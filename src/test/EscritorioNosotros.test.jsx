import { describe, test, expect, beforeEach, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Routes, Route, useLocation } from "react-router-dom"
import Nav from "../components/Nav.jsx"
import Home from "../Home.jsx"
import Nosotros from "../Nosotros.jsx"
import { inicializarHilos } from "../data/hilosData.js"

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
    // y la ventana Destacados lista los hilos sembrados con su cantidad de respuestas
    test("muestra los íconos sin el menú y los 3 hilos más recientes en Destacados", async () => {
        const user = userEvent.setup()
        inicializarHilos()
        renderizar("/")

        expect(screen.queryByRole("button", { name: /Menú/ })).toBeNull()
        expect(screen.getByRole("button", { name: "Quiénes Somos" })).toBeTruthy()

        const items = document.querySelectorAll(".destacado-item")
        expect(items).toHaveLength(3)
        expect(items[0].textContent).toContain("¿Vale la pena la RTX 4060 para jugar en 1080p?")
        expect(items[0].textContent).toContain("6 respuestas")
        expect(items[1].textContent).toContain("4 respuestas")
        expect(items[2].textContent).toContain("2 respuestas")

        await user.dblClick(screen.getByRole("button", { name: "Comunidad" }))
        expect(screen.getByText("Ruta actual: /comunidad")).toBeTruthy()
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
