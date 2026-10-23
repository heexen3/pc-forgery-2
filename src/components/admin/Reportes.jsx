import { useState } from "react"
import { generarReporte } from "./Reportes.js"

function Reportes() {
    const [reporte, setReporte] = useState(null)

    function mostrarReporte() {
        setReporte(generarReporte())
    }

    return (
        <section className="contenido">
            <div className="admin-titulo">
                <h2>Reportes</h2>
            </div>

            <div className="p-3">
                <p>
                    Consulta un resumen de los usuarios y las compras
                    registradas en PC Forgery.
                </p>

                <button
                    type="button"
                    className="btn btn-admin mb-3"
                    onClick={mostrarReporte}
                >
                    Generar reporte
                </button>

                {reporte && (
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
                                    <td>Usuarios registrados</td>
                                    <td>{reporte.usuarios}</td>
                                </tr>

                                <tr>
                                    <td>Administradores</td>
                                    <td>{reporte.administradores}</td>
                                </tr>

                                <tr>
                                    <td>Compras registradas</td>
                                    <td>{reporte.compras}</td>
                                </tr>

                                <tr>
                                    <td>Total de ventas</td>
                                    <td>
                                        {reporte.totalVentas.toLocaleString(
                                            "es-CL",
                                            {
                                                style: "currency",
                                                currency: "CLP",
                                                maximumFractionDigits: 0
                                            }
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    )
}

export default Reportes