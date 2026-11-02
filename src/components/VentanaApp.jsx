import "./VentanaApp.css"
import { rutaPublica } from "../utils/rutaPublica.js"

// Marco reutilizable de "aplicación" Windows 98: barra de título, menú,
// barra de herramientas opcional, contenido y barra de estado.
function VentanaApp({
    titulo,
    icono = "/wlogo.svg",
    menu = ["Archivo", "Edición", "Ver", "Ayuda"],
    barraHerramientas,
    barraEstado,
    className = "",
    children
}) {
    return (
        <div className={`ventana-app ventana-animada ${className}`}>
            <div className="ventana-app-titulo">
                <img src={rutaPublica(icono)} alt="" />
                <span>{titulo}</span>
                <div className="ventana-app-controles" aria-hidden="true">
                    <span>_</span>
                    <span>□</span>
                    <span>×</span>
                </div>
            </div>

            {menu.length > 0 && (
                <div className="ventana-app-menu" aria-hidden="true">
                    {menu.map(opcion => (
                        <span key={opcion}>
                            <u>{opcion.charAt(0)}</u>{opcion.slice(1)}
                        </span>
                    ))}
                </div>
            )}

            {barraHerramientas && (
                <div className="ventana-app-herramientas">{barraHerramientas}</div>
            )}

            <div className="ventana-app-cuerpo">{children}</div>

            {barraEstado && (
                <div className="ventana-app-estado">{barraEstado}</div>
            )}
        </div>
    )
}

export default VentanaApp
