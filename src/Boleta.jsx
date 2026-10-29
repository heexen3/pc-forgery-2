import { Link, useSearchParams } from "react-router-dom"
import "./Carrito.css"
import "./Boleta.css"
import BotonesWindows from "./components/BotonesWindows.jsx"
import TimbreSimulado from "./components/carrito/TimbreSimulado.jsx"
import { formatearPrecio } from "./components/carrito/Carrito.js"
import { obtenerBoleta, formatearNumeroBoleta } from "./components/carrito/Boletas.js"

function formatearSoloFecha(fechaISO) {
    return new Date(fechaISO).toLocaleDateString("es-CL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    })
}

function formatearHora(fechaISO) {
    return new Date(fechaISO).toLocaleTimeString("es-CL", {
        hour: "2-digit",
        minute: "2-digit"
    })
}

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

    const { emisor, cliente } = boleta

    // Renderizado
    return (
        <main className="carrito-contenedor boleta-contenedor">
            <section className="carrito-ventana ventana-animada">
                <div className="carrito-titulo no-imprimir">
                    <h1>Visor de documentos - Boleta {formatearNumeroBoleta(boleta.numero)}</h1>
                    <BotonesWindows />
                </div>

                <div className="carrito-cuerpo">
                    {/* Hoja de la boleta */}
                    <div className="boleta-documento" data-testid="boleta-documento">
                        <div className="boleta-encabezado">
                            <div className="boleta-emisor">
                                <h2>{emisor.razonSocial}</h2>
                                <p>{emisor.giro}</p>
                                <p>{emisor.direccion}</p>
                                <p>Teléfono: {emisor.telefono} · {emisor.correo}</p>
                            </div>
                            <div className="boleta-recuadro">
                                <p>R.U.T.: {emisor.rut}</p>
                                <p className="boleta-recuadro-tipo">BOLETA ELECTRÓNICA</p>
                                <p>N° {boleta.numero}</p>
                                <p className="boleta-sii">S.I.I. - SANTIAGO ORIENTE</p>
                            </div>
                        </div>

                        <div className="boleta-cliente">
                            <p><strong>Fecha emisión:</strong> {formatearSoloFecha(boleta.fecha)}</p>
                            <p><strong>Hora:</strong> {formatearHora(boleta.fecha)}</p>
                            <p><strong>Cliente:</strong> {cliente.nombre}</p>
                            <p><strong>Correo:</strong> {cliente.correo}</p>
                            <p><strong>RUT cliente:</strong> {cliente.rut || "No informado"}</p>
                            <p><strong>Forma de pago:</strong> <span data-testid="boleta-metodo-pago">{boleta.metodoPago}</span></p>
                        </div>

                        <div className="boleta-tabla-contenedor">
                            <table className="boleta-tabla">
                                <thead>
                                    <tr>
                                        <th>Código</th>
                                        <th>Descripción</th>
                                        <th className="numero">Cant.</th>
                                        <th className="numero">Precio unit.</th>
                                        <th className="numero">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {boleta.items.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.codigo}</td>
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
                                            <td className="numero">{item.cantidad}</td>
                                            <td className="numero">{formatearPrecio(item.precio)}</td>
                                            <td className="numero">{formatearPrecio(item.totalLinea)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="boleta-pie">
                            <div className="boleta-timbre">
                                <TimbreSimulado semilla={boleta.codigoVerificacion} />
                                <p>Timbre Electrónico SII (simulado)</p>
                                <p>Código de verificación: {boleta.codigoVerificacion}</p>
                            </div>

                            <div className="boleta-totales">
                                <div>
                                    <span>Monto neto:</span>
                                    <span data-testid="boleta-subtotal">{formatearPrecio(boleta.subtotal)}</span>
                                </div>
                                <div>
                                    <span>IVA (19%):</span>
                                    <span data-testid="boleta-iva">{formatearPrecio(boleta.iva)}</span>
                                </div>
                                <div className="boleta-total">
                                    <span>TOTAL:</span>
                                    <span data-testid="boleta-total">{formatearPrecio(boleta.total)}</span>
                                </div>
                                <p className="boleta-iva-incluido">
                                    El IVA incluido en esta boleta es de {formatearPrecio(boleta.iva)}
                                </p>
                            </div>
                        </div>

                        <p className="boleta-nota">Documento de prueba – sin validez tributaria</p>
                    </div>

                    <div className="carrito-acciones no-imprimir">
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
