import { apiHabilitada, guardarSesion, peticion, usuarioDesdeApi } from "../utils/api.js"

// Usuarios base del sistema (administrador y cliente iniciales).
// Si ya existen usuarios en localStorage ("usuarios"), se respetan esos datos.

export const CLAVE_USUARIOS = "usuarios"
export const CLAVE_VERSION_USUARIOS = "usuariosVersion"
export const VERSION_USUARIOS = 1

export const usuariosBase = [
    {
        nombre: "Administrador",
        usuario: "admin",
        email: "admin@admin.com",
        correo: "admin@admin.com",
        password: "admin123",
        contrasena: "admin123",
        rol: "admin"
    },
    {
        nombre: "Cliente Ejemplo",
        usuario: "cliente",
        email: "cliente@duocuc.cl",
        correo: "cliente@duocuc.cl",
        password: "Cliente.123",
        contrasena: "Cliente.123",
        rol: "usuario"
    }
]

export function leerUsuariosGuardados() {
    try {
        const json = localStorage.getItem(CLAVE_USUARIOS)
        if (!json) return null
        const parseado = JSON.parse(json)
        return Array.isArray(parseado) ? parseado : null
    } catch {
        return null
    }
}

export function obtenerUsuarios() {
    const usuariosGuardados = leerUsuariosGuardados()
    if (!usuariosGuardados) {
        localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuariosBase))
        localStorage.setItem(CLAVE_VERSION_USUARIOS, String(VERSION_USUARIOS))
        return usuariosBase
    }
    return usuariosGuardados
}

export function inicializarUsuarios() {
    const usuariosGuardados = leerUsuariosGuardados()
    if (!usuariosGuardados || usuariosGuardados.length === 0) {
        localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuariosBase))
        localStorage.setItem(CLAVE_VERSION_USUARIOS, String(VERSION_USUARIOS))
        return usuariosBase
    }
    return usuariosGuardados
}

export function guardarUsuarios(usuarios) {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios))
}

export function restablecerUsuarios() {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuariosBase))
    localStorage.setItem(CLAVE_VERSION_USUARIOS, String(VERSION_USUARIOS))
    return usuariosBase
}


// ---------- Backend (auth-service) ----------
// Con backend las contraseñas nunca se guardan en el navegador: viajan solo al
// iniciar sesión o registrarse y auth-service las guarda cifradas con BCrypt.

// Inicia sesión (POST /api/auth/login) y guarda access token, refresh token y usuarioActual.
export async function iniciarSesionApi(identificador, password) {
    const respuesta = await peticion("/auth/login", { metodo: "POST", cuerpo: { identificador, password } })
    guardarSesion(respuesta)
    return usuarioDesdeApi(respuesta.usuario)
}

// Registra un cliente nuevo (POST /api/auth/register).
export function registrarUsuarioApi({ usuario, email, password }) {
    return peticion("/auth/register", { metodo: "POST", cuerpo: { usuario, email, password } })
}

// Lista de usuarios para el panel admin (GET /api/usuarios, solo ADMIN). Se guarda sin contraseñas.
export async function sincronizarUsuarios() {
    if (!apiHabilitada()) return obtenerUsuarios()
    const usuarios = (await peticion("/usuarios")).map(usuarioDesdeApi)
    guardarUsuarios(usuarios)
    return usuarios
}

// Crea (sin id) o edita (con id) un usuario desde el panel admin.
// rol: "admin" o "usuario" (el backend lo convierte a ADMIN o CLIENTE).
export async function guardarUsuarioApi({ id, nombre, usuario, email, password, rol }) {
    const cuerpo = { nombre, usuario, email, rol, password: password || null }
    if (id) {
        await peticion(`/usuarios/${id}`, { metodo: "PUT", cuerpo })
    } else {
        await peticion("/usuarios", { metodo: "POST", cuerpo })
    }
    return sincronizarUsuarios()
}

export async function eliminarUsuarioApi(id) {
    await peticion(`/usuarios/${id}`, { metodo: "DELETE" })
    return sincronizarUsuarios()
}

// El usuario edita su propio perfil (PUT /api/auth/me) y se actualiza usuarioActual.
export async function actualizarPerfilApi(cambios) {
    const actualizado = usuarioDesdeApi(await peticion("/auth/me", { metodo: "PUT", cuerpo: cambios }))
    localStorage.setItem("usuarioActual", JSON.stringify(actualizado))
    return actualizado
}
