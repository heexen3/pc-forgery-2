import { describe, test, expect, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Admin from "../Admin.jsx"

afterEach(() => {
    cleanup()
})

describe("Pruebas de Administración", () => {

    // PRUEBA UNITARIA 1: Mostrar el panel de administración
    test("muestra el panel y los botones del menú", () => {
        render(<Admin />)

        expect(screen.getByRole("heading", { name: "Administración" })).toBeTruthy()
        expect(screen.getByRole("button", { name: "Comandos Admin" })).toBeTruthy()
        expect(screen.getByRole("button", { name: "Dashboard" })).toBeTruthy()
        expect(screen.getByRole("button", { name: "Ver Reportes" })).toBeTruthy()
        expect(screen.getByRole("button", { name: "Ver Usuarios" })).toBeTruthy()
        expect(screen.getByRole("button", { name: "Ver Perfil Admin" })).toBeTruthy()
    })

    // PRUEBA UNITARIA 2: Cambiar a la vista de Dashboard
    test("muestra el Dashboard al pulsar el botón correspondiente", async () => {
        const user = userEvent.setup()
        render(<Admin />)

        await user.click(screen.getByRole("button", { name: "Dashboard" }))

        expect(screen.getByRole("heading", { name: /Dashboard del Sistema/i })).toBeTruthy()
        expect(screen.getByText("Resumen General del Negocio")).toBeTruthy()
        expect(screen.getByText("Ganancias Totales")).toBeTruthy()
    })
})
