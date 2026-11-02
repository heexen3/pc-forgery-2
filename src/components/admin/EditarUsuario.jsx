import { useState, useRef, useEffect } from "react"
import { mostrarAlerta } from "../dialogo/Dialogo.js"
import { obtenerUsuarios, guardarUsuarios } from "../../data/usuariosData.js"

function EditarUsuario({ usuarioSeleccionadoInicial = null, onVolver = null }) {
    const [usuarios, setUsuarios] = useState(() => obtenerUsuarios())
    const refFormulario = useRef(null)

    useEffect(() => {
        if (usuarioSeleccionadoInicial) {
            setTimeout(() => {
                refFormulario.current?.scrollIntoView({ behavior: "smooth", block: "start" })
            }, 80)
        }
    }, [usuarioSeleccionadoInicial])

    const [correoSeleccionado, setCorreoSeleccionado] = useState(() => {
        return usuarioSeleccionadoInicial
            ? (usuarioSeleccionadoInicial.correo || usuarioSeleccionadoInicial.email || "")
            : ""
    })

    const [nombre, setNombre] = useState(() => {
        return usuarioSeleccionadoInicial
            ? (usuarioSeleccionadoInicial.nombre || usuarioSeleccionadoInicial.usuario || "")
            : ""
    })

    const [usuarioNombre, setUsuarioNombre] = useState(() => {
        return usuarioSeleccionadoInicial
            ? (usuarioSeleccionadoInicial.usuario || usuarioSeleccionadoInicial.nombre || "")
            : ""
    })

    const [correo, setCorreo] = useState(() => {
        return usuarioSeleccionadoInicial
            ? (usuarioSeleccionadoInicial.correo || usuarioSeleccionadoInicial.email || "")
            : ""
    })

    const [rol, setRol] = useState(() => {
        return usuarioSeleccionadoInicial
            ? (usuarioSeleccionadoInicial.rol || "usuario")
            : "usuario"
    })

    const [password, setPassword] = useState("")

    function seleccionarUsuario(e) {
        const correoUsuario = e.target.value
        setCorreoSeleccionado(correoUsuario)

        const usuarioSeleccionado = usuarios.find(
            usuario => (usuario.correo || usuario.email) === correoUsuario
        )

        if (usuarioSeleccionado) {
            setNombre(usuarioSeleccionado.nombre || usuarioSeleccionado.usuario || "")
            setUsuarioNombre(usuarioSeleccionado.usuario || usuarioSeleccionado.nombre || "")
            setCorreo(usuarioSeleccionado.correo || usuarioSeleccionado.email || "")
            setRol(usuarioSeleccionado.rol || "usuario")
            setPassword("")
            setTimeout(() => {
                refFormulario.current?.scrollIntoView({ behavior: "smooth", block: "start" })
            }, 50)
        } else {
            setNombre("")
            setUsuarioNombre("")
            setCorreo("")
            setRol("usuario")
            setPassword("")
        }
    }

    function guardarCambios(e) {
        e.preventDefault()

        const limpioNombre = nombre.trim()
        const limpioUsuario = (usuarioNombre || nombre).trim()
        const limpioCorreo = correo.trim().toLowerCase()

        if (!limpioNombre || !limpioCorreo) {
            mostrarAlerta("Por favor completa los campos requeridos.", { icono: "advertencia" })
            return
        }

        // Verificar que no choque con el correo de otro usuario
        const correoExiste = usuarios.some(
            usuario =>
                (usuario.correo || usuario.email)?.toLowerCase() === limpioCorreo &&
                (usuario.correo || usuario.email)?.toLowerCase() !== correoSeleccionado.toLowerCase()
        )

        if (correoExiste) {
            mostrarAlerta("Ya existe otro usuario registrado con ese correo.", { icono: "advertencia" })
            return
        }

        // Verificar que no choque con el nombre de usuario de otro usuario
        const usuarioExiste = usuarios.some(
            usuario => {
                const username = (usuario.usuario || usuario.nombre || "").toLowerCase()
                const actual = usuarios.find(u => (u.correo || u.email) === correoSeleccionado)
                const actualUsername = (actual?.usuario || actual?.nombre || "").toLowerCase()
                return username === limpioUsuario.toLowerCase() && username !== actualUsername
            }
        )

        if (usuarioExiste) {
            mostrarAlerta("Ese nombre de usuario ya está registrado por otra cuenta.", { icono: "advertencia" })
            return
        }

        // Actualizar el usuario con todos sus campos consistentes (nombre, usuario, correo, email, rol, pass)
        let usuarioEditadoRef = null
        const usuariosActualizados = usuarios.map(usuario => {
            if ((usuario.correo || usuario.email) === correoSeleccionado) {
                const actualizado = {
                    ...usuario,
                    nombre: limpioNombre,
                    usuario: limpioUsuario,
                    correo: limpioCorreo,
                    email: limpioCorreo,
                    rol: rol
                }

                if (password.trim()) {
                    actualizado.password = password.trim()
                    actualizado.contrasena = password.trim()
                }

                usuarioEditadoRef = actualizado
                return actualizado
            }

            return usuario
        })

        // Guardar la lista de usuarios completa
        guardarUsuarios(usuariosActualizados)
        setUsuarios(usuariosActualizados)
        setCorreoSeleccionado(limpioCorreo)

        // Si el usuario editado es el que tiene la sesión activa actual, sincronizar 'usuarioActual'
        try {
            const sesionActiva = JSON.parse(localStorage.getItem("usuarioActual"))
            if (
                sesionActiva &&
                ((sesionActiva.correo || sesionActiva.email)?.toLowerCase() === correoSeleccionado.toLowerCase() ||
                 (sesionActiva.usuario || sesionActiva.nombre)?.toLowerCase() === correoSeleccionado.toLowerCase())
            ) {
                localStorage.setItem(
                    "usuarioActual",
                    JSON.stringify({
                        ...sesionActiva,
                        ...usuarioEditadoRef
                    })
                )
            }
        } catch {
            // Ignorar error al leer sesión
        }

        setPassword("")
        mostrarAlerta("Usuario actualizado correctamente con éxito.")
    }

    const usuarioActualEnEdicion = usuarios.find(
        u => (u.correo || u.email) === correoSeleccionado
    )

    return (
        <div className="p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="m-0">Editar usuario</h3>
                {onVolver && (
                    <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={onVolver}
                    >
                        ← Volver a la lista
                    </button>
                )}
            </div>

            {usuarios.length === 0 ? (
                <p>No hay usuarios registrados para editar.</p>
            ) : (
                <>
                    <div className="mb-3">
                        <label htmlFor="usuarioSeleccionado" className="form-label fw-bold">
                            Seleccionar usuario a editar:
                        </label>

                        <select
                            id="usuarioSeleccionado"
                            className="form-select"
                            value={correoSeleccionado}
                            onChange={seleccionarUsuario}
                            required
                        >
                            <option value="">-- Elige un usuario de la lista --</option>

                            {usuarios.map((usuario, indice) => (
                                <option
                                    key={usuario.correo || usuario.email || indice}
                                    value={usuario.correo || usuario.email}
                                >
                                    {usuario.nombre || usuario.usuario} ({usuario.correo || usuario.email}) - Rol: {usuario.rol}
                                </option>
                            ))}
                        </select>
                    </div>

                    {correoSeleccionado && (
                        <form ref={refFormulario} onSubmit={guardarCambios} className="border p-3 bg-light">
                            {/* Referencia clara del usuario que se está editando */}
                            <div className="alert py-2 px-3 mb-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
                                <div>
                                    <strong>Editando actualmente a:</strong>{" "}
                                    <span className="fw-bold">{usuarioActualEnEdicion?.nombre || nombre}</span>{" "}
                                    <span>({correoSeleccionado})</span>
                                </div>
                                <span className="badge">
                                    Rol: {usuarioActualEnEdicion?.rol || rol}
                                </span>
                            </div>

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
                                <label htmlFor="editarUsuarioNombre" className="form-label">
                                    Nombre de usuario (nickname)
                                </label>

                                <input
                                    type="text"
                                    id="editarUsuarioNombre"
                                    className="form-control"
                                    value={usuarioNombre}
                                    onChange={e => setUsuarioNombre(e.target.value)}
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
                                <label htmlFor="editarPassword" className="form-label">
                                    Nueva contraseña (opcional)
                                </label>

                                <input
                                    type="password"
                                    id="editarPassword"
                                    className="form-control"
                                    placeholder="Dejar en blanco para mantener la contraseña actual"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
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
                                    <option value="usuario">Usuario (Cliente)</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>

                            <div className="d-flex flex-wrap gap-2">
                                <button type="submit" className="btn btn-admin">
                                    Guardar cambios
                                </button>
                                {onVolver && (
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={onVolver}
                                    >
                                        Cancelar y volver
                                    </button>
                                )}
                            </div>
                        </form>
                    )}
                </>
            )}
        </div>
    )
}

export default EditarUsuario
