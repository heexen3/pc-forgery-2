import { describe, test, expect, beforeEach, afterEach, vi } from "vitest"
import { render, screen, cleanup, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import Shop from "../Shop.jsx"
import Product from "../Product.jsx"
import { obtenerInsignias } from "../components/tienda/FiltrosTienda.js"
import { obtenerResenas } from "../components/resenas/Resenas.js"

describe("Tienda y reseñas", () => {
    beforeEach(() => {
        localStorage.clear()
        vi.spyOn(window, "alert").mockImplementation(() => {})
    })

    afterEach(() => {
        cleanup()
        vi.restoreAllMocks()
    })

    // PRUEBA UNITARIA 1: filtros, búsqueda, orden e insignias de la tienda
    test("filtra por categoría, ordena por precio, busca por texto y muestra insignias", async () => {
        const user = userEvent.setup()
        render(
            <MemoryRouter initialEntries={["/Shop"]}>
                <Shop />
            </MemoryRouter>
        )

        const contador = screen.getByTestId("contador-productos")
        expect(contador.textContent).toBe("22 objeto(s)")

        // filtrar por categoría y ordenar de menor a mayor precio
        await user.click(screen.getByRole("button", { name: /^Tarjetas de video \(3\)/ }))
        expect(contador.textContent).toBe("3 objeto(s)")
        await user.selectOptions(screen.getByLabelText("Ordenar productos"), "precio-asc")
        const nombres = screen.getAllByRole("link")
            .filter(enlace => enlace.className === "producto-card-nombre")
            .map(enlace => enlace.textContent)
        expect(nombres).toEqual([
            "MSI GeForce RTX 4060 Ventus 2X",
            "Sapphire Pulse AMD Radeon RX 7700 XT",
            "ASUS Dual GeForce RTX 4070 SUPER"
        ])

        // la búsqueda ignora mayúsculas y tildes
        await user.type(screen.getByLabelText("Buscar productos"), "RADEÓN")
        expect(contador.textContent).toBe("1 objeto(s)")

        // insignias según stock y novedad
        expect(obtenerInsignias({ stock: 0 }).map(i => i.texto)).toEqual(["Agotado"])
        expect(obtenerInsignias({ stock: 2, nuevo: true }).map(i => i.texto)).toEqual(["Últimas unidades", "Nuevo"])
    })

    // PRUEBA UNITARIA 2: publicar una reseña con estrellas en el detalle del producto
    test("valida y publica una reseña con estrellas que queda guardada en localStorage", async () => {
        const user = userEvent.setup()
        localStorage.setItem("usuarioActual", JSON.stringify({
            usuario: "Juanito", email: "juan@gmail.com", rol: "usuario"
        }))
        render(
            <MemoryRouter initialEntries={["/producto/1"]}>
                <Routes>
                    <Route path="/producto/:id" element={<Product />} />
                </Routes>
            </MemoryRouter>
        )

        await user.click(screen.getByRole("tab", { name: "Reseñas (0)" }))

        // sin calificación no se puede publicar
        await user.type(screen.getByLabelText("Comentario:"), "Excelente teclado, muy cómodo.")
        await user.click(screen.getByRole("button", { name: "Publicar reseña" }))
        expect(screen.getByRole("status").textContent).toBe("Selecciona una calificación de 1 a 5 estrellas.")

        await user.click(within(screen.getByRole("group", { name: "Calificación" })).getByRole("button", { name: "4 estrellas" }))
        await user.click(screen.getByRole("button", { name: "Publicar reseña" }))

        expect(screen.getByRole("status").textContent).toBe("¡Gracias por tu reseña!")
        expect(screen.getByRole("tab", { name: "Reseñas (1)" })).toBeTruthy()
        expect(screen.getByText("Excelente teclado, muy cómodo.")).toBeTruthy()
        expect(obtenerResenas(1)).toHaveLength(1)
        expect(obtenerResenas(1)[0]).toMatchObject({ estrellas: 4, autor: "Juanito" })
    })
})
