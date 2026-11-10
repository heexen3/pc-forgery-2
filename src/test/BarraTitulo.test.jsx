import { describe, test, expect, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import BarraTitulo from "../components/BarraTitulo.jsx"

describe("BarraTitulo", () => {
    afterEach(() => cleanup())

    // PRUEBA 1 (sin parámetros): solo el título obligatorio, todo lo demás usa los valores por defecto
    test("sin parámetros opcionales usa el ícono por defecto, un span y los tres botones", () => {
        const { container } = render(<BarraTitulo titulo="Mi ventana" />)

        const titulo = screen.getByText("Mi ventana")
        expect(titulo.tagName).toBe("SPAN")
        expect(container.querySelector(".barra-titulo-icono").getAttribute("src")).toContain("wlogo.svg")

        const botones = [...container.querySelectorAll(".boton-ventana")].map(b => b.title)
        expect(botones).toEqual(["Minimizar", "Maximizar", "Cerrar"])
        expect(screen.getByRole("button", { name: "Minimizar" })).toBeTruthy()
    })

    // PRUEBA 2 (con parámetros): se cambian icono, botones, ayuda y etiqueta del título
    test("con parámetros oculta el ícono, usa h1 y muestra solo los botones pedidos", () => {
        const { container } = render(
            <BarraTitulo titulo="Propiedades" icono={null} botones={["cerrar"]} ayuda={true} como="h1" />
        )

        expect(screen.getByRole("heading", { level: 1, name: "Propiedades" })).toBeTruthy()
        expect(container.querySelector(".barra-titulo-icono")).toBeNull()

        const botones = [...container.querySelectorAll(".boton-ventana")].map(b => b.title)
        expect(botones).toEqual(["Ayuda", "Cerrar"])
        expect(screen.queryByRole("button", { name: "Minimizar" })).toBeNull()
    })
})
