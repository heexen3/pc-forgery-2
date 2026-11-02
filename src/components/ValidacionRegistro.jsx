import { mostrarAlerta } from "./dialogo/Dialogo.js"




function ValidacionRegistro(event, navigate) {
    event.preventDefault()

    const usuario = event.target.elements["usuario"].value
    const email = event.target.elements["email"].value
    const password = event.target.elements["password"].value
    const confirmPassword = event.target.elements["confirm_password"].value

    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.-]).{6,}$/

    const regexEmail = /^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com|duocuc\.cl)$/

    const regexUsuario = /^(?=.*[a-zA-Z])[a-zA-Z0-9]{3,}$/

    if (!regexPassword.test(password)) {
        mostrarAlerta("La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula, un número y un carácter especial.", { icono: "advertencia" })
        return
    }

    if (!regexEmail.test(email)) {
        mostrarAlerta("El correo debe ser Gmail, Outlook o Duoc UC.", { icono: "advertencia" })
        return
    }

    if (!regexUsuario.test(usuario)) {
        mostrarAlerta("El usuario debe tener al menos 3 caracteres, contener al menos una letra y no tener caracteres especiales.", { icono: "advertencia" })
        return
    }

    if (password !== confirmPassword) {
        mostrarAlerta("Las contraseñas no coinciden.", { icono: "advertencia" })
        return
    }

    const usuarios = {
        usuario: usuario,
        email: email,
        password: password,
        rol: "usuario"
    }

    const listaUsuarios =
    JSON.parse(localStorage.getItem("usuarios")) || []

    const usuarioExiste = listaUsuarios.some(function(usuarioRegistrado) {
        return usuarioRegistrado.usuario === usuario
    })

    if (usuarioExiste) {
        mostrarAlerta("El nombre de usuario ya está registrado.", { icono: "advertencia" })
        return
    }

    listaUsuarios.push(usuarios)

    localStorage.setItem(
        "usuarios",
        JSON.stringify(listaUsuarios)
    )

    mostrarAlerta("¡Usuario registrado con éxito!")

    navigate("/Login")
}

export default ValidacionRegistro