import { useSearchParams } from "react-router-dom"
import "./product.css"
import Resena from "./components/Resena.jsx"
import BotonesWindows from "./components/BotonesWindows.jsx"
import corsair from './assets/corsair.jpg'
import ssd from './assets/ssd.jpg'
import monitor from './assets/monitor.jpg'
import mouse from './assets/mouse.jpg'

function Product() {
    // Lógica
    const [searchParams] = useSearchParams()
    const id = Number(searchParams.get("id"))
    console.log(id)


    const productos = [ { id: 1, nombre: "Corsair K70 RGB Pro", precio: "$129.990", imagen: corsair, descripcion: "Teclado mecánico RGB de alto rendimiento." }, 
        { id: 2, nombre: "Razer DeathAdder V3", precio: "$69.990", imagen: mouse, descripcion: "Mouse gamer ergonómico de alta precisión." }, 
        { id: 3, nombre: "ASUS TUF Gaming", precio: "$289.990", imagen: monitor, descripcion: "Monitor gaming de alto rendimiento." }, 
        { id: 4, nombre: "Samsung 990 EVO 1TB", precio: "$119.990", imagen: ssd, descripcion: "SSD NVMe de 1TB para alto rendimiento." } ]
    
    const producto = productos.find(function(producto) { return producto.id === id })

    if (!producto) 
    { return (  <main className="producto-contenedor"> 
                    <section className="producto"> 
                        <h1>Producto no encontrado</h1> 
                            <p>El producto que buscas no existe.</p> 
                    </section> 
                </main> ) }
    // Renderizado
    return (
        <main className="producto-contenedor">
            <section className="producto">
                <div className="titulo-producto">
                    <h1 className="producto-nombre">
                        {producto.nombre}
                    </h1>
                    <BotonesWindows />
                </div>
                <div className="producto-imagen">
                    <img
                        src={producto.imagen}
                        alt={producto.nombre}
                    />
                    <p className="producto-descripcion">
                        {producto.descripcion}
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