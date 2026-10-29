// Utilidades del "escritorio" retro: barra de tareas y pantalla de arranque

// Accesos del menú Inicio
export const PROGRAMAS = [
    { ruta: "/", etiqueta: "Escritorio", icono: "/computer.png" },
    { ruta: "/Shop", etiqueta: "Tienda", icono: "/shopping-bag.svg" },
    { ruta: "/arma-tu-pc", etiqueta: "Arma tu PC", icono: "/tools.png" },
    { ruta: "/noticias", etiqueta: "Noticias", icono: "/net.png" },
    { ruta: "/comunidad", etiqueta: "Comunidad", icono: "/group.png" },
    { ruta: "/Carrito", etiqueta: "Carrito", icono: "/shopping-bag.svg" },
    { ruta: "/MisCompras", etiqueta: "Mis compras", icono: "/category-icon.svg" },
    { ruta: "/contacto", etiqueta: "Contacto", icono: "/help.png" }
]

// Nombre de la "ventana" activa según la ruta actual
export function ventanaActiva(ruta) {
    const minuscula = ruta.toLowerCase()
    if (minuscula.startsWith("/shop") || minuscula.startsWith("/producto")) return "Tienda - Explorador"
    if (minuscula.startsWith("/arma-tu-pc")) return "Asistente Arma tu PC"
    if (minuscula.startsWith("/noticias")) return "Noticias - Internet Explorer"
    if (minuscula.startsWith("/comunidad")) return "Comunidad - Outlook Express"
    if (minuscula.startsWith("/carrito")) return "Carrito de compras"
    if (minuscula.startsWith("/boleta")) return "Visor de documentos"
    if (minuscula.startsWith("/miscompras")) return "Mis compras"
    if (minuscula.startsWith("/admin")) return "Panel de control"
    if (minuscula.startsWith("/login") || minuscula.startsWith("/register")) return "Iniciar sesión"
    if (minuscula.startsWith("/contacto")) return "Contacto"
    return "Escritorio PC Forgery"
}

export const CLAVE_ARRANQUE = "arranqueMostrado"
export const DURACION_ARRANQUE_MS = 2200

// La pantalla de inicio se muestra una vez por sesión y nunca en pruebas
export function debeMostrarArranque() {
    if (import.meta.env.MODE === "test") return false
    try {
        return sessionStorage.getItem(CLAVE_ARRANQUE) !== "1"
    } catch {
        return false
    }
}
