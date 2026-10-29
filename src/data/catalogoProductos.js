// Catálogo base de la tienda (mismos datos iniciales que usa el panel admin).
// Si el admin ya guardó productos en localStorage ("productos"), se usan esos (con su stock).
// Los precios incluyen IVA.

export const CLAVE_PRODUCTOS = "productos"
export const CLAVE_VERSION_CATALOGO = "catalogoVersion"
// Subir este número cuando se agreguen productos base nuevos, para que se
// incorporen al catálogo guardado sin perder ediciones ni stock del admin.
export const VERSION_CATALOGO = 2

// Categorías de la tienda. "valor" es lo que se guarda en el producto
// ("Perifericos" sin tilde para mantener compatibilidad con los datos antiguos).
export const CATEGORIAS = [
    { valor: "Procesadores", etiqueta: "Procesadores", icono: "/productos/cpu.svg" },
    { valor: "Placas madre", etiqueta: "Placas madre", icono: "/productos/placa.svg" },
    { valor: "Memorias RAM", etiqueta: "Memorias RAM", icono: "/productos/ram.svg" },
    { valor: "Tarjetas de video", etiqueta: "Tarjetas de video", icono: "/productos/gpu.svg" },
    { valor: "Almacenamiento", etiqueta: "Almacenamiento", icono: "/productos/disco.svg" },
    { valor: "Fuentes de poder", etiqueta: "Fuentes de poder", icono: "/productos/fuente.svg" },
    { valor: "Gabinetes", etiqueta: "Gabinetes", icono: "/productos/gabinete.svg" },
    { valor: "Perifericos", etiqueta: "Periféricos", icono: "/productos/periferico.svg" },
    { valor: "Monitores", etiqueta: "Monitores", icono: "/computer.png" },
    { valor: "Componentes", etiqueta: "Otros componentes", icono: "/tools.png" }
]

export function etiquetaCategoria(valor) {
    return CATEGORIAS.find(categoria => categoria.valor === valor)?.etiqueta || valor || "Sin categoría"
}

