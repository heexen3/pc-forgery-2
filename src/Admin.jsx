import { useEffect, useState } from "react"
import bootstrapCSS from "bootstrap/dist/css/bootstrap.min.css?url"
import adminCSS from "./Admin.css?url"
import BotonesWindows from "./components/BotonesWindows.jsx"
import Usuarios from "./components/admin/Usuarios.jsx"
import Reportes from "./components/admin/Reportes.jsx"
import PerfilAdmin from "./components/admin/PerfilAdmin.jsx"
import Productos from "./components/admin/Productos.jsx"

function Admin() {
    // Lógica
    const [vista, setVista] = useState("comandos")

    useEffect(() => {
        const linkBootstrap = document.createElement("link")
        linkBootstrap.rel = "stylesheet"
        linkBootstrap.href = bootstrapCSS
        linkBootstrap.id = "bootstrap-admin"
        document.head.appendChild(linkBootstrap)

        const linkAdmin = document.createElement("link")
        linkAdmin.rel = "stylesheet"
        linkAdmin.href = adminCSS
        linkAdmin.id = "admin-css"
        document.head.appendChild(linkAdmin)

        return () => {
            document.getElementById("bootstrap-admin")?.remove()
            document.getElementById("admin-css")?.remove()
        }
    }, [])

    return (
        <main className="container-fluid py-4 admin-panel">
            <div className="row g-3">
                {/* Columna izquierda: Menú de navegación de administración */}
                <div className="col-12 col-md-3 admin-menu">
                    <section className="contenido">
                        <div className="admin-titulo">
                            <h2>Administración</h2>
                            <BotonesWindows />
                        </div>

                        <div className="contenido-botones">
                            <button
                                className={vista === "comandos" ? "active" : ""}
                                onClick={() => setVista("comandos")}
                            >
                                Comandos Admin
                            </button>

                            <button
                                className={vista === "historial" ? "active" : ""}
                                onClick={() => setVista("historial")}
                            >
                                Historial
                            </button>

                            <button
                                className={vista === "reportes" ? "active" : ""}
                                onClick={() => setVista("reportes")}
                            >
                                Ver Reportes
                            </button>

                            <button
                                className={vista === "usuarios" ? "active" : ""}
                                onClick={() => setVista("usuarios")}
                            >
                                Ver Usuarios
                            </button>

                            <button
                                className={vista === "perfil" ? "active" : ""}
                                onClick={() => setVista("perfil")}
                            >
                                Ver Perfil Admin
                            </button>

                            <button
                                className={vista === "productos" ? "active" : ""}
                                onClick={() => setVista("productos")}
                            >
                                Gestionar Productos
                            </button>
                        </div>
                    </section>
                </div>

                {/* Columna derecha: Vistas principales */}
                <div className="col-12 col-md-9 admin-vista">
                    {vista === "comandos" && (
                        <section className="contenido">
                            <div className="admin-titulo">
                                <h2>Comandos Admin</h2>
                                <BotonesWindows />
                            </div>

                            <div className="contenido-botones p-3">
                                <button className="btn btn-admin me-2 mb-2">
                                    Borrar LocalStorage
                                </button>

                                <button className="btn btn-admin mb-2">
                                    Limpiar Historial
                                </button>
                            </div>
                        </section>
                    )}

                    {vista === "historial" && (
                        <section className="contenido">
                            <div className="admin-titulo">
                                <h2>Historial</h2>
                                <BotonesWindows />
                            </div>

                            <div className="historial-contenedor">
                                <table className="historial-tabla">
                                    <thead>
                                        <tr>
                                            <th>Fecha</th>
                                            <th>Acción</th>
                                            <th>Usuario</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Registros del historial */}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    {vista === "usuarios" && <Usuarios />}

                    {vista === "reportes" && <Reportes />}

                    {vista === "perfil" && <PerfilAdmin />}

                    {vista === "productos" && <Productos />}
                </div>
            </div>
        </main>
    )
}

export default Admin
