
import { describe, test, expect, beforeEach, afterEach, vi } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, useLocation } from "react-router-dom"
import Login from "../Login.jsx"

function RutaActual() {
    const location = useLocation()
    return <p>Ruta actual: {location.pathname}</p>
}

describe("Pruebas de Login", () => {

    beforeEach(() => {
        localStorage.clear()

        localStorage.setItem("usuarios", JSON.stringify([
            {
                usuario: "Juanito",
                email: "Juan@gmail.com",
                password: "Juan.123",
                rol: "usuario"
            }
        ]))

        vi.spyOn(window, "alert").mockImplementation(() => {})
    })

    afterEach(() => {
        cleanup()
        vi.restoreAllMocks()
    })

    // PRUEBA UNITARIA 1
    test("permite iniciar sesión con credenciales correctas", async () => {
        const user = userEvent.setup()

        render(
            <MemoryRouter initialEntries={["/Login"]}>
                <Login />
                <RutaActual />
            </MemoryRouter>
        )

        await user.type(
            screen.getByLabelText(/correo electrónico o nombre de usuario/i),
            "Juan@gmail.com"
        )

        await user.type(
            screen.getByLabelText("Contraseña:"),
            "Juan.123"
        )

        await user.click(
            screen.getByRole("button", { name: /iniciar sesión/i })
        )

        const usuarioActual = JSON.parse(
            localStorage.getItem("usuarioActual")
        )

        expect(usuarioActual.rol).toBe("usuario")
        expect(window.alert).toHaveBeenCalledWith(
            "Iniciando sesión como: usuario"
        )
        expect(screen.getByText("Ruta actual: /Home")).toBeTruthy()
    })

    // PRUEBA UNITARIA 2
    test("rechaza el inicio de sesión con contraseña incorrecta", async () => {
        const user = userEvent.setup()

        render(
            <MemoryRouter initialEntries={["/Login"]}>
                <Login />
                <RutaActual />
            </MemoryRouter>
        )

        await user.type(
            screen.getByLabelText(/correo electrónico o nombre de usuario/i),
            "Juan@gmail.com"
        )

        await user.type(
            screen.getByLabelText("Contraseña:"),
            "Incorrecta123"
        )

        await user.click(
            screen.getByRole("button", { name: /iniciar sesión/i })
        )

        expect(localStorage.getItem("usuarioActual")).toBeNull()

        expect(window.alert).toHaveBeenCalledWith(
            "Usuario o contraseña incorrectos, por favor, inténtelo de nuevo."
        )

        expect(screen.getByText("Ruta actual: /Login")).toBeTruthy()
    })

})
