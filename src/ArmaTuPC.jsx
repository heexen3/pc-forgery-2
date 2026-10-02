import { useState } from 'react'
import DB_COMPONENTES from './componentesData'
import './ArmaTuPC.css'
import './App.css'

const PASOS = [
    { key: "plataforma", label: "Plataforma" },
    { key: "procesadores", label: "1. CPU" },
    { key: "placas", label: "2. Placa Madre" },
    { key: "ram", label: "3. RAM" },
    { key: "gpu", label: "4. GPU" },
    { key: "almacenamiento", label: "5. Disco" },
    { key: "fuentes", label: "6. Fuente" },
    { key: "gabinetes", label: "7. Gabinete" }
];

function comprobarCompatibilidad(categoria, item, plataforma, seleccion) {
    if (plataforma && item.plataforma && item.plataforma !== plataforma) {
        return false
    }
    if (categoria === "placas" && seleccion.procesadores) {
        if (item.socket !== seleccion.procesadores.socket) return false
    }
    if (categoria === "procesadores" && seleccion.placas) {
        if (item.socket !== seleccion.placas.socket) return false
    }
    if (categoria === "ram" && seleccion.placas) {
        if (item.tipo !== seleccion.placas.tipoRam) return false
    }
    if (categoria === "gabinetes" && seleccion.placas) {
        if (!item.formatosSoportados.includes(seleccion.placas.formato)) return false
    }
    return true
}

