import BarraTitulo from "../BarraTitulo.jsx"
import { useState } from "react"
import NuevaNoticia from "./NuevaNoticia.jsx"
import MostrarNoticias from "./MostrarNoticias.jsx"

function Noticias() {
    const [vista, setVista] = useState("mostrar")

    return (
        <section className="contenido">
            <BarraTitulo titulo="Gestión de Noticias" icono="/tools.png" como="h2" />

            <div className="contenido-botones">
                <button
                    className={`btn btn-admin ${vista === "mostrar" ? "active" : ""}`}
                    onClick={() => setVista("mostrar")}
                >
                    Mostrar noticias
                </button>

                <button
                    className={`btn btn-admin ${vista === "nueva" ? "active" : ""}`}
                    onClick={() => setVista("nueva")}
                >
                    Nueva noticia
                </button>
            </div>

            {vista === "mostrar" && <MostrarNoticias />}

            {vista === "nueva" && <NuevaNoticia />}
        </section>
    )
}

export default Noticias