import { useState } from "react"
import NuevoProducto from "./NuevoProducto.jsx"
import MostrarProductos from "./MostrarProductos.jsx"
import ProductosCriticos from "./ProductosCriticos.jsx"
import Reportes from "./ReportesProductos.jsx"

function Productos() {
    const [vista, setVista] = useState("menu")

    return (
        <section className="contenido">
            <div className="admin-titulo">
                <h2>Gestión de Productos</h2>
            </div>

            {vista === "menu" && (
                <div className="contenido-botones">
                    <button onClick={() => setVista("nuevo")}>
                        Nuevo Producto
                    </button>

                    <button onClick={() => setVista("mostrar")}>
                        Mostrar Productos
                    </button>

                    <button onClick={() => setVista("criticos")}>
                        Productos Críticos
                    </button>

                    <button onClick={() => setVista("reportes")}>
                        Reportes de Productos
                    </button>
                </div>
            )}

            {vista !== "menu" && (
                <div className="contenido-botones">
                    <button onClick={() => setVista("menu")}>
                        Volver al menú de productos
                    </button>
                </div>
            )}

            {vista === "nuevo" && <NuevoProducto />}

            {vista === "mostrar" && <MostrarProductos />}

            {vista === "criticos" && <ProductosCriticos />}

            {vista === "reportes" && <Reportes />}
        </section>
    )
}

export default Productos