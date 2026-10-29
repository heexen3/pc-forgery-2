import "./HiloCard.css"
function HiloCard({ titulo, autor, categoria, respuestas }) {
    return (
        <li className="hilo">
            <div className="hilo-info">
                <h2 className="hilo-titulo">{titulo}</h2>
                <p className="hilo-meta">Publicado por <strong>{autor}</strong> · Categoría: {categoria}</p>
            </div>
            <div className="hilo-stats">
                <span>{respuestas} respuestas</span>
            </div>
        </li>
    )
}

export default HiloCard