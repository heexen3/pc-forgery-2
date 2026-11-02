// Utilidades del "escritorio" retro: barra de tareas y pantalla de arranque

// Accesos del menú Inicio
export const PROGRAMAS = [
    { ruta: "/", etiqueta: "Escritorio", icono: "/computer.png" },
    { ruta: "/Shop", etiqueta: "Tienda", icono: "/shopping-bag.svg" },
    { ruta: "/arma-tu-pc", etiqueta: "Arma tu PC", icono: "/tools.png" },
    { ruta: "/Usuario", etiqueta: "Mi Perfil", icono: "/computer2.png" },
    { ruta: "/noticias", etiqueta: "Noticias", icono: "/net.png" },
    { ruta: "/comunidad", etiqueta: "Comunidad", icono: "/group.png" },
    { ruta: "/nosotros", etiqueta: "Quiénes somos", icono: "/computer2.png" },
    { ruta: "/Carrito", etiqueta: "Carrito", icono: "/carrito-retro.svg" },
    { ruta: "/MisCompras", etiqueta: "Mis compras", icono: "/category-icon.svg" },
    { ruta: "/contacto", etiqueta: "Contacto", icono: "/help.png" }
]

// Íconos del escritorio (Home). Reemplazan al menú de navegación en esa página.
export const ICONOS_ESCRITORIO = [
    { ruta: "/Shop", etiqueta: "Tienda", icono: "/shopping-bag.svg" },
    { ruta: "/arma-tu-pc", etiqueta: "Arma tu PC", icono: "/tools.png" },
    { ruta: "/noticias", etiqueta: "Noticias", icono: "/net.png" },
    { ruta: "/comunidad", etiqueta: "Comunidad", icono: "/group.png" },
    { ruta: "/nosotros", etiqueta: "Quiénes Somos", icono: "/computer2.png" },
    { ruta: "/Carrito", etiqueta: "Carrito", icono: "/carrito-retro.svg" },
    { ruta: "/contacto", etiqueta: "Contacto", icono: "/help.png" }
]

// El Home se muestra como escritorio (sin el menú de navegación superior)
export function esRutaEscritorio(ruta) {
    const minuscula = ruta.toLowerCase().replace(/\/+$/, "")
    return minuscula === "" || minuscula === "/home"
}

// Nombre de la "ventana" activa según la ruta actual
export function ventanaActiva(ruta) {
    const minuscula = ruta.toLowerCase()
    if (minuscula.startsWith("/shop") || minuscula.startsWith("/producto")) return "Tienda - Explorador"
    if (minuscula.startsWith("/arma-tu-pc")) return "Asistente Arma tu PC"
    if (minuscula.startsWith("/usuario")) return "Perfil de usuario"
    if (minuscula.startsWith("/noticias")) return "Noticias - Internet Explorer"
    if (minuscula.startsWith("/comunidad")) return "Comunidad - Outlook Express"
    if (minuscula.startsWith("/carrito")) return "Carrito de compras"
    if (minuscula.startsWith("/boleta")) return "Visor de documentos"
    if (minuscula.startsWith("/miscompras")) return "Mis compras"
    if (minuscula.startsWith("/admin")) return "Panel de control"
    if (minuscula.startsWith("/login") || minuscula.startsWith("/register")) return "Iniciar sesión"
    if (minuscula.startsWith("/contacto")) return "Contacto"
    if (minuscula.startsWith("/nosotros")) return "Propiedades de PC Forgery"
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
