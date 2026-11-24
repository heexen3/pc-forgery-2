import { mostrarAlerta } from "./dialogo/Dialogo.js"
import { iniciarSesionApi, obtenerUsuarios } from "../data/usuariosData.js"
import { apiHabilitada } from "../utils/api.js"

function ValidacionLogin(event, navigate) {
    event.preventDefault()

    const identificador = event.target.elements.usuario.value.trim()
    const password = event.target.elements.password.value.trim()

    // Con backend: auth-service valida la contraseña (BCrypt) y entrega el JWT + refresh token
    if (apiHabilitada()) {
        if (!identificador || !password) {
            mostrarAlerta("Ingresa tu correo o nombre de usuario y tu contraseña.", { icono: "advertencia" })
            return
        }
        iniciarSesionApi(identificador, password)
            .then(usuario => {
                mostrarAlerta("Iniciando sesión como: " + usuario.rol)
                navigate(usuario.rol === "admin" ? "/Admin" : "/Home")
            })
            .catch(error => mostrarAlerta(error.message, { icono: "advertencia" }))
        return
    }

    const usuariosGuardados = obtenerUsuarios()

    if (usuariosGuardados.length === 0) {
        mostrarAlerta("No se encontró ningún usuario registrado, por favor, regístrese primero.", { icono: "advertencia" })
        return
    }
    
    const usuarioEncontrado = usuariosGuardados.find(function(usuario){
        return usuario.email === identificador ||
               usuario.correo === identificador ||
               usuario.usuario === identificador
    })

    if (!usuarioEncontrado) {
        mostrarAlerta("Usuario o correo no encontrado.", { icono: "advertencia" })
        return 
    }

    const passwordValida =
        password === usuarioEncontrado.password ||
        password === usuarioEncontrado.contrasena
    
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
