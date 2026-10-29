// Reseñas de productos guardadas en localStorage, agrupadas por id de producto:
// { "1": [ { id, autor, correo, estrellas, comentario, fecha } ] }

export const CLAVE_RESENAS = "resenas"
export const LARGO_MINIMO_COMENTARIO = 5

function leerTodas() {
    try {
        const datos = JSON.parse(localStorage.getItem(CLAVE_RESENAS))
        return datos && typeof datos === "object" && !Array.isArray(datos) ? datos : {}
    } catch {
        return {}
    }
}

export function obtenerResenas(productoId) {
    const resenas = leerTodas()[String(productoId)]
    return Array.isArray(resenas) ? resenas : []
}

// Agrega (o actualiza, si el usuario ya opinó) una reseña. Devuelve { ok, mensaje, resenas }
export function agregarResena(usuario, productoId, { estrellas, comentario }, fecha = new Date()) {
    const actuales = obtenerResenas(productoId)

    if (!usuario) {
        return { ok: false, mensaje: "Debes iniciar sesión para publicar una reseña.", resenas: actuales }
    }

    const nota = Number(estrellas)
    if (!Number.isInteger(nota) || nota < 1 || nota > 5) {
        return { ok: false, mensaje: "Selecciona una calificación de 1 a 5 estrellas.", resenas: actuales }
    }

    const texto = String(comentario ?? "").trim()
    if (texto.length < LARGO_MINIMO_COMENTARIO) {
        return {
            ok: false,
            mensaje: `El comentario debe tener al menos ${LARGO_MINIMO_COMENTARIO} caracteres.`,
            resenas: actuales
        }
    }

    const correo = String(usuario.email || "").toLowerCase()
    const nueva = {
        id: `${productoId}-${fecha.getTime()}`,
        autor: usuario.usuario || usuario.email,
        correo,
        estrellas: nota,
        comentario: texto,
        fecha: fecha.toISOString()
    }

    const existente = actuales.some(resena => resena.correo === correo)
    const resenas = [nueva, ...actuales.filter(resena => resena.correo !== correo)]

    const todas = leerTodas()
    todas[String(productoId)] = resenas
    localStorage.setItem(CLAVE_RESENAS, JSON.stringify(todas))

    return {
        ok: true,
        mensaje: existente ? "Tu reseña fue actualizada." : "¡Gracias por tu reseña!",
        resenas
    }
}

// Promedio con un decimal y cantidad de reseñas
export function resumenResenas(resenas) {
    if (resenas.length === 0) {
        return { promedio: 0, cantidad: 0 }
    }
    const suma = resenas.reduce((total, resena) => total + Number(resena.estrellas), 0)
    return {
        promedio: Math.round((suma / resenas.length) * 10) / 10,
        cantidad: resenas.length
    }
}

export function textoEstrellas(cantidad) {
    const llenas = Math.round(cantidad)
    return "★".repeat(llenas) + "☆".repeat(5 - llenas)
}
