// Sistema de diálogos estilo Windows 98 que reemplaza alert() y confirm().
// Si el componente <DialogoWindows /> está montado, los mensajes se muestran
// como ventana modal; si no (por ejemplo en pruebas aisladas), se usa
// window.alert / window.confirm como respaldo.

let mostrarEnHost = null

export const ICONOS_DIALOGO = ["info", "error", "advertencia", "pregunta"]

export function registrarHostDialogo(funcion) {
    mostrarEnHost = funcion
    return () => {
        if (mostrarEnHost === funcion) {
            mostrarEnHost = null
        }
    }
}

export function mostrarAlerta(mensaje, opciones = {}) {
    if (!mostrarEnHost) {
        window.alert(mensaje)
        return Promise.resolve()
    }

    return new Promise(resolver => {
        mostrarEnHost({
            tipo: "alerta",
            mensaje,
            titulo: opciones.titulo || "PC Forgery",
            icono: opciones.icono || "info",
            resolver: () => resolver()
        })
    })
}

export function confirmar(mensaje, opciones = {}) {
    if (!mostrarEnHost) {
        return Promise.resolve(window.confirm(mensaje))
    }

    return new Promise(resolver => {
        mostrarEnHost({
            tipo: "confirmacion",
            mensaje,
            titulo: opciones.titulo || "Confirmar",
            icono: opciones.icono || "pregunta",
            resolver
        })
    })
}
