import { describe, test, expect, beforeEach, afterEach, vi } from "vitest"
import { render, screen, cleanup, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Routes, Route, useLocation } from "react-router-dom"
import BarraTitulo from "../components/BarraTitulo.jsx"
import BarraTareas from "../components/escritorio/BarraTareas.jsx"
import Pago from "../Pago.jsx"
import DialogoWindows from "../components/dialogo/DialogoWindows.jsx"
import { agregarAlCarrito, obtenerCarrito } from "../components/carrito/Carrito.js"
import { obtenerBoletas } from "../components/carrito/Boletas.js"

function RutaActual() {
    const location = useLocation()
    return <p>Ruta actual: {location.pathname}</p>
}

describe("Barra de título y pago simulado", () => {
    beforeEach(() => {
        localStorage.clear()
        sessionStorage.clear()
        vi.spyOn(window, "alert").mockImplementation(() => {})
    })

    afterEach(() => {
        cleanup()
        vi.restoreAllMocks()
    })

    // PRUEBA UNITARIA 1: BarraTitulo muestra título e ícono, minimiza y se restaura desde la barra de tareas
    test("BarraTitulo muestra título e ícono, minimizar oculta la ventana y la barra de tareas la restaura", async () => {
        const user = userEvent.setup()
        render(
            <MemoryRouter initialEntries={["/Shop"]}>
                <section data-testid="ventana-prueba">
                    <BarraTitulo titulo="Ventana de prueba" icono="/computer.png" como="h2" id="ventana-prueba" />
                    <p>Contenido de la ventana</p>
                </section>
                <BarraTareas />
            </MemoryRouter>
        )

        const ventana = screen.getByTestId("ventana-prueba")
        expect(within(ventana).getByRole("heading", { name: "Ventana de prueba" })).toBeTruthy()
        expect(ventana.querySelector(".barra-titulo-icono").getAttribute("src")).toContain("computer.png")
        expect(ventana.classList.contains("ventana-minimizada")).toBe(false)

        // minimizar: la ventana se oculta y aparece su botón en la barra de tareas
        await user.click(within(ventana).getByRole("button", { name: "Minimizar" }))
        expect(ventana.classList.contains("ventana-minimizada")).toBe(true)
        const botonTarea = screen.getByRole("button", { name: "Restaurar Ventana de prueba" })

        // clic en la barra de tareas: la ventana vuelve y el botón desaparece
        await user.click(botonTarea)
        expect(ventana.classList.contains("ventana-minimizada")).toBe(false)
        expect(screen.queryByRole("button", { name: "Restaurar Ventana de prueba" })).toBeNull()
    })

    // PRUEBA UNITARIA 2: Pago no exitoso muestra "Pago fallido" y vuelve al carrito sin vaciarlo
    test("simular pago no exitoso muestra Pago fallido y vuelve al carrito con los productos intactos", async () => {
        const user = userEvent.setup()
        localStorage.setItem("productos", JSON.stringify([
            { id: 1, nombre: "Corsair K70 RGB Pro", precio: 129990, stock: 5 }
        ]))
        localStorage.setItem("usuarioActual", JSON.stringify({ usuario: "Juanito", email: "juan@gmail.com", rol: "usuario" }))
        agregarAlCarrito({ productoId: 1, nombre: "Corsair K70 RGB Pro", precio: "129.990", imagen: "corsair.jpg" }, 2)

        render(
            <MemoryRouter initialEntries={[{ pathname: "/pago", state: { metodoPago: "Débito", rut: "" } }]}>
                <Routes>
                    <Route path="/pago" element={<Pago />} />
                    <Route path="/Carrito" element={<p>Página del carrito</p>} />
                </Routes>
                <RutaActual />
                <DialogoWindows />
            </MemoryRouter>
        )

        expect(screen.getByTestId("pago-total").textContent).toBe("$259.980")
        await user.click(screen.getByRole("button", { name: "Simular pago no exitoso" }))

        const dialogo = screen.getByRole("alertdialog")
        expect(within(dialogo).getByText("Pago fallido")).toBeTruthy()
        expect(screen.getByText("Ruta actual: /Carrito")).toBeTruthy()
        expect(obtenerCarrito()).toHaveLength(1)
        expect(obtenerCarrito()[0].cantidad).toBe(2)
        expect(obtenerBoletas()).toHaveLength(0)
        expect(window.alert).not.toHaveBeenCalled()
    })
})
