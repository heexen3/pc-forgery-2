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
        expect(screen.getByRole("button", { name: "Historial" })).toBeTruthy()
        expect(screen.getByRole("button", { name: "Ver Reportes" })).toBeTruthy()
        expect(screen.getByRole("button", { name: "Ver Usuarios" })).toBeTruthy()
        expect(screen.getByRole("button", { name: "Ver Perfil Admin" })).toBeTruthy()
    })

    // PRUEBA UNITARIA 2: Cambiar a la vista de historial
    test("muestra el historial al pulsar el botón correspondiente", async () => {
        const user = userEvent.setup()
        render(<Admin />)

        await user.click(screen.getByRole("button", { name: "Historial" }))

        expect(screen.getByRole("heading", { name: "Historial" })).toBeTruthy()
        expect(screen.getByRole("columnheader", { name: "Fecha" })).toBeTruthy()
        expect(screen.getByRole("columnheader", { name: "Acción" })).toBeTruthy()
        expect(screen.getByRole("columnheader", { name: "Usuario" })).toBeTruthy()
    })
})