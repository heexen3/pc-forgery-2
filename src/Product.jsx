import { mostrarAlerta } from "./components/dialogo/Dialogo.js"
import { useState } from "react"
import { Link, useParams, useSearchParams } from "react-router-dom"
import "./Product.css"
import Resena from "./components/Resena.jsx"
import ProductoCard from "./components/ProductoCard.jsx"
import { agregarAlCarrito, formatearPrecio } from "./components/carrito/Carrito.js"
import { etiquetaCategoria, obtenerProducto, obtenerProductos } from "./data/catalogoProductos.js"
import { obtenerInsignias } from "./components/tienda/FiltrosTienda.js"
import { rutaPublica } from "./utils/rutaPublica.js"
import {
    agregarResena,
    obtenerResenas,
    resumenResenas,
    textoEstrellas
} from "./components/resenas/Resenas.js"

const PESTANAS = [
    { id: "general", etiqueta: "General" },
    { id: "especificaciones", etiqueta: "Especificaciones" },
    { id: "resenas", etiqueta: "Reseñas" }
]

const MAXIMO_RELACIONADOS = 4

function leerUsuarioActual() {
    try {
        return JSON.parse(localStorage.getItem("usuarioActual"))
    } catch {
        return null
    }
}

// Sirve para /producto/:id y para la ruta antigua /Shop/Product?id=
function Product() {
    const [searchParams] = useSearchParams()
    const { id: idRuta } = useParams()
    const id = Number(idRuta ?? searchParams.get("id"))
    // key: al navegar a un producto relacionado se reinicia el estado del detalle
    return <DetalleProducto key={id} id={id} />
}

