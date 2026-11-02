import { mostrarAlerta, confirmar as confirmarDialogo } from "../dialogo/Dialogo.js"
import { useState, useRef } from "react"
import BotonesWindows from "../BotonesWindows.jsx"
import {
    CATEGORIAS,
    etiquetaCategoria,
    inicializarCatalogo,
    restablecerCatalogo
} from "../../data/catalogoProductos.js"

function MostrarProductos() {
    // El catálogo inicial vive en data/catalogoProductos.js (compartido con la tienda)
    const [productos, setProductos] = useState(() => inicializarCatalogo())

    const [productoEditar, setProductoEditar] = useState(null)
    const refFormulario = useRef(null)

    function iniciarEdicion(producto) {
        setProductoEditar({ ...producto })
        setTimeout(() => {
            if (refFormulario.current) {
                refFormulario.current.scrollIntoView({ behavior: "smooth", block: "start" })
            }
        }, 80)
    }

    function manejarCambio(event) {
        const { name, value, type, checked } = event.target

        setProductoEditar({
            ...productoEditar,
            [name]: type === "checkbox" ? checked : value
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
            mostrarAlerta("Verifica los datos del producto.", { icono: "advertencia" })
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
        mostrarAlerta("Producto actualizado correctamente.")
    }

    async function eliminarProducto(id) {
        const confirmar = await confirmarDialogo(
            "¿Estás seguro de que deseas eliminar este producto?"
        )

        if (!confirmar) return

        const productosActualizados = productos.filter(
            producto => producto.id !== id
        )

        if (productosActualizados.length === 0) {
            setProductos(restablecerCatalogo())
        } else {
            setProductos(productosActualizados)

            localStorage.setItem(
                "productos",
                JSON.stringify(productosActualizados)
            )
        }
    }

    return (
        <section className="contenido">
            <div className="admin-titulo">
                <h2>Mostrar Productos</h2>
                <BotonesWindows />
            </div>

            {productoEditar && (
                <form ref={refFormulario} onSubmit={guardarEdicion} className="p-3 mb-4 border bg-light">
                    <h3>Editar producto #{productoEditar.id}</h3>

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
                            {CATEGORIAS.map(categoria => (
                                <option key={categoria.valor} value={categoria.valor}>{categoria.etiqueta}</option>
                            ))}
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

                    <div className="mb-3 form-check">
                        <input
                            id="nuevo-editar"
                            name="nuevo"
                            type="checkbox"
                            className="form-check-input"
                            checked={Boolean(productoEditar.nuevo)}
                            onChange={manejarCambio}
                        />
                        <label htmlFor="nuevo-editar" className="form-check-label">
                            Mostrar insignia "Nuevo" en la tienda
                        </label>
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

                    <div className="d-flex flex-wrap gap-2">
                        <button type="submit" className="btn btn-admin">
                            Guardar cambios
                        </button>

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setProductoEditar(null)}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            )}

            <div className="admin-tabla-contenedor p-2 p-md-3">
                <table className="table table-bordered table-striped tabla-admin-responsiva mb-0">
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
                                <td data-label="ID">{producto.id}</td>
                                <td data-label="Producto">
                                    <strong>{producto.nombre}</strong>
                                </td>
                                <td data-label="Categoría">{etiquetaCategoria(producto.categoria)}</td>
                                <td data-label="Precio">
                                    ${Number(producto.precio).toLocaleString("es-CL")}
                                </td>
                                <td data-label="Stock">
                                    <span className={Number(producto.stock) <= 3 ? "text-danger fw-bold" : ""}>
                                        {producto.stock}
                                    </span>
                                </td>
                                <td data-label="Acciones">
                                    <button
                                        type="button"
                                        className="btn btn-admin btn-sm me-2 mb-1"
                                        onClick={() => iniciarEdicion(producto)}
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
                                <td colSpan="6" className="text-center py-3">
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
