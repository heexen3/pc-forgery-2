import BarraTitulo from "./components/BarraTitulo.jsx"
import { useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { mostrarAlerta, confirmar as confirmarDialogo } from "./components/dialogo/Dialogo.js"
import { obtenerUsuarios, guardarUsuarios } from "./data/usuariosData.js"
import { rutaPublica } from "./utils/rutaPublica.js"
import {
    obtenerArmados,
    eliminarArmado,
    actualizarNombreArmado,
    cargarSeleccion
} from "./components/armado/ArmadosGuardados.js"
import { PASOS } from "./components/armado/ArmadoPC.js"
import { formatearPrecio } from "./components/carrito/Carrito.js"
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
    const navigate = useNavigate()

    // Obtener usuario que inició sesión desde localStorage
    const [usuarioActual, setUsuarioActual] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("usuarioActual"))
        } catch {
            return null
        }
    })

    // Estados para edición inline del perfil
    const [editandoUsuario, setEditandoUsuario] = useState(false)
    const [tempUsuario, setTempUsuario] = useState("")

    const [editandoNombre, setEditandoNombre] = useState(false)
    const [tempNombre, setTempNombre] = useState("")

    const [editandoDescripcion, setEditandoDescripcion] = useState(false)
    const [tempDescripcion, setTempDescripcion] = useState("")

    const inputFoto = useRef(null)

    // Estados para la sección desplegable de configuraciones de PC
    const [armadosDesplegados, setArmadosDesplegados] = useState(true)
    const [armados, setArmados] = useState(() => obtenerArmados(usuarioActual))
    const [detallesAbiertos, setDetallesAbiertos] = useState({})

    // Edición de nombre de un armado guardado inline
    const [editandoArmadoId, setEditandoArmadoId] = useState(null)
    const [tempNombreArmado, setTempNombreArmado] = useState("")

    // Si no hay sesión iniciada, mostrar ventana de advertencia estilo Windows 98
    if (!usuarioActual) {
        return (
            <main className="usuario-contenedor">
                <section className="usuario-ventana ventana-animada">
                    <BarraTitulo titulo="Perfil de usuario" />

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

    // Alternar vista detallada de componentes de una configuración
    function alternarDetalleArmado(id) {
        setDetallesAbiertos(prev => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    // Cargar la configuración seleccionada y redirigir a Arma tu PC
    function redirigirConArmado(armado) {
        try {
            sessionStorage.setItem("armadoSeleccionadoId", armado.id)
        } catch {
            // Ignorar en entornos sin sessionStorage
        }
        navigate("/arma-tu-pc", { state: { armadoId: armado.id } })
    }

    // Eliminar una configuración guardada
    async function manejarEliminarArmado(armado) {
        const confirmado = await confirmarDialogo(`¿Deseas eliminar la configuración "${armado.nombre}"?`)
        if (!confirmado) return

        const actualizados = eliminarArmado(usuarioActual, armado.id)
        setArmados(actualizados)
        mostrarAlerta(`Configuración "${armado.nombre}" eliminada.`)
    }

    // Guardar nuevo nombre de configuración inline
    function guardarRenombrarArmado(e, id) {
        e.preventDefault()
        const limpio = tempNombreArmado.trim()
        if (limpio.length < 3) {
            mostrarAlerta("El nombre debe tener al menos 3 caracteres.", { icono: "advertencia" })
            return
        }

        const resultado = actualizarNombreArmado(usuarioActual, id, limpio)
        if (resultado.ok) {
            setArmados(resultado.armados)
            setEditandoArmadoId(null)
            mostrarAlerta("Nombre de la configuración actualizado.")
        } else {
            mostrarAlerta(resultado.mensaje, { icono: "advertencia" })
        }
    }

    const descripcion = usuarioActual.descripcion || "Este usuario aún no tiene una descripción."

    return (
        <main className="usuario-contenedor">
            {/* VENTANA 1: PERFIL DEL USUARIO */}
            <section className="usuario-ventana ventana-animada">
                {/* Barra superior Windows 98 */}
                <BarraTitulo titulo={`Perfil de usuario - ${usuarioActual.usuario || usuarioActual.nombre}`} />

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
                                <Link to="/arma-tu-pc" className="boton-enlace">
                                    Ir a Arma tu PC
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

            {/* VENTANA 2: VISTA DESPLEGABLE DE CONFIGURACIONES GUARDADAS (ARMA TU PC) */}
            <section className="usuario-ventana ventana-animada">
                <BarraTitulo titulo={`Mis Configuraciones de PC (${armados.length} guardadas)`} icono="/computer.png">
                    {/* extra: desplegar/colapsar la lista de armados */}
                    <button
                        type="button"
                        className="boton-colapsar"
                        onClick={() => setArmadosDesplegados(!armadosDesplegados)}
                        title={armadosDesplegados ? "Colapsar configuraciones" : "Desplegar configuraciones"}
                        aria-expanded={armadosDesplegados}
                    >
                        {armadosDesplegados ? "-" : "+"}
                    </button>
                </BarraTitulo>

                {armadosDesplegados && (
                    <div className="usuario-cuerpo usuario-armados-cuerpo">
                        {/* Listado de configuraciones guardadas */}
                        {armados.length === 0 ? (
                            <div className="armados-vacio">
                                <img src={rutaPublica("/computer.png")} alt="" width="36" height="36" />
                                <div>
                                    <strong>No tienes configuraciones de PC guardadas aún.</strong>
                                    <p>Visita el Asistente de Arma tu PC para armar tu equipo y guardar tu configuración.</p>
                                </div>
                                <Link to="/arma-tu-pc" className="boton-enlace btn-retro">
                                    Ir a Arma tu PC
                                </Link>
                            </div>
                        ) : (
                            <div className="armados-lista-contenedor">
                                {armados.map(armado => {
                                    const seleccionArmado = cargarSeleccion(armado)
                                    const detalleVisible = Boolean(detallesAbiertos[armado.id])
                                    const estaEditandoNombre = editandoArmadoId === armado.id

                                    return (
                                        <div key={armado.id} className="armado-tarjeta">
                                            {/* Cabecera de la tarjeta del armado */}
                                            <div className="armado-tarjeta-header">
                                                <div className="armado-tarjeta-info">
                                                    <img src={rutaPublica("/computer.png")} alt="PC" width="28" height="28" />

                                                    {estaEditandoNombre ? (
                                                        <form
                                                            onSubmit={e => guardarRenombrarArmado(e, armado.id)}
                                                            className="usuario-form-inline"
                                                        >
                                                            <input
                                                                type="text"
                                                                value={tempNombreArmado}
                                                                onChange={e => setTempNombreArmado(e.target.value)}
                                                                maxLength={40}
                                                                required
                                                                autoFocus
                                                                className="usuario-input-inline"
                                                            />
                                                            <button type="submit" className="boton-mini">Guardar</button>
                                                            <button
                                                                type="button"
                                                                className="boton-mini"
                                                                onClick={() => setEditandoArmadoId(null)}
                                                            >
                                                                Cancelar
                                                            </button>
                                                        </form>
                                                    ) : (
                                                        <div className="armado-nombre-bloque">
                                                            <span className="armado-nombre-texto">
                                                                {armado.nombre}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                className="boton-editar"
                                                                title="Renombrar configuración"
                                                                onClick={() => {
                                                                    setTempNombreArmado(armado.nombre)
                                                                    setEditandoArmadoId(armado.id)
                                                                }}
                                                            >
                                                                <img src={rutaPublica("/editar.svg")} alt="Editar nombre" />
                                                            </button>
                                                        </div>
                                                    )}

                                                    <span className="armado-plataforma-badge">
                                                        {armado.plataforma || "PC"}
                                                    </span>
                                                </div>

                                                <div className="armado-tarjeta-precio">
                                                    <span>Total estimado:</span>
                                                    <strong>{formatearPrecio(armado.total)}</strong>
                                                </div>
                                            </div>

                                            {/* Barra de metadatos y botones de acción */}
                                            <div className="armado-tarjeta-acciones">
                                                <div className="armado-fecha">
                                                    <small>
                                                        Guardado: {armado.fecha ? new Date(armado.fecha).toLocaleDateString("es-CL") : "Reciente"}
                                                    </small>
                                                </div>

                                                <div className="armado-botones-grupo">
                                                    {/* Botón desplegable para ver los componentes */}
                                                    <button
                                                        type="button"
                                                        className="btn-retro btn-toggle-detalle"
                                                        onClick={() => alternarDetalleArmado(armado.id)}
                                                        title="Mostrar u ocultar los componentes de esta configuración"
                                                    >
                                                        {detalleVisible ? "▲ Ocultar componentes" : "▼ Ver componentes"}
                                                    </button>

                                                    {/* Botón principal: Redirigir a Arma tu PC con esta configuración */}
                                                    <button
                                                        type="button"
                                                        className="btn-retro btn-destacado"
                                                        onClick={() => redirigirConArmado(armado)}
                                                        title="Cargar esta configuración en el Asistente Arma tu PC"
                                                    >
                                                        🛠 Cargar en Arma tu PC
                                                    </button>

                                                    {/* Botón secundario: Eliminar */}
                                                    <button
                                                        type="button"
                                                        className="btn-retro btn-peligro"
                                                        onClick={() => manejarEliminarArmado(armado)}
                                                        title="Eliminar esta configuración"
                                                    >
                                                        ✕ Eliminar
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Vista desplegable: Detalle completo de los componentes de la configuración */}
                                            {detalleVisible && (
                                                <div className="armado-desglose-componentes">
                                                    <div className="armado-desglose-titulo">
                                                        <strong>Componentes seleccionados en "{armado.nombre}":</strong>
                                                    </div>

                                                    <table className="armado-tabla-componentes">
                                                        <thead>
                                                            <tr>
                                                                <th>Pieza</th>
                                                                <th>Componente</th>
                                                                <th>Precio</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {PASOS.slice(1).map(paso => {
                                                                const pieza = seleccionArmado[paso.key]
                                                                return (
                                                                    <tr key={paso.key}>
                                                                        <td className="armado-tabla-categoria">
                                                                            <strong>{paso.label.split(". ")[1] || paso.label}:</strong>
                                                                        </td>
                                                                        <td className="armado-tabla-nombre">
                                                                            {pieza ? (
                                                                                <span>{pieza.nombre}</span>
                                                                            ) : (
                                                                                <em className="texto-sin-seleccionar">Sin seleccionar</em>
                                                                            )}
                                                                        </td>
                                                                        <td className="armado-tabla-precio">
                                                                            {pieza ? formatearPrecio(pieza.precio) : "-"}
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })}
                                                        </tbody>
                                                    </table>

                                                    <div className="armado-desglose-pie">
                                                        <button
                                                            type="button"
                                                            className="btn-retro btn-destacado"
                                                            onClick={() => redirigirConArmado(armado)}
                                                        >
                                                            Abrir en Arma tu PC para modificar o comprar →
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                )}
            </section>
        </main>
    )
}

export default Usuario
