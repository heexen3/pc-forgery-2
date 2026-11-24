import { obtenerProductos, sincronizarProductos } from "../../data/catalogoProductos.js"
import { apiHabilitada, peticion } from "../../utils/api.js"
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

// Fila del historial de compras ("compras") a partir de una boleta
function compraDesdeBoleta(boleta) {
    return {
        id: boleta.numero,
        boleta: boleta.numero,
        correo: boleta.correo,
        producto: boleta.items
            .map(item => `${item.nombre} x${item.cantidad}`)
            .join(", "),
        fecha: formatearFecha(boleta.fecha),
        metodoPago: boleta.metodoPago,
        total: boleta.total
    }
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

// Validaciones previas al pago (sesión, carrito, RUT, método y stock).
// Se usan en el Carrito antes de ir a /pago y otra vez al generar la boleta.
// Devuelve { ok, mensaje }
export function validarCompra(usuario, datosPago = {}) {
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

    return { ok: true, mensaje: "" }
}

// Checkout: genera la boleta del carrito actual, la guarda en el historial
// de compras, descuenta stock y vacía el carrito. Devuelve { ok, mensaje, boleta }
// datosPago: { metodoPago, rut } (el RUT del cliente es opcional)
export function generarBoleta(usuario, fecha = new Date(), datosPago = {}) {
    const metodoPago = datosPago.metodoPago || METODOS_PAGO[0]
    const rutCliente = String(datosPago.rut ?? "").trim()

    const validacion = validarCompra(usuario, datosPago)
    if (!validacion.ok) {
        return validacion
    }

    // Con backend: POST /api/pedidos. pedidos-service toma los precios de productos-service,
    // verifica stock en inventario-service, cobra en pagos-service y devuelve la boleta.
    if (apiHabilitada()) {
        return enviarCheckout(datosPago, false)
    }

    const carrito = obtenerCarrito()
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
    compras.push(compraDesdeBoleta(boleta))
    localStorage.setItem("compras", JSON.stringify(compras))

    descontarStock(boleta.items)
    vaciarCarrito()

    return { ok: true, mensaje: "Compra realizada con éxito.", boleta }
}

// Datos del paso de pago (método y RUT) entre el Carrito y /pago.
// Viajan en location.state y se respaldan en sessionStorage por si se recarga /pago.
const CLAVE_DATOS_PAGO = "datosPago"

export function guardarDatosPago(datosPago) {
    sessionStorage.setItem(CLAVE_DATOS_PAGO, JSON.stringify(datosPago))
}

export function obtenerDatosPago() {
    try {
        return JSON.parse(sessionStorage.getItem(CLAVE_DATOS_PAGO)) || {}
    } catch {
        return {}
    }
}

export function borrarDatosPago() {
    sessionStorage.removeItem(CLAVE_DATOS_PAGO)
}

// ---------- Backend (pedidos-service) ----------

// Envía el carrito al checkout del backend. simularRechazo=true corresponde al botón
// "Simular pago no exitoso": pagos-service rechaza el pago y el carrito queda intacto.
async function enviarCheckout(datosPago, simularRechazo) {
    const carrito = obtenerCarrito()
    const metodoPago = datosPago.metodoPago || METODOS_PAGO[0]
    const cuerpo = {
        metodoPago,
        rut: String(datosPago.rut ?? "").trim(),
        simularRechazo,
        items: carrito.map(item => ({
            id: item.id,
            tipo: item.tipo,
            productoId: item.tipo === "armado" ? null : Number(item.productoId),
            nombre: item.nombre,
            cantidad: item.cantidad,
            componentes: item.componentes
        }))
    }
    try {
        const boleta = await peticion("/pedidos", { metodo: "POST", cuerpo })
        guardarBoletaLocal(boleta)
        vaciarCarrito()
        await sincronizarProductos().catch(() => null)
        return { ok: true, mensaje: "Compra realizada con éxito.", boleta }
    } catch (error) {
        return { ok: false, mensaje: error.message, status: error.status }
    }
}

// Registra en el backend un pago rechazado (botón "Simular pago no exitoso").
export function registrarPagoRechazado(datosPago) {
    if (!apiHabilitada()) return Promise.resolve({ ok: false })
    return enviarCheckout(datosPago, true)
}

function guardarBoletaLocal(boleta) {
    const boletas = obtenerBoletas().filter(item => item.numero !== boleta.numero)
    localStorage.setItem(CLAVE_BOLETAS, JSON.stringify([...boletas, boleta]))
    const compras = (JSON.parse(localStorage.getItem("compras")) || []).filter(item => item.boleta !== boleta.numero)
    localStorage.setItem("compras", JSON.stringify([...compras, compraDesdeBoleta(boleta)]))
}

// Trae las boletas del backend (el ADMIN recibe todas, el cliente solo las suyas)
// y actualiza las cachés "boletas" y "compras" que usan Mis compras, Boleta y el panel admin.
export async function sincronizarBoletas() {
    if (!apiHabilitada()) return obtenerBoletas()
    const boletas = await peticion("/boletas")
    localStorage.setItem(CLAVE_BOLETAS, JSON.stringify(boletas))
    localStorage.setItem("compras", JSON.stringify(boletas.map(compraDesdeBoleta)))
    return boletas
}
