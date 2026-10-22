import { Link } from 'react-router-dom'

function ProductoCard({ id, nombre, imagen, precio }) {
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
                <button>
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