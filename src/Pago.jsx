import { useState } from "react"
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import "./Pago.css"
import BarraTitulo from "./components/BarraTitulo.jsx"
import useCarrito from "./components/carrito/useCarrito.js"
import { calcularTotales, formatearPrecio } from "./components/carrito/Carrito.js"
import { borrarDatosPago, generarBoleta, METODOS_PAGO, obtenerDatosPago } from "./components/carrito/Boletas.js"
import { mostrarAlerta } from "./components/dialogo/Dialogo.js"

// Página de pago simulado (/pago). Se llega desde "Finalizar compra" del Carrito,
// que ya validó sesión, RUT, método de pago y stock. Aquí solo se elige el
// resultado del pago: exitoso genera la boleta; no exitoso vuelve al carrito sin tocarlo.
function Pago() {
    const navigate = useNavigate()
    const location = useLocation()
    const carrito = useCarrito()
    const { subtotal, iva, total } = calcularTotales(carrito)
    // evita que el carrito recién vaciado por la boleta dispare la redirección al carrito
    const [procesando, setProcesando] = useState(false)

    const datosPago = location.state || obtenerDatosPago()
    const metodoPago = datosPago.metodoPago || METODOS_PAGO[0]

    if (carrito.length === 0 && !procesando) {
        return <Navigate to="/Carrito" replace />
    }

    function pagoExitoso() {
        setProcesando(true)
        const usuario = JSON.parse(localStorage.getItem("usuarioActual"))
        const resultado = generarBoleta(usuario, new Date(), datosPago)

        mostrarAlerta(resultado.mensaje, { icono: resultado.ok ? "info" : "error" })

        if (resultado.ok) {
            borrarDatosPago()
            navigate(`/Boleta?numero=${resultado.boleta.numero}`)
        } else {
            setProcesando(false)
            navigate(usuario ? "/Carrito" : "/Login")
        }
    }

    function pagoFallido() {
        mostrarAlerta("El pago no pudo completarse. Tu carrito se mantiene intacto, puedes intentarlo de nuevo.", {
            titulo: "Pago fallido",
            icono: "error"
        })
        navigate("/Carrito")
    }

    return (
        <main className="pago-contenedor">
            <section className="pago-ventana ventana-animada" aria-labelledby="titulo-pago">
                <BarraTitulo titulo="Pago seguro - PC Forgery" icono="/shopping-bag.svg" como="h1" idTitulo="titulo-pago" id="ventana-pago" />

                <div className="pago-cuerpo">
                    <p className="pago-aviso">
                        Este es un pago <strong>simulado</strong>: no se realiza ningún cobro real.
                    </p>

                    <fieldset className="pago-resumen">
                        <legend>Resumen del pedido</legend>
                        <ul className="pago-items">
                            {carrito.map(item => (
                                <li key={item.id}>
                                    <span>{item.cantidad} x {item.nombre}</span>
                                    <span>{formatearPrecio(item.precio * item.cantidad)}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="pago-linea">
                            <span>Subtotal (neto):</span>
                            <span>{formatearPrecio(subtotal)}</span>
                        </div>
                        <div className="pago-linea">
                            <span>IVA (19%):</span>
                            <span>{formatearPrecio(iva)}</span>
                        </div>
                        <div className="pago-linea pago-total">
                            <span>Total a pagar:</span>
                            <span data-testid="pago-total">{formatearPrecio(total)}</span>
                        </div>
                        <div className="pago-linea">
                            <span>Método de pago:</span>
                            <span>{metodoPago}</span>
                        </div>
                    </fieldset>

                    <div className="pago-botones">
                        <button type="button" className="pago-boton" onClick={pagoExitoso}>
                            Simular pago exitoso
                        </button>
                        <button type="button" className="pago-boton" onClick={pagoFallido}>
                            Simular pago no exitoso
                        </button>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Pago
