import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import "./HiloDetalle.css"
import MarcoCorreo from "./components/escritorio/MarcoCorreo.jsx"
import MensajeForo from "./components/MensajeForo.jsx"

const LARGO_MINIMO_RESPUESTA = 3

// Ruta /comunidad/hilo/:id
function HiloDetalle() {
    const { id } = useParams()
    return <DetalleHilo key={id} id={id} />
}

function DetalleHilo({ id }) {
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

    function formatearFecha(iso) {
        const fecha = new Date(iso)
        if (Number.isNaN(fecha.getTime())) return ""
        return fecha.toLocaleString("es-CL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        })
    }

    function irARespuesta() {
        document.getElementById("respuesta-hilo")?.focus()
    }

    const usuario = leerUsuarioActual()
    const [hilo, setHilo] = useState(() => leerHilos().find(item => item.id === id) || null)
    const [texto, setTexto] = useState("")
    const [aviso, setAviso] = useState("")
    const [exito, setExito] = useState(false)

    function avisar(ok, mensaje) {
        setExito(ok)
        setAviso(mensaje)
    }

    function responder(event) {
        event.preventDefault()

        if (!usuario) {
            avisar(false, "Debes iniciar sesión para responder.")
            return
        }

        const hilos = leerHilos()
        const indice = hilos.findIndex(item => item.id === id)
        if (indice === -1) {
            avisar(false, "El hilo no existe.")
            return
        }

        const textoLimpio = texto.trim()
        if (textoLimpio.length < LARGO_MINIMO_RESPUESTA) {
            avisar(false, `La respuesta debe tener al menos ${LARGO_MINIMO_RESPUESTA} caracteres.`)
            return
        }

        const ahora = new Date()
        const actual = hilos[indice]
        const respuestas = Array.isArray(actual.respuestas) ? actual.respuestas : []
        const actualizado = {
            ...actual,
            respuestas: [
                ...respuestas,
                {
                    id: `${id}-r${ahora.getTime()}-${respuestas.length + 1}`,
                    autor: usuario.usuario || usuario.email,
                    texto: textoLimpio,
                    fecha: ahora.toISOString()
                }
            ],
            ultimaActividad: ahora.toISOString()
        }
        hilos[indice] = actualizado

        try {
            localStorage.setItem("hilos", JSON.stringify(hilos))
        } catch {
            avisar(false, "No se pudo guardar la respuesta. Inténtalo de nuevo.")
            return
        }

        setHilo(actualizado)
        setTexto("")
        avisar(true, "Tu respuesta fue publicada.")
    }

    // Renderizado
    if (!hilo) {
        return (
            <main className="hilo-detalle-main">
                <MarcoCorreo titulo="Hilo no encontrado" estado="Hilo no encontrado">
                    <div className="hilo-detalle-contenedor">
                        <div className="hilo-detalle-vacio">
                            <h1>Hilo no encontrado</h1>
                            <p>El hilo que buscas no existe.</p>
                            <Link to="/comunidad" className="boton-volver">← Volver a Comunidad</Link>
                        </div>
                    </div>
                </MarcoCorreo>
            </main>
        )
    }

    const cantidad = hilo.respuestas.length

    return (
        <main className="hilo-detalle-main">
            <MarcoCorreo
                titulo={hilo.titulo}
                cantidad={leerHilos().length}
                estado={`${cantidad} respuesta(s)`}
                alResponder={usuario ? irARespuesta : undefined}
            >
                <div className="hilo-detalle-contenedor">
                    <div className="hilo-detalle-cabecera">
                        <h1>Hilo</h1>
                        <Link to="/comunidad" className="boton-volver">← Volver a Comunidad</Link>
                    </div>
                    <article className="hilo-detalle">
                        <h2>{hilo.titulo}</h2>
                        <p className="hilo-meta">
                            Publicado por <strong>{hilo.autor}</strong> · Categoría: {hilo.categoria} · {formatearFecha(hilo.fecha)}
                        </p>
                        <MensajeForo
                            autor={hilo.autor}
                            texto={hilo.mensaje}
                            fecha={formatearFecha(hilo.fecha)}
                            esOriginal={true}
                        />
                        {hilo.respuestas.map(respuesta => (
                            <MensajeForo
                                key={respuesta.id}
                                autor={respuesta.autor}
                                texto={respuesta.texto}
                                fecha={formatearFecha(respuesta.fecha)}
                            />
                        ))}
                        {usuario ? (
                            <form className="caja-respuesta" onSubmit={responder}>
                                <label htmlFor="respuesta-hilo">
                                    Responder como <strong>{usuario.usuario || usuario.email}</strong>
                                </label>
                                <textarea
                                    id="respuesta-hilo"
                                    name="respuesta"
                                    rows="4"
                                    placeholder="Escribe tu respuesta..."
                                    value={texto}
                                    onChange={event => setTexto(event.target.value)}
                                ></textarea>
                                {aviso && (
                                    <p
                                        role="status"
                                        className={`caja-respuesta-mensaje ${exito ? "caja-respuesta-ok" : "caja-respuesta-error"}`}
                                    >
                                        {aviso}
                                    </p>
                                )}
                                <button type="submit">Responder</button>
                            </form>
                        ) : (
                            <div className="caja-respuesta">
                                <p className="caja-respuesta-aviso">
                                    Debes <Link to="/Login">iniciar sesión</Link> para responder este hilo.
                                </p>
                            </div>
                        )}
                    </article>
                </div>
            </MarcoCorreo>
        </main>
    )
}

export default HiloDetalle