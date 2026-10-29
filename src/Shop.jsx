import { useState } from "react"
import "./Shop.css"
import ProductoCard from "./components/ProductoCard"
import VentanaApp from "./components/VentanaApp"
import { CATEGORIAS, etiquetaCategoria, obtenerProductos } from "./data/catalogoProductos.js"
import { ORDENES, filtrarProductos, contarPorCategoria } from "./components/tienda/FiltrosTienda.js"

function Shop() {
    // Lógica
    const [productos] = useState(() => obtenerProductos())
    const [categoria, setCategoria] = useState("")
    const [busqueda, setBusqueda] = useState("")
    const [orden, setOrden] = useState("relevancia")

    const conteo = contarPorCategoria(productos)
    const visibles = filtrarProductos(productos, { categoria, busqueda, orden })
    // solo se muestran en el árbol las categorías que tienen productos
    const categoriasConProductos = CATEGORIAS.filter(item => conteo[item.valor])
    const categoriasExtra = Object.keys(conteo).filter(
        valor => !CATEGORIAS.some(item => item.valor === valor)
    )
    const ruta = `C:\\PC Forgery\\Tienda${categoria ? `\\${etiquetaCategoria(categoria)}` : ""}`

    function elegirCategoria(valor) {
        setCategoria(valor)
    }

    // Renderizado
    return (
        <main className="tienda">
            <VentanaApp
                titulo={`Explorando - ${categoria ? etiquetaCategoria(categoria) : "Tienda"}`}
                icono="/shopping-bag.svg"
                menu={["Archivo", "Edición", "Ver", "Favoritos", "Herramientas", "Ayuda"]}
                className="explorador"
                barraHerramientas={
                    <>
                        <button
                            type="button"
                            className="boton-herramienta"
                            onClick={() => elegirCategoria("")}
                            disabled={!categoria}
                        >
                            ⬆ Subir
                        </button>
                        <label className="barra-direccion">
                            <span>Dirección</span>
                            <input type="text" value={ruta} readOnly aria-label="Dirección" />
                        </label>
                        <label className="barra-busqueda">
                            <span>Buscar:</span>
                            <input
                                type="search"
                                placeholder="Nombre o marca..."
                                value={busqueda}
                                onChange={event => setBusqueda(event.target.value)}
                                aria-label="Buscar productos"
                            />
                        </label>
                        <label className="barra-orden">
                            <span>Ordenar:</span>
                            <select
                                value={orden}
                                onChange={event => setOrden(event.target.value)}
                                aria-label="Ordenar productos"
                            >
                                {ORDENES.map(opcion => (
                                    <option key={opcion.valor} value={opcion.valor}>{opcion.etiqueta}</option>
                                ))}
                            </select>
                        </label>
                    </>
                }
                barraEstado={
                    <>
                        <span data-testid="contador-productos">{visibles.length} objeto(s)</span>
                        <span>{categoria ? etiquetaCategoria(categoria) : "Todas las categorías"}</span>
                        <span>🖥 Mi PC</span>
                    </>
                }
            >
                <div className="explorador-cuerpo">
                    {/* Árbol de carpetas = categorías */}
                    <nav className="explorador-arbol" aria-label="Categorías">
                        <p className="explorador-arbol-titulo">Carpetas</p>
                        <button
                            type="button"
                            className={`carpeta ${categoria === "" ? "carpeta-activa" : ""}`}
                            onClick={() => elegirCategoria("")}
                            aria-pressed={categoria === ""}
                        >
                            <img src="/hardware-icon.svg" alt="" />
                            Todas ({productos.length})
                        </button>
                        <div className="carpeta-hijos">
                            {categoriasConProductos.map(item => (
                                <button
                                    type="button"
                                    key={item.valor}
                                    className={`carpeta ${categoria === item.valor ? "carpeta-activa" : ""}`}
                                    onClick={() => elegirCategoria(item.valor)}
                                    aria-pressed={categoria === item.valor}
                                >
                                    <img src="/category-icon.svg" alt="" />
                                    {item.etiqueta} ({conteo[item.valor]})
                                </button>
                            ))}
                            {categoriasExtra.map(valor => (
                                <button
                                    type="button"
                                    key={valor}
                                    className={`carpeta ${categoria === valor ? "carpeta-activa" : ""}`}
                                    onClick={() => elegirCategoria(valor)}
                                    aria-pressed={categoria === valor}
                                >
                                    <img src="/category-icon.svg" alt="" />
                                    {etiquetaCategoria(valor)} ({conteo[valor]})
                                </button>
                            ))}
                        </div>
                    </nav>

                    {/* Vista de íconos = productos */}
                    <div className="explorador-vista">
                        <div className="explorador-encabezado">
                            <img src="/shopping-bag.svg" alt="" />
                            <div>
                                <h1>{categoria ? etiquetaCategoria(categoria) : "Bienvenido a la tienda PC Forgery"}</h1>
                                <p>Selecciona una carpeta para filtrar o busca un producto por su nombre.</p>
                            </div>
                        </div>
                        {visibles.length === 0 ? (
                            <p className="explorador-vacio">
                                No se encontraron productos que coincidan con la búsqueda.
                            </p>
                        ) : (
                            <div className="productos-grid">
                                {visibles.map(producto => (
                                    <ProductoCard key={producto.id} producto={producto} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </VentanaApp>
        </main>
    )
}

export default Shop
