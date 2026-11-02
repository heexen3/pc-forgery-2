import { useState } from "react"
import BotonesWindows from "../BotonesWindows.jsx"
import NuevaNoticia from "./NuevaNoticia.jsx"
import MostrarNoticias from "./MostrarNoticias.jsx"

function Noticias() {
    const [vista, setVista] = useState("mostrar")

    return (
        <section className="contenido">
            <div className="admin-titulo">
                <h2>Gestión de Noticias</h2>
                <BotonesWindows />
            </div>

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