import { describe, test, expect, beforeEach, afterEach } from "vitest"
import { render, screen, cleanup, within } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import Boleta from "../Boleta.jsx"
import { validarRut, formatearRut, calcularDv } from "../components/carrito/Rut.js"
import { generarBoleta, obtenerBoleta } from "../components/carrito/Boletas.js"
import { agregarAlCarrito } from "../components/carrito/Carrito.js"

const usuario = { usuario: "Juanito", email: "juan@gmail.com", rol: "usuario" }
const teclado = { productoId: 1, nombre: "Corsair K70 RGB Pro", precio: 129990, imagen: "corsair.jpg" }

describe("Boleta electrónica y RUT", () => {
    beforeEach(() => {
        localStorage.clear()
        localStorage.setItem("productos", JSON.stringify([
            { id: 1, nombre: "Corsair K70 RGB Pro", precio: 129990, stock: 5 }
        ]))
    })

    afterEach(() => {
        cleanup()
    })

    // PRUEBA UNITARIA 1: validación del RUT con dígito verificador
    test("valida y formatea el RUT y rechaza la compra con un RUT incorrecto", () => {
        expect(calcularDv("12345678")).toBe("5")
        expect(validarRut("12.345.678-5")).toBe(true)
        expect(validarRut("12345678-K")).toBe(false)
        expect(validarRut("abc")).toBe(false)
        expect(formatearRut("123456785")).toBe("12.345.678-5")

        agregarAlCarrito(teclado)
        const rechazo = generarBoleta(usuario, new Date(), { metodoPago: "Débito", rut: "12.345.678-9" })
        expect(rechazo).toMatchObject({
            ok: false,
            mensaje: "El RUT ingresado no es válido. Revisa el dígito verificador."
        })

        const metodoInvalido = generarBoleta(usuario, new Date(), { metodoPago: "Bitcoin" })
        expect(metodoInvalido.ok).toBe(false)
    })

    // PRUEBA UNITARIA 2: la boleta muestra el formato chileno completo
    test("muestra emisor, folio, detalle, neto, IVA, total, pago y timbre simulado", () => {
        agregarAlCarrito(teclado, 2)
        const resultado = generarBoleta(usuario, new Date(2026, 9, 29, 15, 30), {
            metodoPago: "Transferencia",
            rut: "12345678-5"
        })
        expect(resultado.ok).toBe(true)

        render(
            <MemoryRouter initialEntries={[`/Boleta?numero=${resultado.boleta.numero}`]}>
                <Boleta />
            </MemoryRouter>
        )

        const documento = screen.getByTestId("boleta-documento")
        expect(within(documento).getByText("PC Forgery SpA")).toBeTruthy()
        expect(within(documento).getByText("BOLETA ELECTRÓNICA")).toBeTruthy()
        expect(within(documento).getByText("N° 1")).toBeTruthy()
        expect(documento.textContent).toContain("12.345.678-5")
        expect(within(documento).getByText("PF-00001")).toBeTruthy()
        expect(screen.getByTestId("boleta-subtotal").textContent).toBe("$218.471")
        expect(screen.getByTestId("boleta-iva").textContent).toBe("$41.509")
        expect(screen.getByTestId("boleta-total").textContent).toBe("$259.980")
        expect(screen.getByTestId("boleta-metodo-pago").textContent).toBe("Transferencia")
        expect(screen.getByRole("img", { name: "Timbre electrónico simulado" })).toBeTruthy()
        expect(screen.getByText("Documento de prueba – sin validez tributaria")).toBeTruthy()

        // las boletas antiguas (sin emisor ni método de pago) siguen funcionando
        localStorage.setItem("boletas", JSON.stringify([{
            numero: 7, fecha: "2026-05-01T12:00:00.000Z", usuario: "Ana", correo: "ana@gmail.com",
            items: [{ id: "p-1", nombre: "Mouse", precio: 10000, cantidad: 1 }],
            subtotal: 8403, iva: 1597, total: 10000
        }]))
        expect(obtenerBoleta(7)).toMatchObject({ metodoPago: "No informado", emisor: { razonSocial: "PC Forgery SpA" } })
    })
})
