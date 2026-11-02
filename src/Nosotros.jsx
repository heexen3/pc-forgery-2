import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./Nosotros.css"
import { rutaPublica } from "./utils/rutaPublica.js"

// Pestañas del cuadro "Propiedades de PC Forgery"
const PESTANAS = [
    { id: "general", etiqueta: "General" },
    { id: "mision-vision", etiqueta: "Misión y Visión" },
    { id: "historia", etiqueta: "Historia" },
    { id: "equipo", etiqueta: "Equipo" }
]

const HISTORIA = [
    {
        anio: "2023",
        titulo: "El PC de la bodega",
        texto: "Ordenando la bodega de su tío, Daniel encuentra un Pentium II con Windows 98. Junto a Luis y J. Vargas, compañeros de estudios, pasan un fin de semana entero cambiándole la fuente y la RAM hasta que vuelve a sonar el clásico inicio de Windows."
    },
    {
        anio: "2024",
        titulo: "Armados por encargo",
        texto: "La noticia corre: familiares y compañeros les piden ayuda para armar sus PC. Arman una planilla con precios de tiendas chilenas y un grupo de WhatsApp llamado \"Los Forjadores\" para resolver dudas de compatibilidad."
    },
    {
        anio: "2025",
        titulo: "Nace PC Forgery",
        texto: "Del verbo forjar: cada PC se arma pieza por pieza. Los tres amigos deciden convertir su planilla en una tienda y su grupo de WhatsApp en una comunidad abierta."
    },
    {
        anio: "2026",
        titulo: "PC Forgery 98",
        texto: "Llega la tienda en línea con Arma tu PC, boletas electrónicas y foro de la comunidad, vestida como el Windows que los inspiró. El Pentium II sigue funcionando y tiene un lugar de honor en el escritorio."
    }
]

const EQUIPO = [
    {
        nombre: "Luis",
        rol: "Ventas y armado de equipos",
        frase: "Si no prende al primer intento, revisa el cable de 8 pines.",
        icono: "/tools.png"
    },
    {
        nombre: "Daniel",
        rol: "Soporte técnico y comunidad",
        frase: "El dueño original del Pentium II (bueno, su tío).",
        icono: "/computer.png"
    },
    {
        nombre: "J. Vargas",
        rol: "Diseño y experiencia retro",
        frase: "Cree que todo se ve mejor con un borde biselado.",
        icono: "/net.png"
    }
]

