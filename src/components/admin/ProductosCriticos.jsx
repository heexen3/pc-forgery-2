
import { useState, useEffect } from "react"
import { obtenerProductosCriticos } from "./ProductosCriticos.js"

function ProductosCriticos() {
    const [productos, setProductos] = useState([])

    useEffect(() => {
        setProductos(obtenerProductosCriticos())
    }, [])

    return (
        <section className="contenido">
            <div className="admin-titulo">
                <h2>Productos con Stock Crítico</h2>
            </div>

            <div className="table-responsive">
                <table className="table table-bordered table-striped">
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
                                <td>{producto.id}</td>
                                <td>{producto.nombre}</td>
                                <td>{producto.categoria}</td>
                                <td>
                                    ${Number(producto.precio).toLocaleString("es-CL")}
                                </td>
                                <td>{producto.stock}</td>
                                <td>
                                    {Number(producto.stock) === 0
                                        ? "Sin stock"
                                        : "Stock crítico"}
                                </td>
                            </tr>
                        ))}

                        {productos.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center">
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
