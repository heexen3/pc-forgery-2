import { useState } from 'react'
import { Link } from 'react-router-dom'
import "./comunidad.css"
import HiloCard from "./components/HiloCard"
import MarcoCorreo from "./components/escritorio/MarcoCorreo.jsx"
import { rutaPublica } from "./utils/rutaPublica.js"

function Comunidad() {
    // Lógica
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

    // primero va el hilo con la actividad mas reciente
    // (un hilo nuevo, o con una respuesta nueva, sube hasta arriba)
    const [hilos] = useState(() =>
        [...leerHilos()].sort(
            (a, b) => new Date(b.ultimaActividad) - new Date(a.ultimaActividad)
        )
    )

    // Renderizado
    return (
        <main className="comunidad-main">
            <MarcoCorreo cantidad={hilos.length} estado={`${hilos.length} hilo(s)`}>
                <div className="contenedor-foro">
                    <div className="cabecera-foro">
                        <div className="cabecera-titulo">
                            <img src={rutaPublica("/computer.png")} alt="" />
                            <h1>Comunidad</h1>
                        </div>
                        <Link to="/comunidad/nuevo-hilo" className="boton-nuevo-hilo">+ Nuevo hilo</Link>
                    </div>
                    {hilos.length === 0 ? (
                        <p className="foro-vacio">Aún no hay hilos. ¡Crea el primero!</p>
                    ) : (
                        <ul className="lista-hilos">
                            {hilos.map(hilo => (
                                <HiloCard
                                    key={hilo.id}
                                    id={hilo.id}
                                    titulo={hilo.titulo}
                                    autor={hilo.autor}
                                    categoria={hilo.categoria}
                                    respuestas={hilo.respuestas.length}
                                    ultimaActividad={formatearFecha(hilo.ultimaActividad)}
                                />
                            ))}
                        </ul>
                    )}
                </div>
            </MarcoCorreo>
        </main>
    )
}
export default Comunidad