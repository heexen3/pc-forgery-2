


function Resena({ usuario, texto }) {
    return (
        <div className="reseña">
            <p className="reseña-usuario">{usuario}:</p>
            <p className="reseña-texto">{texto}</p>
        </div>
    )
}

export default Resena