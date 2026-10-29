import "./Shop.css"
import ProductoCard from "./components/ProductoCard"
import corsair from './assets/corsair.jpg'
import ssd from './assets/ssd.jpg'
import monitor from './assets/monitor.jpg'
import mouse from './assets/mouse.jpg'
function Shop() {
    // Lógica

    // Renderizado
    return(
        <>
        <main className="tienda">
        <div className="contenedor-bienvenida">
            <h1>Bienvenido a nuestra tienda PC Forgery.</h1>
            <span>Aquí podras ver toda nuestra tienda</span>
        </div>
        <aside className="categorias-contenedor">
            <div className="productos-titulo">
                <img src="/category-icon.svg" alt="" className="category-icon" />
                <h2>Categorías</h2>
            </div>
            <div className="categorias-botones">
            <button className="boton-categoria">Procesadores</button>
            <button className="boton-categoria">Tarjetas gráficas</button>
            <button className="boton-categoria">Memoria RAM</button>
            <button className="boton-categoria">Almacenamiento</button>
            </div>
        </aside>
    <section className="productos">
        <div className="productos-titulo">
            <img src="/shopping-bag.svg" alt="" className="shopping-bag" />
            <h2>Productos</h2>
        </div>
        <ProductoCard
            id="1"
            nombre="Corsair K70 RGB Pro"
            imagen={corsair}
            precio="129.990"
        />
            
        <ProductoCard
            id="2"
            nombre="Razer DeathAdder V3"
            imagen={mouse}
            precio="69.990"
        />
            
        <ProductoCard
            id="3"
            nombre="ASUS TUF Gaming"
            imagen={monitor}
            precio="289.990"
        />
            
        <ProductoCard
            id="4"
            nombre="Samsung 990 EVO 1TB"
            imagen={ssd}
            precio="119.990"
        />
    </section>
    </main>
        </>
    )
}

export default Shop