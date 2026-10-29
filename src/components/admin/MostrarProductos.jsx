import { useState } from "react"

function MostrarProductos() {
    const [productos, setProductos] = useState(() => {
        
        const productosGuardados = localStorage.getItem("productos")

        const productosIniciales = [
            {
                id: 1,
                nombre: "Corsair K70 RGB Pro",
                categoria: "Perifericos",
                precio: 129990,
                stock: 15,
                descripcion: "Teclado mecánico RGB de alto rendimiento.",
                imagen: "/img/corsair.jpg"
            },
            {
                id: 2,
                nombre: "Razer DeathAdder V3",
                categoria: "Perifericos",
                precio: 69990,
                stock: 8,
                descripcion: "Mouse gamer ergonómico de alta precisión.",
                imagen: "/img/mouse.jpg"
            },
            {
                id: 3,
                nombre: "ASUS TUF Gaming",
                categoria: "Monitores",
                precio: 289990,
                stock: 3,
                descripcion: "Monitor gaming de alto rendimiento.",
                imagen: "/img/monitor.jpg"
            },
            {
                id: 4,
                nombre: "Samsung 990 EVO 1TB",
                categoria: "Almacenamiento",
                precio: 119990,
                stock: 0,
                descripcion: "SSD NVMe de 1TB para alto rendimiento.",
                imagen: "/img/ssd.jpg"
            }
        ]

        try {
            if (productosGuardados !== null) {
                const productosParseados = JSON.parse(productosGuardados)

                if (localStorage.getItem("productosInicialesCargados") !== "true") {
                    const nombresIniciales = new Set(
                        productosIniciales.map(producto => producto.nombre)
                    )

                    const productosPersonalizados = productosParseados.filter(
                        producto => !nombresIniciales.has(producto.nombre)
                    )

                    const productosActualizados = [
                        ...productosIniciales,
                        ...productosPersonalizados
                    ].map((producto, index) => ({
                        ...producto,
                        id: index + 1
                    }))

                    localStorage.setItem(
                        "productos",
                        JSON.stringify(productosActualizados)
                    )

                    localStorage.setItem("productosInicialesCargados", "true")

                    return productosActualizados
                }

                return productosParseados
            }
        } catch {
            localStorage.removeItem("productos")
        }

        localStorage.setItem("productos", JSON.stringify(productosIniciales))
        localStorage.setItem("productosInicialesCargados", "true")

        return productosIniciales
    })

    const [productoEditar, setProductoEditar] = useState(null)

    function manejarCambio(event) {
        const { name, value } = event.target

        setProductoEditar({
            ...productoEditar,
            [name]: value
        })
    }

    function guardarEdicion(event) {
        event.preventDefault()

        if (
            !productoEditar.nombre.trim() ||
            !productoEditar.categoria ||
            Number(productoEditar.precio) <= 0 ||
            Number(productoEditar.stock) < 0
        ) {
            alert("Verifica los datos del producto.")
            return
        }

        const productosActualizados = productos.map(producto =>
            producto.id === productoEditar.id
                ? {
                    ...productoEditar,
                    precio: Number(productoEditar.precio),
                    stock: Number(productoEditar.stock)
                }
                : producto
        )

        setProductos(productosActualizados)

        localStorage.setItem(
            "productos",
            JSON.stringify(productosActualizados)
        )

        setProductoEditar(null)
        alert("Producto actualizado correctamente.")
    }

    function eliminarProducto(id) {
    const confirmar = window.confirm(
        "¿Estás seguro de que deseas eliminar este producto?"
    )

    if (!confirmar) return

    const productosActualizados = productos.filter(
        producto => producto.id !== id
    )

    if (productosActualizados.length === 0) {
        const productosIniciales = [
            {
                id: 1,
                nombre: "Corsair K70 RGB Pro",
                categoria: "Perifericos",
                precio: 129990,
                stock: 15,
                descripcion: "Teclado mecánico RGB de alto rendimiento.",
                imagen: "/img/corsair.jpg"
            },
            {
                id: 2,
                nombre: "Razer DeathAdder V3",
                categoria: "Perifericos",
                precio: 69990,
                stock: 8,
                descripcion: "Mouse gamer ergonómico de alta precisión.",
                imagen: "/img/mouse.jpg"
            },
            {
                id: 3,
                nombre: "ASUS TUF Gaming",
                categoria: "Monitores",
                precio: 289990,
                stock: 3,
                descripcion: "Monitor gaming de alto rendimiento.",
                imagen: "/img/monitor.jpg"
            },
            {
                id: 4,
                nombre: "Samsung 990 EVO 1TB",
                categoria: "Almacenamiento",
                precio: 119990,
                stock: 0,
                descripcion: "SSD NVMe de 1TB para alto rendimiento.",
                imagen: "/img/ssd.jpg"
            }
        ]

        setProductos(productosIniciales)

        localStorage.setItem(
            "productos",
            JSON.stringify(productosIniciales)
        )

        localStorage.setItem("productosInicialesCargados", "true")
    } else {
        setProductos(productosActualizados)

        localStorage.setItem(
            "productos",
            JSON.stringify(productosActualizados)
        )
    }}

    return (
        <section className="contenido">
            <div className="admin-titulo">
                <h2>Mostrar Productos</h2>
            </div>

            {productoEditar && (
                <form onSubmit={guardarEdicion} className="mb-4">
                    <h3>Editar producto</h3>

                    <div className="mb-3">
                        <label htmlFor="nombre-editar" className="form-label">
                            Nombre
                        </label>
                        <input
                            id="nombre-editar"
                            name="nombre"
                            type="text"
                            className="form-control"
                            value={productoEditar.nombre}
                            onChange={manejarCambio}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="categoria-editar" className="form-label">
                            Categoría
                        </label>
                        <select
                            id="categoria-editar"
                            name="categoria"
                            className="form-select"
                            value={productoEditar.categoria}
                            onChange={manejarCambio}
                            required
                        >
                            <option value="">Selecciona una categoría</option>
                            <option value="Perifericos">Periféricos</option>
                            <option value="Componentes">Componentes</option>
                            <option value="Monitores">Monitores</option>
                            <option value="Almacenamiento">Almacenamiento</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="precio-editar" className="form-label">
                            Precio (CLP)
                        </label>
                        <input
                            id="precio-editar"
                            name="precio"
                            type="number"
                            min="1"
                            step="1"
                            className="form-control"
                            value={productoEditar.precio}
                            onChange={manejarCambio}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="stock-editar" className="form-label">
                            Stock
                        </label>
                        <input
                            id="stock-editar"
                            name="stock"
                            type="number"
                            min="0"
                            step="1"
                            className="form-control"
                            value={productoEditar.stock}
                            onChange={manejarCambio}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="descripcion-editar" className="form-label">
                            Descripción
                        </label>
                        <textarea
                            id="descripcion-editar"
                            name="descripcion"
                            className="form-control"
                            rows="3"
                            value={productoEditar.descripcion || ""}
                            onChange={manejarCambio}
                        />
                    </div>

                    <button type="submit" className="btn btn-admin me-2">
                        Guardar cambios
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setProductoEditar(null)}
                    >
                        Cancelar
                    </button>
                </form>
            )}

            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Producto</th>
                            <th>Categoría</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {productos.map(producto => (
                            <tr key={producto.id}>
                                <td>{producto.id}</td>
                                <td>{producto.nombre}</td>
                                <td>{producto.categoria}</td>
                                <td>
                                    ${Number(producto.precio).toLocaleString("es-CL")}
                                </td>
                                <td>{producto.stock}</td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-admin btn-sm me-2 mb-1"
                                        onClick={() => setProductoEditar({ ...producto })}
                                    >
                                        Editar
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm mb-1"
                                        onClick={() => eliminarProducto(producto.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {productos.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center">
                                    No hay productos registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    )
}

export default MostrarProductos

