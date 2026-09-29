import VentanaColapsable from "./components/VentanaColapsable"
import './Noticias.css'
import './App.css'

function Noticias() {
    // lógica

    // renderizado
    return (
        <section className="contenedor-noticias">

            <div className="titulo-noticias">
                <img src="/computer.png" alt=""/>
                <h1>Noticias</h1>
            </div>

            <ul className="lista-noticias">
                
                <li className="noticia">
                    <a href="noticia_detalle.html?id=1" className="noticia-link">
                        <h2 className="noticia-titulo">Nueva generación de tarjetas gráficas llega a la tienda</h2>
                        <p className="noticia-meta">Publicado el 03 de septiembre, 2026</p>
                        <p className="noticia-resumen">Ya disponibles los nuevos modelos con mejor rendimiento por precio, ideales para actualizar tu setup sin gastar de más.</p>
                    </a>
                </li>

                <li className="noticia">
                    <a href="noticia_detalle.html?id=2" className="noticia-link">
                        <h2 className="noticia-titulo">PC Forgery suma la sección Comunidad</h2>
                        <p className="noticia-meta">Publicado el 06 de septiembre, 2026</p>
                        <p className="noticia-resumen">Ahora puedes compartir tus armados, hacer preguntas y ayudar a otros usuarios en nuestro nuevo espacio de foro.</p>
                    </a>
                </li>

                <li className="noticia">
                    <a href="noticia_detalle.html?id=3" className="noticia-link">
                        <h2 className="noticia-titulo">Guía rápida: cómo elegir tu primera fuente de poder</h2>
                        <p className="noticia-meta">Publicado el 01 de septiembre, 2026</p>
                        <p className="noticia-resumen">Te explicamos qué significa el wattage, la certificación 80 Plus y qué debes considerar antes de comprar.</p>
                    </a>
                </li>
            </ul>
        </section>
    )

}

export default Noticias