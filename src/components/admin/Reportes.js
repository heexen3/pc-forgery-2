export function generarReporte() {
    const usuarios = JSON.parse(
        localStorage.getItem("usuarios")
    ) || []

    const compras = JSON.parse(
        localStorage.getItem("compras")
    ) || []

    const administradores = usuarios.filter(
        usuario => usuario.rol === "admin"
    ).length

    const totalVentas = compras.reduce(
        (total, compra) => total + Number(compra.total || 0),
        0
    )

    return {
        usuarios: usuarios.length,
        administradores: administradores,
        compras: compras.length,
        totalVentas: totalVentas
    }
}


export function generarReporteProd() {
    const productos = JSON.parse(
        localStorage.getItem("productos")
    ) || []

    const totalProductos = productos.length

    const unidadesTotales = productos.reduce(
        (total, producto) => total + Number(producto.stock || 0),
        0
    )

    const valorInventario = productos.reduce(
        (total, producto) =>
            total + Number(producto.precio || 0) * Number(producto.stock || 0),
        0
    )

    const productosSinStock = productos.filter(
        producto => Number(producto.stock) === 0
    ).length

    const productosCriticos = productos.filter(
        producto => Number(producto.stock) <= 3
    ).length

    const productosPorCategoria = productos.reduce(
        (categorias, producto) => {
            const categoria = producto.categoria || "Sin categoría"

            categorias[categoria] = (categorias[categoria] || 0) + 1

            return categorias
        },
        {}
    )

    const categoriaConMasProductos = Object.entries(productosPorCategoria)
        .sort((a, b) => b[1] - a[1])[0]

    return {
        totalProductos,
        unidadesTotales,
        valorInventario,
        productosSinStock,
        productosCriticos,
        categoriaConMasProductos: categoriaConMasProductos
            ? categoriaConMasProductos[0]
            : "Sin datos",
        cantidadCategoria: categoriaConMasProductos
            ? categoriaConMasProductos[1]
            : 0
    }
}
