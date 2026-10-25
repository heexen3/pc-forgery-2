import { useState } from "react"
import NuevoUsuario from "./NuevoUsuario.jsx"
import MostrarUsuarios from "./MostrarUsuarios.jsx"
import EditarUsuario from "./EditarUsuario.jsx"
import HistorialCompras from "./HistorialCompras.jsx"

function Usuarios() {
    const [vistaUsuario, setVistaUsuario] = useState("mostrar")

    return (
        <section className="contenido">
            <div className="admin-titulo">
                <h2>Administración de Usuarios</h2>
            </div>

            <div className="contenido-botones">
                <button
                    className="btn btn-admin"
                    onClick={() => setVistaUsuario("nuevo")}
                >
                    Nuevo usuario
                </button>

                <button
                    className="btn btn-admin"
                    onClick={() => setVistaUsuario("mostrar")}
                >
                    Mostrar usuarios
                </button>

                <button
                    className="btn btn-admin"
                    onClick={() => setVistaUsuario("editar")}
                >
                    Editar usuario
                </button>

                <button
                    className="btn btn-admin"
                    onClick={() => setVistaUsuario("compras")}
                >
                    Historial de compras
                </button>
            </div>

            <div className="usuarios-vista">
                {vistaUsuario === "nuevo" && <NuevoUsuario />}

                {vistaUsuario === "mostrar" && <MostrarUsuarios />}

                {vistaUsuario === "editar" && <EditarUsuario />}

                {vistaUsuario === "compras" && <HistorialCompras />}
            </div>
        </section>
    )
}

export default Usuarios