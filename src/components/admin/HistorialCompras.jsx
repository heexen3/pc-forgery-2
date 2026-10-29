import { useEffect, useState } from "react"
import { obtenerCompras, filtrarCompras } from "./HistorialCompras.js"

function HistorialCompras() {
    const [compras, setCompras] = useState([])
    const [correoSeleccionado, setCorreoSeleccionado] = useState("")

    useEffect(() => {
        setCompras(obtenerCompras())
    }, [])

    const comprasFiltradas = filtrarCompras(
        compras,
        correoSeleccionado
    )

    return (
        <div className="p-3">
            <h3>Historial de compras</h3>

            <div className="mb-3">
                <label htmlFor="filtrarCompras" className="form-label">
                    Filtrar por correo del usuario
                </label>

                <input
                    type="email"
                    id="filtrarCompras"
                    className="form-control"
                    placeholder="usuario@correo.cl"
                    value={correoSeleccionado}
                    onChange={e => setCorreoSeleccionado(e.target.value)}
                />
            </div>

            {comprasFiltradas.length === 0 ? (
                <p>No se encontraron compras registradas.</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>Producto</th>
                                <th>Fecha</th>
                                <th>Total</th>
                            </tr>
                        </thead>

                        <tbody>
                            {comprasFiltradas.map((compra, indice) => (
                                <tr key={compra.id || indice}>
                                    <td>{compra.correo}</td>
                                    <td>{compra.producto}</td>
                                    <td>{compra.fecha}</td>
                                    <td>
                                        {Number(compra.total || 0).toLocaleString(
                                            "es-CL",
                                            {
                                                style: "currency",
                                                currency: "CLP",
                                                maximumFractionDigits: 0
                                            }
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default HistorialCompras