import { Link } from "react-router-dom"
import "./HiloCard.css"

// ultimaActividad llega ya formateada (texto)
function HiloCard({ id, titulo, autor, categoria, respuestas, ultimaActividad }) {
    return (
        <li className="hilo">
            <div className="hilo-info">
                <h2 className="hilo-titulo">
                    <Link to={`/comunidad/hilo/${id}`}>{titulo}</Link>
                </h2>
                <p className="hilo-meta">Publicado por <strong>{autor}</strong> · Categoría: {categoria}</p>
            </div>
            <div className="hilo-stats">
                <span>{respuestas} {respuestas === 1 ? "respuesta" : "respuestas"}</span>
                {ultimaActividad && (
                    <span className="hilo-actividad">Última actividad: {ultimaActividad}</span>
                )}
            </div>
        </li>
    )
}

export default HiloCard