// Funciones de Vitest para describir y ejecutar las pruebas
import { describe, test, expect, beforeEach, afterEach } from "vitest"
// render dibuja el componente, screen permite buscar elementos y cleanup lo limpia
import { render, screen, cleanup } from "@testing-library/react"
// MemoryRouter es necesario porque la página tiene enlaces (Link) que requieren un router
import { MemoryRouter } from "react-router-dom"
import Comunidad from "../Comunidad.jsx"

// Función de apoyo: arma un hilo de ejemplo con los mismos campos que guarda la aplicación.
// Solo cambian el id, el título y la fecha de última actividad, que es lo que importa aquí
function crearHilo(id, titulo, ultimaActividad) {
    return {
        id,
        titulo,
        categoria: "General",
        autor: "pedro",
        mensaje: "Mensaje de prueba del hilo.",
        fecha: "2026-10-01T10:00:00.000Z",
        ultimaActividad,
        respuestas: []
    }
}

// Función de apoyo: dibuja la página de comunidad dentro de un router simulado
function mostrarComunidad() {
    return render(
        <MemoryRouter>
            <Comunidad />
        </MemoryRouter>
    )
}

describe("Comunidad", () => {
    // Se vacía el localStorage antes de cada prueba para que no queden hilos de otras pruebas
    beforeEach(() => {
        localStorage.clear()
    })

    // Se limpia lo dibujado después de cada prueba
    afterEach(() => {
        cleanup()
    })

    // PRUEBA UNITARIA 1: los hilos se ordenan por la actividad más reciente
    // Qué se prueba: la página debe mostrar primero el hilo con actividad más nueva
    // (por ejemplo, uno recién creado o con una respuesta reciente),
    // sin importar en qué orden estén guardados.
    test("lista los hilos con el de actividad más reciente primero", () => {
        // Se guardan 3 hilos a propósito DESORDENADOS: antiguo, reciente e intermedio.
        // Si la página no ordenara, saldrían en este mismo orden
        localStorage.setItem("hilos", JSON.stringify([
            crearHilo("hilo-a", "Hilo antiguo", "2026-10-01T10:00:00.000Z"),
            crearHilo("hilo-b", "Hilo reciente", "2026-10-03T10:00:00.000Z"),
            crearHilo("hilo-c", "Hilo intermedio", "2026-10-02T10:00:00.000Z")
        ]))

        mostrarComunidad()

        // Los títulos de los hilos son los encabezados de nivel 2.
        // Se leen en el orden en que aparecen en pantalla
        const titulos = screen
            .getAllByRole("heading", { level: 2 })
            .map(titulo => titulo.textContent)

        // Deben aparecer del más reciente al más antiguo
        expect(titulos).toEqual(["Hilo reciente", "Hilo intermedio", "Hilo antiguo"])
        // Cada título es un enlace que lleva al detalle de ese hilo (usa el id del hilo en la URL)
        expect(screen.getByRole("link", { name: "Hilo reciente" }).getAttribute("href")).toBe("/comunidad/hilo/hilo-b")
        // El botón para crear un hilo nuevo apunta a su formulario
        expect(screen.getByRole("link", { name: "+ Nuevo hilo" }).getAttribute("href")).toBe("/comunidad/nuevo-hilo")
    })

    // PRUEBA UNITARIA 2: todavía no hay hilos creados
    // Qué se prueba: con el localStorage vacío (nadie ha creado hilos),
    // la página debe mostrar un mensaje que invite a crear el primero,
    // en vez de una lista vacía, y seguir mostrando el botón para crear hilos.
    test("sin hilos muestra el mensaje para crear el primero", () => {
        mostrarComunidad()

        // Aparece el mensaje de lista vacía
        expect(screen.getByText("Aún no hay hilos. ¡Crea el primero!")).toBeTruthy()
        // No se dibuja ninguna tarjeta de hilo (los títulos de hilo son encabezados de nivel 2)
        expect(screen.queryAllByRole("heading", { level: 2 })).toHaveLength(0)
        // El botón para crear un hilo sigue disponible
        expect(screen.getByRole("link", { name: "+ Nuevo hilo" }).getAttribute("href")).toBe("/comunidad/nuevo-hilo")
    })
})