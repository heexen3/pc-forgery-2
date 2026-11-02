import { Link, useNavigate } from "react-router-dom"
import VentanaApp from "../VentanaApp.jsx"
import "./Marcos.css"

// Marco estilo Internet Explorer para las páginas de Noticias
function MarcoNavegador({ titulo, direccion, children }) {
    const navigate = useNavigate()

    const herramientas = (
        <div className="ie-herramientas">
            <div className="ie-botones">
                <button type="button" className="boton-plano" onClick={() => navigate(-1)}>
                    <span aria-hidden="true">◄</span> Atrás
                </button>
                <button type="button" className="boton-plano" onClick={() => navigate(1)}>
                    Adelante <span aria-hidden="true">►</span>
                </button>
                <button type="button" className="boton-plano" onClick={() => navigate(0)}>
                    <span aria-hidden="true">↻</span> Actualizar
                </button>
                <Link to="/" className="boton-plano">
                    <span aria-hidden="true">⌂</span> Inicio
                </Link>
            </div>
            <div className="ie-direccion">
                <label htmlFor="ie-direccion">Dirección</label>
                <input id="ie-direccion" type="text" value={direccion} readOnly />
                <span className="ie-logo" aria-hidden="true">e</span>
            </div>
        </div>
    )

    return (
        <VentanaApp
            titulo={`${titulo} - Microsoft Internet Explorer`}
            icono="/net.png"
            menu={["Archivo", "Edición", "Ver", "Favoritos", "Herramientas", "Ayuda"]}
            barraHerramientas={herramientas}
            barraEstado={<><span>Listo</span><span>🌐 Internet</span></>}
            className="marco-navegador"
        >
            <div className="ie-pagina">{children}</div>
        </VentanaApp>
    )
}

export default MarcoNavegador
