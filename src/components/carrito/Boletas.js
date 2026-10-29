import { obtenerProductos } from "../../data/catalogoProductos.js"
import { obtenerCarrito, calcularTotales, stockDisponible, vaciarCarrito } from "./Carrito.js"

export const CLAVE_BOLETAS = "boletas"

export function obtenerBoletas() {
    try {
        const boletas = JSON.parse(localStorage.getItem(CLAVE_BOLETAS))
        return Array.isArray(boletas) ? boletas : []
    } catch {
        return []
    }
}

export function obtenerBoleta(numero) {
    return obtenerBoletas().find(boleta => boleta.numero === Number(numero))
}

export function obtenerBoletasUsuario(correo) {
    return obtenerBoletas().filter(
        boleta => boleta.correo?.toLowerCase() === correo?.toLowerCase()
    )
}

export function siguienteNumeroBoleta(boletas) {
    return boletas.reduce((maximo, boleta) => Math.max(maximo, boleta.numero), 0) + 1
}

export function formatearNumeroBoleta(numero) {
    return `N° ${String(numero).padStart(6, "0")}`
}

export function formatearFecha(fechaISO) {
    return new Date(fechaISO).toLocaleString("es-CL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    })
}

// Descuenta del stock de la tienda los productos comprados
function descontarStock(items) {
    const productosActualizados = obtenerProductos().map(producto => {
        const comprado = items.find(
            item => item.tipo === "producto" && Number(item.productoId) === Number(producto.id)
        )
        if (!comprado) {
            return producto
        }
        return {
            ...producto,
            stock: Math.max(0, Number(producto.stock) - comprado.cantidad)
        }
    })

    localStorage.setItem("productos", JSON.stringify(productosActualizados))
    // evita que el panel admin reemplace el stock por los datos iniciales
    localStorage.setItem("productosInicialesCargados", "true")
}

// Checkout: genera la boleta del carrito actual, la guarda en el historial
// de compras, descuenta stock y vacía el carrito. Devuelve { ok, mensaje, boleta }
export function generarBoleta(usuario, fecha = new Date()) {
    const carrito = obtenerCarrito()

    if (!usuario) {
        return { ok: false, mensaje: "Debes iniciar sesión para finalizar la compra." }
    }

    if (carrito.length === 0) {
        return { ok: false, mensaje: "El carrito está vacío." }
    }

    const sinStock = carrito.find(item => item.cantidad > stockDisponible(item))
    if (sinStock) {
        return {
            ok: false,
            mensaje: `No hay stock suficiente de ${sinStock.nombre}.`
        }
    }

    const boletas = obtenerBoletas()
    const { subtotal, iva, total } = calcularTotales(carrito)

    const boleta = {
        numero: siguienteNumeroBoleta(boletas),
        fecha: fecha.toISOString(),
        usuario: usuario.usuario,
        correo: usuario.email,
        items: carrito.map(item => ({
            id: item.id,
            tipo: item.tipo,
            productoId: item.productoId,
            nombre: item.nombre,
            precio: item.precio,
            cantidad: item.cantidad,
            componentes: item.componentes,
            totalLinea: item.precio * item.cantidad
        })),
        subtotal,
        iva,
        total
    }

    localStorage.setItem(CLAVE_BOLETAS, JSON.stringify([...boletas, boleta]))

    // Registro para el historial de compras y reportes del panel admin
    const compras = JSON.parse(localStorage.getItem("compras")) || []
    compras.push({
        id: boleta.numero,
        boleta: boleta.numero,
        correo: boleta.correo,
        producto: boleta.items
            .map(item => `${item.nombre} x${item.cantidad}`)
            .join(", "),
        fecha: formatearFecha(boleta.fecha),
        total: boleta.total
    })
    localStorage.setItem("compras", JSON.stringify(compras))

    descontarStock(boleta.items)
    vaciarCarrito()

    return { ok: true, mensaje: "Compra realizada con éxito.", boleta }
}