function DetalleProducto({ id }) {
    // Lógica
    const producto = obtenerProducto(id)
    const usuario = leerUsuarioActual()
    const [pestana, setPestana] = useState("general")
    const [resenas, setResenas] = useState(() => obtenerResenas(id))
    const [estrellas, setEstrellas] = useState(0)
    const [comentario, setComentario] = useState("")
    const [mensajeResena, setMensajeResena] = useState("")

    if (!producto) {
        return (
            <main className="producto-contenedor">
                <div className="producto ventana-animada">
                    <div className="titulo-producto">
                        <h1 className="producto-nombre">Producto no encontrado</h1>
                    </div>
                    <div className="producto-error">
                        <img src={rutaPublica("/questionmark.png")} alt="" />
                        <p>El producto que buscas no existe.</p>
                        <Link to="/Shop" className="boton-enlace">Volver a la tienda</Link>
                    </div>
                </div>
            </main>
        )
    }

    const agotado = Number(producto.stock) <= 0
    const insignias = obtenerInsignias(producto)
    const { promedio, cantidad } = resumenResenas(resenas)
    const especificaciones = Object.entries(producto.especificaciones || {})
    const relacionados = obtenerProductos()
        .filter(item => item.categoria === producto.categoria && Number(item.id) !== Number(producto.id))
        .slice(0, MAXIMO_RELACIONADOS)

    function agregar() {
        const resultado = agregarAlCarrito({
            productoId: Number(producto.id),
            nombre: producto.nombre,
            imagen: producto.imagen,
            precio: producto.precio
        })
        mostrarAlerta(resultado.mensaje, { icono: resultado.ok ? "info" : "error" })
    }

    function publicarResena(event) {
        event.preventDefault()
        const resultado = agregarResena(usuario, producto.id, { estrellas, comentario })
        setResenas(resultado.resenas)
        setMensajeResena(resultado.mensaje)
        if (resultado.ok) {
            setEstrellas(0)
            setComentario("")
        }
    }

    // Renderizado
    return (
        <main className="producto-contenedor">
            {/* Ventana de "Propiedades" estilo Windows 98 */}
            <div className="producto ventana-animada">
                <div className="titulo-producto">
                    <img src={rutaPublica("/wlogo.svg")} alt="" className="wlogo" width="20" />
                    <span>Propiedades de {producto.nombre}</span>
                    <div className="botones-titulo" aria-hidden="true">
                        <span>?</span>
                        <span>×</span>
                    </div>
                </div>

                <div className="pestanas" role="tablist" aria-label="Información del producto">
                    {PESTANAS.map(item => (
                        <button
                            key={item.id}
                            type="button"
                            role="tab"
                            id={`pestana-${item.id}`}
                            aria-selected={pestana === item.id}
                            aria-controls={`panel-${item.id}`}
                            className={`pestana ${pestana === item.id ? "pestana-activa" : ""}`}
                            onClick={() => setPestana(item.id)}
                        >
                            {item.etiqueta}{item.id === "resenas" ? ` (${cantidad})` : ""}
                        </button>
                    ))}
                </div>

                <div
                    className="panel-pestana"
                    role="tabpanel"
                    id={`panel-${pestana}`}
                    aria-labelledby={`pestana-${pestana}`}
                >
                    {pestana === "general" && (
                        <div className="producto-general">
                            <div className="producto-imagen">
                                <img src={rutaPublica(producto.imagen || "/questionmark.png")} alt={producto.nombre} />
                            </div>
                            <div className="producto-info">
                                <h1 className="producto-nombre">{producto.nombre}</h1>
                                {insignias.length > 0 && (
                                    <div className="producto-insignias">
                                        {insignias.map(insignia => (
                                            <span key={insignia.tipo} className={`insignia insignia-${insignia.tipo}`}>
                                                {insignia.texto}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <p className="producto-descripcion">{producto.descripcion}</p>
                                <table className="tabla-propiedades">
                                    <tbody>
                                        <tr><th>Categoría:</th><td>{etiquetaCategoria(producto.categoria)}</td></tr>
                                        {producto.marca && <tr><th>Marca:</th><td>{producto.marca}</td></tr>}
                                        <tr>
                                            <th>Disponibilidad:</th>
                                            <td>{agotado ? "Agotado" : `${producto.stock} unidades en stock`}</td>
                                        </tr>
                                        <tr>
                                            <th>Valoración:</th>
                                            <td>
                                                {cantidad > 0
                                                    ? `${textoEstrellas(promedio)} ${promedio.toFixed(1)} (${cantidad})`
                                                    : "Sin reseñas"}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <p className="producto-precio">{formatearPrecio(producto.precio)}</p>
                                <p className="producto-iva">Precio con IVA incluido</p>
                                <button
                                    className="producto-agregar-carrito"
                                    onClick={agregar}
                                    disabled={agotado}
                                >
                                    {agotado ? "Sin stock" : "Agregar al carrito"}
                                </button>
                            </div>
                        </div>
                    )}

                    {pestana === "especificaciones" && (
                        especificaciones.length === 0 ? (
                            <p>Este producto aún no tiene especificaciones registradas.</p>
                        ) : (
                            <table className="tabla-especificaciones">
                                <thead>
                                    <tr><th>Propiedad</th><th>Valor</th></tr>
                                </thead>
                                <tbody>
                                    {especificaciones.map(([clave, valor]) => (
                                        <tr key={clave}><td>{clave}</td><td>{valor}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        )
                    )}

                    {pestana === "resenas" && (
                        <div className="producto-resenas">
                            <div className="resumen-resenas" data-testid="resumen-resenas">
                                <span className="resumen-estrellas">{textoEstrellas(promedio)}</span>
                                <span>
                                    {cantidad > 0
                                        ? `${promedio.toFixed(1)} de 5 · ${cantidad} reseña${cantidad === 1 ? "" : "s"}`
                                        : "Aún no hay reseñas. ¡Sé el primero en opinar!"}
                                </span>
                            </div>

                            {usuario ? (
                                <form className="form-resena" onSubmit={publicarResena}>
                                    <fieldset>
                                        <legend>Escribe tu reseña como {usuario.usuario || usuario.email}</legend>
                                        <div className="selector-estrellas" role="group" aria-label="Calificación">
                                            {[1, 2, 3, 4, 5].map(valor => (
                                                <button
                                                    key={valor}
                                                    type="button"
                                                    className={valor <= estrellas ? "estrella-activa" : ""}
                                                    aria-label={`${valor} estrella${valor === 1 ? "" : "s"}`}
                                                    aria-pressed={valor === estrellas}
                                                    onClick={() => setEstrellas(valor)}
                                                >
                                                    {valor <= estrellas ? "★" : "☆"}
                                                </button>
                                            ))}
                                        </div>
                                        <label htmlFor="comentario-resena">Comentario:</label>
                                        <textarea
                                            id="comentario-resena"
                                            rows="3"
                                            maxLength={500}
                                            value={comentario}
                                            onChange={event => setComentario(event.target.value)}
                                        />
                                        <button type="submit">Publicar reseña</button>
                                    </fieldset>
                                </form>
                            ) : (
                                <p className="aviso-login">
                                    <Link to="/Login">Inicia sesión</Link> para dejar tu reseña.
                                </p>
                            )}
                            {mensajeResena && <p className="mensaje-resena" role="status">{mensajeResena}</p>}

                            <div className="reseñas">
                                {resenas.map(resena => (
                                    <Resena key={resena.id} {...resena} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="producto-acciones">
                    <Link to="/Shop" className="boton-enlace">Volver a la tienda</Link>
                    <button type="button" onClick={() => setPestana("resenas")}>Ver reseñas</button>
                </div>
            </div>

            {relacionados.length > 0 && (
                <div className="producto-relacionados ventana-animada">
                    <div className="titulo-producto">
                        <img src={rutaPublica("/wlogo.svg")} alt="" className="wlogo" width="20" />
                        <h2>Productos relacionados</h2>
                    </div>
                    <div className="productos-grid">
                        {relacionados.map(item => (
                            <ProductoCard key={item.id} producto={item} />
                        ))}
                    </div>
                </div>
            )}
        </main>
    )
}

export default Product
