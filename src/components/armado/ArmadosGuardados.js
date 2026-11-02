// Armados guardados por usuario (RF-09). Se guardan en localStorage solo
// los ids de cada componente, así al cargarlos se usan los datos actuales.
import { DB_COMPONENTES } from "../../data/componentesData.js"
import { CATEGORIAS, seleccionVacia, calcularTotalArmado } from "./ArmadoPC.js"

export const CLAVE_ARMADOS = "armadosGuardados"

function leerTodos() {
    try {
        const armados = JSON.parse(localStorage.getItem(CLAVE_ARMADOS))
        return armados && typeof armados === "object" && !Array.isArray(armados) ? armados : {}
    } catch {
        return {}
    }
}

function claveUsuario(usuario) {
    return usuario?.email?.toLowerCase() || ""
}

export function obtenerArmados(usuario) {
    if (!usuario) {
        return []
    }
    return leerTodos()[claveUsuario(usuario)] || []
}

// Guarda (o reemplaza si ya existe uno con el mismo nombre) el armado actual.
// Devuelve { ok, mensaje, armados }
export function guardarArmado(usuario, nombre, seleccion, plataforma, fecha = new Date()) {
    if (!usuario) {
        return { ok: false, mensaje: "Debes iniciar sesión para guardar tus armados.", armados: [] }
    }

    const nombreLimpio = String(nombre || "").trim()
    if (nombreLimpio.length < 3) {
        return { ok: false, mensaje: "El nombre del armado debe tener al menos 3 caracteres.", armados: obtenerArmados(usuario) }
    }

    const componentes = {}
    CATEGORIAS.forEach(categoria => {
        componentes[categoria] = seleccion[categoria]?.id || null
    })

    if (Object.values(componentes).every(id => !id)) {
        return { ok: false, mensaje: "Elige al menos un componente antes de guardar.", armados: obtenerArmados(usuario) }
    }

    const armados = obtenerArmados(usuario).filter(
        armado => armado.nombre.toLowerCase() !== nombreLimpio.toLowerCase()
    )
    const nuevo = {
        id: `${fecha.getTime()}`,
        nombre: nombreLimpio,
        plataforma,
        componentes,
        total: calcularTotalArmado(seleccion),
        fecha: fecha.toISOString()
    }
    const actualizados = [...armados, nuevo]

    const todos = leerTodos()
    todos[claveUsuario(usuario)] = actualizados
    localStorage.setItem(CLAVE_ARMADOS, JSON.stringify(todos))

    return { ok: true, mensaje: `Armado "${nombreLimpio}" guardado.`, armados: actualizados }
}

export function eliminarArmado(usuario, id) {
    const actualizados = obtenerArmados(usuario).filter(armado => armado.id !== id)
    const todos = leerTodos()
    todos[claveUsuario(usuario)] = actualizados
    localStorage.setItem(CLAVE_ARMADOS, JSON.stringify(todos))
    return actualizados
}

// Convierte un armado guardado en una selección con los datos actuales
export function cargarSeleccion(armado) {
    const seleccion = seleccionVacia()
    CATEGORIAS.forEach(categoria => {
        const id = armado.componentes?.[categoria]
        seleccion[categoria] = (DB_COMPONENTES[categoria] || []).find(item => item.id === id) || null
    })
    return seleccion
}
