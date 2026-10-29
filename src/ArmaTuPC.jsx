import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./ArmaTuPC.css"
import VentanaColapsable from "./components/VentanaColapsable.jsx"
import { DB_COMPONENTES } from "./data/componentesData.js"
import { rutaPublica } from "./utils/rutaPublica.js"
import {
    PASOS,
    nombrePaso,
    seleccionVacia,
    comprobarCompatibilidad,
    detectarConflicto,
    cambiarPlataforma,
    seleccionarComponente,
    calcularTotalArmado,
    calcularConsumo,
    potenciaRecomendada,
    fuenteSuficiente,
    componentesFaltantes,
    crearItemArmado
} from "./components/armado/ArmadoPC.js"
import {
    obtenerArmados,
    guardarArmado,
    eliminarArmado,
    cargarSeleccion
} from "./components/armado/ArmadosGuardados.js"
import { agregarAlCarrito, formatearPrecio } from "./components/carrito/Carrito.js"
import { mostrarAlerta } from "./components/dialogo/Dialogo.js"

// Textos de ayuda del asistente para cada paso
const AYUDA_PASOS = {
    plataforma: "Bienvenido al Asistente para armar tu PC. Primero, define con qué fabricante deseas armar tu plataforma base:",
    procesadores: "El procesador (CPU) es el cerebro del equipo. Solo se muestran los compatibles con tu plataforma.",
    placas: "La placa madre conecta todo. Debe tener el mismo socket que tu procesador.",
    ram: "La memoria RAM debe coincidir con la tecnología de la placa (DDR4 o DDR5).",
    gpu: "La tarjeta de video define el rendimiento en juegos. Fíjate en su consumo: lo necesitarás para la fuente.",
    almacenamiento: "Elige dónde se guardarán tu sistema y tus archivos.",
    fuentes: "La fuente debe cubrir el consumo estimado con un margen de seguridad. Las que no alcanzan aparecen marcadas.",
    gabinetes: "Por último, el gabinete debe admitir el formato de tu placa y el largo de tu tarjeta de video."
}

function leerUsuarioActual() {
    try {
        return JSON.parse(localStorage.getItem("usuarioActual"))
    } catch {
        return null
    }
}

