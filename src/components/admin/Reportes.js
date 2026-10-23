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