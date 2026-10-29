export function obtenerProductosCriticos() {
    const productosGuardados = localStorage.getItem("productos")

    if (productosGuardados === null) {
        return []
    }

    try {
        const productos = JSON.parse(productosGuardados)

        return productos.filter(
            producto => Number(producto.stock) <= 3
        )
    } catch {
        console.error("Error al leer los productos guardados.")
        return []
    }
}
