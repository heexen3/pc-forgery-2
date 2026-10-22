import { Link } from 'react-router-dom'
import "./NuevoHilo.css"

function NuevoHilo() {
    return (
        <main className="nuevo-hilo-main">
            <section className="contenedor-foro">
                <div className="cabecera-foro">
                    <h1>Nuevo hilo</h1>
                    <Link to="/comunidad" className="boton-volver">← Volver a Comunidad</Link>
                </div>
                <form className="formulario-hilo">
                    <label htmlFor="titulo-hilo">Título</label>
                    <input type="text" id="titulo-hilo" name="titulo" placeholder="Escribe un título claro para tu hilo" />
                    <label htmlFor="categoria-hilo">Categoría</label>
                    <select id="categoria-hilo" name="categoria">
                        <option value="armado">Armado de PC</option>
                        <option value="soporte">Soporte técnico</option>
                        <option value="showcase">Showcase</option>
                        <option value="general">General</option>
                    </select>
                    <label htmlFor="mensaje-hilo">Mensaje</label>
                    <textarea id="mensaje-hilo" name="mensaje" placeholder="Cuéntanos en detalle tu consulta o publicación..." rows="8"></textarea>
                    <div className="acciones-formulario">
                        <button type="submit" className="boton-postear" disabled>Postear</button>
                        <span className="aviso-formulario">Publicar hilos estará disponible próximamente.</span>
                    </div>
                </form>
            </section>
        </main>
    )
}
export default NuevoHilo