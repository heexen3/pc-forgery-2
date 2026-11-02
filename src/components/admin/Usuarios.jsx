import { useState, useRef } from "react"
import BotonesWindows from "../BotonesWindows.jsx"
import NuevoUsuario from "./NuevoUsuario.jsx"
import MostrarUsuarios from "./MostrarUsuarios.jsx"
import EditarUsuario from "./EditarUsuario.jsx"
import HistorialCompras from "./HistorialCompras.jsx"

function Usuarios() {
    const [vistaUsuario, setVistaUsuario] = useState("mostrar")
    const [usuarioParaEditar, setUsuarioParaEditar] = useState(null)
    const refFormEditar = useRef(null)

    function manejarEditarUsuario(usuario) {
        setUsuarioParaEditar(usuario)
        setVistaUsuario("editar")
        setTimeout(() => {
            if (refFormEditar.current) {
                refFormEditar.current.scrollIntoView({ behavior: "smooth", block: "start" })
            }
        }, 80)
    }

    return (
        <section className="contenido">
            <div className="admin-titulo">
                <h2>Administración de Usuarios</h2>
                <BotonesWindows />
            </div>

            <div className="contenido-botones">
                <button
                    className={`btn btn-admin ${vistaUsuario === "nuevo" ? "active" : ""}`}
                    onClick={() => {
                        setUsuarioParaEditar(null)
                        setVistaUsuario("nuevo")
                    }}
                >
                    Nuevo usuario
                </button>

                <button
                    className={`btn btn-admin ${vistaUsuario === "mostrar" ? "active" : ""}`}
                    onClick={() => setVistaUsuario("mostrar")}
                >
                    Mostrar usuarios
                </button>

                <button
                    className={`btn btn-admin ${vistaUsuario === "editar" ? "active" : ""}`}
                    onClick={() => setVistaUsuario("editar")}
                >
                    Editar usuario
                </button>

                <button
                    className={`btn btn-admin ${vistaUsuario === "compras" ? "active" : ""}`}
                    onClick={() => setVistaUsuario("compras")}
                >
                    Historial de compras
                </button>
            </div>

            <div className="usuarios-vista" ref={refFormEditar}>
                {vistaUsuario === "nuevo" && <NuevoUsuario />}

                {vistaUsuario === "mostrar" && (
                    <MostrarUsuarios onEditarUsuario={manejarEditarUsuario} />
                )}

                {vistaUsuario === "editar" && (
                    <EditarUsuario
                        key={usuarioParaEditar ? (usuarioParaEditar.correo || usuarioParaEditar.email || "sel") : "default"}
                        usuarioSeleccionadoInicial={usuarioParaEditar}
                        onVolver={() => setVistaUsuario("mostrar")}
                    />
                )}

                {vistaUsuario === "compras" && <HistorialCompras />}
            </div>
        </section>
    )
}

export default Usuarios
