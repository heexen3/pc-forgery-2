import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./IconosEscritorio.css"
import { ICONOS_ESCRITORIO } from "./Escritorio.js"
import { rutaPublica } from "../../utils/rutaPublica.js"

// En celulares y tablets (o si se tocó con el dedo) basta un toque para abrir,
// como en un menú normal. Con mouse se usa el clic simple para seleccionar
// y el doble clic para abrir, igual que en Windows 98.
function abrirConUnToque(tipoPuntero) {
    if (tipoPuntero === "touch" || tipoPuntero === "pen") return true
    return typeof window.matchMedia === "function" &&
        window.matchMedia("(max-width: 767px), (hover: none)").matches
}

function IconosEscritorio({ iconos = ICONOS_ESCRITORIO }) {
    const [seleccionado, setSeleccionado] = useState(null)
    const tipoPuntero = useRef("mouse")
    const navigate = useNavigate()

    function abrir(icono) {
        navigate(icono.ruta)
    }

    function clic(icono) {
        if (abrirConUnToque(tipoPuntero.current)) {
            abrir(icono)
        } else {
            setSeleccionado(icono.ruta)
        }
    }

    function tecla(event, icono) {
        if (event.key === "Enter") {
            event.preventDefault()
            abrir(icono)
            return
        }
        // Flechas para recorrer los íconos con el teclado
        const flechas = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }
        if (flechas[event.key]) {
            event.preventDefault()
            const botones = [...event.currentTarget.parentElement.querySelectorAll(".icono-escritorio")]
            const actual = botones.indexOf(event.currentTarget)
            const siguiente = botones[(actual + flechas[event.key] + botones.length) % botones.length]
            siguiente.focus()
            setSeleccionado(iconos[botones.indexOf(siguiente)].ruta)
        }
    }

    return (
        <nav
            className="iconos-escritorio"
            aria-label="Escritorio"
            // clic en una parte vacía del escritorio quita la selección
            onClick={event => { if (event.target === event.currentTarget) setSeleccionado(null) }}
        >
            {iconos.map(icono => (
                <button
                    key={icono.ruta}
                    type="button"
                    className={`icono-escritorio ${seleccionado === icono.ruta ? "seleccionado" : ""}`}
                    aria-pressed={seleccionado === icono.ruta}
                    title={`Abrir ${icono.etiqueta}`}
                    onPointerDown={event => { tipoPuntero.current = event.pointerType || "mouse" }}
                    onFocus={() => setSeleccionado(icono.ruta)}
                    onClick={() => clic(icono)}
                    onDoubleClick={() => abrir(icono)}
                    onKeyDown={event => tecla(event, icono)}
                >
                    <span className="icono-escritorio-imagen">
                        <img src={rutaPublica(icono.icono)} alt="" draggable="false" />
                    </span>
                    <span className="icono-escritorio-texto">{icono.etiqueta}</span>
                </button>
            ))}
        </nav>
    )
}

export default IconosEscritorio
