import { Link } from "react-router-dom"
import "./Carrito.css"
import BotonesWindows from "./components/BotonesWindows.jsx"
import { formatearPrecio } from "./components/carrito/Carrito.js"
import {
    obtenerBoletas,
    obtenerBoletasUsuario,
    formatearNumeroBoleta,
    formatearFecha
} from "./components/carrito/Boletas.js"

function MisCompras() {
    // Lógica
    const usuario = JSON.parse(localStorage.getItem("usuarioActual"))

    // El admin ve todas las boletas, el usuario solo las suyas
    const boletas = !usuario
        ? []
        : usuario.rol === "admin"
            ? obtenerBoletas()
            : obtenerBoletasUsuario(usuario.email)

    // Renderizado
    return (
        <main className="carrito-contenedor">
            <section className="carrito-ventana ventana-animada">
                <div className="carrito-titulo">
                    <h1>Mis compras</h1>
                    <BotonesWindows />
                </div>

                <div className="carrito-cuerpo">
                    {!usuario ? (
                        <p className="carrito-vacio">
                            Debes <Link to="/Login">iniciar sesión</Link> para ver tus boletas.
                        </p>
                    ) : boletas.length === 0 ? (
                        <p className="carrito-vacio">Aún no tienes compras registradas.</p>
                    ) : (
                        <div className="carrito-tabla-contenedor">
                            <table className="carrito-tabla tabla-apilable">
                                <thead>
                                    <tr>
                                        <th>Boleta</th>
                                        <th>Fecha</th>
                                        <th>Productos</th>
                                        <th>Total</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...boletas].reverse().map(boleta => (
                                        <tr key={boleta.numero}>
                                            <td className="celda-nombre" data-label="Boleta">{formatearNumeroBoleta(boleta.numero)}</td>
                                            <td data-label="Fecha">{formatearFecha(boleta.fecha)}</td>
                                            <td data-label="Productos">{boleta.items.reduce((total, item) => total + item.cantidad, 0)}</td>
                                            <td data-label="Total">{formatearPrecio(boleta.total)}</td>
                                            <td className="celda-acciones">
                                                <Link
                                                    to={`/Boleta?numero=${boleta.numero}`}
                                                    className="carrito-enlace"
                                                >
                                                    Ver boleta
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}

export default MisCompras
