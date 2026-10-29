// Devuelve la ruta correcta para un archivo de la carpeta public/.
// En GitHub Pages el sitio vive en un subdirectorio (/pc-forgery-2/), así que una
// ruta absoluta como "/corsair.jpg" apuntaría a la raíz del dominio y fallaría.
// Esta función antepone import.meta.env.BASE_URL y es idempotente: si la ruta ya
// trae la base, o es una URL externa (http, https, data, blob), se deja igual.
// También sirve para los datos antiguos guardados en localStorage ("/corsair.jpg").
export function rutaPublica(ruta) {
    if (!ruta || typeof ruta !== "string") return ruta
    if (/^(https?:|data:|blob:|\/\/)/i.test(ruta)) return ruta

    const base = import.meta.env.BASE_URL || "/"
    if (base !== "/" && ruta.startsWith(base)) return ruta

    const limpia = ruta.replace(/^\.?\/+/, "")
    return base.endsWith("/") ? base + limpia : base + "/" + limpia
}

export default rutaPublica
