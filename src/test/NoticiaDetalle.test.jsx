// Funciones de Vitest para describir y ejecutar las pruebas
import { describe, test, expect, beforeEach, afterEach } from "vitest"
// render dibuja el componente, screen permite buscar elementos y cleanup lo limpia
import { render, screen, cleanup } from "@testing-library/react"
// MemoryRouter simula la barra de direcciones. Aquí basta con él,
// porque NoticiaDetalle lee el id desde la URL con useSearchParams (?id=...)
import { MemoryRouter } from "react-router-dom"
import NoticiaDetalle from "../NoticiaDetalle.jsx"
// crearNoticia guarda una noticia como lo hace el admin, y formatearFecha
// es la misma función que usa la página para mostrar la fecha
import { crearNoticia, formatearFecha } from "../data/catalogoNoticias.js"

// Función de apoyo: simula que el usuario entra a una dirección de la aplicación
function mostrarDetalle(ruta) {
    return render(
        <MemoryRouter initialEntries={[ruta]}>
            <NoticiaDetalle />
        </MemoryRouter>
    )
}

describe("Detalle de noticia", () => {
    // Se vacía el localStorage antes de cada prueba para partir sin noticias creadas por el admin
    beforeEach(() => {
        localStorage.clear()
    })

    // Se limpia lo dibujado después de cada prueba
    afterEach(() => {
        cleanup()
    })

    // PRUEBA UNITARIA 1: con parámetro, una noticia creada por el admin
    // Qué se prueba: cuando la URL trae el id de una noticia que existe ("?id=..."),
    // la página muestra esa noticia completa: título, fecha, imagen
    // y cada párrafo del texto por separado.
    test("con el id de una noticia creada por el admin muestra su imagen y cada párrafo por separado", () => {
        // Se crea una noticia como lo haría el admin. El texto lleva una línea en blanco
        // en medio, así que debería dividirse en 2 párrafos.
        // crearNoticia asigna el id y la fecha, por eso se busca la noticia recién creada
        const creada = crearNoticia({
            titulo: "Noticia de prueba",
            resumen: "Resumen corto",
            texto: "Primer párrafo de la noticia.\n\nSegundo párrafo de la noticia.",
            imagen: "data:image/png;base64,AAAA"
        }).find(noticia => noticia.titulo === "Noticia de prueba")

        // Se simula entrar a la noticia usando su id como parámetro
        mostrarDetalle(`/noticias/detalle?id=${creada.id}`)

        // El título aparece como encabezado
        expect(screen.getByRole("heading", { name: "Noticia de prueba" })).toBeTruthy()
        // La fecha se muestra con el mismo formato que usa la página
        expect(screen.getByText(formatearFecha(creada.fecha))).toBeTruthy()
        // La imagen de la noticia usa la imagen que subió el admin y el título como texto alternativo
        expect(screen.getByAltText("Noticia de prueba").getAttribute("src")).toBe("data:image/png;base64,AAAA")
        // Cada párrafo del texto se muestra por separado
        expect(screen.getByText("Primer párrafo de la noticia.")).toBeTruthy()
        expect(screen.getByText("Segundo párrafo de la noticia.")).toBeTruthy()
    })

    // PRUEBA UNITARIA 2: sin parámetro
    // Qué se prueba: si se entra a la página de detalle sin indicar qué noticia
    // (la URL no trae "?id=..."), no hay nada que mostrar. La página no debe romperse:
    // debe avisar que la noticia no fue encontrada y ofrecer volver al listado.
    test("sin el parámetro id muestra que la noticia no fue encontrada", () => {
        // Se simula entrar a /noticias/detalle sin ningún parámetro
        mostrarDetalle("/noticias/detalle")

        // Aparece el mensaje de error como título de la página
        expect(screen.getByRole("heading", { name: "Noticia no encontrada" })).toBeTruthy()
        // Hay un enlace para volver al listado de noticias
        expect(screen.getByRole("link", { name: "← Volver a Noticias" }).getAttribute("href")).toBe("/noticias")
        // No se dibuja ninguna imagen de noticia (se prueba con el título de la primera noticia base)
        expect(screen.queryByRole("img", { name: /tarjetas gráficas/ })).toBeNull()
    })
})