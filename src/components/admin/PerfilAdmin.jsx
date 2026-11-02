import BarraTitulo from "../BarraTitulo.jsx"
import { useEffect, useState } from "react"
import {
    obtenerPerfilAdmin,
    guardarPerfilAdmin
} from "./PerfilAdmin.js"

function PerfilAdmin() {
    const [nombre, setNombre] = useState("")
    const [correo, setCorreo] = useState("")
    const [mensaje, setMensaje] = useState("")

    useEffect(() => {
        const usuarioActual = obtenerPerfilAdmin()

        if (usuarioActual) {
            setNombre(usuarioActual.nombre || usuarioActual.usuario || "")
            setCorreo(usuarioActual.correo || usuarioActual.email || "")
        } else {
            setMensaje("No se encontró una sesión activa.")
        }
    }, [])

    function guardarCambios(e) {
        e.preventDefault()

        const resultado = guardarPerfilAdmin(nombre, correo)

        setMensaje(resultado.mensaje)

        if (resultado.correcto) {
            const usuarioActual = obtenerPerfilAdmin()

            if (usuarioActual) {
                setNombre(usuarioActual.nombre || usuarioActual.usuario || "")
                setCorreo(usuarioActual.correo || usuarioActual.email || "")
            }
        }
    }

    return (
        <section className="contenido">
            <BarraTitulo titulo="Perfil del administrador" icono="/tools.png" como="h2" />

            <div className="p-3">
                <form onSubmit={guardarCambios} className="border p-3 bg-light">
                    <div className="mb-3">
                        <label htmlFor="perfilNombre" className="form-label">
                            Nombre completo
                        </label>

                        <input
                            type="text"
                            id="perfilNombre"
                            className="form-control"
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="perfilCorreo" className="form-label">
                            Correo electrónico
                        </label>

                        <input
                            type="email"
                            id="perfilCorreo"
                            className="form-control"
                            value={correo}
                            onChange={e => setCorreo(e.target.value)}
                            required
                        />
                    </div>

                    {mensaje && (
                        <p role="status" className="alert py-2">{mensaje}</p>
                    )}

                    <button type="submit" className="btn btn-admin">
                        Guardar cambios
                    </button>
                </form>
            </div>
        </section>
    )
}

export default PerfilAdmin
