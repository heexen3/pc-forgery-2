import { Link } from "react-router-dom"
import VentanaApp from "../VentanaApp.jsx"
import "./Marcos.css"

const CARPETAS = [
    { nombre: "Bandeja de entrada", cantidad: 3 },
    { nombre: "Bandeja de salida", cantidad: 0 },
    { nombre: "Elementos enviados", cantidad: 0 },
    { nombre: "Elementos eliminados", cantidad: 0 },
    { nombre: "Borradores", cantidad: 1 }
]

// Marco estilo Outlook Express para la sección Comunidad (solo visual)
function MarcoCorreo({ titulo = "Comunidad", carpetaActiva = "Bandeja de entrada", estado, children }) {
    const herramientas = (
        <div className="oe-herramientas">
            <Link to="/comunidad/nuevo-hilo" className="boton-plano oe-boton">
                <span aria-hidden="true">✉</span>
                Nuevo hilo
            </Link>
            <button type="button" className="boton-plano oe-boton" disabled>
                <span aria-hidden="true">↩</span>
                Responder
            </button>
            <button type="button" className="boton-plano oe-boton" disabled>
                <span aria-hidden="true">↪</span>
                Reenviar
            </button>
            <Link to="/comunidad" className="boton-plano oe-boton">
                <span aria-hidden="true">⇅</span>
                Enviar y recibir
            </Link>
        </div>
    )

    return (
        <VentanaApp
            titulo={`${titulo} - Outlook Express`}
            icono="/group.png"
            menu={["Archivo", "Edición", "Ver", "Herramientas", "Mensaje", "Ayuda"]}
            barraHerramientas={herramientas}
            barraEstado={<><span>{estado}</span><span>Trabajando en línea</span></>}
            className="marco-correo"
        >
            <div className="oe-layout">
                <nav className="oe-carpetas" aria-label="Carpetas">
                    <p className="oe-carpetas-titulo">Carpetas</p>
                    <ul>
                        <li className="oe-raiz">📁 Outlook Express</li>
                        {CARPETAS.map(carpeta => (
                            <li
                                key={carpeta.nombre}
                                className={carpeta.nombre === carpetaActiva ? "oe-activa" : ""}
                            >
                                📂 {carpeta.nombre}
                                {carpeta.cantidad > 0 && <b> ({carpeta.cantidad})</b>}
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="oe-contenido">{children}</div>
            </div>
        </VentanaApp>
    )
}

export default MarcoCorreo
