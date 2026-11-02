import { obtenerProductos } from "../../data/catalogoProductos.js"
import { obtenerCarrito, calcularTotales, stockDisponible, vaciarCarrito } from "./Carrito.js"
import { formatearRut, validarRut } from "./Rut.js"

export const CLAVE_BOLETAS = "boletas"

// Datos ficticios del emisor (formato de boleta electrónica chilena)
export const EMISOR = {
    razonSocial: "PC Forgery SpA",
    rut: "76.543.210-3",
    giro: "Venta al por menor de computadores y componentes",
    direccion: "Av. Providencia 1234, Of. 98, Providencia, Santiago",
    telefono: "+56 2 2345 6789",
    correo: "ventas@pcforgery.cl"
}

export const METODOS_PAGO = ["Débito", "Crédito", "Transferencia"]

// Código del producto en la boleta: PF-00001 para productos, PF-ARM para armados
export function codigoItem(item) {
    if (item.tipo === "armado") {
        return "PF-ARM"
    }
    return `PF-${String(item.productoId ?? item.id ?? "").padStart(5, "0")}`
}

// Código de verificación simulado a partir de los datos de la boleta
export function codigoVerificacion(boleta) {
    const texto = `${boleta.numero}|${boleta.fecha}|${boleta.total}|${boleta.correo}`
    let hash = 0
    for (const caracter of texto) {
        hash = (hash * 31 + caracter.charCodeAt(0)) >>> 0
    }
    return hash.toString(16).toUpperCase().padStart(8, "0")
}

// Completa los campos nuevos en boletas antiguas (guardadas antes del formato realista)
export function normalizarBoleta(boleta) {
    if (!boleta) {
        return boleta
    }
    return {
        ...boleta,
        emisor: boleta.emisor || EMISOR,
        metodoPago: boleta.metodoPago || "No informado",
        cliente: boleta.cliente || {
            nombre: boleta.usuario,
            correo: boleta.correo,
            rut: ""
        },
        items: (boleta.items || []).map(item => ({
            ...item,
            codigo: item.codigo || codigoItem(item),
            totalLinea: item.totalLinea ?? item.precio * item.cantidad
        })),
        codigoVerificacion: boleta.codigoVerificacion || codigoVerificacion(boleta)
    }
}

export function obtenerBoletas() {
    try {
        const boletas = JSON.parse(localStorage.getItem(CLAVE_BOLETAS))
        return Array.isArray(boletas) ? boletas : []
    } catch {
        return []
    }
}

export function obtenerBoleta(numero) {
    return normalizarBoleta(
        obtenerBoletas().find(boleta => boleta.numero === Number(numero))
    )
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
// datosPago: { metodoPago, rut } (el RUT del cliente es opcional)
export function generarBoleta(usuario, fecha = new Date(), datosPago = {}) {
    const metodoPago = datosPago.metodoPago || METODOS_PAGO[0]
    const rutCliente = String(datosPago.rut ?? "").trim()

    const carrito = obtenerCarrito()

    if (!usuario) {
        return { ok: false, mensaje: "Debes iniciar sesión para finalizar la compra." }
    }

    if (carrito.length === 0) {
        return { ok: false, mensaje: "El carrito está vacío." }
    }

    if (rutCliente && !validarRut(rutCliente)) {
        return { ok: false, mensaje: "El RUT ingresado no es válido. Revisa el dígito verificador." }
    }

    if (!METODOS_PAGO.includes(metodoPago)) {
        return { ok: false, mensaje: "Selecciona un método de pago válido." }
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
        tipoDocumento: "BOLETA ELECTRÓNICA",
        numero: siguienteNumeroBoleta(boletas),
        fecha: fecha.toISOString(),
        usuario: usuario.usuario,
        correo: usuario.email,
        emisor: EMISOR,
        cliente: {
            nombre: usuario.usuario,
            correo: usuario.email,
            rut: rutCliente ? formatearRut(rutCliente) : ""
        },
        metodoPago,
        items: carrito.map(item => ({
            id: item.id,
            codigo: codigoItem(item),
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
    boleta.codigoVerificacion = codigoVerificacion(boleta)

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
        metodoPago: boleta.metodoPago,
        total: boleta.total
    })
    localStorage.setItem("compras", JSON.stringify(compras))

    descontarStock(boleta.items)
    vaciarCarrito()

    return { ok: true, mensaje: "Compra realizada con éxito.", boleta }
}