function Nosotros() {
    const [pestana, setPestana] = useState("general")
    const navigate = useNavigate()

    // Flechas izquierda/derecha para cambiar de pestaña con el teclado
    function teclaPestana(event) {
        const indice = PESTANAS.findIndex(p => p.id === pestana)
        let siguiente = null
        if (event.key === "ArrowRight") siguiente = (indice + 1) % PESTANAS.length
        if (event.key === "ArrowLeft") siguiente = (indice - 1 + PESTANAS.length) % PESTANAS.length
        if (siguiente === null) return
        event.preventDefault()
        setPestana(PESTANAS[siguiente].id)
        document.getElementById(`pestana-${PESTANAS[siguiente].id}`)?.focus()
    }

    return (
        <main className="nosotros">
            <section className="propiedades ventana-animada" aria-labelledby="titulo-nosotros">
                <div className="propiedades-titulo">
                    <img src={rutaPublica("/computer2.png")} alt="" />
                    <h1 id="titulo-nosotros">Propiedades de PC Forgery — Quiénes Somos</h1>
                    <div className="propiedades-controles" aria-hidden="true">
                        <span>?</span>
                        <span>×</span>
                    </div>
                </div>

                <div className="propiedades-pestanas" role="tablist" aria-label="Secciones de Quiénes Somos">
                    {PESTANAS.map(p => (
                        <button
                            key={p.id}
                            id={`pestana-${p.id}`}
                            type="button"
                            role="tab"
                            aria-selected={pestana === p.id}
                            aria-controls={`panel-${p.id}`}
                            tabIndex={pestana === p.id ? 0 : -1}
                            className={pestana === p.id ? "activa" : ""}
                            onClick={() => setPestana(p.id)}
                            onKeyDown={teclaPestana}
                        >
                            {p.etiqueta}
                        </button>
                    ))}
                </div>

                <div
                    className="propiedades-panel"
                    role="tabpanel"
                    id={`panel-${pestana}`}
                    aria-labelledby={`pestana-${pestana}`}
                >
                    {pestana === "general" && (
                        <div className="panel-general">
                            <div className="general-monitor">
                                <img src={rutaPublica("/computer2.png")} alt="" />
                            </div>
                            <div className="general-info">
                                <h2>¿Qué es PC Forgery?</h2>
                                <p>
                                    Somos una tienda chilena de componentes de PC hecha por tres amigos que
                                    aprendieron a armar computadores reviviendo uno de 1998. Vendemos piezas,
                                    te ayudamos a que sean compatibles y explicamos todo sin tecnicismos.
                                </p>
                                <dl className="general-ficha">
                                    <dt>Sistema:</dt>
                                    <dd>PC Forgery 98, Segunda Edición</dd>
                                    <dt>Registrado a:</dt>
                                    <dd>La comunidad PC Forgery, Santiago de Chile</dd>
                                    <dt>Equipo:</dt>
                                    <dd>3 amigos, 1 cautín y mucho café</dd>
                                    <dt>Precios:</dt>
                                    <dd>En pesos chilenos, IVA incluido</dd>
                                </dl>
                                <div className="general-acciones">
                                    <Link to="/arma-tu-pc" className="propiedades-enlace">Arma tu PC</Link>
                                    <Link to="/comunidad" className="propiedades-enlace">Únete a la comunidad</Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {pestana === "mision-vision" && (
                        <div className="panel-mision-vision">
                            <fieldset className="grupo-retro">
                                <legend><h2>Misión</h2></legend>
                                <p>
                                    Que cualquier persona en Chile pueda armar su propio PC sin miedo:
                                    componentes compatibles, precios claros con IVA incluido y una comunidad
                                    que responde las dudas con paciencia, como lo hicimos entre nosotros
                                    con el PC de la bodega.
                                </p>
                            </fieldset>
                            <fieldset className="grupo-retro">
                                <legend><h2>Visión</h2></legend>
                                <p>
                                    Ser el punto de encuentro de quienes arman PC en Chile, donde comprar
                                    piezas y aprender sea tan entretenido como encender un computador de los 90
                                    por primera vez.
                                </p>
                            </fieldset>
                            <fieldset className="grupo-retro">
                                <legend><h2>Lo que nos importa</h2></legend>
                                <ul className="lista-valores">
                                    <li><strong>Compatibilidad:</strong> te avisamos si una pieza no calza con otra.</li>
                                    <li><strong>Transparencia:</strong> el precio que ves es el que pagas.</li>
                                    <li><strong>Comunidad:</strong> nadie nace sabiendo armar un PC.</li>
                                    <li><strong>Nostalgia:</strong> lo nuevo también puede verse como en 1998.</li>
                                </ul>
                            </fieldset>
                        </div>
                    )}

                    {pestana === "historia" && (
                        <div className="panel-historia">
                            <h2>Nuestra historia</h2>
                            <ol className="linea-tiempo">
                                {HISTORIA.map(hito => (
                                    <li key={hito.anio}>
                                        <span className="linea-tiempo-anio">{hito.anio}</span>
                                        <div className="linea-tiempo-contenido">
                                            <h3>{hito.titulo}</h3>
                                            <p>{hito.texto}</p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}

                    {pestana === "equipo" && (
                        <div className="panel-equipo">
                            <h2>El equipo</h2>
                            <ul className="tarjetas-equipo">
                                {EQUIPO.map(persona => (
                                    <li key={persona.nombre} className="tarjeta-equipo">
                                        <img src={rutaPublica(persona.icono)} alt="" />
                                        <div>
                                            <h3>{persona.nombre}</h3>
                                            <p className="tarjeta-equipo-rol">{persona.rol}</p>
                                            <p>"{persona.frase}"</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="propiedades-botones">
                    <button type="button" onClick={() => navigate("/")}>Aceptar</button>
                    <button type="button" onClick={() => navigate("/")}>Cancelar</button>
                    <button type="button" disabled>Aplicar</button>
                </div>
            </section>
        </main>
    )
}

export default Nosotros
