import { useState } from "react"

function NuevoUsuario() {
    const [nombre, setNombre] = useState("")
    const [correo, setCorreo] = useState("")
    const [contrasena, setContrasena] = useState("")
    const [rol, setRol] = useState("usuario")

    function registrarUsuario(e) {
        e.preventDefault()

        const usuariosGuardados = JSON.parse(
            localStorage.getItem("usuarios")
        ) || []

        const correoExiste = usuariosGuardados.some(
            usuario =>
                (usuario.correo || usuario.email)?.toLowerCase() === correo.trim().toLowerCase()
        )

        if (correoExiste) {
            alert("Ya existe un usuario registrado con ese correo.")
            return
        }

        const nuevoUsuario = {
            nombre: nombre.trim(),
            correo: correo.trim(),
            contrasena: contrasena,
            rol: rol
        }

        usuariosGuardados.push(nuevoUsuario)

        localStorage.setItem(
            "usuarios",
            JSON.stringify(usuariosGuardados)
        )

        alert("Usuario registrado correctamente.")

        setNombre("")
        setCorreo("")
        setContrasena("")
        setRol("usuario")
    }

    return (
        <div className="p-3">
            <h3>Nuevo usuario</h3>

            <form onSubmit={registrarUsuario}>
                <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">
                        Nombre completo
                    </label>

                    <input
                        type="text"
                        id="nombre"
                        className="form-control"
                        value={nombre}
                        onChange={e => setNombre(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="correo" className="form-label">
                        Correo electrónico
                    </label>

                    <input
                        type="email"
                        id="correo"
                        className="form-control"
                        value={correo}
                        onChange={e => setCorreo(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="contrasena" className="form-label">
                        Contraseña
                    </label>

                    <input
                        type="password"
                        id="contrasena"
                        className="form-control"
                        value={contrasena}
                        onChange={e => setContrasena(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="rol" className="form-label">
                        Rol del usuario
                    </label>

                    <select
                        id="rol"
                        className="form-select"
                        value={rol}
                        onChange={e => setRol(e.target.value)}
                    >
                        <option value="usuario">Usuario</option>
                        <option value="admin">Administrador</option>
                    </select>
                </div>

                <button type="submit" className="btn btn-admin">
                    Registrar usuario
                </button>
            </form>
        </div>
    )
}

export default NuevoUsuario