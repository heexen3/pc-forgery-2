
import { describe, test, expect, beforeEach, afterEach, vi } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, useLocation } from "react-router-dom"
import Register from "../Register.jsx"

function RutaActual() {
    const location = useLocation()
    return <p>Ruta actual: {location.pathname}</p>
}

describe("Pruebas de Registro", () => {
    beforeEach(() => {
        localStorage.clear()
        localStorage.setItem("usuarios", JSON.stringify([]))
        vi.spyOn(window, "alert").mockImplementation(() => {})
    })

    afterEach(() => {
        cleanup()
        vi.restoreAllMocks()
    })

    // PRUEBA UNITARIA 1: Registro exitoso
    test("permite registrar un usuario con datos válidos", async () => {
        const user = userEvent.setup()

        render(
            <MemoryRouter initialEntries={["/Register"]}>
                <Register />
                <RutaActual />
            </MemoryRouter>
        )

        await user.type(
            screen.getByLabelText(/usuario/i),
            "Juanito"
        )
        await user.type(
            screen.getByLabelText(/correo/i),
            "juan@gmail.com"
        )
        await user.type(
            screen.getByLabelText(/^contraseña:$/i),
            "Juan.123"
        )
        await user.type(
            screen.getByLabelText(/confirmar contraseña/i),
            "Juan.123"
        )

        await user.click(
            screen.getByRole("button", {
                name: /registrarse|crear cuenta|registro/i
            })
        )

        const usuarios = JSON.parse(localStorage.getItem("usuarios"))

        expect(usuarios).toHaveLength(1)
        expect(usuarios[0].usuario).toBe("Juanito")
        expect(usuarios[0].email).toBe("juan@gmail.com")
        expect(usuarios[0].rol).toBe("usuario")
        expect(window.alert).toHaveBeenCalledWith(
            "¡Usuario registrado con éxito!"
        )
        expect(screen.getByText("Ruta actual: /Login")).toBeTruthy()
    })

    // PRUEBA UNITARIA 2: Usuario duplicado
    test("rechaza registrar un nombre de usuario duplicado", async () => {
        const user = userEvent.setup()

        localStorage.setItem("usuarios", JSON.stringify([
            {
                usuario: "Juanito",
                email: "juan@gmail.com",
                password: "Juan.123",
                rol: "usuario"
            }
        ]))

        render(
            <MemoryRouter initialEntries={["/Register"]}>
                <Register />
                <RutaActual />
            </MemoryRouter>
        )

        await user.type(
            screen.getByLabelText(/usuario/i),
            "Juanito"
        )
        await user.type(
            screen.getByLabelText(/correo/i),
            "otro@gmail.com"
        )
        await user.type(
            screen.getByLabelText(/^contraseña:$/i),
            "Juan.123"
        )
        await user.type(
            screen.getByLabelText(/confirmar contraseña/i),
            "Juan.123"
        )

        await user.click(
            screen.getByRole("button", {
                name: /registrarse|crear cuenta|registro/i
            })
        )

        const usuarios = JSON.parse(localStorage.getItem("usuarios"))

        expect(usuarios).toHaveLength(1)
        expect(window.alert).toHaveBeenCalledWith(
            "El nombre de usuario ya está registrado."
        )
        expect(screen.getByText("Ruta actual: /Register")).toBeTruthy()
    })
})
