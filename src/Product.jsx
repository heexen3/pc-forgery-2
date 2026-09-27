import { useSearchParams } from "react-router-dom"
import "./product.css"
import Resena from "./components/Resena.jsx"
import BotonesWindows from "./components/BotonesWindows.jsx"

function Product() {

    const [searchParams] = useSearchParams()
    const id = searchParams.get("id")

    return (
        <main className="producto-contenedor">
            <section className="producto">
                <div className="titulo-producto">
                    <h1 className="producto-nombre">
                        Nombre del Producto
                    </h1>
                    <BotonesWindows />
                </div>
                <div className="producto-imagen">
                    <img
                        src="/img/producto1.png"
                        alt="Imagen del producto"
                    />
                    <p className="producto-descripcion">
                        Descripción del producto aquí.
                    </p>
                </div>
                <div className="producto-detalles">
                    <p className="producto-precio">
                        $Precio
                    </p>
                    <button className="producto-agregar-carrito">
                        Agregar al carrito
                    </button>
                </div>
            </section>
            <section className="producto-reseña">
                <div className="titulo-reseña">
                    <h2>Reseñas del producto</h2>
                    <BotonesWindows />
                </div>
                <div className="reseñas">
                    <Resena
                        usuario="Adolfo_Hernandez"
                        texto="¡NEIN NEIN NEIN!"
                    />
                    <Resena
                        usuario="Usuario2"
                        texto="Reseña del producto aquí."
                    />
                </div>
            </section>
        </main>
    )
}

export default Product