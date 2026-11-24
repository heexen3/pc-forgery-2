import { apiHabilitada, peticion, usuarioDesdeApi } from "../../utils/api.js"

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

    // Con backend: PUT /api/usuarios/{id} sobre la propia cuenta (devuelve una promesa)
    if (apiHabilitada()) {
        return peticion(`/usuarios/${usuarioActual.id}`, {
            metodo: "PUT",
            cuerpo: {
                nombre: nombre.trim(),
                usuario: usuarioActual.usuario,
                email: correo.trim(),
                rol: usuarioActual.rol
            }
        })
            .then(actualizado => {
                localStorage.setItem("usuarioActual", JSON.stringify(usuarioDesdeApi(actualizado)))
                return { correcto: true, mensaje: "Perfil actualizado correctamente." }
            })
            .catch(error => ({ correcto: false, mensaje: error.message }))
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