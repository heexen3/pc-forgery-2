import { useEffect, useState } from "react"

function EditarUsuario() {
    const [usuarios, setUsuarios] = useState([])
    const [correoSeleccionado, setCorreoSeleccionado] = useState("")
    const [nombre, setNombre] = useState("")
    const [correo, setCorreo] = useState("")
    const [rol, setRol] = useState("usuario")

    useEffect(() => {
        const usuariosGuardados = JSON.parse(
            localStorage.getItem("usuarios")
        ) || []

        setUsuarios(usuariosGuardados)
    }, [])

    function seleccionarUsuario(e) {
        const correoUsuario = e.target.value
        setCorreoSeleccionado(correoUsuario)

        const usuarioSeleccionado = usuarios.find(
            usuario => usuario.correo === correoUsuario
        )

        if (usuarioSeleccionado) {
            setNombre(usuarioSeleccionado.nombre || "")
            setCorreo(usuarioSeleccionado.correo || "")
            setRol(usuarioSeleccionado.rol || "usuario")
        } else {
            setNombre("")
            setCorreo("")
            setRol("usuario")
        }
    }

    function guardarCambios(e) {
        e.preventDefault()

        const correoExiste = usuarios.some(
            usuario =>
                usuario.correo === correo &&
                usuario.correo !== correoSeleccionado
        )

        if (correoExiste) {
            alert("Ya existe otro usuario con ese correo.")
            return
        }

        const usuariosActualizados = usuarios.map(usuario => {
            if (usuario.correo === correoSeleccionado) {
                return {
                    ...usuario,
                    nombre: nombre,
                    correo: correo,
                    rol: rol
                }
            }

            return usuario
        })

        localStorage.setItem(
            "usuarios",
            JSON.stringify(usuariosActualizados)
        )

        setUsuarios(usuariosActualizados)
        setCorreoSeleccionado(correo)

        alert("Usuario actualizado correctamente.")
    }

    return (
        <div className="p-3">
            <h3>Editar usuario</h3>

            {usuarios.length === 0 ? (
                <p>No hay usuarios registrados para editar.</p>
            ) : (
                <>
                    <div className="mb-3">
                        <label htmlFor="usuarioSeleccionado" className="form-label">
                            Seleccionar usuario
                        </label>

                        <select
                            id="usuarioSeleccionado"
                            className="form-select"
                            value={correoSeleccionado}
                            onChange={seleccionarUsuario}
                            required
                        >
                            <option value="">Selecciona un usuario</option>

                            {usuarios.map((usuario, indice) => (
                                <option
                                    key={usuario.correo || indice}
                                    value={usuario.correo}
                                >
                                    {usuario.nombre} ({usuario.correo})
                                </option>
                            ))}
                        </select>
                    </div>

                    {correoSeleccionado && (
                        <form onSubmit={guardarCambios}>
                            <div className="mb-3">
                                <label htmlFor="editarNombre" className="form-label">
                                    Nombre completo
                                </label>

                                <input
                                    type="text"
                                    id="editarNombre"
                                    className="form-control"
                                    value={nombre}
                                    onChange={e => setNombre(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="editarCorreo" className="form-label">
                                    Correo electrónico
                                </label>

                                <input
                                    type="email"
                                    id="editarCorreo"
                                    className="form-control"
                                    value={correo}
                                    onChange={e => setCorreo(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="editarRol" className="form-label">
                                    Rol
                                </label>

                                <select
                                    id="editarRol"
                                    className="form-select"
                                    value={rol}
                                    onChange={e => setRol(e.target.value)}
                                >
                                    <option value="usuario">Usuario</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>

                            <button type="submit" className="btn btn-admin">
                                Guardar cambios
                            </button>
                        </form>
                    )}
                </>
            )}
        </div>
    )
}

export default EditarUsuario