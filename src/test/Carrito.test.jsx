import { describe, test, expect, beforeEach, afterEach, vi } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, useLocation } from "react-router-dom"
import Carrito from "../Carrito.jsx"
import { obtenerCarrito, agregarAlCarrito } from "../components/carrito/Carrito.js"
import { obtenerBoletas } from "../components/carrito/Boletas.js"
import { obtenerCompras } from "../components/admin/HistorialCompras.js"

function RutaActual() {
    const location = useLocation()
    return <p>Ruta actual: {location.pathname}{location.search}</p>
}

const teclado = { productoId: 1, nombre: "Corsair K70 RGB Pro", precio: "129.990", imagen: "corsair.jpg" }
const mouse = { productoId: 2, nombre: "Razer DeathAdder V3", precio: "69.990", imagen: "mouse.jpg" }

describe("Carrito de compras", () => {
    beforeEach(() => {
        localStorage.clear()
        localStorage.setItem("productos", JSON.stringify([
            { id: 1, nombre: "Corsair K70 RGB Pro", precio: 129990, stock: 5 },
            { id: 2, nombre: "Razer DeathAdder V3", precio: 69990, stock: 2 }
        ]))
        vi.spyOn(window, "alert").mockImplementation(() => {})
    })

    afterEach(() => {
        cleanup()
        vi.restoreAllMocks()
    })

    function renderCarrito() {
        render(
            <MemoryRouter initialEntries={["/Carrito"]}>
                <Carrito />
                <RutaActual />
            </MemoryRouter>
        )
    }

    // PRUEBA UNITARIA 1: Agregar productos, respetar stock y calcular totales con IVA
    test("agrega productos respetando el stock y calcula subtotal, IVA y total", async () => {
        const user = userEvent.setup()
        expect(agregarAlCarrito(teclado).ok).toBe(true)
        expect(agregarAlCarrito(mouse, 2).ok).toBe(true)

        // no se puede superar el stock disponible
        const sinStock = agregarAlCarrito(mouse)
        expect(sinStock.ok).toBe(false)
        expect(sinStock.mensaje).toBe("Solo hay 2 unidades disponibles de Razer DeathAdder V3.")

        renderCarrito()
        expect(screen.getByLabelText("Cantidad de Razer DeathAdder V3").value).toBe("2")
        expect(screen.getByTestId("carrito-total").textContent).toBe("$269.970")
        expect(screen.getByTestId("carrito-subtotal").textContent).toBe("$226.866")
        expect(screen.getByTestId("carrito-iva").textContent).toBe("$43.104")

        // eliminar un producto actualiza los totales
        await user.click(screen.getByRole("button", { name: "Eliminar Razer DeathAdder V3" }))
        expect(obtenerCarrito()).toHaveLength(1)
        expect(screen.getByTestId("carrito-total").textContent).toBe("$129.990")
    })

    // PRUEBA UNITARIA 2: Finalizar compra genera la boleta
    test("finaliza la compra, genera la boleta, la registra en el historial y descuenta stock", async () => {
        const user = userEvent.setup()
        localStorage.setItem("usuarioActual", JSON.stringify({
            usuario: "Juanito", email: "juan@gmail.com", rol: "usuario"
        }))
        agregarAlCarrito(teclado, 2)
        renderCarrito()

        await user.click(screen.getByRole("button", { name: "Finalizar compra" }))

        expect(window.alert).toHaveBeenCalledWith("Compra realizada con éxito.")
        expect(screen.getByText("Ruta actual: /Boleta?numero=1")).toBeTruthy()
        expect(obtenerCarrito()).toHaveLength(0)

        const [boleta] = obtenerBoletas()
        expect(boleta).toMatchObject({ numero: 1, correo: "juan@gmail.com", total: 259980, subtotal: 218471, iva: 41509 })
        expect(boleta.items[0]).toMatchObject({ nombre: "Corsair K70 RGB Pro", cantidad: 2, totalLinea: 259980 })

        expect(obtenerCompras()[0]).toMatchObject({ correo: "juan@gmail.com", producto: "Corsair K70 RGB Pro x2", total: 259980 })
        expect(JSON.parse(localStorage.getItem("productos"))[0].stock).toBe(3)
    })
})
