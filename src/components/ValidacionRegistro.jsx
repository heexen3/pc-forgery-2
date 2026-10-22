



function ValidacionRegistro(event, navigate) {
    event.preventDefault()

    const usuario = event.target.usuario.value
    const email = event.target.email.value
    const password = event.target.password.value
    const confirmPassword = event.target.confirm_password.value

    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.-]).{6,}$/

    const regexEmail = /^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com|duocuc\.cl)$/

    const regexUsuario = /^(?=.*[a-zA-Z])[a-zA-Z0-9]{3,}$/

    if (!regexPassword.test(password)) {
        alert("La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula, un número y un carácter especial.")
        return
    }

    if (!regexEmail.test(email)) {
        alert("El correo debe ser Gmail, Outlook o Duoc UC.")
        return
    }

    if (!regexUsuario.test(usuario)) {
        alert("El usuario debe tener al menos 3 caracteres, contener al menos una letra y no tener caracteres especiales.")
        return
    }

    if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden.")
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
        alert("El nombre de usuario ya está registrado.")
        return
    }

    listaUsuarios.push(usuarios)

    localStorage.setItem(
        "usuarios",
        JSON.stringify(listaUsuarios)
    )

    alert("¡Usuario registrado con éxito!")

    navigate("/Login")
}

export default ValidacionRegistro