export const productosBase = [
    {
        id: 1,
        nombre: "Corsair K70 RGB Pro",
        categoria: "Perifericos",
        marca: "Corsair",
        precio: 129990,
        stock: 15,
        descripcion: "Teclado mecánico RGB de alto rendimiento.",
        imagen: "/corsair.jpg",
        especificaciones: {
            "Tipo": "Teclado mecánico",
            "Switches": "Cherry MX Red",
            "Iluminación": "RGB por tecla",
            "Conexión": "USB-C desmontable"
        }
    },
    {
        id: 2,
        nombre: "Razer DeathAdder V3",
        categoria: "Perifericos",
        marca: "Razer",
        precio: 69990,
        stock: 8,
        descripcion: "Mouse gamer ergonómico de alta precisión.",
        imagen: "/mouse.jpg",
        especificaciones: {
            "Tipo": "Mouse óptico",
            "Sensor": "Focus Pro 30K",
            "Peso": "59 g",
            "Conexión": "USB cableado"
        }
    },
    {
        id: 3,
        nombre: "ASUS TUF Gaming",
        categoria: "Monitores",
        marca: "ASUS",
        precio: 289990,
        stock: 3,
        descripcion: "Monitor gaming de alto rendimiento.",
        imagen: "/monitor.jpg",
        especificaciones: {
            "Tamaño": "27 pulgadas",
            "Resolución": "2560 x 1440",
            "Frecuencia": "165 Hz",
            "Panel": "IPS"
        }
    },
    {
        id: 4,
        nombre: "Samsung 990 EVO 1TB",
        categoria: "Almacenamiento",
        marca: "Samsung",
        precio: 119990,
        stock: 0,
        descripcion: "SSD NVMe de 1TB para alto rendimiento.",
        imagen: "/ssd.jpg",
        especificaciones: {
            "Capacidad": "1 TB",
            "Interfaz": "PCIe 4.0 x4 / 5.0 x2 NVMe",
            "Lectura": "5.000 MB/s",
            "Formato": "M.2 2280"
        }
    },
    {
        id: 5,
        nombre: "AMD Ryzen 5 7600X",
        categoria: "Procesadores",
        marca: "AMD",
        precio: 245000,
        stock: 10,
        descripcion: "Procesador de 6 núcleos y 12 hilos para gaming en plataforma AM5.",
        imagen: "/productos/cpu.svg",
        especificaciones: { "Socket": "AM5", "Núcleos / hilos": "6 / 12", "Frecuencia máx.": "5,3 GHz", "TDP": "105 W" }
    },
    {
        id: 6,
        nombre: "Intel Core i5-13400F",
        categoria: "Procesadores",
        marca: "Intel",
        precio: 185000,
        stock: 2,
        descripcion: "Procesador de 10 núcleos con excelente relación precio/rendimiento.",
        imagen: "/productos/cpu.svg",
        especificaciones: { "Socket": "LGA1700", "Núcleos / hilos": "10 / 16", "Frecuencia máx.": "4,6 GHz", "Gráficos integrados": "No" }
    },
    {
        id: 7,
        nombre: "AMD Ryzen 7 7800X3D",
        categoria: "Procesadores",
        marca: "AMD",
        precio: 420000,
        stock: 4,
        nuevo: true,
        descripcion: "El procesador gamer con 3D V-Cache para los FPS más altos.",
        imagen: "/productos/cpu.svg",
        especificaciones: { "Socket": "AM5", "Núcleos / hilos": "8 / 16", "Caché L3": "96 MB", "TDP": "120 W" }
    },
    {
        id: 8,
        nombre: "ASUS TUF Gaming B650-PLUS WIFI",
        categoria: "Placas madre",
        marca: "ASUS",
        precio: 215000,
        stock: 6,
        descripcion: "Placa madre ATX para AM5 con WiFi 6 y soporte DDR5.",
        imagen: "/productos/placa.svg",
        especificaciones: { "Socket": "AM5", "Chipset": "B650", "Formato": "ATX", "Memoria": "DDR5" }
    },
    {
        id: 9,
        nombre: "ASRock B760M-HDV/M.2 D4",
        categoria: "Placas madre",
        marca: "ASRock",
        precio: 115000,
        stock: 3,
        descripcion: "Placa Micro-ATX económica para Intel de 12ª/13ª generación.",
        imagen: "/productos/placa.svg",
        especificaciones: { "Socket": "LGA1700", "Chipset": "B760", "Formato": "Micro-ATX", "Memoria": "DDR4" }
    },
    {
        id: 10,
        nombre: "Kingston Fury Beast RGB 32GB DDR5",
        categoria: "Memorias RAM",
        marca: "Kingston",
        precio: 125000,
        stock: 12,
        nuevo: true,
        descripcion: "Kit de 2 x 16 GB DDR5 a 6000 MT/s con iluminación RGB.",
        imagen: "/productos/ram.svg",
        especificaciones: { "Capacidad": "32 GB (2 x 16 GB)", "Tipo": "DDR5", "Velocidad": "6000 MT/s", "Latencia": "CL36" }
    },
    {
        id: 11,
        nombre: "Corsair Vengeance LPX 16GB DDR4",
        categoria: "Memorias RAM",
        marca: "Corsair",
        precio: 45000,
        stock: 20,
        descripcion: "Kit de 2 x 8 GB DDR4 a 3200 MHz de perfil bajo.",
        imagen: "/productos/ram.svg",
        especificaciones: { "Capacidad": "16 GB (2 x 8 GB)", "Tipo": "DDR4", "Velocidad": "3200 MHz", "Latencia": "CL16" }
    },
    {
        id: 12,
        nombre: "MSI GeForce RTX 4060 Ventus 2X",
        categoria: "Tarjetas de video",
        marca: "MSI",
        precio: 340000,
        stock: 5,
        descripcion: "Tarjeta de video para jugar en 1080p con DLSS 3.",
        imagen: "/productos/gpu.svg",
        especificaciones: { "Memoria": "8 GB GDDR6", "Consumo": "115 W", "Largo": "199 mm", "Fuente recomendada": "550 W" }
    },
    {
        id: 13,
        nombre: "ASUS Dual GeForce RTX 4070 SUPER",
        categoria: "Tarjetas de video",
        marca: "ASUS",
        precio: 690000,
        stock: 1,
        nuevo: true,
        descripcion: "Rendimiento 1440p con trazado de rayos y DLSS 3.",
        imagen: "/productos/gpu.svg",
        especificaciones: { "Memoria": "12 GB GDDR6X", "Consumo": "220 W", "Largo": "267 mm", "Fuente recomendada": "650 W" }
    },
    {
        id: 14,
        nombre: "Sapphire Pulse AMD Radeon RX 7700 XT",
        categoria: "Tarjetas de video",
        marca: "Sapphire",
        precio: 485000,
        stock: 0,
        descripcion: "Tarjeta AMD con 12 GB para 1440p a alta tasa de cuadros.",
        imagen: "/productos/gpu.svg",
        especificaciones: { "Memoria": "12 GB GDDR6", "Consumo": "245 W", "Largo": "280 mm", "Fuente recomendada": "700 W" }
    },
    {
        id: 15,
        nombre: "Kingston NV2 1TB PCIe 4.0 NVMe",
        categoria: "Almacenamiento",
        marca: "Kingston",
        precio: 62000,
        stock: 25,
        descripcion: "SSD NVMe de 1 TB, ideal como disco principal.",
        imagen: "/productos/disco.svg",
        especificaciones: { "Capacidad": "1 TB", "Interfaz": "PCIe 4.0 NVMe", "Lectura": "3.500 MB/s", "Formato": "M.2 2280" }
    },
    {
        id: 16,
        nombre: "WD_BLACK SN850X 2TB PCIe 4.0 NVMe",
        categoria: "Almacenamiento",
        marca: "Western Digital",
        precio: 165000,
        stock: 7,
        nuevo: true,
        descripcion: "SSD de alto rendimiento para juegos y edición de video.",
        imagen: "/productos/disco.svg",
        especificaciones: { "Capacidad": "2 TB", "Interfaz": "PCIe 4.0 NVMe", "Lectura": "7.300 MB/s", "Formato": "M.2 2280" }
    },
    {
        id: 17,
        nombre: "Corsair CV650 650W 80+ Bronze",
        categoria: "Fuentes de poder",
        marca: "Corsair",
        precio: 58000,
        stock: 9,
        descripcion: "Fuente de poder confiable para equipos de gama media.",
        imagen: "/productos/fuente.svg",
        especificaciones: { "Potencia": "650 W", "Certificación": "80 Plus Bronze", "Modular": "No" }
    },
    {
        id: 18,
        nombre: "MSI MAG A850GL 850W 80+ Gold PCIe 5.0",
        categoria: "Fuentes de poder",
        marca: "MSI",
        precio: 125000,
        stock: 2,
        nuevo: true,
        descripcion: "Fuente modular con conector 12VHPWR para tarjetas de última generación.",
        imagen: "/productos/fuente.svg",
        especificaciones: { "Potencia": "850 W", "Certificación": "80 Plus Gold", "Modular": "Sí" }
    },
    {
        id: 19,
        nombre: "NZXT H5 Flow Compact Mid Tower",
        categoria: "Gabinetes",
        marca: "NZXT",
        precio: 92000,
        stock: 4,
        descripcion: "Gabinete con excelente flujo de aire y panel de vidrio templado.",
        imagen: "/productos/gabinete.svg",
        especificaciones: { "Formato": "Mid Tower", "Placas": "ATX / Micro-ATX / Mini-ITX", "GPU máx.": "365 mm" }
    },
    {
        id: 20,
        nombre: "Cooler Master MasterBox Q300L Mini Tower",
        categoria: "Gabinetes",
        marca: "Cooler Master",
        precio: 46000,
        stock: 0,
        descripcion: "Gabinete compacto Micro-ATX con filtros magnéticos.",
        imagen: "/productos/gabinete.svg",
        especificaciones: { "Formato": "Mini Tower", "Placas": "Micro-ATX / Mini-ITX", "GPU máx.": "360 mm" }
    },
    {
        id: 21,
        nombre: "HyperX Cloud II",
        categoria: "Perifericos",
        marca: "HyperX",
        precio: 79990,
        stock: 11,
        descripcion: "Audífonos gamer con sonido envolvente 7.1 virtual.",
        imagen: "/productos/periferico.svg",
        especificaciones: { "Tipo": "Audífonos", "Sonido": "7.1 virtual", "Conexión": "USB / 3,5 mm" }
    },
    {
        id: 22,
        nombre: "Logitech G Pro X Superlight 2",
        categoria: "Perifericos",
        marca: "Logitech",
        precio: 149990,
        stock: 3,
        nuevo: true,
        descripcion: "Mouse inalámbrico ultraliviano para competitivo.",
        imagen: "/productos/periferico.svg",
        especificaciones: { "Tipo": "Mouse inalámbrico", "Peso": "60 g", "Sensor": "HERO 2" }
    }
]

