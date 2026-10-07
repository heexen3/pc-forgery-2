import { useEffect, useState } from "react"
import bootstrapCSS from "bootstrap/dist/css/bootstrap.min.css?url"
import adminCSS from "./Admin.css?url"
import BotonesWindows from "./components/BotonesWindows"
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
        <>
        <main>
            <section className="contenido">
                <div className="admin-titulo">
                    <h2>Administración</h2>
                </div>
                
                <div className="contenido-botones">
                    <button onClick={() => setVista("comandos")}>
                        Comandos Admin
                    </button>
                    <button onClick={() => setVista("historial")}>
                        Historial
                    </button>
                </div>
            </section>
        </main>
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
                </table>
            </div>
        </section>
)}
        </>
    )
}

export default Admin