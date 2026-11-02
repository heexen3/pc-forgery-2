import { useRef, useState } from "react"
import { Link } from "react-router-dom"
import BotonesWindows from "./components/BotonesWindows.jsx"
import { mostrarAlerta } from "./components/dialogo/Dialogo.js"
import { obtenerUsuarios, guardarUsuarios } from "./data/usuariosData.js"
import { rutaPublica } from "./utils/rutaPublica.js"
import "./Usuario.css"

// Valida formato de nombre de usuario (letras, números o guion bajo, entre 3 y 20 caracteres)
function validarNombreUsuario(nombre) {
    const expresion = /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/
    return expresion.test(nombre)
}

// Valida descripción (máximo 160 caracteres)
function validarDescripcion(descripcion) {
    return descripcion.length <= 160
}

function Usuario() {
    // Obtener usuario que inició sesión desde localStorage
    const [usuarioActual, setUsuarioActual] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("usuarioActual"))
        } catch {
            return null
        }
    })

    // Estados para edición inline
    const [editandoUsuario, setEditandoUsuario] = useState(false)
    const [tempUsuario, setTempUsuario] = useState("")

    const [editandoNombre, setEditandoNombre] = useState(false)
    const [tempNombre, setTempNombre] = useState("")

    const [editandoDescripcion, setEditandoDescripcion] = useState(false)
    const [tempDescripcion, setTempDescripcion] = useState("")

    const inputFoto = useRef(null)

    // Si no hay sesión iniciada, mostrar ventana de advertencia estilo Windows 98
    if (!usuarioActual) {
        return (
            <main className="usuario-contenedor">
                <section className="usuario-ventana ventana-animada">
                    <div className="barra-ventana">
                        <img src={rutaPublica("/wlogo.svg")} alt="" className="wlogo" width="25px" />
                        <span>Perfil de usuario</span>
                        <BotonesWindows />
                    </div>

                    <div className="usuario-cuerpo usuario-no-sesion">
                        <img
                            src={rutaPublica("/tools.png")}
                            alt="Aviso"
                            className="usuario-icono-aviso"
                            width="48"
                            height="48"
                        />
                        <h2>No hay ninguna sesión activa</h2>
                        <p>Debes iniciar sesión con tu cuenta para ver y editar tu perfil de usuario.</p>

                        <div className="usuario-acciones-no-sesion">
                            <Link to="/Login" className="boton-enlace">
                                Iniciar sesión
                            </Link>
                            <Link to="/Register" className="boton-enlace">
                                Registrarse
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        )
    }

    // Persistir cambios en usuarioActual y en el listado de usuarios de usuariosData
    function guardarCambios(usuarioActualizado) {
        setUsuarioActual(usuarioActualizado)

        localStorage.setItem(
            "usuarioActual",
            JSON.stringify(usuarioActualizado)
        )

        const usuarios = obtenerUsuarios()
        const correoActual = usuarioActual.email || usuarioActual.correo

        const listaActualizada = usuarios.map(usuario => {
            const correo = usuario.email || usuario.correo
            if (correo && correo === correoActual) {
                return {
                    ...usuario,
                    ...usuarioActualizado
                }
            }
            return usuario
        })

        guardarUsuarios(listaActualizada)
    }

    // Manejar cambio de nombre de usuario
    function iniciarEdicionUsuario() {
        setTempUsuario(usuarioActual.usuario || "")
        setEditandoUsuario(true)
    }

    function guardarUsuarioForm(e) {
        e.preventDefault()
        const limpio = tempUsuario.trim()

        if (!validarNombreUsuario(limpio)) {
            mostrarAlerta(
                "El usuario debe tener entre 3 y 20 caracteres, comenzar con una letra y contener solo letras, números o guion bajo.",
                { icono: "advertencia" }
            )
            return
        }

        guardarCambios({
            ...usuarioActual,
            usuario: limpio
        })
        setEditandoUsuario(false)
        mostrarAlerta("Nombre de usuario actualizado correctamente.")
    }

    // Manejar cambio de nombre completo
    function iniciarEdicionNombre() {
        setTempNombre(usuarioActual.nombre || "")
        setEditandoNombre(true)
    }

    function guardarNombreForm(e) {
        e.preventDefault()
        const limpio = tempNombre.trim()

        if (!limpio) {
            mostrarAlerta("Por favor ingresa un nombre válido.", { icono: "advertencia" })
            return
        }

        guardarCambios({
            ...usuarioActual,
            nombre: limpio
        })
        setEditandoNombre(false)
        mostrarAlerta("Nombre completo actualizado correctamente.")
    }

    // Manejar cambio de descripción
    function iniciarEdicionDescripcion() {
        setTempDescripcion(usuarioActual.descripcion || "")
        setEditandoDescripcion(true)
    }

    function guardarDescripcionForm(e) {
        e.preventDefault()

        if (!validarDescripcion(tempDescripcion)) {
            mostrarAlerta("La descripción no puede superar los 160 caracteres.", { icono: "advertencia" })
            return
        }

        guardarCambios({
            ...usuarioActual,
            descripcion: tempDescripcion.trim()
        })
        setEditandoDescripcion(false)
        mostrarAlerta("Descripción actualizada correctamente.")
    }

    // Manejar cambio de foto de perfil
    function cambiarFoto(event) {
        const archivo = event.target.files[0]
        if (!archivo) return

        if (!archivo.type.startsWith("image/")) {
            mostrarAlerta("Por favor selecciona un archivo de imagen válido.", { icono: "advertencia" })
            event.target.value = ""
            return
        }

        const lector = new FileReader()
        lector.onload = function () {
            guardarCambios({
                ...usuarioActual,
                foto: lector.result
            })
            mostrarAlerta("Foto de perfil actualizada correctamente.")
        }
        lector.readAsDataURL(archivo)
        event.target.value = ""
    }

    const descripcion = usuarioActual.descripcion || "Este usuario aún no tiene una descripción."

    return (
        <main className="usuario-contenedor">
            <section className="usuario-ventana ventana-animada">
                {/* Barra superior Windows 98 */}
                <div className="barra-ventana">
                    <img src={rutaPublica("/wlogo.svg")} alt="" className="wlogo" width="25px" />
                    <span>Perfil de usuario - {usuarioActual.usuario || usuarioActual.nombre}</span>
                    <BotonesWindows />
                </div>

                <div className="usuario-cuerpo">
                    <div className="contenedor-usuario">
                        {/* Columna Izquierda: Foto de perfil con botón y editar.svg */}
                        <div className="usuario-columna-foto">
                            <div className="usuario-foto">
                                <button
                                    type="button"
                                    className="boton-cambiar-foto"
                                    title="Haz clic para cambiar tu foto de perfil"
                                    onClick={() => inputFoto.current && inputFoto.current.click()}
                                >
                                    <img
                                        src={rutaPublica(usuarioActual.foto || "/usuario-generico.jpg")}
                                        alt="Foto de perfil"
                                        id="foto-perfil"
                                        className="foto-perfil"
                                    />

                                    {/* Icono editar.svg sobre la foto */}
                                    <span className="badge-editar-foto">
                                        <img
                                            src={rutaPublica("/editar.svg")}
                                            alt="Editar foto"
                                            className="icono-editar-foto"
                                        />
                                    </span>
                                </button>

                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={inputFoto}
                                    onChange={cambiarFoto}
                                    hidden
                                />
                            </div>

                            <p className="usuario-foto-ayuda">Haz clic en la foto para cambiarla</p>
                        </div>

                        {/* Columna Derecha: Información del usuario */}
                        <div className="usuario-columna-info">
                            {/* Nombre de usuario */}
                            <div className="usuario-dato">
                                <span className="usuario-dato-etiqueta"><strong>Usuario:</strong></span>

                                {editandoUsuario ? (
                                    <form onSubmit={guardarUsuarioForm} className="usuario-form-inline">
                                        <input
                                            type="text"
                                            value={tempUsuario}
                                            onChange={e => setTempUsuario(e.target.value)}
                                            minLength="3"
                                            maxLength="20"
                                            required
                                            autoFocus
                                            className="usuario-input-inline"
                                        />
                                        <button type="submit" className="boton-mini">Guardar</button>
                                        <button
                                            type="button"
                                            className="boton-mini"
                                            onClick={() => setEditandoUsuario(false)}
                                        >
                                            Cancelar
                                        </button>
                                    </form>
                                ) : (
                                    <div className="usuario-dato-valor">
                                        <span id="nombre-usuario" className="texto-valor">
                                            {usuarioActual.usuario || "Sin usuario"}
                                        </span>
                                        <button
                                            type="button"
                                            className="boton-editar"
                                            title="Editar nombre de usuario"
                                            onClick={iniciarEdicionUsuario}
                                        >
                                            <img src={rutaPublica("/editar.svg")} alt="Editar nombre de usuario" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Nombre completo */}
                            <div className="usuario-dato">
                                <span className="usuario-dato-etiqueta"><strong>Nombre completo:</strong></span>

                                {editandoNombre ? (
                                    <form onSubmit={guardarNombreForm} className="usuario-form-inline">
                                        <input
                                            type="text"
                                            value={tempNombre}
                                            onChange={e => setTempNombre(e.target.value)}
                                            required
                                            autoFocus
                                            className="usuario-input-inline"
                                        />
                                        <button type="submit" className="boton-mini">Guardar</button>
                                        <button
                                            type="button"
                                            className="boton-mini"
                                            onClick={() => setEditandoNombre(false)}
                                        >
                                            Cancelar
                                        </button>
                                    </form>
                                ) : (
                                    <div className="usuario-dato-valor">
                                        <span className="texto-valor">
                                            {usuarioActual.nombre || "No especificado"}
                                        </span>
                                        <button
                                            type="button"
                                            className="boton-editar"
                                            title="Editar nombre completo"
                                            onClick={iniciarEdicionNombre}
                                        >
                                            <img src={rutaPublica("/editar.svg")} alt="Editar nombre" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Correo */}
                            <div className="usuario-dato">
                                <span className="usuario-dato-etiqueta"><strong>Correo:</strong></span>
                                <div className="usuario-dato-valor">
                                    <span className="texto-valor">{usuarioActual.email || usuarioActual.correo}</span>
                                </div>
                            </div>

                            {/* Rol */}
                            <div className="usuario-dato">
                                <span className="usuario-dato-etiqueta"><strong>Rol:</strong></span>
                                <div className="usuario-dato-valor">
                                    <span className="usuario-rol-badge">
                                        {usuarioActual.rol === "admin" ? "Administrador" : "Cliente"}
                                    </span>
                                </div>
                            </div>

                            {/* Descripción */}
                            <div className="usuario-dato-bloque">
                                <div className="usuario-desc-header">
                                    <strong>Descripción:</strong>
                                    {!editandoDescripcion && (
                                        <button
                                            type="button"
                                            className="boton-editar"
                                            title="Editar descripción"
                                            onClick={iniciarEdicionDescripcion}
                                        >
                                            <img src={rutaPublica("/editar.svg")} alt="Editar descripción" />
                                        </button>
                                    )}
                                </div>

                                {editandoDescripcion ? (
                                    <form onSubmit={guardarDescripcionForm} className="usuario-form-desc">
                                        <textarea
                                            value={tempDescripcion}
                                            onChange={e => setTempDescripcion(e.target.value)}
                                            maxLength={160}
                                            rows="4"
                                            className="usuario-textarea"
                                            placeholder="Escribe algo sobre ti (máximo 160 caracteres)..."
                                            autoFocus
                                        />
                                        <div className="usuario-desc-footer">
                                            <small>{tempDescripcion.length}/160 caracteres</small>
                                            <div className="usuario-desc-botones">
                                                <button type="submit">Guardar</button>
                                                <button
                                                    type="button"
                                                    onClick={() => setEditandoDescripcion(false)}
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                ) : (
                                    <p className="usuario-texto-descripcion">
                                        {descripcion}
                                    </p>
                                )}
                            </div>

                            {/* Acciones del perfil */}
                            <div className="usuario-pie-acciones">
                                <Link to="/MisCompras" className="boton-enlace">
                                    Ver mis compras
                                </Link>
                                {usuarioActual.rol === "admin" && (
                                    <Link to="/Admin" className="boton-enlace">
                                        Panel de administración
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Usuario
