import { obtenerStock } from "../../data/catalogoProductos.js"

export const CLAVE_CARRITO = "carrito"
export const EVENTO_CARRITO = "carritoActualizado"
export const IVA = 0.19

export function parsearCarrito(carritoGuardado) {
    try {
        const carrito = JSON.parse(carritoGuardado)
        return Array.isArray(carrito) ? carrito : []
    } catch {
        return []
    }
}

export function obtenerCarrito() {
    return parsearCarrito(localStorage.getItem(CLAVE_CARRITO))
}

export function guardarCarrito(carrito) {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito))
    // avisa a los componentes (Nav, página del carrito) que el carrito cambió
    window.dispatchEvent(new Event(EVENTO_CARRITO))
    return carrito
}

// Convierte precios como "$129.990" o "129.990" a número (129990)
export function convertirPrecio(precio) {
    if (typeof precio === "number") {
        return precio
    }
    return Number(String(precio).replace(/\D/g, "")) || 0
}

export function formatearPrecio(valor) {
    return Number(valor || 0).toLocaleString("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0
    })
}

// Stock máximo de un ítem del carrito. Los PC armados no tienen límite.
export function stockDisponible(item) {
    if (item.tipo === "armado") {
        return Infinity
    }
    return obtenerStock(item.productoId)
}

// Agrega un producto de la tienda o un PC armado.
// Devuelve { ok, mensaje, carrito }
export function agregarAlCarrito(item, cantidad = 1) {
    const carrito = obtenerCarrito()
    const tipo = item.tipo || "producto"
    const id = item.id ?? `producto-${item.productoId}`
    const existente = carrito.find(producto => producto.id === id)
    const cantidadActual = existente ? existente.cantidad : 0
    const nuevaCantidad = cantidadActual + cantidad

    const nuevoItem = {
        ...item,
        id,
        tipo,
        precio: convertirPrecio(item.precio)
    }

    const stock = stockDisponible(nuevoItem)

    if (stock <= 0) {
        return { ok: false, mensaje: "Producto sin stock disponible.", carrito }
    }

    if (nuevaCantidad > stock) {
        return {
            ok: false,
            mensaje: `Solo hay ${stock} unidades disponibles de ${item.nombre}.`,
            carrito
        }
    }

    let carritoActualizado
    if (existente) {
        carritoActualizado = carrito.map(producto =>
            producto.id === id
                ? { ...producto, cantidad: nuevaCantidad }
                : producto
        )
    } else {
        carritoActualizado = [...carrito, { ...nuevoItem, cantidad }]
    }

    guardarCarrito(carritoActualizado)
    return {
        ok: true,
        mensaje: `${item.nombre} agregado al carrito.`,
        carrito: carritoActualizado
    }
}

export function cambiarCantidad(id, cantidad) {
    const carrito = obtenerCarrito()
    const item = carrito.find(producto => producto.id === id)
    const nuevaCantidad = Math.floor(Number(cantidad))

    if (!item) {
        return { ok: false, mensaje: "El producto no está en el carrito.", carrito }
    }

    if (!nuevaCantidad || nuevaCantidad < 1) {
        return eliminarDelCarrito(id)
    }

    const stock = stockDisponible(item)
    if (nuevaCantidad > stock) {
        return {
            ok: false,
            mensaje: `Solo hay ${stock} unidades disponibles de ${item.nombre}.`,
            carrito
        }
    }

    const carritoActualizado = carrito.map(producto =>
        producto.id === id ? { ...producto, cantidad: nuevaCantidad } : producto
    )
    guardarCarrito(carritoActualizado)
    return { ok: true, mensaje: "", carrito: carritoActualizado }
}

export function eliminarDelCarrito(id) {
    const carritoActualizado = obtenerCarrito().filter(
        producto => producto.id !== id
    )
    guardarCarrito(carritoActualizado)
    return { ok: true, mensaje: "", carrito: carritoActualizado }
}

export function vaciarCarrito() {
    return guardarCarrito([])
}

export function contarProductos(carrito) {
    return carrito.reduce((total, item) => total + item.cantidad, 0)
}

// Los precios de la tienda incluyen IVA (como en las boletas chilenas):
// total = suma de los productos, subtotal = neto sin IVA, iva = 19% del neto.
export function calcularTotales(carrito) {
    const total = carrito.reduce(
        (suma, item) => suma + convertirPrecio(item.precio) * item.cantidad,
        0
    )
    const subtotal = Math.round(total / (1 + IVA))
    const iva = total - subtotal

    return { subtotal, iva, total }
}
