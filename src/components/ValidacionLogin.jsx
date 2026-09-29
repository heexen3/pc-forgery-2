


function ValidacionLogin(event, navigate) {
    event.preventDefault()

    const identificador = event.target.usuario.value.trim()
    const password = event.target.password.value.trim()

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
        alert("No se encontró ningún usuario registrado, por favor, regístrese primero.")
        return
    }
    
    const usuarioEncontrado = usuariosGuardados.find(function(usuario){
        return usuario.email === identificador ||
               usuario.usuario === identificador
    })

    if (!usuarioEncontrado) {
        alert("Usuario o correo no encontrado.")
        return 
    }

    const passwordValida =
        password === usuarioEncontrado.password
    
        if (!passwordValida) {
            alert("Usuario o contraseña incorrectos, por favor, inténtelo de nuevo.")
            return
        }
    
    localStorage.setItem(
        "usuarioActual",
        JSON.stringify(usuarioEncontrado)
    )

    alert("Iniciando sesión como: "+usuarioEncontrado.rol)

    if (usuarioEncontrado.rol === "admin") {
        navigate("/Admin")
    } else if (usuarioEncontrado.rol === "usuario") {
        navigate("/Home")
    } else {
        alert("Rol de usuario desconocido, por favor, contacte al administrador.")
    }
}

export default ValidacionLogin