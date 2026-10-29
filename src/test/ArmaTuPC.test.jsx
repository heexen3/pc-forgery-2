import { describe, test, expect, beforeEach, afterEach, vi } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, useLocation } from "react-router-dom"
import ArmaTuPC from "../ArmaTuPC.jsx"
import { DB_COMPONENTES } from "../data/componentesData.js"
import { obtenerCarrito } from "../components/carrito/Carrito.js"
import { detectarConflicto } from "../components/armado/ArmadoPC.js"

function RutaActual() {
    const location = useLocation()
    return <p>Ruta actual: {location.pathname}</p>
}

function buscar(categoria, id) {
    return DB_COMPONENTES[categoria].find(producto => producto.id === id)
}

// Armado AMD completo y compatible
function armadoAMD() {
    return {
        procesadores: buscar("procesadores", "cpu-amd-7600x"),
        placas: buscar("placas", "mb-asus-b650-atx"),
        ram: buscar("ram", "ram-kingston-32-ddr5"),
        gpu: buscar("gpu", "gpu-rtx-4060"),
        almacenamiento: buscar("almacenamiento", "ssd-kingston-1tb-nvme"),
        fuentes: buscar("fuentes", "psu-corsair-650w"),
        gabinetes: buscar("gabinetes", "case-deepcool-cc560")
    }
}

describe("Arma tu PC conectado al carrito", () => {
    beforeEach(() => {
        localStorage.clear()
        vi.spyOn(window, "alert").mockImplementation(() => {})
    })

    afterEach(() => {
        cleanup()
        vi.restoreAllMocks()
    })

    function renderArmaTuPC() {
        render(
            <MemoryRouter initialEntries={["/arma-tu-pc"]}>
                <ArmaTuPC />
                <RutaActual />
            </MemoryRouter>
        )
    }

    // PRUEBA UNITARIA 1: Armado incompleto o incompatible
    test("no agrega al carrito un armado incompleto o incompatible", async () => {
        const user = userEvent.setup()
        renderArmaTuPC()

        await user.click(screen.getByRole("button", { name: "Agregar al Carrito" }))

        expect(window.alert).toHaveBeenCalledWith(
            "Faltan componentes por elegir: CPU, Placa Madre, RAM, GPU, Disco, Fuente, Gabinete."
        )
        expect(obtenerCarrito()).toHaveLength(0)

        // una placa AMD con un procesador Intel es incompatible
        const incompatible = { ...armadoAMD(), procesadores: buscar("procesadores", "cpu-intel-13400f") }
        expect(detectarConflicto(incompatible)).toBe("CPU y Placa tienen sockets diferentes.")
    })

    // PRUEBA UNITARIA 2: Flujo completo hasta el carrito
    test("arma un PC paso a paso y lo agrega al carrito", async () => {
        const user = userEvent.setup()
        renderArmaTuPC()

        await user.click(screen.getByRole("button", { name: "Elegir Intel" }))
        // solo se muestran CPUs Intel
        expect(screen.queryByText("AMD Ryzen 5 7600X")).toBeNull()

        await user.click(screen.getByRole("button", { name: "Elegir Intel Core i5-13400F" }))
        await user.click(screen.getByRole("button", { name: /siguiente/i }))
        await user.click(screen.getByRole("button", { name: "Elegir ASRock B760M-HDV/M.2 D4" }))
        await user.click(screen.getByRole("button", { name: /siguiente/i }))
        // la placa es DDR4, no se ofrece RAM DDR5
        expect(screen.queryByText("Corsair Vengeance 16GB DDR5")).toBeNull()
        await user.click(screen.getByRole("button", { name: "Elegir Corsair Vengeance LPX 16GB DDR4" }))
        await user.click(screen.getByRole("button", { name: /siguiente/i }))
        await user.click(screen.getByRole("button", { name: "Elegir MSI GeForce RTX 4060 Ventus 2X" }))
        await user.click(screen.getByRole("button", { name: /siguiente/i }))
        await user.click(screen.getByRole("button", { name: "Elegir Crucial P3 Plus 500GB PCIe 4.0 NVMe" }))
        await user.click(screen.getByRole("button", { name: /siguiente/i }))
        await user.click(screen.getByRole("button", { name: "Elegir Corsair CV550 550W 80+ Bronze" }))
        await user.click(screen.getByRole("button", { name: /siguiente/i }))
        await user.click(screen.getByRole("button", { name: "Elegir Cooler Master MasterBox Q300L Mini Tower" }))

        expect(screen.getByText("Sistema compatible hasta el momento.")).toBeTruthy()
        expect(screen.getByTestId("total-armado").textContent).toBe("$821.000")

        await user.click(screen.getByRole("button", { name: "Agregar al Carrito" }))

        const carrito = obtenerCarrito()
        expect(carrito).toHaveLength(1)
        expect(carrito[0]).toMatchObject({ tipo: "armado", nombre: "PC Armado Intel", precio: 821000, cantidad: 1 })
        expect(carrito[0].componentes).toHaveLength(7)
        expect(window.alert).toHaveBeenCalledWith("PC Armado Intel agregado al carrito.")
        expect(screen.getByText("Ruta actual: /Carrito")).toBeTruthy()
    })
})
