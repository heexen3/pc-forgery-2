import { Link } from 'react-router-dom'
import { agregarAlCarrito, formatearPrecio } from './carrito/Carrito.js'
import { obtenerInsignias } from './tienda/FiltrosTienda.js'

function ProductoCard({ producto }) {
    const { id, nombre, imagen, precio } = producto
    const agotado = Number(producto.stock) <= 0
    const insignias = obtenerInsignias(producto)

    function agregar() {
        const resultado = agregarAlCarrito({
            productoId: Number(id),
            nombre,
            imagen,
            precio
        })
        alert(resultado.mensaje)
    }

    return (
        <div className={`producto-card ${agotado ? "producto-agotado" : ""}`}>
            <div className="producto-card-imagen">
                <Link to={`/producto/${id}`}>
                    <img src={imagen || "/questionmark.png"} alt={nombre} />
                </Link>
                {insignias.length > 0 && (
                    <div className="insignias">
                        {insignias.map(insignia => (
                            <span key={insignia.tipo} className={`insignia insignia-${insignia.tipo}`}>
                                {insignia.texto}
                            </span>
                        ))}
                    </div>
                )}
            </div>
            <Link to={`/producto/${id}`} className="producto-card-nombre">
                {nombre}
            </Link>
            <p className="producto-card-precio">{formatearPrecio(precio)}</p>
            <div className="producto-card-botones">
                <button onClick={agregar} disabled={agotado} aria-label={`Agregar ${nombre} al carrito`}>
                    {agotado ? "Sin stock" : "Agregar al carrito"}
                </button>
                <Link to={`/producto/${id}`} className="boton-enlace">
                    Ver detalles
                </Link>
            </div>
        </div>
    )
}

export default ProductoCard
