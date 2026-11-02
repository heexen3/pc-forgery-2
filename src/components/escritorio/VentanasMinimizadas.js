// Pequeño "store" compartido de ventanas minimizadas.
// Cualquier ventana que use <BarraTitulo /> se registra aquí al minimizarse y
// la barra de tareas (BarraTareas) muestra un botón por cada una para restaurarla.
// El estado vive solo en memoria (dura la sesión de la pestaña, no se guarda).
import { useSyncExternalStore } from "react"

let ventanas = []
const suscriptores = new Set()

function notificar() {
    suscriptores.forEach(funcion => funcion())
}

export function suscribirVentanas(funcion) {
    suscriptores.add(funcion)
    return () => suscriptores.delete(funcion)
}

export function obtenerVentanasMinimizadas() {
    return ventanas
}

// ventana: { id, titulo, icono }
export function minimizarVentana(ventana) {
    if (ventanas.some(item => item.id === ventana.id)) return
    ventanas = [...ventanas, ventana]
    notificar()
}

export function restaurarVentana(id) {
    if (!ventanas.some(item => item.id === id)) return
    ventanas = ventanas.filter(item => item.id !== id)
    notificar()
}

export function estaMinimizada(id) {
    return ventanas.some(item => item.id === id)
}

// Hook: lista reactiva de ventanas minimizadas
export function useVentanasMinimizadas() {
    return useSyncExternalStore(suscribirVentanas, obtenerVentanasMinimizadas, obtenerVentanasMinimizadas)
}
