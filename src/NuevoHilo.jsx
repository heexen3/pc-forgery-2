import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "./NuevoHilo.css"
import MarcoCorreo from "./components/escritorio/MarcoCorreo.jsx"

const CATEGORIAS = ["Armado de PC", "Soporte técnico", "Showcase", "General"]
const LARGO_MINIMO_TITULO = 5
const LARGO_MAXIMO_TITULO = 100
const LARGO_MINIMO_MENSAJE = 10

function NuevoHilo() {
    // Lógica
    function leerUsuarioActual() {
        try {
            return JSON.parse(localStorage.getItem("usuarioActual"))
        } catch {
            return null
        }
    }

    function leerHilos() {
        try {
            const datos = JSON.parse(localStorage.getItem("hilos"))
            return Array.isArray(datos) ? datos : []
        } catch {
            return []
        }
    }

    const navigate = useNavigate()
    const usuario = leerUsuarioActual()
    const [titulo, setTitulo] = useState("")
    const [categoria, setCategoria] = useState(CATEGORIAS[0])
    const [mensaje, setMensaje] = useState("")
    const [error, setError] = useState("")

    function publicar(event) {
        event.preventDefault()

        if (!usuario) {
            setError("Debes iniciar sesión para crear un hilo.")
            return
        }

        const tituloLimpio = titulo.trim()
        if (tituloLimpio.length < LARGO_MINIMO_TITULO) {
            setError(`El título debe tener al menos ${LARGO_MINIMO_TITULO} caracteres.`)
            return
        }
        if (tituloLimpio.length > LARGO_MAXIMO_TITULO) {
            setError(`El título no puede superar los ${LARGO_MAXIMO_TITULO} caracteres.`)
            return
        }

        if (!CATEGORIAS.includes(categoria)) {
            setError("Selecciona una categoría válida.")
            return
        }

        const mensajeLimpio = mensaje.trim()
        if (mensajeLimpio.length < LARGO_MINIMO_MENSAJE) {
            setError(`El mensaje debe tener al menos ${LARGO_MINIMO_MENSAJE} caracteres.`)
            return
        }

        const hilos = leerHilos()
        const ahora = new Date()

        // id único, aunque dos hilos se creen en el mismo milisegundo     //hay que borrar
        const base = `hilo-${ahora.getTime()}`
        let id = base
        let n = 1
        while (hilos.some(hilo => hilo.id === id)) {
            id = `${base}-${n++}`
        }

        const nuevo = {
            id,
            titulo: tituloLimpio,
            categoria,
            autor: usuario.usuario || usuario.email,
            mensaje: mensajeLimpio,
            fecha: ahora.toISOString(),
            ultimaActividad: ahora.toISOString(),
            respuestas: []
        }

        try {
            localStorage.setItem("hilos", JSON.stringify([nuevo, ...hilos]))
        } catch {
            setError("No se pudo guardar el hilo. Inténtalo de nuevo.")
            return
        }

        // al publicar se abre el hilo recien creado
        navigate(`/comunidad/hilo/${id}`)
    }

    // Renderizado
    return (
        <main className="nuevo-hilo-main">
            <MarcoCorreo titulo="Nuevo hilo" carpetaActiva="Borradores" estado="Redactando mensaje">
                <div className="contenedor-foro">
                    <div className="cabecera-foro">
                        <h1>Nuevo hilo</h1>
                        <Link to="/comunidad" className="boton-volver">← Volver a Comunidad</Link>
                    </div>
                    <form className="formulario-hilo" onSubmit={publicar}>
                        {!usuario && (
                            <p className="aviso-sesion">
                                Debes <Link to="/Login">iniciar sesión</Link> para crear un hilo.
                            </p>
                        )}
                        <label htmlFor="titulo-hilo">Título</label>
                        <input
                            type="text"
                            id="titulo-hilo"
                            name="titulo"
                            placeholder="Escribe un título claro para tu hilo"
                            maxLength={LARGO_MAXIMO_TITULO}
                            value={titulo}
                            onChange={event => setTitulo(event.target.value)}
                            disabled={!usuario}
                        />
                        <label htmlFor="categoria-hilo">Categoría</label>
                        <select
                            id="categoria-hilo"
                            name="categoria"
                            value={categoria}
                            onChange={event => setCategoria(event.target.value)}
                            disabled={!usuario}
                        >
                            {CATEGORIAS.map(opcion => (
                                <option key={opcion} value={opcion}>{opcion}</option>
                            ))}
                        </select>
                        <label htmlFor="mensaje-hilo">Mensaje</label>
                        <textarea
                            id="mensaje-hilo"
                            name="mensaje"
                            placeholder="Cuéntanos en detalle tu consulta o publicación..."
                            rows="8"
                            value={mensaje}
                            onChange={event => setMensaje(event.target.value)}
                            disabled={!usuario}
                        ></textarea>
                        {error && <p className="error-formulario" role="alert">{error}</p>}
                        <div className="acciones-formulario">
                            <button type="submit" className="boton-postear" disabled={!usuario}>Postear</button>
                        </div>
                    </form>
                </div>
            </MarcoCorreo>
        </main>
    )
}
export default NuevoHilo