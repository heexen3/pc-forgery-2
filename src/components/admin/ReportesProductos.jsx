
import { useState } from "react"
import { generarReporteProd } from "./Reportes.js"

function Reportes() {
    const [reporte, setReporte] = useState(() => generarReporteProd())

    function actualizarReporte() {
        setReporte(generarReporteProd())
    }

    return (
        <section className="contenido">
            <div className="admin-titulo">
                <h2>Reportes del Inventario</h2>
            </div>

            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>Indicador</th>
                            <th>Resultado</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>Total de productos registrados</td>
                            <td>{reporte.totalProductos}</td>
                        </tr>

                        <tr>
                            <td>Unidades en inventario</td>
                            <td>{reporte.unidadesTotales}</td>
                        </tr>

                        <tr>
                            <td>Valor del inventario</td>
                            <td>
                                ${reporte.valorInventario.toLocaleString("es-CL")}
                            </td>
                        </tr>

                        <tr>
                            <td>Productos sin stock</td>
                            <td>{reporte.productosSinStock}</td>
                        </tr>

                        <tr>
                            <td>Productos con stock crítico (3 o menos)</td>
                            <td>{reporte.productosCriticos}</td>
                        </tr>

                        <tr>
                            <td>Categoría con más productos</td>
                            <td>{reporte.categoriaConMasProductos}</td>
                        </tr>

                        <tr>
                            <td>Cantidad de productos en esa categoría</td>
                            <td>{reporte.cantidadCategoria}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <button
                type="button"
                className="btn btn-admin"
                onClick={actualizarReporte}
            >
                Actualizar reporte
            </button>
        </section>
    )
}

export default Reportes