function ArmaTuPC() {
    // Lógica
    const navigate = useNavigate()
    const usuario = leerUsuarioActual()
    const [pasoActual, setPasoActual] = useState(0)
    const [plataforma, setPlataforma] = useState(null)
    const [seleccion, setSeleccion] = useState(seleccionVacia())
    const [aviso, setAviso] = useState("")
    const [nombreArmado, setNombreArmado] = useState("")
    const [armados, setArmados] = useState(() => obtenerArmados(usuario))
    const [mensajeArmados, setMensajeArmados] = useState("")

    const paso = PASOS[pasoActual]
    const conflicto = detectarConflicto(seleccion)
    const total = calcularTotalArmado(seleccion)
    const consumo = calcularConsumo(seleccion)
    const recomendada = potenciaRecomendada(seleccion)
    const hayComponentes = total > 0
    const progreso = Math.round(((pasoActual + 1) / PASOS.length) * 100)
    const usoFuente = seleccion.fuentes && recomendada > 0
        ? Math.min(100, Math.round((recomendada / seleccion.fuentes.potenciaWatts) * 100))
        : 0

    function cambiarPaso(direccion) {
        const nuevoPaso = pasoActual + direccion
        if (nuevoPaso >= 0 && nuevoPaso < PASOS.length) {
            setPasoActual(nuevoPaso)
        }
    }

    function pasoCompletado(pasoNav) {
        return pasoNav.key === "plataforma" ? Boolean(plataforma) : Boolean(seleccion[pasoNav.key])
    }

    function elegirPlataforma(marca) {
        setSeleccion(cambiarPlataforma(seleccion, plataforma, marca))
        setPlataforma(marca)
        setAviso("")
        cambiarPaso(1)
    }

    function elegirComponente(categoria, producto) {
        const resultado = seleccionarComponente(seleccion, categoria, producto)
        setSeleccion(resultado.seleccion)
        setAviso(
            resultado.removidos.length > 0
                ? `Se quitó por incompatibilidad: ${resultado.removidos.join(", ")}.`
                : ""
        )
    }

    function reiniciarBuild() {
        setPasoActual(0)
        setPlataforma(null)
        setSeleccion(seleccionVacia())
        setAviso("")
    }

    function agregarArmadoAlCarrito() {
        const faltantes = componentesFaltantes(seleccion)
        if (faltantes.length > 0) {
            mostrarAlerta(`Faltan componentes por elegir: ${faltantes.join(", ")}.`, { icono: "advertencia" })
            return
        }
        if (conflicto) {
            mostrarAlerta(`No se puede agregar un PC incompatible: ${conflicto}`, { icono: "advertencia" })
            return
        }

        const resultado = agregarAlCarrito(crearItemArmado(seleccion, plataforma))
        mostrarAlerta(resultado.mensaje, { icono: resultado.ok ? "info" : "error" })
        if (resultado.ok) {
            navigate("/Carrito")
        }
    }

    function guardarArmadoActual(event) {
        event.preventDefault()
        const resultado = guardarArmado(usuario, nombreArmado, seleccion, plataforma)
        setArmados(resultado.armados)
        setMensajeArmados(resultado.mensaje)
        if (resultado.ok) {
            setNombreArmado("")
        }
    }

    function cargarArmado(armado) {
        setSeleccion(cargarSeleccion(armado))
        setPlataforma(armado.plataforma || null)
        setPasoActual(PASOS.length - 1)
        setAviso("")
        setMensajeArmados(`Armado "${armado.nombre}" cargado.`)
    }

    function borrarArmado(armado) {
        setArmados(eliminarArmado(usuario, armado.id))
        setMensajeArmados(`Armado "${armado.nombre}" eliminado.`)
    }

    const productosCompatibles = paso.key === "plataforma"
        ? []
        : (DB_COMPONENTES[paso.key] || []).filter(producto =>
            comprobarCompatibilidad(paso.key, producto, seleccion, plataforma)
        )

    // Renderizado
    return (
        <main className="wizard-container">
            <VentanaColapsable titulo="Asistente para armar tu PC" className="window wizard-window ventana-animada">
                <div className="wizard-cuerpo">
                    {/* Panel lateral del instalador con la lista de pasos */}
                    <aside className="wizard-banner">
                        <img src={rutaPublica("/computer.png")} alt="" className="wizard-banner-img" />
                        <p className="wizard-banner-titulo">Arma tu PC</p>
                        <nav className="wizard-steps" id="wizard-steps" aria-label="Pasos del asistente">
                            {PASOS.map((pasoNav, index) => (
                                <button
                                    key={pasoNav.key}
                                    className={`step-tab ${index === pasoActual ? "active" : ""} ${pasoCompletado(pasoNav) ? "completo" : ""}`}
                                    onClick={() => setPasoActual(index)}
                                >
                                    <span className="step-check" aria-hidden="true">
                                        {pasoCompletado(pasoNav) ? "✔" : index === pasoActual ? "►" : "○"}
                                    </span>
                                    {pasoNav.label}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    <div className="wizard-content">
                        <div className="wizard-encabezado">
                            <div>
                                <h2>{nombrePaso(paso)}</h2>
                                <p>Paso {pasoActual + 1} de {PASOS.length}</p>
                            </div>
                            <img src={rutaPublica("/tools.png")} alt="" />
                        </div>

                        <div
                            className="wizard-progreso"
                            role="progressbar"
                            aria-label="Progreso del asistente"
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={progreso}
                        >
                            <div className="wizard-progreso-relleno" style={{ width: `${progreso}%` }}></div>
                        </div>

                        <div className="clippy-helper">
                            <img src={rutaPublica("/help.png")} alt="Clippy" className="clippy-img" />
                            <div className="clippy-dialog">{AYUDA_PASOS[paso.key]}</div>
                        </div>

                        <div className="grid-productos">
                            {paso.key === "plataforma" && ["AMD", "Intel"].map(marca => {
                                const seleccionada = plataforma === marca
                                return (
                                    <div key={marca} className={`item-card ${seleccionada ? "selected" : ""}`}>
                                        <img src={rutaPublica("/computer.png")} className="item-img" alt={marca} />
                                        <h4>Plataforma {marca}</h4>
                                        <p>Configura procesadores y placas compatibles con {marca}.</p>
                                        <button
                                            className={`btn-retro ${seleccionada ? "btn-selected" : ""}`}
                                            onClick={() => elegirPlataforma(marca)}
                                        >
                                            {seleccionada ? "Seleccionada" : `Elegir ${marca}`}
                                        </button>
                                    </div>
                                )
                            })}

                            {paso.key !== "plataforma" && productosCompatibles.length === 0 && (
                                <div className="empty-msg">
                                    <p>No hay componentes compatibles disponibles para tu configuración actual.</p>
                                    <p><small>Prueba modificando tus elecciones en los pasos anteriores.</small></p>
                                </div>
                            )}

                            {productosCompatibles.map(producto => {
                                const estaSeleccionado = seleccion[paso.key]?.id === producto.id
                                const fuenteCorta = paso.key === "fuentes" && consumo > 0 && !fuenteSuficiente(producto, seleccion)
                                return (
                                    <div
                                        key={producto.id}
                                        className={`item-card ${estaSeleccionado ? "selected" : ""} ${fuenteCorta ? "item-insuficiente" : ""}`}
                                    >
                                        <img src={rutaPublica(producto.img)} className="item-img" alt={producto.nombre} />
                                        <h4 className="item-title">{producto.nombre}</h4>
                                        <div className="item-specs">
                                            {producto.socket && <span>Socket: {producto.socket}</span>}
                                            {producto.tipo && <span>Tipo: {producto.tipo}</span>}
                                            {producto.tipoRam && <span>RAM: {producto.tipoRam}</span>}
                                            {producto.formato && <span>Formato: {producto.formato}</span>}
                                            {producto.vram && <span>VRAM: {producto.vram}</span>}
                                            {producto.capacidad && <span>Capacidad: {producto.capacidad}</span>}
                                            {producto.potenciaWatts && <span>Potencia: {producto.potenciaWatts}W</span>}
                                            {producto.consumoWatts && <span>Consumo: {producto.consumoWatts}W</span>}
                                        </div>
                                        {fuenteCorta && (
                                            <p className="item-alerta">⚠ Potencia insuficiente para tu armado</p>
                                        )}
                                        <p className="item-price">{formatearPrecio(producto.precio)}</p>
                                        <button
                                            className={`btn-retro ${estaSeleccionado ? "btn-selected" : ""}`}
                                            aria-label={`${estaSeleccionado ? "Seleccionado" : "Elegir"} ${producto.nombre}`}
                                            onClick={() => elegirComponente(paso.key, producto)}
                                        >
                                            {estaSeleccionado ? "Seleccionado" : "Elegir"}
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <div className="wizard-actions">
                    <button className="btn-retro" disabled={pasoActual === 0} onClick={() => cambiarPaso(-1)}>
                        &lt; Atrás
                    </button>
                    <button className="btn-retro" disabled={pasoActual === PASOS.length - 1} onClick={() => cambiarPaso(1)}>
                        Siguiente &gt;
                    </button>
                    <button className="btn-retro" onClick={reiniciarBuild}>Cancelar</button>
                </div>
            </VentanaColapsable>

            <div className="wizard-lateral">
                <aside className="window summary-window ventana-animada">
                    <div className="window-header">
                        <span className="window-title">Resumen de Construcción</span>
                    </div>
                    <div className="summary-body">
                        <ul className="summary-list">
                            {PASOS.slice(1).map(pasoResumen => {
                                const item = seleccion[pasoResumen.key]
                                return (
                                    <li key={pasoResumen.key} className="summary-item">
                                        <span>
                                            <strong>{nombrePaso(pasoResumen)}:</strong>{" "}
                                            {item ? item.nombre : <em>Sin seleccionar</em>}
                                        </span>
                                        {item && <span>{formatearPrecio(item.precio)}</span>}
                                    </li>
                                )
                            })}
                        </ul>

                        <div
                            className={`compatibility-box ${conflicto ? "status-error" : hayComponentes ? "status-ok" : ""}`}
                            data-testid="compatibilidad"
                        >
                            <div className="compat-indicator"></div>
                            <span>
                                {conflicto
                                    ? `Incompatible: ${conflicto}`
                                    : hayComponentes
                                        ? "Sistema compatible hasta el momento."
                                        : "Estado: Sin componentes seleccionados"}
                            </span>
                        </div>

                        {aviso && <p className="aviso-compatibilidad">{aviso}</p>}

                        {/* Consumo eléctrico estimado */}
                        <div className="summary-energia">
                            <div>
                                <span>Consumo estimado:</span>
                                <strong data-testid="consumo-armado">{consumo} W</strong>
                            </div>
                            <div>
                                <span>Fuente recomendada:</span>
                                <strong>{recomendada > 0 ? `${recomendada} W` : "-"}</strong>
                            </div>
                            {seleccion.fuentes && (
                                <>
                                    <div>
                                        <span>Fuente elegida:</span>
                                        <strong>{seleccion.fuentes.potenciaWatts} W</strong>
                                    </div>
                                    <div
                                        className={`medidor-energia ${!fuenteSuficiente(seleccion.fuentes, seleccion) ? "medidor-excedido" : ""}`}
                                        title="Uso recomendado de la fuente"
                                    >
                                        <div style={{ width: `${usoFuente}%` }}></div>
                                    </div>
                                </>
                            )}
                            {seleccion.fuentes && !fuenteSuficiente(seleccion.fuentes, seleccion) && (
                                <p className="aviso-compatibilidad" role="alert">
                                    ⚠ La fuente elegida no alcanza para este armado. Elige una de al menos {recomendada} W.
                                </p>
                            )}
                        </div>

                        <div className="summary-total">
                            <span>Total Estimado:</span>
                            <strong data-testid="total-armado">{formatearPrecio(total)}</strong>
                        </div>

                        <div className="summary-buttons">
                            <button className="btn-retro" onClick={reiniciarBuild}>Reiniciar</button>
                            <button className="btn-retro btn-primary" onClick={agregarArmadoAlCarrito}>
                                Agregar al Carrito
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Armados guardados del usuario (RF-09) */}
                <aside className="window summary-window ventana-animada">
                    <div className="window-header">
                        <span className="window-title">Mis armados guardados</span>
                    </div>
                    <div className="summary-body">
                        {!usuario ? (
                            <p className="armados-info">Inicia sesión para guardar tus armados y retomarlos después.</p>
                        ) : (
                            <>
                                <form className="armados-form" onSubmit={guardarArmadoActual}>
                                    <label htmlFor="nombre-armado">Nombre del armado:</label>
                                    <div>
                                        <input
                                            id="nombre-armado"
                                            type="text"
                                            maxLength={40}
                                            placeholder="Ej: PC gamer 2026"
                                            value={nombreArmado}
                                            onChange={event => setNombreArmado(event.target.value)}
                                        />
                                        <button type="submit" className="btn-retro">Guardar</button>
                                    </div>
                                </form>
                                {mensajeArmados && <p className="armados-info" role="status">{mensajeArmados}</p>}
                                {armados.length === 0 ? (
                                    <p className="armados-info">Aún no tienes armados guardados.</p>
                                ) : (
                                    <ul className="armados-lista">
                                        {armados.map(armado => (
                                            <li key={armado.id}>
                                                <div>
                                                    <strong>{armado.nombre}</strong>
                                                    <small>{armado.plataforma || "Sin plataforma"} · {formatearPrecio(armado.total)}</small>
                                                </div>
                                                <div>
                                                    <button
                                                        className="btn-retro"
                                                        aria-label={`Cargar ${armado.nombre}`}
                                                        onClick={() => cargarArmado(armado)}
                                                    >
                                                        Cargar
                                                    </button>
                                                    <button
                                                        className="btn-retro"
                                                        aria-label={`Eliminar ${armado.nombre}`}
                                                        onClick={() => borrarArmado(armado)}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </>
                        )}
                    </div>
                </aside>
            </div>
        </main>
    )
}

export default ArmaTuPC
