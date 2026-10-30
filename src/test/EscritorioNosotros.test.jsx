import { describe, test, expect, beforeEach, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Routes, Route, useLocation } from "react-router-dom"
import Nav from "../components/Nav.jsx"
import Home from "../Home.jsx"
import Nosotros from "../Nosotros.jsx"

function RutaActual() {
    const location = useLocation()
    return <p>Ruta actual: {location.pathname}</p>
}

function renderizar(ruta) {
    render(
        <MemoryRouter initialEntries={[ruta]}>
            <Nav />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/nosotros" element={<Nosotros />} />
                <Route path="*" element={<RutaActual />} />
            </Routes>
        </MemoryRouter>
    )
}

describe("Escritorio del Home y Quiénes Somos", () => {
    beforeEach(() => {
        localStorage.clear()
    })

    afterEach(() => {
        cleanup()
    })

    // PRUEBA UNITARIA 1: el Home es un escritorio con íconos en lugar del menú
    test("muestra los íconos del escritorio sin el menú y abre la tienda con doble clic", async () => {
        const user = userEvent.setup()
        renderizar("/")

        expect(screen.queryByRole("button", { name: /Menú/ })).toBeNull()
        const tienda = screen.getByRole("button", { name: "Tienda" })
        expect(screen.getByRole("button", { name: "Quiénes Somos" })).toBeTruthy()

        await user.click(tienda)
        expect(tienda.getAttribute("aria-pressed")).toBe("true")

        await user.dblClick(tienda)
        expect(screen.getByText("Ruta actual: /Shop")).toBeTruthy()
    })

    // PRUEBA UNITARIA 2: Quiénes Somos muestra Misión y Visión en su pestaña
    test("Quiénes Somos muestra la Misión y la Visión al abrir su pestaña", async () => {
        const user = userEvent.setup()
        renderizar("/nosotros")

        expect(screen.getByRole("heading", { name: /Quiénes Somos/ })).toBeTruthy()
        await user.click(screen.getByRole("tab", { name: "Misión y Visión" }))

        expect(screen.getByRole("heading", { name: "Misión" })).toBeTruthy()
        expect(screen.getByRole("heading", { name: "Visión" })).toBeTruthy()
    })
})
