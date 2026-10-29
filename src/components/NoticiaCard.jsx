import { Link } from 'react-router-dom'
import "./NoticiaCard.css"
function NoticiaCard({ id, titulo, fecha, resumen }) {
    return (
        <li className="noticia">
            <Link to={`/noticias/detalle?id=${id}`} className="noticia-link">
                <h2 className="noticia-titulo">{titulo}</h2>
                <p className="noticia-meta">{fecha}</p>
                <p className="noticia-resumen">{resumen}</p>
            </Link>
        </li>
    )
}

export default NoticiaCard