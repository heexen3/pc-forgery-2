import "./Noticias.css"
import NoticiaCard from "./components/NoticiaCard"
import MarcoNavegador from "./components/escritorio/MarcoNavegador.jsx"
import { rutaPublica } from "./utils/rutaPublica.js"
import { useNoticias } from "./components/noticias/useNoticias.js"
import { formatearFecha } from "./data/catalogoNoticias.js"

function Noticias() {
    const { noticias, eliminarNoticia } = useNoticias()

    const usuario = JSON.parse(localStorage.getItem("usuarioActual"))
    const esAdmin = usuario?.rol === "admin"

    return (
        <main className="noticias-main">
            <MarcoNavegador titulo="Noticias PC Forgery" direccion="http://www.pcforgery.cl/noticias">
            <div className="contenedor-noticias">
                <div className="titulo-noticias">
                    <img src={rutaPublica("/computer.png")} alt="" />
                    <h1>Noticias</h1>
                </div>

                <ul className="lista-noticias">
                    {noticias.map(noticia => (
                        <NoticiaCard
                            key={noticia.id}
                            id={noticia.id}
                            titulo={noticia.titulo}
                            fecha={formatearFecha(noticia.fecha)}
                            resumen={noticia.resumen}
                            imagen={noticia.imagen}
                            onEliminar={esAdmin ? eliminarNoticia : undefined}
                        />
                    ))}

                    {noticias.length === 0 && (
                        <p>No hay noticias publicadas todavía.</p>
                    )}
                </ul>
            </div>
            </MarcoNavegador>
        </main>
    )
}
export default Noticias