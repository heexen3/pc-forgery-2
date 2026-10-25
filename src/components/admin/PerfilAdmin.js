export function obtenerPerfilAdmin() {
    return JSON.parse(localStorage.getItem("usuarioActual"))
}

export function guardarPerfilAdmin(nombre, correo) {
    const usuarioActual = obtenerPerfilAdmin()

    if (!usuarioActual) {
        return {
            correcto: false,
            mensaje: "No se encontró una sesión activa."
        }
    }

    const usuarios = JSON.parse(
        localStorage.getItem("usuarios")
    ) || []

    const correoActual = usuarioActual.correo || usuarioActual.email

    const correoExiste = usuarios.some(
        usuario =>
            (usuario.correo || usuario.email)?.toLowerCase() === correo.trim().toLowerCase() &&
            (usuario.correo || usuario.email)?.toLowerCase() !== correoActual?.toLowerCase()
    )

    if (correoExiste) {
        return {
            correcto: false,
            mensaje: "Ese correo ya pertenece a otro usuario."
        }
    }

    const usuarioActualizado = {
        ...usuarioActual,
        nombre: nombre.trim(),
        correo: correo.trim()
    }

    const usuariosActualizados = usuarios.map(usuario =>
        (usuario.correo || usuario.email) === correoActual
            ? {
                ...usuario,
                nombre: nombre.trim(),
                correo: correo.trim()
            }
            : usuario
    )

    localStorage.setItem(
        "usuarios",
        JSON.stringify(usuariosActualizados)
    )

    localStorage.setItem(
        "usuarioActual",
        JSON.stringify(usuarioActualizado)
    )

    return {
        correcto: true,
        mensaje: "Perfil actualizado correctamente."
    }
}