// Usuarios base del sistema (administrador y cliente iniciales).
// Si ya existen usuarios en localStorage ("usuarios"), se respetan esos datos.

export const CLAVE_USUARIOS = "usuarios"
export const CLAVE_VERSION_USUARIOS = "usuariosVersion"
export const VERSION_USUARIOS = 1

export const usuariosBase = [
    {
        nombre: "Administrador",
        usuario: "admin",
        email: "admin@admin.com",
        correo: "admin@admin.com",
        password: "admin123",
        contrasena: "admin123",
        rol: "admin"
    },
    {
        nombre: "Cliente Ejemplo",
        usuario: "cliente",
        email: "cliente@duocuc.cl",
        correo: "cliente@duocuc.cl",
        password: "Cliente.123",
        contrasena: "Cliente.123",
        rol: "usuario"
    }
]

export function leerUsuariosGuardados() {
    try {
        const json = localStorage.getItem(CLAVE_USUARIOS)
        if (!json) return null
        const parseado = JSON.parse(json)
        return Array.isArray(parseado) ? parseado : null
    } catch {
        return null
    }
}

export function obtenerUsuarios() {
    const usuariosGuardados = leerUsuariosGuardados()
    if (!usuariosGuardados) {
        localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuariosBase))
        localStorage.setItem(CLAVE_VERSION_USUARIOS, String(VERSION_USUARIOS))
        return usuariosBase
    }
    return usuariosGuardados
}

export function inicializarUsuarios() {
    const usuariosGuardados = leerUsuariosGuardados()
    if (!usuariosGuardados || usuariosGuardados.length === 0) {
        localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuariosBase))
        localStorage.setItem(CLAVE_VERSION_USUARIOS, String(VERSION_USUARIOS))
        return usuariosBase
    }
    return usuariosGuardados
}

export function guardarUsuarios(usuarios) {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios))
}

export function restablecerUsuarios() {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuariosBase))
    localStorage.setItem(CLAVE_VERSION_USUARIOS, String(VERSION_USUARIOS))
    return usuariosBase
}

