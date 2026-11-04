import { describe, test, expect, afterEach, vi } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import RutaProtegida from "../components/RutaProtegida.jsx"

afterEach(() => {
    cleanup()
    localStorage.clear()
    vi.restoreAllMocks()
})

function renderizarEn(ruta) {
    return render(
        <MemoryRouter initialEntries={[ruta]}>
            <Routes>
                <Route path="/" element={<p>Inicio</p>} />
                <Route path="/Login" element={<p>Pantalla login</p>} />
                <Route path="/Admin" element={<RutaProtegida rol="admin"><p>Panel admin</p></RutaProtegida>} />
            </Routes>
        </MemoryRouter>
    )
}

describe("Pruebas de RutaProtegida", () => {

    // PRUEBA UNITARIA 1: sin sesión se redirige al login con aviso
    test("sin sesión redirige a /Login y avisa acceso restringido", async () => {
        const alerta = vi.spyOn(window, "alert").mockImplementation(() => {})
        renderizarEn("/Admin")

        expect(screen.getByText("Pantalla login")).toBeTruthy()
        expect(screen.queryByText("Panel admin")).toBeNull()
        await vi.waitFor(() => expect(alerta).toHaveBeenCalledTimes(1))
    })

    // PRUEBA UNITARIA 2: usuario normal va al Home y el admin sí entra
    test("usuario sin rol admin vuelve al inicio y el admin ve el panel", () => {
        vi.spyOn(window, "alert").mockImplementation(() => {})
        localStorage.setItem("usuarioActual", JSON.stringify({ usuario: "ana", email: "ana@x.cl", rol: "usuario" }))
        renderizarEn("/Admin")
        expect(screen.getByText("Inicio")).toBeTruthy()
        cleanup()

        localStorage.setItem("usuarioActual", JSON.stringify({ usuario: "admin", email: "admin@x.cl", rol: "admin" }))
        renderizarEn("/Admin")
        expect(screen.getByText("Panel admin")).toBeTruthy()
    })
})
