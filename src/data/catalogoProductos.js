// Catálogo base de la tienda (mismos datos iniciales que usa el panel admin).
// Si el admin ya guardó productos en localStorage, se usan esos (con su stock).
export const productosBase = [
    {
        id: 1,
        nombre: "Corsair K70 RGB Pro",
        categoria: "Perifericos",
        precio: 129990,
        stock: 15,
        descripcion: "Teclado mecánico RGB de alto rendimiento.",
        imagen: "/corsair.jpg"
    },
    {
        id: 2,
        nombre: "Razer DeathAdder V3",
        categoria: "Perifericos",
        precio: 69990,
        stock: 8,
        descripcion: "Mouse gamer ergonómico de alta precisión.",
        imagen: "/mouse.jpg"
    },
    {
        id: 3,
        nombre: "ASUS TUF Gaming",
        categoria: "Monitores",
        precio: 289990,
        stock: 3,
        descripcion: "Monitor gaming de alto rendimiento.",
        imagen: "/monitor.jpg"
    },
    {
        id: 4,
        nombre: "Samsung 990 EVO 1TB",
        categoria: "Almacenamiento",
        precio: 119990,
        stock: 0,
        descripcion: "SSD NVMe de 1TB para alto rendimiento.",
        imagen: "/ssd.jpg"
    }
]

export function obtenerProductos() {
    try {
        const productosGuardados = JSON.parse(localStorage.getItem("productos"))
        if (Array.isArray(productosGuardados)) {
            return productosGuardados
        }
    } catch {
        // si el JSON está corrupto se usa el catálogo base
    }
    return productosBase
}

// Devuelve el stock disponible de un producto de la tienda.
// Si el producto no está en el catálogo (o no tiene stock definido) no se limita.
export function obtenerStock(productoId) {
    const producto = obtenerProductos().find(
        producto => Number(producto.id) === Number(productoId)
    )

    if (!producto || producto.stock === undefined || producto.stock === null) {
        return Infinity
    }

    return Number(producto.stock)
}
