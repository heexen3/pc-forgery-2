// Funciones de Vitest para describir y ejecutar las pruebas
import { describe, test, expect, beforeEach, afterEach } from "vitest"
// render dibuja el componente en un DOM simulado, screen permite buscar elementos
// y cleanup lo limpia al terminar cada prueba
import { render, screen, cleanup } from "@testing-library/react"
// MemoryRouter simula la barra de direcciones (sin navegador real).
// Routes y Route son necesarios porque HiloDetalle lee el id desde la ruta con useParams
import { MemoryRouter, Routes, Route } from "react-router-dom"
import HiloDetalle from "../HiloDetalle.jsx"

// Función de apoyo: simula que el usuario entra a una dirección de la aplicación.
// El ":id" de la ruta es el parámetro que HiloDetalle usa para buscar el hilo
function mostrarHilo(ruta) {
    return render(
        <MemoryRouter initialEntries={[ruta]}>
            <Routes>
                <Route path="/comunidad/hilo/:id" element={<HiloDetalle />} />
            </Routes>
        </MemoryRouter>
    )
}

describe("Detalle de hilo de la comunidad", () => {
    // Antes de cada prueba se vacía el localStorage y se guarda un hilo de ejemplo,
    // porque HiloDetalle busca el hilo ahí (clave "hilos").
    // Así las pruebas no dependen de datos reales ni una de la otra.
    beforeEach(() => {
        localStorage.clear()
        localStorage.setItem("hilos", JSON.stringify([
            {
                id: "hilo-1",
                titulo: "Duda sobre mi armado",
                categoria: "Armado de PC",
                autor: "pedro",
                mensaje: "¿Me alcanza una fuente de 500W para esta tarjeta?",
                fecha: "2026-10-01T12:00:00.000Z",
                ultimaActividad: "2026-10-02T12:00:00.000Z",
                respuestas: [
                    {
                        id: "hilo-1-r1",
                        autor: "maria",
                        texto: "Te recomiendo una de 650W para estar tranquilo.",
                        fecha: "2026-10-02T12:00:00.000Z"
                    }
                ]
            }
        ]))
    })

    // Después de cada prueba se quita lo que se dibujó, para que no se acumule en la siguiente
    afterEach(() => {
        cleanup()
    })

    // PRUEBA UNITARIA 1: con parámetro, un hilo que existe
    // Qué se prueba: cuando la URL trae el id de un hilo guardado ("hilo-1"),
    // la página debe mostrar ese hilo completo: su título, el mensaje original
    // y las respuestas que ya tiene.
    test("con el id de un hilo existente muestra el hilo, su mensaje y sus respuestas", () => {
        mostrarHilo("/comunidad/hilo/hilo-1")

        // El título del hilo aparece como encabezado de nivel 2
        expect(screen.getByRole("heading", { level: 2, name: "Duda sobre mi armado" })).toBeTruthy()
        // Se muestra el mensaje con el que se creó el hilo
        expect(screen.getByText("¿Me alcanza una fuente de 500W para esta tarjeta?")).toBeTruthy()
        // Se muestra la respuesta guardada dentro del hilo
        expect(screen.getByText("Te recomiendo una de 650W para estar tranquilo.")).toBeTruthy()
        // El botón para volver apunta a la lista de la comunidad
        expect(screen.getByRole("link", { name: "← Volver a Comunidad" }).getAttribute("href")).toBe("/comunidad")
        // No hay "usuarioActual" en el localStorage (nadie inició sesión),
        // así que se invita a iniciar sesión y no aparece el botón para responder
        expect(screen.getByRole("link", { name: "iniciar sesión" })).toBeTruthy()
        // (No se busca el botón "Responder": el marco de la página siempre trae uno, aunque deshabilitado)
        expect(screen.getByRole("link", { name: "iniciar sesión" })).toBeTruthy()
        expect(screen.queryByPlaceholderText("Escribe tu respuesta...")).toBeNull()
    })

    // PRUEBA UNITARIA 2: con un parámetro que no corresponde a ningún hilo
    // Qué se prueba: si la URL trae un id que no existe en el localStorage,
    // la página no debe romperse ni mostrar datos de otro hilo:
    // debe avisar que el hilo no fue encontrado y ofrecer volver a la comunidad.
    test("con un id inexistente muestra que el hilo no fue encontrado", () => {
        mostrarHilo("/comunidad/hilo/no-existe")

        // Aparece el mensaje de error como título de la página
        expect(screen.getByRole("heading", { level: 1, name: "Hilo no encontrado" })).toBeTruthy()
        // Se muestra la explicación para el usuario
        expect(screen.getByText("El hilo que buscas no existe.")).toBeTruthy()
        // Hay un enlace para volver a la comunidad
        expect(screen.getByRole("link", { name: "← Volver a Comunidad" }).getAttribute("href")).toBe("/comunidad")
        // El hilo que sí existe ("hilo-1") no debe aparecer en esta página
        expect(screen.queryByText("Duda sobre mi armado")).toBeNull()
    })
})