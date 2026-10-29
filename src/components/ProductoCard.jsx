import { Link } from 'react-router-dom'
import { agregarAlCarrito } from './carrito/Carrito.js'

function ProductoCard({ id, nombre, imagen, precio }) {
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
        <article>
            <div className="productos-titulo">
                <span>{nombre}</span>
            </div>
            <div className="productos-botones">
                <img
                    src={imagen}
                    alt={nombre}
                />
                <p>
                    Precio: ${precio}
                </p>
                <button onClick={agregar}>
                    Agregar al carrito
                </button>
                <Link to={`/Shop/Product?id=${id}`}>
                    <button>
                        Ver detalles
                    </button>
                </Link>
            </div>
        </article>
    )
}

export default ProductoCard