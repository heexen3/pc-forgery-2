import "./MensajeForo.css"

//lka fecha llega formateada en forma de texto
function MensajeForo({ autor, texto, esOriginal, fecha }) {
    return (
        <div className={`mensaje ${esOriginal ? "mensaje-original" : ""}`}>
            <p className="mensaje-autor">
                {autor}
                {fecha && <span className="mensaje-fecha"> · {fecha}</span>}
            </p>
            <p className="mensaje-texto">{texto}</p>
        </div>
    )
}

export default MensajeForo