function ArmaTuPC() {
    const [pasoActual, setPasoActual] = useState(0)
    const [plataforma, setPlataforma] = useState(null)
    const [seleccion, setSeleccion] = useState({
        procesadores: null,
        placas: null,
        ram: null,
        gpu: null,
        almacenamiento: null,
        fuentes: null,
        gabinetes: null
    })

    const paso = PASOS[pasoActual]

    function cambiarPaso(direccion) {
        const nuevoPaso = pasoActual + direccion
        if (nuevoPaso >= 0 && nuevoPaso < PASOS.length) {
            setPasoActual(nuevoPaso)
        }
    }

    function seleccionarPlataforma(marca) {
        if (plataforma !== marca) {
            setPlataforma(marca)
            setSeleccion(prev => ({ ...prev, procesadores: null, placas: null, ram: null }))
        }
        setPasoActual(1)
    }

    function seleccionarComponente(categoria, item) {
        setSeleccion(prev => {
            const nuevaSeleccion = { ...prev, [categoria]: item }

            if (categoria === "placas") {
                if (nuevaSeleccion.ram && nuevaSeleccion.ram.tipo !== item.tipoRam) {
                    nuevaSeleccion.ram = null
                }
                if (nuevaSeleccion.gabinetes && !nuevaSeleccion.gabinetes.formatosSoportados.includes(item.formato)) {
                    nuevaSeleccion.gabinetes = null
                }
            }

            return nuevaSeleccion
        })
    }

    function reiniciarBuild() {
        setPasoActual(0)
        setPlataforma(null)
        setSeleccion({
            procesadores: null,
            placas: null,
            ram: null,
            gpu: null,
            almacenamiento: null,
            fuentes: null,
            gabinetes: null
        })
    }

    // Total y estado de compatibilidad, calculados en cada render (no hace falta guardarlos en useState)
    let total = 0
    let hayConflicto = false
    let detalleConflicto = ""

    PASOS.slice(1).forEach((p) => {
        if (seleccion[p.key]) total += seleccion[p.key].precio
    })

    if (seleccion.procesadores && seleccion.placas && seleccion.procesadores.socket !== seleccion.placas.socket) {
        hayConflicto = true
        detalleConflicto = "CPU y Placa tienen sockets diferentes."
    } else if (seleccion.placas && seleccion.ram && seleccion.placas.tipoRam !== seleccion.ram.tipo) {
        hayConflicto = true
        detalleConflicto = "La memoria RAM no coincide con la tecnología de la placa."
    } else if (seleccion.placas && seleccion.gabinetes && !seleccion.gabinetes.formatosSoportados.includes(seleccion.placas.formato)) {
        hayConflicto = true
        detalleConflicto = "El gabinete no admite el tamaño de la placa madre."
    }

    const productosCompatibles = paso.key !== "plataforma"
        ? (DB_COMPONENTES[paso.key] || []).filter((producto) =>
            comprobarCompatibilidad(paso.key, producto, plataforma, seleccion)
          )
        : []

    return (
        <>
        <div className="wizard-container">
            <section className="window wizard-window">
                <div className="barra-ventana">
                    <img src="/wlogo.svg" alt="" className="wlogo" width="25px"/>
                    <span>Arma tu PC</span>
                    <div className="botones-windows">
                        <button className="boton-colapsar">-</button>
                    </div>
                </div>

                <div className="contenido-ventana">
                    <nav className="wizard-steps" id="wizard-steps">
                        {PASOS.map((p, index) => (
                            <button
                                key={p.key}
                                className={`step-tab ${index === pasoActual ? "active" : ""}`}
                                onClick={() => setPasoActual(index)}
                            >
                                {p.label}
                            </button>
                        ))}
                    </nav>

                    <div className="wizard-content" id="wizard-content">
                        <div className="clippy-helper">
                            <img src="/help.png" alt="Clippy" className="clippy-img"/>
                            <div className="clippy-dialog">
                                {paso.key === "plataforma"
                                    ? "Primero, define con qué fabricante deseas armar tu plataforma base:"
                                    : `Selecciona tu opción para ${paso.label}.`}
                            </div>
                        </div>

                        <div className="grid-productos">
                            {paso.key === "plataforma" ? (
                                ["AMD", "Intel"].map((marca) => (
                                    <div key={marca} className={`item-card ${plataforma === marca ? "selected" : ""}`}>
                                        <img src="/computer.png" className="item-img" alt={marca}/>
                                        <h4>Plataforma {marca}</h4>
                                        <p>Configura procesadores y placas compatibles con {marca}.</p>
                                        <button
                                            className={`btn-retro ${plataforma === marca ? "btn-selected" : ""}`}
                                            onClick={() => seleccionarPlataforma(marca)}
                                        >
                                            {plataforma === marca ? "Seleccionada" : `Elegir ${marca}`}
                                        </button>
                                    </div>
                                ))
                            ) : productosCompatibles.length === 0 ? (
                                <div className="empty-msg">
                                    <p>No hay componentes compatibles disponibles para tu configuración actual.</p>
                                    <p><small>Prueba modificando tus elecciones en los pasos anteriores.</small></p>
                                </div>
                            ) : (
                                productosCompatibles.map((producto) => {
                                    const estaSeleccionado = seleccion[paso.key]?.id === producto.id
                                    return (
                                        <div key={producto.id} className={`item-card ${estaSeleccionado ? "selected" : ""}`}>
                                            <img src={producto.img} className="item-img" alt={producto.nombre}/>
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
                                            <p className="item-price">${producto.precio.toLocaleString("es-CL")}</p>
                                            <button
                                                className={`btn-retro ${estaSeleccionado ? "btn-selected" : ""}`}
                                                onClick={() => seleccionarComponente(paso.key, producto)}
                                            >
                                                {estaSeleccionado ? "Seleccionado" : "Elegir"}
                                            </button>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>

                    <div className="wizard-actions">
                        <button className="btn-retro" disabled={pasoActual === 0} onClick={() => cambiarPaso(-1)}>« Anterior</button>
                        <button className="btn-retro" disabled={pasoActual === PASOS.length - 1} onClick={() => cambiarPaso(1)}>Siguiente »</button>
                    </div>
                </div>
            </section>

            <aside className="window summary-window">
                <div className="window-header">
                    <span className="window-title">Resumen de Construcción</span>
                </div>
                <div className="summary-body">
                    <ul className="summary-list">
                        {PASOS.slice(1).map((p) => {
                            const item = seleccion[p.key]
                            return (
                                <li key={p.key} className="summary-item">
                                    {item ? (
                                        <>
                                            <span><strong>{p.label.split(". ")[1]}:</strong> {item.nombre}</span>
                                            <span>${item.precio.toLocaleString("es-CL")}</span>
                                        </>
                                    ) : (
                                        <span><strong>{p.label.split(". ")[1]}:</strong> <em>Sin seleccionar</em></span>
                                    )}
                                </li>
                            )
                        })}
                    </ul>

                    <div className={`compatibility-box ${hayConflicto ? "status-error" : "status-ok"}`}>
                        <span>{hayConflicto ? `Incompatible: ${detalleConflicto}` : "Sistema compatible hasta el momento."}</span>
                    </div>

                    <div className="summary-total">
                        <span>Total Estimado:</span>
                        <strong>${total.toLocaleString("es-CL")}</strong>
                    </div>

                    <div className="summary-buttons">
                        <button className="btn-retro" onClick={reiniciarBuild}>Reiniciar</button>
                        <button className="btn-retro btn-primary">Agregar al Carrito</button>
                    </div>
                </div>
            </aside>
        </div>
            
        </>
    )
}

export default ArmaTuPC