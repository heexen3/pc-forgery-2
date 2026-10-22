import "./Noticias.css"
import NoticiaCard from "./components/NoticiaCard"

function Noticias() {
    return (
        <main className="noticias-main">
            <section className="contenedor-noticias">
                <div className="titulo-noticias">
                    <img src="/img/computer.png" alt="" />
                    <h1>Noticias</h1>
                </div>

                <ul className="lista-noticias">
                    <NoticiaCard
                        id="1"
                        titulo="Nueva generación de tarjetas gráficas llega a la tienda"
                        fecha="Publicado el 03 de septiembre, 2026"
                        resumen="Ya disponibles los nuevos modelos con mejor rendimiento por precio, ideales para actualizar tu setup sin gastar de más."
                    />
                    <NoticiaCard
                        id="2"
                        titulo="PC Forgery suma la sección Comunidad"
                        fecha="Publicado el 06 de septiembre, 2026"
                        resumen="Ahora puedes compartir tus armados, hacer preguntas y ayudar a otros usuarios en nuestro nuevo espacio de foro."
                    />
                    <NoticiaCard
                        id="3"
                        titulo="Guía rápida: cómo elegir tu primera fuente de poder"
                        fecha="Publicado el 01 de septiembre, 2026"
                        resumen="Te explicamos qué significa el wattage, la certificación 80 Plus y qué debes considerar antes de comprar."
                    />
                </ul>
            </section>
        </main>
    )
}
export default Noticias