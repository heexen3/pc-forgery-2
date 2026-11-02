import { useState } from "react"
import BotonesWindows from "../BotonesWindows.jsx"
import { obtenerProductosCriticos } from "./ProductosCriticos.js"

function ProductosCriticos() {
    const [productos] = useState(() => obtenerProductosCriticos())

    return (
        <section className="contenido">
            <div className="admin-titulo">
                <h2>Productos con Stock Crítico</h2>
                <BotonesWindows />
            </div>

            <div className="admin-tabla-contenedor p-2 p-md-3">
                <table className="table table-bordered table-striped tabla-admin-responsiva mb-0">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Producto</th>
                            <th>Categoría</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Estado</th>
                        </tr>
                    </thead>

                    <tbody>
                        {productos.map(producto => (
                            <tr key={producto.id}>
                                <td data-label="ID">{producto.id}</td>
                                <td data-label="Producto">
                                    <strong>{producto.nombre}</strong>
                                </td>
                                <td data-label="Categoría">{producto.categoria}</td>
                                <td data-label="Precio">
                                    ${Number(producto.precio).toLocaleString("es-CL")}
                                </td>
                                <td data-label="Stock">
                                    <span className="text-danger fw-bold">{producto.stock}</span>
                                </td>
                                <td data-label="Estado">
                                    <span className={`badge ${Number(producto.stock) === 0 ? "bg-danger" : "bg-warning text-dark"}`}>
                                        {Number(producto.stock) === 0
                                            ? "Sin stock"
                                            : "Stock crítico"}
                                    </span>
                                </td>
                            </tr>
                        ))}

                        {productos.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center py-3">
                                    No hay productos con stock crítico.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    )
}

export default ProductosCriticos
