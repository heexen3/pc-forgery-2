import { useEffect, useRef, useState } from "react"
import { registrarHostDialogo } from "./Dialogo.js"
import "./DialogoWindows.css"

const SIMBOLOS = {
    info: "i",
    error: "×",
    advertencia: "!",
    pregunta: "?"
}

// Host de diálogos: se monta una sola vez en App y muestra en cola los
// mensajes enviados con mostrarAlerta() y confirmar().
function DialogoWindows() {
    const [cola, setCola] = useState([])
    const botonAceptar = useRef(null)
    const actual = cola[0]

    useEffect(() => {
        return registrarHostDialogo(dialogo => {
            setCola(anterior => [...anterior, dialogo])
        })
    }, [])

    useEffect(() => {
        if (actual && botonAceptar.current) {
            botonAceptar.current.focus()
        }
    }, [actual])

    if (!actual) {
        return null
    }

    function cerrar(respuesta) {
        actual.resolver(respuesta)
        setCola(anterior => anterior.slice(1))
    }

    function manejarTecla(event) {
        if (event.key === "Escape") {
            event.preventDefault()
            cerrar(false)
        }
    }

    const esConfirmacion = actual.tipo === "confirmacion"

    return (
        <div className="dialogo-fondo" onKeyDown={manejarTecla}>
            <div
                className="dialogo-ventana"
                role={esConfirmacion ? "dialog" : "alertdialog"}
                aria-modal="true"
                aria-labelledby="dialogo-titulo"
                aria-describedby="dialogo-mensaje"
            >
                <div className="dialogo-titulo">
                    <span id="dialogo-titulo">{actual.titulo}</span>
                    <button
                        type="button"
                        className="dialogo-cerrar"
                        aria-label="Cerrar diálogo"
                        onClick={() => cerrar(false)}
                    >
                        ×
                    </button>
                </div>

                <div className="dialogo-cuerpo">
                    <span className={`dialogo-icono dialogo-icono-${actual.icono}`} aria-hidden="true">
                        {SIMBOLOS[actual.icono] || SIMBOLOS.info}
                    </span>
                    <p id="dialogo-mensaje">{actual.mensaje}</p>
                </div>

                <div className="dialogo-botones">
                    <button type="button" ref={botonAceptar} onClick={() => cerrar(true)}>
                        Aceptar
                    </button>
                    {esConfirmacion && (
                        <button type="button" onClick={() => cerrar(false)}>
                            Cancelar
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DialogoWindows
