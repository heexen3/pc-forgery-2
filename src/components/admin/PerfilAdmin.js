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

    const correoExiste = usuarios.some(
        usuario =>
            usuario.correo?.toLowerCase() === correo.trim().toLowerCase() &&
            usuario.correo !== usuarioActual.correo
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
        usuario.correo === usuarioActual.correo
            ? { ...usuario, nombre: nombre.trim(), correo: correo.trim() }
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