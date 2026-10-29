import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./ArmaTuPC.css"
import VentanaColapsable from "./components/VentanaColapsable.jsx"
import { DB_COMPONENTES } from "./data/componentesData.js"
import {
    PASOS,
    nombrePaso,
    seleccionVacia,
    comprobarCompatibilidad,
    detectarConflicto,
    cambiarPlataforma,
    seleccionarComponente,
    calcularTotalArmado,
    componentesFaltantes,
    crearItemArmado
} from "./components/armado/ArmadoPC.js"
import { agregarAlCarrito, formatearPrecio } from "./components/carrito/Carrito.js"

function ArmaTuPC() {
    // Lógica
    const navigate = useNavigate()
    const [pasoActual, setPasoActual] = useState(0)
    const [plataforma, setPlataforma] = useState(null)
    const [seleccion, setSeleccion] = useState(seleccionVacia())
    const [aviso, setAviso] = useState("")

    const paso = PASOS[pasoActual]
    const conflicto = detectarConflicto(seleccion)
    const total = calcularTotalArmado(seleccion)
    const hayComponentes = total > 0

    function cambiarPaso(direccion) {
        const nuevoPaso = pasoActual + direccion
        if (nuevoPaso >= 0 && nuevoPaso < PASOS.length) {
            setPasoActual(nuevoPaso)
        }
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
            alert(`Faltan componentes por elegir: ${faltantes.join(", ")}.`)
            return
        }
        if (conflicto) {
            alert(`No se puede agregar un PC incompatible: ${conflicto}`)
            return
        }

        const resultado = agregarAlCarrito(crearItemArmado(seleccion, plataforma))
        alert(resultado.mensaje)
        if (resultado.ok) {
            navigate("/Carrito")
        }
    }

    const productosCompatibles = paso.key === "plataforma"
        ? []
        : (DB_COMPONENTES[paso.key] || []).filter(producto =>
            comprobarCompatibilidad(paso.key, producto, seleccion, plataforma)
        )

    // Renderizado
    return (
        <main className="wizard-container">
            <VentanaColapsable titulo="Arma tu PC" className="window wizard-window">
                <nav className="wizard-steps" id="wizard-steps">
                    {PASOS.map((pasoNav, index) => (
                        <button
                            key={pasoNav.key}
                            className={`step-tab ${index === pasoActual ? "active" : ""}`}
                            onClick={() => setPasoActual(index)}
                        >
                            {pasoNav.label}
                        </button>
                    ))}
                </nav>

                <div className="wizard-content">
                    <div className="clippy-helper">
                        <img src="/help.png" alt="Clippy" className="clippy-img" />
                        <div className="clippy-dialog">
                            {paso.key === "plataforma"
                                ? "Primero, define con qué fabricante deseas armar tu plataforma base:"
                                : `Selecciona tu opción para ${paso.label}.`}
                        </div>
                    </div>

                    <div className="grid-productos">
                        {paso.key === "plataforma" && ["AMD", "Intel"].map(marca => {
                            const seleccionada = plataforma === marca
                            return (
                                <div key={marca} className={`item-card ${seleccionada ? "selected" : ""}`}>
                                    <img src="/computer.png" className="item-img" alt={marca} />
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
                            return (
                                <div key={producto.id} className={`item-card ${estaSeleccionado ? "selected" : ""}`}>
                                    <img src={producto.img} className="item-img" alt={producto.nombre} />
                                    <h4 className="item-title">{producto.nombre}</h4>
                                    <div className="item-specs">
                                        {producto.socket && <span>Socket: {producto.socket}</span>}
                                        {producto.tipo && <span>Tipo: {producto.tipo}</span>}
                                        {producto.tipoRam && <span>RAM: {producto.tipoRam}</span>}
                                        {producto.formato && <span>Formato: {producto.formato}</span>}
                                        {producto.vram && <span>VRAM: {producto.vram}</span>}
                                        {producto.capacidad && <span>Capacidad: {producto.capacidad}</span>}
                                        {producto.potenciaWatts && <span>Potencia: {producto.potenciaWatts}W</span>}
                                    </div>
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

                <div className="wizard-actions">
                    <button className="btn-retro" disabled={pasoActual === 0} onClick={() => cambiarPaso(-1)}>
                        &laquo; Anterior
                    </button>
                    <button className="btn-retro" disabled={pasoActual === PASOS.length - 1} onClick={() => cambiarPaso(1)}>
                        Siguiente &raquo;
                    </button>
                </div>
            </VentanaColapsable>

            <aside className="window summary-window">
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
        </main>
    )
}

export default ArmaTuPC
