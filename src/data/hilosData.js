// Hilos base de la comunidad (se cargan solo la primera vez que se ejecuta la app).
// Si ya existen hilos en localStorage ("hilos"), se respetan esos datos.

export const CLAVE_HILOS = "hilos"
export const CLAVE_VERSION_HILOS = "hilosVersion"
export const VERSION_HILOS = 1

export const hilosBase = [
    {
        id: "semilla-1",
        titulo: "¿Vale la pena la RTX 4060 para jugar en 1080p?",
        autor: "camila_gamer",
        categoria: "Tarjetas de video",
        mensaje: "Estoy armando mi primer PC y dudo entre la RTX 4060 y la RX 7600. Juego sobre todo en 1080p a 144 Hz. ¿Qué me recomiendan?",
        fecha: "2026-10-27T21:15:00.000Z",
        ultimaActividad: "2026-10-29T14:40:00.000Z",
        respuestas: [
            { id: "semilla-1-r1", autor: "tomas.hw", texto: "Para 1080p la 4060 va sobrada y consume poco. Si juegas con DLSS, mejor aún.", fecha: "2026-10-27T22:02:00.000Z" },
            { id: "semilla-1-r2", autor: "valeria_pc", texto: "La RX 7600 es más barata y rinde parecido en rasterización. Revisa precios.", fecha: "2026-10-28T00:30:00.000Z" },
            { id: "semilla-1-r3", autor: "nico_overclock", texto: "Ojo con los 8 GB de VRAM, algunos juegos nuevos ya piden más en ultra.", fecha: "2026-10-28T13:10:00.000Z" },
            { id: "semilla-1-r4", autor: "camila_gamer", texto: "Gracias a todos, creo que me voy por la 4060 por el consumo.", fecha: "2026-10-28T18:45:00.000Z" },
            { id: "semilla-1-r5", autor: "fran_build", texto: "Buena elección. Acompáñala con una fuente de 550 W certificada.", fecha: "2026-10-29T10:20:00.000Z" },
            { id: "semilla-1-r6", autor: "tomas.hw", texto: "Y actualiza los drivers apenas la instales 😉", fecha: "2026-10-29T14:40:00.000Z" }
        ]
    },
    {
        id: "semilla-2",
        titulo: "Mi PC no da video después de cambiar la RAM",
        autor: "diego_rojas",
        categoria: "Soporte técnico",
        mensaje: "Le puse 2x16 GB DDR4 3200 y ahora prende pero no da imagen. Con la RAM antigua funciona. Placa B450.",
        fecha: "2026-10-26T16:05:00.000Z",
        ultimaActividad: "2026-10-27T11:30:00.000Z",
        respuestas: [
            { id: "semilla-2-r1", autor: "valeria_pc", texto: "Prueba con un solo módulo en el slot A2 y actualiza la BIOS, las B450 antiguas fallan con kits nuevos.", fecha: "2026-10-26T17:20:00.000Z" },
            { id: "semilla-2-r2", autor: "nico_overclock", texto: "También puede ser el XMP. Resetea el CMOS y deja la RAM a 2400 para probar.", fecha: "2026-10-26T19:48:00.000Z" },
            { id: "semilla-2-r3", autor: "diego_rojas", texto: "Era la BIOS. Actualicé con la RAM vieja y ahora funcionan las nuevas. ¡Gracias!", fecha: "2026-10-27T09:15:00.000Z" },
            { id: "semilla-2-r4", autor: "fran_build", texto: "Clásico de las B450. Bueno que lo solucionaste.", fecha: "2026-10-27T11:30:00.000Z" }
        ]
    },
    {
        id: "semilla-3",
        titulo: "Ryzen 5 7600 vs Intel i5-13400F para un PC de estudio y juegos",
        autor: "javiera.m",
        categoria: "Procesadores",
        mensaje: "Necesito un PC para la universidad (programación) y jugar un poco. ¿Cuál conviene más pensando en actualizar en el futuro?",
        fecha: "2026-10-24T13:30:00.000Z",
        ultimaActividad: "2026-10-25T08:10:00.000Z",
        respuestas: [
            { id: "semilla-3-r1", autor: "tomas.hw", texto: "El Ryzen en AM5 te deja cambiar de procesador más adelante sin cambiar la placa.", fecha: "2026-10-24T15:00:00.000Z" },
            { id: "semilla-3-r2", autor: "camila_gamer", texto: "El i5 sale más barato con placas DDR4. Depende de tu presupuesto total.", fecha: "2026-10-25T08:10:00.000Z" }
        ]
    },
    {
        id: "semilla-4",
        titulo: "¿Qué pasta térmica recomiendan?",
        autor: "fran_build",
        categoria: "Refrigeración",
        mensaje: "Voy a cambiar la pasta de mi procesador después de dos años. ¿Alguna marca que valga la pena en Chile?",
        fecha: "2026-10-22T19:45:00.000Z",
        ultimaActividad: "2026-10-23T10:05:00.000Z",
        respuestas: [
            { id: "semilla-4-r1", autor: "nico_overclock", texto: "Arctic MX-4 o MX-6, fáciles de encontrar y rinden muy bien por su precio.", fecha: "2026-10-23T10:05:00.000Z" }
        ]
    },
    {
        id: "semilla-5",
        titulo: "Mi primer armado: Ryzen 5 5600 + RX 6600, ¿comentarios?",
        autor: "benja_retro",
        categoria: "Armados",
        mensaje: "Les dejo la lista: Ryzen 5 5600, B550M, 16 GB DDR4 3600, RX 6600, SSD NVMe 1 TB y fuente 600 W 80+ Bronze. ¿Algo que cambiarían?",
        fecha: "2026-10-20T23:10:00.000Z",
        ultimaActividad: "2026-10-20T23:10:00.000Z",
        respuestas: []
    }
]

export function leerHilosGuardados() {
    try {
        const json = localStorage.getItem(CLAVE_HILOS)
        if (json === null) return null
        const parseado = JSON.parse(json)
        return Array.isArray(parseado) ? parseado : null
    } catch {
        return null
    }
}

// Carga los hilos base solo si nunca se han guardado hilos (primera ejecución).
// Nunca sobrescribe datos existentes, aunque estén vacíos o dañados.
export function inicializarHilos() {
    if (localStorage.getItem(CLAVE_HILOS) !== null) {
        return leerHilosGuardados() || []
    }
    localStorage.setItem(CLAVE_HILOS, JSON.stringify(hilosBase))
    localStorage.setItem(CLAVE_VERSION_HILOS, String(VERSION_HILOS))
    return hilosBase
}

// Los "cantidad" hilos más recientes (por fecha de publicación).
// Pensado para poder cambiar el criterio más adelante (por ejemplo, los más votados).
export function obtenerHilosRecientes(cantidad = 3) {
    const hilos = leerHilosGuardados() || []
    return [...hilos]
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, cantidad)
}
