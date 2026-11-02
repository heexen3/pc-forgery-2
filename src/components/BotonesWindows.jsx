import { useState } from "react"

// Botones de control de ventana estilo Windows 98 ( ? _ □ × ).
// Sin props se comportan como antes: son decorativos (aria-hidden) y solo
// muestran la animación de "presionado" (bisel invertido en :active).
//
// Props opcionales (las usa BarraTitulo):
// - botones: cuáles mostrar, en orden ["minimizar", "maximizar", "cerrar"]
// - ayuda: muestra el botón "?" antes de los demás
// - onMinimizar / onAyuda: acciones reales; si existen, esos botones quedan accesibles
// - etiquetaVentana: nombre de la ventana (queda en data-ventana del botón)
const SIMBOLOS = { ayuda: "?", minimizar: "_", maximizar: "□", cerrar: "×" }
const NOMBRES = { ayuda: "Ayuda", minimizar: "Minimizar", maximizar: "Maximizar", cerrar: "Cerrar" }

function BotonesWindows({
    botones = ["minimizar", "maximizar", "cerrar"],
    ayuda = false,
    onMinimizar,
    onAyuda,
    etiquetaVentana = ""
}) {
    // "pulsado" deja el bisel invertido un instante al soltar con el teclado/toque
    const [pulsado, setPulsado] = useState("")
    const lista = ayuda ? ["ayuda", ...botones] : botones
    const acciones = { minimizar: onMinimizar, ayuda: onAyuda }
    const interactivo = Boolean(onMinimizar || onAyuda)

    function presionar(tipo) {
        setPulsado(tipo)
        setTimeout(() => setPulsado(actual => (actual === tipo ? "" : actual)), 150)
        acciones[tipo]?.()
    }

    return (
        <div className="botones-windows" aria-hidden={interactivo ? undefined : "true"}>
            {lista.map(tipo => {
                const accion = acciones[tipo]
                return (
                    <button
                        key={tipo}
                        type="button"
                        className={`boton-ventana boton-ventana-${tipo} ${pulsado === tipo ? "pulsado" : ""}`}
                        tabIndex={accion ? undefined : -1}
                        aria-hidden={interactivo && !accion ? "true" : undefined}
                        aria-label={accion ? NOMBRES[tipo] : undefined}
                        data-ventana={etiquetaVentana || undefined}
                        title={NOMBRES[tipo]}
                        onClick={() => presionar(tipo)}
                    >
                        {SIMBOLOS[tipo]}
                    </button>
                )
            })}
        </div>
    )
}

export default BotonesWindows