function leerProductosGuardados() {
    try {
        const productosGuardados = JSON.parse(localStorage.getItem(CLAVE_PRODUCTOS))
        return Array.isArray(productosGuardados) ? productosGuardados : null
    } catch {
        // si el JSON está corrupto se usa el catálogo base
        return null
    }
}

// Incorpora al catálogo guardado los productos base que aún no existen (por nombre)
// y completa los campos nuevos (especificaciones, marca, nuevo) de los que ya existen,
// sin pisar precio, stock ni datos editados por el admin.
export function migrarCatalogo(productosGuardados) {
    const nombres = new Map(productosGuardados.map(producto => [producto.nombre, producto]))
    const idsUsados = new Set(productosGuardados.map(producto => Number(producto.id)))
    let maximoId = Math.max(0, ...idsUsados)

    const actualizados = productosGuardados.map(producto => {
        const base = productosBase.find(item => item.nombre === producto.nombre)
        return base ? { ...base, ...producto } : producto
    })

    productosBase.forEach(base => {
        if (nombres.has(base.nombre)) return
        let id = base.id
        if (idsUsados.has(id)) {
            maximoId += 1
            id = maximoId
        }
        idsUsados.add(id)
        maximoId = Math.max(maximoId, id)
        actualizados.push({ ...base, id })
    })

    return actualizados
}

