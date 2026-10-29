import { test, expect } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import { afterEach } from "vitest"
import { MemoryRouter } from "react-router-dom"
import Product from "../Product.jsx"

afterEach(() => {
    cleanup()
})

// PRUEBA UNITARIA 1: Mostrar un producto existente
test("muestra los detalles del producto según su id", () => {
    render(
        <MemoryRouter initialEntries={["/Shop/Product?id=1"]}>
            <Product />
        </MemoryRouter>
    )

    expect(screen.getByRole("heading", { name: "Corsair K70 RGB Pro" })).toBeTruthy()
    expect(screen.getByText("Teclado mecánico RGB de alto rendimiento.")).toBeTruthy()
    expect(screen.getByAltText("Corsair K70 RGB Pro")).toBeTruthy()
})

// PRUEBA UNITARIA 2: Producto inexistente
test("muestra un mensaje cuando el producto no existe", () => {
    render(
        <MemoryRouter initialEntries={["/Shop/Product?id=999"]}>
            <Product />
        </MemoryRouter>
    )

    expect(screen.getByRole("heading", { name: "Producto no encontrado" })).toBeTruthy()
    expect(screen.getByText("El producto que buscas no existe.")).toBeTruthy()
})