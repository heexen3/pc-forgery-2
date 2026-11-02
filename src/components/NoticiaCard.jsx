import { Link } from 'react-router-dom'
import "./NoticiaCard.css"
import { rutaPublica } from "../utils/rutaPublica.js"

// onEliminar es opcional: solo se pasa cuando quien ve la pagina es admin,
// el boton de eliminar no aparece para usuarios normales.
function NoticiaCard({ id, titulo, fecha, resumen, imagen, onEliminar }) {
    function manejarEliminar(event) {
        // evita que el click en "Eliminar" tambien dispare la navegacion del Link
        event.preventDefault()
        event.stopPropagation()
        onEliminar(id)
    }

    return (
        <li className="noticia">
            <Link to={`/noticias/detalle?id=${id}`} className="noticia-link">
                {imagen && (
                    <img
                        src={rutaPublica(imagen)}
                        alt=""
                        className="noticia-imagen"
                    />
                )}
                <h2 className="noticia-titulo">{titulo}</h2>
                <p className="noticia-meta">{fecha}</p>
                <p className="noticia-resumen">{resumen}</p>
            </Link>

            {onEliminar && (
                <button
                    type="button"
                    className="noticia-eliminar"
                    onClick={manejarEliminar}
                >
                    Eliminar
                </button>
            )}
        </li>
    )
}

export default NoticiaCard