export function obtenerProductos() {
    const productosGuardados = leerProductosGuardados()
    if (!productosGuardados) {
        return productosBase
    }

    if (Number(localStorage.getItem(CLAVE_VERSION_CATALOGO)) < VERSION_CATALOGO) {
        const migrados = migrarCatalogo(productosGuardados)
        localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(migrados))
        localStorage.setItem(CLAVE_VERSION_CATALOGO, String(VERSION_CATALOGO))
        return migrados
    }

    return productosGuardados
}

// Usado por el panel admin: garantiza que el catálogo quede guardado en localStorage.
export function inicializarCatalogo() {
    const productos = obtenerProductos()
    localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(productos))
    localStorage.setItem(CLAVE_VERSION_CATALOGO, String(VERSION_CATALOGO))
    localStorage.setItem("productosInicialesCargados", "true")
    return productos
}

// Restablece el catálogo base (cuando el admin elimina todos los productos).
export function restablecerCatalogo() {
    localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(productosBase))
    localStorage.setItem(CLAVE_VERSION_CATALOGO, String(VERSION_CATALOGO))
    localStorage.setItem("productosInicialesCargados", "true")
    return productosBase
}

export function obtenerProducto(productoId) {
    return obtenerProductos().find(
        producto => Number(producto.id) === Number(productoId)
    )
}

// Devuelve el stock disponible de un producto de la tienda.
// Si el producto no está en el catálogo (o no tiene stock definido) no se limita.
export function obtenerStock(productoId) {
    const producto = obtenerProducto(productoId)

    if (!producto || producto.stock === undefined || producto.stock === null) {
        return Infinity
    }

    return Number(producto.stock)
}
