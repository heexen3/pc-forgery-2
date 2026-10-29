import { useEffect, useRef, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import "./BarraTareas.css"
import { PROGRAMAS, ventanaActiva } from "./Escritorio.js"

function formatearHora(fecha) {
    return fecha.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })
}

function BarraTareas() {
    const [menuAbierto, setMenuAbierto] = useState(false)
    const [hora, setHora] = useState(() => new Date())
    const location = useLocation()
    const contenedor = useRef(null)

    // Reloj en vivo
    useEffect(() => {
        const intervalo = setInterval(() => setHora(new Date()), 1000)
        return () => clearInterval(intervalo)
    }, [])

    // Cerrar el menú al hacer clic fuera de la barra
    useEffect(() => {
        if (!menuAbierto) return undefined
        function clicFuera(event) {
            if (contenedor.current && !contenedor.current.contains(event.target)) {
                setMenuAbierto(false)
            }
        }
        function tecla(event) {
            if (event.key === "Escape") setMenuAbierto(false)
        }
        document.addEventListener("mousedown", clicFuera)
        document.addEventListener("keydown", tecla)
        return () => {
            document.removeEventListener("mousedown", clicFuera)
            document.removeEventListener("keydown", tecla)
        }
    }, [menuAbierto])

    return (
        <div className="barra-tareas no-imprimir" ref={contenedor}>
            <button
                type="button"
                className={`boton-inicio ${menuAbierto ? "activo" : ""}`}
                aria-haspopup="menu"
                aria-expanded={menuAbierto}
                onClick={() => setMenuAbierto(!menuAbierto)}
            >
                <img src="/wlogo.svg" alt="" />
                <span>Inicio</span>
            </button>

            {menuAbierto && (
                <div className="menu-inicio" role="menu">
                    <div className="menu-inicio-lateral" aria-hidden="true">
                        <span>PC Forgery <b>98</b></span>
                    </div>
                    <ul>
                        {PROGRAMAS.map(programa => (
                            <li key={programa.ruta}>
                                <Link
                                    to={programa.ruta}
                                    role="menuitem"
                                    onClick={() => setMenuAbierto(false)}
                                >
                                    <img src={programa.icono} alt="" />
                                    {programa.etiqueta}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="barra-tareas-ventanas">
                <span className="tarea-activa">{ventanaActiva(location.pathname)}</span>
            </div>

            <div className="bandeja-sistema">
                <time dateTime={hora.toISOString()} aria-label="Hora actual">
                    {formatearHora(hora)}
                </time>
            </div>
        </div>
    )
}

export default BarraTareas
