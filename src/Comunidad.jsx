import { Link } from 'react-router-dom'
import "./Comunidad.css"
import HiloCard from "./components/HiloCard"
import MensajeForo from "./components/MensajeForo"

function Comunidad() {
    return (
        <main className="comunidad-main">
            <section className="contenedor-foro">
                <div className="cabecera-foro">
                    <div className="cabecera-titulo">
                        <img src="/img/computer.png" alt="" />
                        <h1>Comunidad</h1>
                    </div>
                    <Link to="/comunidad/nuevo-hilo" className="boton-nuevo-hilo">+ Nuevo hilo</Link>
                </div>
                <ul className="lista-hilos">
                    <HiloCard titulo="¿Qué placa madre me recomiendan para un Ryzen 5 5600?" autor="jgamer99" categoria="Armado de PC" respuestas="12" />
                    <HiloCard titulo="Mi PC no enciende después de cambiar la fuente de poder" autor="anafix" categoria="Soporte técnico" respuestas="7" />
                    <HiloCard titulo="Muestren sus setups armados con PC Forgery" autor="retrotech_cl" categoria="Showcase" respuestas="34" />
                </ul>
                <article className="hilo-detalle">
                    <h2>¿Qué placa madre me recomiendan para un Ryzen 5 5600?</h2>
                    <p className="hilo-meta">Publicado por <strong>jgamer99</strong></p>
                    <MensajeForo autor="jgamer99" esOriginal={true}
                        texto="Ando armando un PC nuevo y ya tengo el procesador, pero no sé bien qué placa madre elegir. ¿Alguna recomendación en el catálogo de la tienda?" />
                    <MensajeForo autor="retrotech_cl"
                        texto="Yo usé la ASUS Prime B450M-A y me fue bien, tiene socket AM4 igual que tu procesador." />
                    <MensajeForo autor="anafix"
                        texto="Depende también de si quieres overclockear después, ahí conviene una gama más alta." />
                    <div className="caja-respuesta">
                        <textarea placeholder="Escribe tu respuesta..." disabled></textarea>
                        <button disabled>Responder</button>
                    </div>
                </article>
            </section>
        </main>
    )
}
export default Comunidad