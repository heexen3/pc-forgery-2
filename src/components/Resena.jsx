import { textoEstrellas } from "./resenas/Resenas.js"

function Resena({ autor, estrellas, comentario, fecha }) {
    return (
        <div className="reseña">
            <div className="reseña-usuario">
                <span>{autor}</span>
                <span className="reseña-estrellas" aria-label={`${estrellas} de 5 estrellas`}>
                    {textoEstrellas(estrellas)}
                </span>
            </div>
            <p className="reseña-texto">{comentario}</p>
            {fecha && (
                <p className="reseña-fecha">
                    {new Date(fecha).toLocaleDateString("es-CL")}
                </p>
            )}
        </div>
    )
}

export default Resena
