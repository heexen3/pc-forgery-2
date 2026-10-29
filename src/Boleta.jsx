import { Link, useSearchParams } from "react-router-dom"
import "./Carrito.css"
import BotonesWindows from "./components/BotonesWindows.jsx"
import { formatearPrecio } from "./components/carrito/Carrito.js"
import {
    obtenerBoleta,
    formatearNumeroBoleta,
    formatearFecha
} from "./components/carrito/Boletas.js"

function Boleta() {
    // Lógica
    const [searchParams] = useSearchParams()
    const boleta = obtenerBoleta(searchParams.get("numero"))

    if (!boleta) {
        return (
            <main className="carrito-contenedor">
                <section className="carrito-ventana">
                    <div className="carrito-titulo">
                        <h1>Boleta no encontrada</h1>
                        <BotonesWindows />
                    </div>
                    <div className="carrito-cuerpo">
                        <p>La boleta que buscas no existe.</p>
                        <Link to="/MisCompras" className="carrito-enlace">Ver mis compras</Link>
                    </div>
                </section>
            </main>
        )
    }

    // Renderizado
    return (
        <main className="carrito-contenedor">
            <section className="carrito-ventana">
                <div className="carrito-titulo">
                    <h1>Boleta electrónica {formatearNumeroBoleta(boleta.numero)}</h1>
                    <BotonesWindows />
                </div>

                <div className="carrito-cuerpo">
                    <div className="boleta-datos">
                        <p><strong>PC Forgery</strong> - Tienda de componentes</p>
                        <p>Fecha: {formatearFecha(boleta.fecha)}</p>
                        <p>Cliente: {boleta.usuario} ({boleta.correo})</p>
                    </div>

                    <div className="carrito-tabla-contenedor">
                        <table className="carrito-tabla">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Precio unitario</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {boleta.items.map(item => (
                                    <tr key={item.id}>
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
                                        <td>{item.cantidad}</td>
                                        <td>{formatearPrecio(item.precio)}</td>
                                        <td>{formatearPrecio(item.totalLinea)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="carrito-resumen">
                        <div>
                            <span>Subtotal (neto):</span>
                            <span data-testid="boleta-subtotal">{formatearPrecio(boleta.subtotal)}</span>
                        </div>
                        <div>
                            <span>IVA (19%):</span>
                            <span data-testid="boleta-iva">{formatearPrecio(boleta.iva)}</span>
                        </div>
                        <div className="carrito-total">
                            <span>Total:</span>
                            <span data-testid="boleta-total">{formatearPrecio(boleta.total)}</span>
                        </div>
                    </div>

                    <div className="carrito-acciones">
                        <button onClick={() => window.print()}>Imprimir</button>
                        <Link to="/MisCompras"><button>Mis compras</button></Link>
                        <Link to="/Shop"><button>Volver a la tienda</button></Link>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Boleta
