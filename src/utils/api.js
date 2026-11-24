import { useEffect, useState } from "react"

// Cliente HTTP del frontend hacia el backend de microservicios (a través del API Gateway).
//
// - VITE_API_URL define la URL del gateway (por defecto http://localhost:8080).
//   Con VITE_API_URL=off (o vacío) la app funciona como antes, solo con localStorage
//   (útil para la demo estática en GitHub Pages). En las pruebas (vitest) también se usa
//   el modo local, para que los tests no dependan de un servidor.
// - La sesión (access token + refresh token) se guarda en localStorage, así sobrevive
//   a recargar la página. Si el gateway responde 401 se renueva el access token con el
//   refresh token una sola vez y se reintenta la petición.

const URL_POR_DEFECTO = "http://localhost:8080"
const CLAVE_SESION = "sesion"
const CLAVE_USUARIO_ACTUAL = "usuarioActual"
export const EVENTO_SESION = "sesionActualizada"

const urlConfigurada = import.meta.env.VITE_API_URL
export const API_URL = String(urlConfigurada ?? URL_POR_DEFECTO).trim().replace(/\/+$/, "")

// ¿Los datos vienen del backend? (false en vitest o con VITE_API_URL=off)
export function apiHabilitada() {
    return import.meta.env.MODE !== "test" && API_URL !== "" && API_URL.toLowerCase() !== "off"
}

// Error con el mensaje que devuelve el backend ({ mensaje }) y el código HTTP
export class ErrorApi extends Error {
    constructor(mensaje, status) {
        super(mensaje)
        this.name = "ErrorApi"
        this.status = status
    }
}

// ---------- Sesión ----------

export function obtenerSesion() {
    try {
        const sesion = JSON.parse(localStorage.getItem(CLAVE_SESION))
        return sesion && sesion.accessToken ? sesion : null
    } catch {
        return null
    }
}

export function haySesion() {
    return Boolean(obtenerSesion()?.refreshToken)
}

// Convierte el usuario del backend al formato que ya usaba el frontend
// (rol "admin"/"usuario", email y correo).
export function usuarioDesdeApi(usuario) {
    if (!usuario) return null
    return {
        id: usuario.id,
        nombre: usuario.nombre,
        usuario: usuario.usuario,
        email: usuario.email,
        correo: usuario.email,
        rol: usuario.rol === "ADMIN" ? "admin" : "usuario",
        descripcion: usuario.descripcion || "",
        foto: usuario.foto || "",
        activo: usuario.activo,
        fechaRegistro: usuario.fechaRegistro
    }
}

// Guarda la respuesta de /auth/login o /auth/refresh: tokens + usuarioActual
export function guardarSesion(respuesta) {
    localStorage.setItem(CLAVE_SESION, JSON.stringify({
        accessToken: respuesta.accessToken,
        refreshToken: respuesta.refreshToken,
        expiraEn: Date.now() + Number(respuesta.expiraEn || 0) * 1000
    }))
    if (respuesta.usuario) {
        localStorage.setItem(CLAVE_USUARIO_ACTUAL, JSON.stringify(usuarioDesdeApi(respuesta.usuario)))
    }
    window.dispatchEvent(new Event(EVENTO_SESION))
}

export function borrarSesionLocal() {
    localStorage.removeItem(CLAVE_SESION)
    localStorage.removeItem(CLAVE_USUARIO_ACTUAL)
    window.dispatchEvent(new Event(EVENTO_SESION))
}

// Cierra la sesión: revoca el refresh token en el backend (si se puede) y limpia el navegador
export async function cerrarSesion() {
    const sesion = obtenerSesion()
    borrarSesionLocal()
    if (sesion?.refreshToken && apiHabilitada()) {
        try {
            await fetch(`${API_URL}/api/auth/logout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken: sesion.refreshToken })
            })
        } catch {
            // sin conexión: la sesión local ya se borró
        }
    }
}

// Si varias peticiones reciben 401 a la vez, todas esperan la misma renovación
let renovacionEnCurso = null

export function renovarSesion() {
    const sesion = obtenerSesion()
    if (!sesion?.refreshToken) {
        return Promise.resolve(false)
    }
    if (!renovacionEnCurso) {
        renovacionEnCurso = fetch(`${API_URL}/api/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: sesion.refreshToken })
        })
            .then(async respuesta => {
                if (!respuesta.ok) {
                    borrarSesionLocal()
                    return false
                }
                guardarSesion(await respuesta.json())
                return true
            })
            .catch(() => false)
            .finally(() => {
                renovacionEnCurso = null
            })
    }
    return renovacionEnCurso
}

// ---------- Peticiones ----------

/**
 * Llama al API Gateway. ruta sin el prefijo /api (ej: "/productos").
 * @param {string} ruta
 * @param {{ metodo?: string, cuerpo?: any, reintentar?: boolean }} [opciones]
 * @returns {Promise<any>} JSON de la respuesta (null si es 204)
 */
export async function peticion(ruta, { metodo = "GET", cuerpo, reintentar = true } = {}) {
    const sesion = obtenerSesion()
    const headers = { Accept: "application/json" }
    if (cuerpo !== undefined) headers["Content-Type"] = "application/json"
    if (sesion?.accessToken) headers.Authorization = `Bearer ${sesion.accessToken}`

    let respuesta
    try {
        respuesta = await fetch(`${API_URL}/api${ruta}`, {
            method: metodo,
            headers,
            body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo)
        })
    } catch {
        throw new ErrorApi("No se pudo conectar con el servidor. Revisa que el backend esté encendido.", 0)
    }

    // Access token vencido: se renueva con el refresh token y se reintenta una vez
    if (respuesta.status === 401 && reintentar && sesion?.refreshToken && !ruta.startsWith("/auth/")) {
        const renovada = await renovarSesion()
        if (renovada) {
            return peticion(ruta, { metodo, cuerpo, reintentar: false })
        }
    }

    if (respuesta.status === 204) return null

    let datos
    try {
        datos = await respuesta.json()
    } catch {
        datos = null
    }

    if (!respuesta.ok) {
        throw new ErrorApi(datos?.mensaje || `Error ${respuesta.status} del servidor.`, respuesta.status)
    }
    return datos
}

// Ejecuta "accion" con el resultado, sea un valor normal (modo local) o una promesa (modo API).
// Permite que una misma función devuelva { ok, mensaje } directo o tras llamar al backend.
export function cuandoListo(resultado, accion) {
    if (resultado && typeof resultado.then === "function") {
        return resultado.then(accion)
    }
    return accion(resultado)
}

// Hook: al montar la página vuelve a pedir los datos al backend (si está habilitado)
// y vuelve a renderizar cuando llegan. "alTerminar" sirve para refrescar estados locales.
export function useSincronizacion(sincronizar, alTerminar) {
    const [version, setVersion] = useState(0)
    useEffect(() => {
        if (!apiHabilitada()) return undefined
        let activo = true
        Promise.resolve()
            .then(sincronizar)
            .then(() => {
                if (!activo) return
                if (alTerminar) alTerminar()
                setVersion(valor => valor + 1)
            })
            .catch(() => {
                // sin backend se siguen mostrando los datos guardados en el navegador
            })
        return () => {
            activo = false
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return version
}
