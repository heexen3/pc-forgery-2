import {useState} from 'react'

function VentanaColapsable({titulo, className, children}) {
    const [colapsada, setColapsada] = useState(false)

    return (
    <section className={className}>
      <div className="barra-ventana">
        <img src="/img/wlogo.svg" alt="" className="wlogo" width="25px" />
        <span>{titulo}</span>
        <div className="botones-windows">
          <button
            className="boton-colapsar"
            onClick={() => setColapsada(!colapsada)}
          >
            {colapsada ? "+" : "-"}
          </button>
        </div>
      </div>
      <div className={`contenido-ventana ${colapsada ? "oculto" : ""}`}>
        {children}
      </div>
    </section>
    )
}

export default VentanaColapsable