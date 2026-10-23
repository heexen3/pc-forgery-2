import { useEffect, useState } from "react"
import bootstrapCSS from "bootstrap/dist/css/bootstrap.min.css?url"
import adminCSS from "./Admin.css?url"
import Usuarios from "./components/admin/Usuarios"
import Reportes from "./components/admin/Reportes"
import PerfilAdmin from "./components/admin/PerfilAdmin"
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
    //
return (
    <main className="container-fluid py-4 admin-panel">
        <div className="row g-3">

            {/* Columna izquierda */}
            <div className="col-12 col-md-3 admin-menu">
                <section className="contenido">
                    <div className="admin-titulo">
                        <h2>Administración</h2>
                    </div>

                    <div className="contenido-botones">
                        <button
                            onClick={() => setVista("comandos")}
                        >
                            Comandos Admin
                        </button>

                        <button
                            onClick={() => setVista("historial")}
                        >
                            Historial
                        </button>
                        
                        <button onClick={() => setVista("reportes")}>
                            Ver Reportes
                        </button>
                        
                        <button onClick={() => setVista("usuarios")}>
                            Ver Usuarios
                        </button>
                        
                        <button onClick={() => setVista("perfil")}>
                            Ver Perfil Admin
                        </button>
                    </div>
                </section>
            </div>

            {/* Columna derecha */}
            <div className="col-12 col-md-9 admin-vista">

                {vista === "comandos" && (
                    <section className="contenido">
                        <div className="admin-titulo">
                            <h2>Comandos Admin</h2>
                        </div>

                        <div className="contenido-botones">
                            <button className="btn btn-admin">
                                Borrar LocalStorage
                            </button>

                            <button className="btn btn-admin">
                                Limpiar Historial
                            </button>
                        </div>
                    </section>
                )}

                {vista === "historial" && (
                    <section className="contenido">
                        <div className="admin-titulo">
                            <h2>Historial</h2>
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

            </div>
        </div>
    </main>
)


}

export default Admin