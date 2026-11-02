import { mostrarAlerta } from "./dialogo/Dialogo.js"
function ValidacionLogin(event, navigate) {
    event.preventDefault()

    const identificador = event.target.elements.usuario.value.trim()
    const password = event.target.elements.password.value.trim()

    const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios")) || []

    const adminExiste = usuariosGuardados.some(function(usuario) {
    return usuario.usuario === "admin"})
    
    if (!adminExiste) {
        usuariosGuardados.push({
            usuario: "admin",
            email: "admin@admin.com",
            password: "admin123",
            rol: "admin"
        })
    
        localStorage.setItem(
            "usuarios",
            JSON.stringify(usuariosGuardados)
        )
    }

    if (usuariosGuardados.length === 0) {
        mostrarAlerta("No se encontró ningún usuario registrado, por favor, regístrese primero.", { icono: "advertencia" })
        return
    }
    
    const usuarioEncontrado = usuariosGuardados.find(function(usuario){
        return usuario.email === identificador ||
               usuario.usuario === identificador
    })

    if (!usuarioEncontrado) {
        mostrarAlerta("Usuario o correo no encontrado.", { icono: "advertencia" })
        return 
    }

    const passwordValida =
        password === usuarioEncontrado.password
    
        if (!passwordValida) {
            mostrarAlerta("Usuario o contraseña incorrectos, por favor, inténtelo de nuevo.", { icono: "advertencia" })
            return
        }
    
    localStorage.setItem(
        "usuarioActual",
        JSON.stringify(usuarioEncontrado)
    )

    mostrarAlerta("Iniciando sesión como: "+usuarioEncontrado.rol)

    if (usuarioEncontrado.rol === "admin") {
        navigate("/Admin")
    } else if (usuarioEncontrado.rol === "usuario") {
        navigate("/Home")
    } else {
        mostrarAlerta("Rol de usuario desconocido, por favor, contacte al administrador.", { icono: "advertencia" })
    }
}

export default ValidacionLogin