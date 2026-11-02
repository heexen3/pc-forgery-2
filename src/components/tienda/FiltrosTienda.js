// Lógica de filtros, orden e insignias de la tienda (sin React, fácil de testear)

export const LIMITE_ULTIMAS_UNIDADES = 3

export const ORDENES = [
    { valor: "relevancia", etiqueta: "Destacados" },
    { valor: "precio-asc", etiqueta: "Precio: menor a mayor" },
    { valor: "precio-desc", etiqueta: "Precio: mayor a menor" },
    { valor: "nombre", etiqueta: "Nombre (A-Z)" }
]

// Quita tildes y pasa a minúsculas para comparar textos
export function normalizarTexto(texto) {
    return String(texto ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
}

export function filtrarProductos(productos, { categoria = "", busqueda = "", orden = "relevancia" } = {}) {
    const termino = normalizarTexto(busqueda)

    const filtrados = productos.filter(producto => {
        const coincideCategoria = !categoria || producto.categoria === categoria
        const coincideBusqueda = !termino ||
            normalizarTexto(producto.nombre).includes(termino) ||
            normalizarTexto(producto.marca).includes(termino)
        return coincideCategoria && coincideBusqueda
    })

    const ordenados = [...filtrados]
    if (orden === "precio-asc") {
        ordenados.sort((a, b) => Number(a.precio) - Number(b.precio))
    } else if (orden === "precio-desc") {
        ordenados.sort((a, b) => Number(b.precio) - Number(a.precio))
    } else if (orden === "nombre") {
        ordenados.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))
    } else {
        // destacados: primero los que tienen stock, luego los nuevos
        ordenados.sort((a, b) =>
            (Number(b.stock) > 0) - (Number(a.stock) > 0) ||
            Boolean(b.nuevo) - Boolean(a.nuevo)
        )
    }
    return ordenados
}

// Devuelve las insignias a mostrar en la tarjeta: [{ texto, tipo }]
export function obtenerInsignias(producto) {
    const insignias = []
    const stock = Number(producto.stock)

    if (producto.stock !== undefined && producto.stock !== null) {
        if (stock <= 0) {
            insignias.push({ texto: "Agotado", tipo: "agotado" })
        } else if (stock <= LIMITE_ULTIMAS_UNIDADES) {
            insignias.push({ texto: "Últimas unidades", tipo: "ultimas" })
        }
    }

    if (producto.nuevo) {
        insignias.push({ texto: "Nuevo", tipo: "nuevo" })
    }

    return insignias
}

export function contarPorCategoria(productos) {
    return productos.reduce((conteo, producto) => {
        conteo[producto.categoria] = (conteo[producto.categoria] || 0) + 1
        return conteo
    }, {})
}
