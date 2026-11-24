import BarraTitulo from "./components/BarraTitulo.jsx"
import { useEffect, useState } from "react"
import bootstrapCSS from "bootstrap/dist/css/bootstrap.min.css?url"
import adminCSS from "./Admin.css?url"
import Usuarios from "./components/admin/Usuarios.jsx"
import Reportes from "./components/admin/Reportes.jsx"
import PerfilAdmin from "./components/admin/PerfilAdmin.jsx"
import Productos from "./components/admin/Productos.jsx"
import Dashboard from "./components/admin/Dashboard.jsx"
import NoticiasAdmin from "./components/admin/Noticias.jsx"
import { sincronizarUsuarios } from "./data/usuariosData.js"
import { sincronizarProductos } from "./data/catalogoProductos.js"
import { sincronizarNoticias } from "./data/catalogoNoticias.js"
import { sincronizarBoletas } from "./components/carrito/Boletas.js"
import { useSincronizacion } from "./utils/api.js"

// Con backend: al entrar al panel se cargan usuarios (auth), catálogo y stock
// (productos + inventario), boletas (pedidos) y noticias (comunidad). Requiere rol ADMIN.
function sincronizarPanel() {
    return Promise.allSettled([sincronizarUsuarios(), sincronizarProductos(), sincronizarBoletas(), sincronizarNoticias()])
}

function Admin() {
    useSincronizacion(sincronizarPanel)
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
                        <BarraTitulo titulo="Administración" icono="/tools.png" como="h2" />

                        <div className="contenido-botones">
                            <button
                                className={vista === "comandos" ? "active" : ""}
                                onClick={() => setVista("comandos")}
                            >
                                Comandos Admin
                            </button>

                            <button
                                className={vista === "dashboard" ? "active" : ""}
                                onClick={() => setVista("dashboard")}
                            >
                                Dashboard
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

                            <button
                                className={vista === "noticias" ? "active" : ""}
                                onClick={() => setVista("noticias")}
                            >
                                Gestionar Noticias
                            </button>
                        </div>
                    </section>
                </div>

                {/* Columna derecha: Vistas principales */}
                <div className="col-12 col-md-9 admin-vista">
                    {vista === "comandos" && (
                        <section className="contenido">
                            <BarraTitulo titulo="Comandos Admin" icono="/tools.png" como="h2" />

                            <div className="contenido-botones p-3">
                                <button
                                    className="btn btn-admin me-2 mb-2"
                                    onClick={() => {
                                        // se conserva la sesión (tokens) para no cerrar la sesión del admin
                                        const sesion = localStorage.getItem("sesion")
                                        const usuarioActual = localStorage.getItem("usuarioActual")
                                        localStorage.clear()
                                        if (sesion) localStorage.setItem("sesion", sesion)
                                        if (usuarioActual) localStorage.setItem("usuarioActual", usuarioActual)
                                        alert("LocalStorage borrado correctamente.")
                                    }}
                                >
                                    Borrar LocalStorage
                                </button>
                            </div>
                        </section>
                    )}

                    {vista === "dashboard" && <Dashboard />}

                    {vista === "usuarios" && <Usuarios />}

                    {vista === "reportes" && <Reportes />}

                    {vista === "perfil" && <PerfilAdmin />}

                    {vista === "productos" && <Productos />}

                    {vista === "noticias" && <NoticiasAdmin />}
                </div>
            </div>
        </main>
    )
}

export default Admin
