// Utilidades para el RUT chileno (validación con dígito verificador, módulo 11)

// Deja solo números y la K, en mayúscula: "12.345.678-k" -> "12345678K"
export function limpiarRut(rut) {
    return String(rut ?? "").replace(/[^0-9kK]/g, "").toUpperCase()
}

// Calcula el dígito verificador de un cuerpo numérico ("12345678" -> "5")
export function calcularDv(cuerpo) {
    let suma = 0
    let multiplicador = 2
    for (let i = String(cuerpo).length - 1; i >= 0; i--) {
        suma += Number(String(cuerpo)[i]) * multiplicador
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1
    }
    const resto = 11 - (suma % 11)
    if (resto === 11) return "0"
    if (resto === 10) return "K"
    return String(resto)
}

export function validarRut(rut) {
    const limpio = limpiarRut(rut)
    if (!/^\d{7,8}[0-9K]$/.test(limpio)) {
        return false
    }
    const cuerpo = limpio.slice(0, -1)
    const dv = limpio.slice(-1)
    return calcularDv(cuerpo) === dv
}

// "123456785" -> "12.345.678-5"
export function formatearRut(rut) {
    const limpio = limpiarRut(rut)
    if (limpio.length < 2) {
        return limpio
    }
    const cuerpo = limpio.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    return `${cuerpo}-${limpio.slice(-1)}`
}
