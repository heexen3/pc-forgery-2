export function obtenerCompras() {
    return JSON.parse(localStorage.getItem("compras")) || []
}

export function filtrarCompras(compras, correo) {
    if (!correo.trim()) {
        return compras
    }

    return compras.filter(
        compra =>
            compra.correo?.toLowerCase() === correo.trim().toLowerCase()
    )
}