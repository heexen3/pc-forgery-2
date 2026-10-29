import { Link, useNavigate } from "react-router-dom"
import "./Carrito.css"
import BotonesWindows from "./components/BotonesWindows.jsx"
import useCarrito from "./components/carrito/useCarrito.js"
import {
    cambiarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    calcularTotales,
    formatearPrecio
} from "./components/carrito/Carrito.js"
import { generarBoleta } from "./components/carrito/Boletas.js"

function Carrito() {
    // Lógica
    const navigate = useNavigate()
    const carrito = useCarrito()
    const { subtotal, iva, total } = calcularTotales(carrito)

    function actualizarCantidad(id, cantidad) {
        const resultado = cambiarCantidad(id, cantidad)
        if (!resultado.ok) {
            alert(resultado.mensaje)
        }
    }

    function confirmarVaciado() {
        if (window.confirm("¿Estás seguro de que deseas vaciar el carrito?")) {
            vaciarCarrito()
        }
    }

    function finalizarCompra() {
        const usuario = JSON.parse(localStorage.getItem("usuarioActual"))
        const resultado = generarBoleta(usuario)

        alert(resultado.mensaje)

        if (!usuario) {
            navigate("/Login")
            return
        }

        if (resultado.ok) {
            navigate(`/Boleta?numero=${resultado.boleta.numero}`)
        }
    }

    // Renderizado
    return (
        <main className="carrito-contenedor">
            <section className="carrito-ventana">
                <div className="carrito-titulo">
                    <h1>Carrito de compras</h1>
                    <BotonesWindows />
                </div>

                <div className="carrito-cuerpo">
                    {carrito.length === 0 ? (
                        <div className="carrito-vacio">
                            <p>Tu carrito está vacío.</p>
                            <p>
                                Visita la <Link to="/Shop">tienda</Link> o{" "}
                                <Link to="/arma-tu-pc">arma tu PC</Link>.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="carrito-tabla-contenedor">
                                <table className="carrito-tabla">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Producto</th>
                                            <th>Precio</th>
                                            <th>Cantidad</th>
                                            <th>Total</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {carrito.map(item => (
                                            <tr key={item.id}>
                                                <td>
                                                    {item.imagen && <img src={item.imagen} alt={item.nombre} />}
                                                </td>
                                                <td>
                                                    {item.nombre}
                                                    {item.componentes && (
                                                        <ul className="carrito-componentes">
                                                            {item.componentes.map(componente => (
                                                                <li key={componente.id}>
                                                                    {componente.categoria}: {componente.nombre}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </td>
                                                <td>{formatearPrecio(item.precio)}</td>
                                                <td>
                                                    <div className="carrito-cantidad">
                                                        <button
                                                            aria-label={`Disminuir cantidad de ${item.nombre}`}
                                                            onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                                                        >
                                                            -
                                                        </button>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            aria-label={`Cantidad de ${item.nombre}`}
                                                            value={item.cantidad}
                                                            onChange={e => {
                                                                // se ignora el campo vacío o 0 mientras se escribe
                                                                if (Number(e.target.value) >= 1) {
                                                                    actualizarCantidad(item.id, e.target.value)
                                                                }
                                                            }}
                                                        />
                                                        <button
                                                            aria-label={`Aumentar cantidad de ${item.nombre}`}
                                                            onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </td>
                                                <td>{formatearPrecio(item.precio * item.cantidad)}</td>
                                                <td>
                                                    <button
                                                        aria-label={`Eliminar ${item.nombre}`}
                                                        onClick={() => eliminarDelCarrito(item.id)}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="carrito-resumen">
                                <div>
                                    <span>Subtotal (neto):</span>
                                    <span data-testid="carrito-subtotal">{formatearPrecio(subtotal)}</span>
                                </div>
                                <div>
                                    <span>IVA (19%):</span>
                                    <span data-testid="carrito-iva">{formatearPrecio(iva)}</span>
                                </div>
                                <div className="carrito-total">
                                    <span>Total:</span>
                                    <span data-testid="carrito-total">{formatearPrecio(total)}</span>
                                </div>
                            </div>

                            <div className="carrito-acciones">
                                <button onClick={confirmarVaciado}>Vaciar carrito</button>
                                <Link to="/Shop"><button>Seguir comprando</button></Link>
                                <button onClick={finalizarCompra}>Finalizar compra</button>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </main>
    )
}

export default Carrito
