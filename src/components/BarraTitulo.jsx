import { useEffect, useId, useRef } from "react"
import "./BarraTitulo.css"
import BotonesWindows from "./BotonesWindows.jsx"
import { rutaPublica } from "../utils/rutaPublica.js"
import {
    minimizarVentana,
    restaurarVentana,
    useVentanasMinimizadas
} from "./escritorio/VentanasMinimizadas.js"

/**
 * Barra de título estándar de todas las ventanas de PC Forgery (estilo Windows 98).
 *
 * Se pone como PRIMER hijo del elemento que hace de ventana (section, div, aside...).
 * Degradado azul marino → azul, ícono pequeño y título en negrita a la izquierda,
 * y los botones grises biselados ( _ □ × ) a la derecha, reutilizando BotonesWindows.
 *
 * Minimizar ( _ ): oculta la ventana completa (su elemento padre recibe la clase
 * "ventana-minimizada") y agrega un botón con su nombre en la barra de tareas;
 * al hacer clic en ese botón la ventana se restaura. Maximizar ( □ ) y cerrar ( × )
 * son decorativos: solo muestran la animación de botón presionado.
 *
 * @param {object}   props
 * @param {string}   props.titulo       Texto de la barra (también nombra el botón de la barra de tareas).
 * @param {string}   [props.icono="/wlogo.svg"] Ruta del ícono dentro de /public (se resuelve con rutaPublica).
 *                                      Usa null para no mostrar ícono.
 * @param {string[]} [props.botones=["minimizar","maximizar","cerrar"]] Qué botones mostrar y en qué orden.
 * @param {boolean}  [props.ayuda=false] Muestra el botón "?" (como en los cuadros de Propiedades).
 * @param {Function} [props.onAyuda]    Acción del botón "?".
 * @param {Function} [props.onMinimizar] Se llama al minimizar (además de ocultar la ventana).
 * @param {boolean}  [props.minimizable=true] En false, "_" queda decorativo (diálogos modales).
 * @param {string}   [props.id]         Identificador para registrar la ventana en la barra de tareas.
 *                                      Si no se entrega se genera uno automáticamente.
 * @param {"span"|"h1"|"h2"|"h3"} [props.como="span"] Etiqueta del título: permite que la barra
 *                                      sea el encabezado de la página (h1) sin perder el estilo.
 * @param {string}   [props.idTitulo]   id del elemento del título (para aria-labelledby).
 * @param {string}   [props.className]  Clases extra para la barra.
 * @param {React.ReactNode} [props.children] Extras entre el título y los botones (ej. un botón "-" de colapsar).
 */
function BarraTitulo({
    titulo,
    icono = "/wlogo.svg",
    botones = ["minimizar", "maximizar", "cerrar"],
    ayuda = false,
    onAyuda,
    onMinimizar,
    minimizable = true,
    id,
    como: Titulo = "span",
    idTitulo,
    className = "",
    children
}) {
    const idAutomatico = useId()
    const idVentana = id || `ventana-${idAutomatico}`
    const barra = useRef(null)
    const minimizadas = useVentanasMinimizadas()
    const minimizada = minimizadas.some(ventana => ventana.id === idVentana)

    // La ventana es el elemento que contiene a la barra: se oculta mientras está minimizada
    useEffect(() => {
        const ventana = barra.current?.parentElement
        if (!ventana) return
        ventana.classList.toggle("ventana-minimizada", minimizada)
    }, [minimizada])

    // Si la ventana desaparece (cambio de página), se quita su botón de la barra de tareas
    useEffect(() => () => restaurarVentana(idVentana), [idVentana])

    function minimizar() {
        minimizarVentana({ id: idVentana, titulo, icono })
        onMinimizar?.()
    }

    return (
        <div className={`barra-titulo-win ${className}`} ref={barra}>
            {icono && <img src={rutaPublica(icono)} alt="" className="barra-titulo-icono" />}
            <Titulo className="barra-titulo-texto" id={idTitulo}>{titulo}</Titulo>
            {children}
            <BotonesWindows
                botones={botones}
                ayuda={ayuda}
                onAyuda={onAyuda}
                onMinimizar={minimizable && botones.includes("minimizar") ? minimizar : undefined}
                etiquetaVentana={titulo}
            />
        </div>
    )
}

export default BarraTitulo
