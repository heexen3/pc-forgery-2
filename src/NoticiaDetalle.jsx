import { useSearchParams, Link } from "react-router-dom"
import "./NoticiaDetalle.css"
/*import noticia1 from "./assets/noticia1.webp"
import noticia2 from "./assets/noticia2.webp"
import monalisa from "./assets/monalisa.jpeg"
import computer from "./assets/computer.png"
*/
function NoticiaDetalle() {
    const [searchParams] = useSearchParams()
    const id = Number(searchParams.get("id"))

    const noticias = [
        {
            id: 1,
            titulo: "DETALLE DE NOTICIA IMPORTANTE",
            fecha: "Publicado el 03 de septiembre, 2026",
            imagen: "/img/noticia1.webp",
            cuerpo: [
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure natus veritatis ullam praesentium voluptas perspiciatis voluptatem, nihil inventore. Excepturi reprehenderit, quae quia maiores nesciunt saepe soluta iure natus exercitationem amet.",
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure natus veritatis ullam praesentium voluptas perspiciatis voluptatem, nihil inventore."
            ],
            imagenSecundaria: "/img/monalisa.jpeg"
        },
        {
            id: 2,
            titulo: "PC Forgery suma la sección Comunidad",
            fecha: "Publicado el 06 de septiembre, 2026",
            imagen: "/img/noticia2.webp",
            cuerpo: [
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure natus veritatis ullam praesentium voluptas perspiciatis voluptatem, nihil inventore. Excepturi reprehenderit, quae quia maiores nesciunt saepe soluta iure natus exercitationem amet.",
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure natus veritatis ullam praesentium voluptas perspiciatis voluptatem, nihil inventore."
            ],
            imagenSecundaria: null
        },
        {
            id: 3,
            titulo: "Guía rápida: cómo elegir tu primera fuente de poder",
            fecha: "Publicado el 01 de septiembre, 2026",
            imagen: "/img/computer.png",
            cuerpo: [
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure natus veritatis ullam praesentium voluptas perspiciatis voluptatem, nihil inventore. Excepturi reprehenderit, quae quia maiores nesciunt saepe soluta iure natus exercitationem amet.",
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure natus veritatis ullam praesentium voluptas perspiciatis voluptatem, nihil inventore."
            ],
            imagenSecundaria: null
        }
    ]
    const noticia = noticias.find(function (n) { return n.id === id })
    if (!noticia) {
        return (
            <main className="detalle-main">
                <article className="contenedor-noticia-detalle">
                    <h1>Noticia no encontrada</h1>
                    <Link to="/noticias" className="boton-volver">← Volver a Noticias</Link>
                </article>
            </main>
        )
    }
    return (
        <main className="detalle-main">
            <article className="contenedor-noticia-detalle">
                <Link to="/noticias" className="boton-volver">← Volver a Noticias</Link>

                <h1>{noticia.titulo}</h1>
                <p className="noticia-meta">{noticia.fecha}</p>

                <img src={noticia.imagen} alt={noticia.titulo} className="noticia-imagen-principal" />

                <div className="noticia-cuerpo">
                    {noticia.cuerpo.map(function (parrafo, i) {
                        return <p key={i}>{parrafo}</p>
                    })}
                    {noticia.imagenSecundaria && (
                        <img src={noticia.imagenSecundaria} alt="" className="noticia-imagen-secundaria" />
                    )}
                </div>
            </article>
        </main>
    )
}
export default NoticiaDetalle