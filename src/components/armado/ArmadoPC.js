// Lógica del asistente "Arma tu PC" (portada de JS/buildpc.js) - RF-07 y RF-08

// Secuencia de pasos del asistente
export const PASOS = [
    { key: "plataforma", label: "Plataforma" },
    { key: "procesadores", label: "1. CPU" },
    { key: "placas", label: "2. Placa Madre" },
    { key: "ram", label: "3. RAM" },
    { key: "gpu", label: "4. GPU" },
    { key: "almacenamiento", label: "5. Disco" },
    { key: "fuentes", label: "6. Fuente" },
    { key: "gabinetes", label: "7. Gabinete" }
]

export const CATEGORIAS = PASOS.slice(1).map(paso => paso.key)

export function nombrePaso(paso) {
    return paso.label.split(". ")[1] || paso.label
}

export function seleccionVacia() {
    return {
        procesadores: null,
        placas: null,
        ram: null,
        gpu: null,
        almacenamiento: null,
        fuentes: null,
        gabinetes: null
    }
}

// Motor de compatibilidad: indica si un producto de una categoría es
// compatible con la plataforma y los componentes ya elegidos
export function comprobarCompatibilidad(categoria, item, seleccion, plataforma) {
    const s = seleccion

    // Filtro por plataforma
    if ((categoria === "procesadores" || categoria === "placas") && plataforma) {
        if (item.plataforma !== plataforma) {
            return false
        }
    }

    // CPU vs Placa (Socket)
    if (categoria === "placas" && s.procesadores && item.socket !== s.procesadores.socket) {
        return false
    }
    if (categoria === "procesadores" && s.placas && item.socket !== s.placas.socket) {
        return false
    }

    // Placa vs RAM (DDR4 / DDR5)
    if (categoria === "ram" && s.placas && item.tipo !== s.placas.tipoRam) {
        return false
    }

    // Placa vs Gabinete (Formato soportado)
    if (categoria === "gabinetes" && s.placas && !item.formatosSoportados.includes(s.placas.formato)) {
        return false
    }

    return true
}

// Devuelve el texto del conflicto encontrado o null si todo es compatible
export function detectarConflicto(seleccion) {
    const s = seleccion

    if (s.procesadores && s.placas && s.procesadores.socket !== s.placas.socket) {
        return "CPU y Placa tienen sockets diferentes."
    }
    if (s.placas && s.ram && s.placas.tipoRam !== s.ram.tipo) {
        return "La memoria RAM no coincide con la tecnología de la placa."
    }
    if (s.placas && s.gabinetes && !s.gabinetes.formatosSoportados.includes(s.placas.formato)) {
        return "El gabinete no admite el tamaño de la placa madre."
    }
    return null
}

// Cambiar la plataforma limpia CPU, placa y RAM
export function cambiarPlataforma(seleccion, plataformaActual, nuevaPlataforma) {
    if (plataformaActual === nuevaPlataforma) {
        return seleccion
    }
    return { ...seleccion, procesadores: null, placas: null, ram: null }
}

// Al elegir un componente se quitan los que dejan de ser compatibles
// (avisa si el cambio rompe la compatibilidad anterior - RF-08)
export function seleccionarComponente(seleccion, categoria, item) {
    const nuevaSeleccion = { ...seleccion, [categoria]: item }
    const removidos = []

    if (categoria === "placas") {
        if (nuevaSeleccion.ram && nuevaSeleccion.ram.tipo !== item.tipoRam) {
            removidos.push(nuevaSeleccion.ram.nombre)
            nuevaSeleccion.ram = null
        }
        if (nuevaSeleccion.gabinetes && !nuevaSeleccion.gabinetes.formatosSoportados.includes(item.formato)) {
            removidos.push(nuevaSeleccion.gabinetes.nombre)
            nuevaSeleccion.gabinetes = null
        }
    }

    return { seleccion: nuevaSeleccion, removidos }
}

export function calcularTotalArmado(seleccion) {
    return CATEGORIAS.reduce(
        (total, categoria) => total + (seleccion[categoria]?.precio || 0),
        0
    )
}

export function componentesFaltantes(seleccion) {
    return PASOS.slice(1)
        .filter(paso => !seleccion[paso.key])
        .map(paso => nombrePaso(paso))
}

// Convierte la configuración en un ítem del carrito.
// Mismo armado => mismo id, así se suma la cantidad en vez de duplicarlo.
export function crearItemArmado(seleccion, plataforma) {
    const componentes = PASOS.slice(1)
        .filter(paso => seleccion[paso.key])
        .map(paso => ({
            categoria: nombrePaso(paso),
            id: seleccion[paso.key].id,
            nombre: seleccion[paso.key].nombre,
            precio: seleccion[paso.key].precio
        }))

    return {
        id: `armado-${componentes.map(componente => componente.id).join("_")}`,
        tipo: "armado",
        nombre: `PC Armado ${plataforma || ""}`.trim(),
        precio: calcularTotalArmado(seleccion),
        imagen: "/computer.png",
        componentes
    }
}
