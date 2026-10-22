import "./MensajeForo.css"
function MensajeForo({ autor, texto, esOriginal }) {
    return (
        <div className={`mensaje ${esOriginal ? "mensaje-original" : ""}`}>
            <p className="mensaje-autor">{autor}</p>
            <p className="mensaje-texto">{texto}</p>
        </div>
    )
}

export default MensajeForo