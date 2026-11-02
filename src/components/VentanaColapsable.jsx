import BarraTitulo from "./BarraTitulo.jsx"
import {useState} from 'react'

function VentanaColapsable({titulo, className, children}) {
    const [colapsada, setColapsada] = useState(false)

    return (
    <section className={className}>
      <BarraTitulo titulo={titulo}>
        {/* extra: botón para colapsar/expandir el contenido */}
        <button
          type="button"
          className="boton-colapsar"
          aria-expanded={!colapsada}
          onClick={() => setColapsada(!colapsada)}
        >
          {colapsada ? "+" : "-"}
        </button>
      </BarraTitulo>
      <div className={`contenido-ventana ${colapsada ? "oculto" : ""}`}>
        {children}
      </div>
    </section>
    )
}

export default VentanaColapsable