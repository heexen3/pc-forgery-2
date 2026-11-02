import { useSearchParams, Link } from "react-router-dom"
import "./NoticiaDetalle.css"
import MarcoNavegador from "./components/escritorio/MarcoNavegador.jsx"
import { rutaPublica } from "./utils/rutaPublica.js"
import { obtenerNoticia, formatearFecha } from "./data/catalogoNoticias.js"

function NoticiaDetalle() {
    const [searchParams] = useSearchParams()
    const id = Number(searchParams.get("id"))

    const noticia = obtenerNoticia(id)

    if (!noticia) {
        return (
            <main className="detalle-main">
                <MarcoNavegador titulo="No se puede mostrar la página" direccion={`http://www.pcforgery.cl/noticias/detalle?id=${id}`}>
                    <div className="contenedor-noticia-detalle">
                        <h1>Noticia no encontrada</h1>
                        <Link to="/noticias" className="boton-volver">← Volver a Noticias</Link>
                    </div>
                </MarcoNavegador>
            </main>
        )
    }

    return (
        <main className="detalle-main">
            <MarcoNavegador titulo={noticia.titulo} direccion={`http://www.pcforgery.cl/noticias/detalle?id=${noticia.id}`}>
            <div className="contenedor-noticia-detalle">
                <Link to="/noticias" className="boton-volver">← Volver a Noticias</Link>

                <h1>{noticia.titulo}</h1>
                <p className="noticia-meta">{formatearFecha(noticia.fecha)}</p>

                <img src={rutaPublica(noticia.imagen)} alt={noticia.titulo} className="noticia-imagen-principal" />

                <div className="noticia-cuerpo">
                    {noticia.texto.split("\n").filter(parrafo => parrafo.trim() !== "").map(function (parrafo, i) {
                        return <p key={i}>{parrafo}</p>
                    })}
                </div>
            </div>
            </MarcoNavegador>
        </main>
    )
}
export default NoticiaDetalle