// Catalogo de noticias. Mismo patron que catalogoProductos.js:
// el admin crea/elimina noticias y quedan guardadas en localStorage.
// Si el admin elimina todas, se vuelve a las noticias base (no se pierde la seccion).

export const CLAVE_NOTICIAS = "noticias"

export const noticiasBase = [
    {
        id: 1,
        titulo: "Nueva generación de tarjetas gráficas llega a la tienda",
        resumen: "Ya disponibles los nuevos modelos con mejor rendimiento por precio, ideales para actualizar tu setup sin gastar de más.",
        texto: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure natus veritatis ullam praesentium voluptas perspiciatis voluptatem, nihil inventore. Excepturi reprehenderit, quae quia maiores nesciunt saepe soluta iure natus exercitationem amet.\n\nLorem ipsum dolor sit amet consectetur adipisicing elit. Iure natus veritatis ullam praesentium voluptas perspiciatis voluptatem, nihil inventore.",
        imagen: "/noticia1.webp",
        fecha: "2026-09-03"
    },
    {
        id: 2,
        titulo: "PC Forgery suma la sección Comunidad",
        resumen: "Ahora puedes compartir tus armados, hacer preguntas y ayudar a otros usuarios en nuestro nuevo espacio de foro.",
        texto: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure natus veritatis ullam praesentium voluptas perspiciatis voluptatem, nihil inventore. Excepturi reprehenderit, quae quia maiores nesciunt saepe soluta iure natus exercitationem amet.\n\nLorem ipsum dolor sit amet consectetur adipisicing elit. Iure natus veritatis ullam praesentium voluptas perspiciatis voluptatem, nihil inventore.",
        imagen: "/noticia2.webp",
        fecha: "2026-09-06"
    },
    {
        id: 3,
        titulo: "Guía rápida: cómo elegir tu primera fuente de poder",
        resumen: "Te explicamos qué significa el wattage, la certificación 80 Plus y qué debes considerar antes de comprar.",
        texto: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure natus veritatis ullam praesentium voluptas perspiciatis voluptatem, nihil inventore. Excepturi reprehenderit, quae quia maiores nesciunt saepe soluta iure natus exercitationem amet.\n\nLorem ipsum dolor sit amet consectetur adipisicing elit. Iure natus veritatis ullam praesentium voluptas perspiciatis voluptatem, nihil inventore.",
        imagen: "/computer.png",
        fecha: "2026-09-01"
    }
]

function leerNoticiasGuardadas() {
    try {
        const noticiasGuardadas = JSON.parse(localStorage.getItem(CLAVE_NOTICIAS))
        return Array.isArray(noticiasGuardadas) ? noticiasGuardadas : null
    } catch {
        // si el JSON esta corrupto se usa el catalogo base
        return null
    }
}

// Devuelve las noticias guardadas (o el catalogo base si todavia no hay nada guardado),
// siempre ordenadas de la mas reciente a la mas antigua.
export function obtenerNoticias() {
    const noticias = leerNoticiasGuardadas() || noticiasBase
    return [...noticias].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
}

// Usado por el panel admin: garantiza que el catalogo quede guardado en localStorage.
export function inicializarCatalogoNoticias() {
    const noticias = leerNoticiasGuardadas() || noticiasBase
    localStorage.setItem(CLAVE_NOTICIAS, JSON.stringify(noticias))
    return obtenerNoticias()
}

// Restablece el catalogo base (cuando el admin elimina todas las noticias).
export function restablecerNoticias() {
    localStorage.setItem(CLAVE_NOTICIAS, JSON.stringify(noticiasBase))
    return obtenerNoticias()
}

export function obtenerNoticia(noticiaId) {
    return obtenerNoticias().find(
        noticia => Number(noticia.id) === Number(noticiaId)
    )
}

// Crea una noticia nueva a partir de los datos del formulario del admin
// (titulo, resumen, texto, imagen) y la deja guardada en localStorage.
export function crearNoticia({ titulo, resumen, texto, imagen }) {
    const noticiasActuales = [...(leerNoticiasGuardadas() || noticiasBase)]

    const nuevaNoticia = {
        id: noticiasActuales.length > 0
            ? Math.max(...noticiasActuales.map(noticia => Number(noticia.id))) + 1
            : 1,
        titulo,
        resumen,
        texto,
        imagen,
        fecha: new Date().toISOString().slice(0, 10)
    }

    noticiasActuales.push(nuevaNoticia)
    localStorage.setItem(CLAVE_NOTICIAS, JSON.stringify(noticiasActuales))

    return obtenerNoticias()
}

// Elimina una noticia por id. Si no queda ninguna, se vuelve al catálogo base
// en vez de dejar la seccion de noticias vacia.
export function eliminarNoticia(noticiaId) {
    const noticiasActuales = (leerNoticiasGuardadas() || noticiasBase).filter(
        noticia => Number(noticia.id) !== Number(noticiaId)
    )

    if (noticiasActuales.length === 0) {
        return restablecerNoticias()
    }

    localStorage.setItem(CLAVE_NOTICIAS, JSON.stringify(noticiasActuales))
    return obtenerNoticias()
}

// Formatea "2026-09-03" como "Publicado el 03 de septiembre, 2026".
export function formatearFecha(fechaISO) {
    const fecha = new Date(`${fechaISO}T00:00:00`)
    if (Number.isNaN(fecha.getTime())) return ""

    const formateada = fecha.toLocaleDateString("es-CL", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    })

    return `Publicado el ${formateada}`
}