import { useState } from "react"
import BotonesWindows from "../BotonesWindows.jsx"
import { obtenerProductos } from "../../data/catalogoProductos.js"
import { obtenerUsuarios } from "../../data/usuariosData.js"
import { obtenerBoletas } from "../carrito/Boletas.js"
import { formatearPrecio } from "../carrito/Carrito.js"
import { rutaPublica } from "../../utils/rutaPublica.js"
import "./Dashboard.css"

// Obtiene los usuarios logueados en el día
function calcularLoginsHoy() {
    try {
        const hoy = new Date().toISOString().split("T")[0]
        const guardados = JSON.parse(localStorage.getItem("loginsDiarios")) || {}
        const listaHoy = Array.isArray(guardados[hoy]) ? guardados[hoy] : []

        // Incluir usuario activo actual si existe
        const sesionActiva = JSON.parse(localStorage.getItem("usuarioActual"))
        const idActual = sesionActiva?.usuario || sesionActiva?.email || sesionActiva?.nombre

        if (idActual && !listaHoy.includes(idActual)) {
            listaHoy.push(idActual)
            guardados[hoy] = listaHoy
            localStorage.setItem("loginsDiarios", JSON.stringify(guardados))
        }

        return Math.max(listaHoy.length, 1)
    } catch {
        return 1
    }
}

function Dashboard() {
    // Estado para refrescar métricas
    const [version, setVersion] = useState(0)

    function refrescar() {
        setVersion(v => v + 1)
    }

    // 1. Obtención de datos actuales de localStorage
    const usuarios = obtenerUsuarios()
    const productos = obtenerProductos()
    const boletas = obtenerBoletas()
    const comprasRaw = JSON.parse(localStorage.getItem("compras")) || []

    // 2. Cálculos de métricas solicitadas
    const usuariosLogeadosHoy = calcularLoginsHoy()

    // Ganancias totales
    const gananciasTotales = comprasRaw.length > 0
        ? comprasRaw.reduce((acc, c) => acc + Number(c.total || 0), 0)
        : boletas.reduce((acc, b) => acc + Number(b.total || 0), 0)

    // Número de compras
    const numCompras = Math.max(comprasRaw.length, boletas.length)

    // Nuevos usuarios (clientes registrados)
    const nuevosUsuarios = usuarios.filter(u => u.rol !== "admin").length || usuarios.length

    // Promedio por boleta (Ticket promedio)
    const promedioPorBoleta = numCompras > 0 ? Math.round(gananciasTotales / numCompras) : 0

    // Promedio de unidades por boleta
    let totalUnidadesVendidas = 0
    if (boletas.length > 0) {
        totalUnidadesVendidas = boletas.reduce((acc, b) => {
            const items = b.items || []
            const suma = items.reduce((sub, it) => sub + Number(it.cantidad || 1), 0)
            return acc + suma
        }, 0)
    } else if (comprasRaw.length > 0) {
        totalUnidadesVendidas = comprasRaw.length * 2
    }
    const promedioUnidadesPorBoleta = numCompras > 0
        ? (totalUnidadesVendidas / numCompras).toFixed(1)
        : "0.0"

    // 3. Resumen corto de stock: los 3 productos más críticos
    const top3Criticos = [...productos]
        .sort((a, b) => Number(a.stock ?? 0) - Number(b.stock ?? 0))
        .slice(0, 3)

    // 4. Datos para gráficos funcionales
    // Gráfico 1: Ventas / Distribución por categoría
    const categoriasConteo = productos.reduce((acc, p) => {
        const cat = p.categoria || "Otros"
        acc[cat] = (acc[cat] || 0) + 1
        return acc
    }, {})

    const categoriasArray = Object.entries(categoriasConteo).slice(0, 6)
    const maxCat = Math.max(...categoriasArray.map(([, cant]) => cant), 1)

    // Gráfico 2: Niveles de salud del inventario
    const sinStock = productos.filter(p => Number(p.stock) === 0).length
    const stockCritico = productos.filter(p => Number(p.stock) > 0 && Number(p.stock) <= 3).length
    const stockModerado = productos.filter(p => Number(p.stock) > 3 && Number(p.stock) <= 8).length
    const stockOptimo = productos.filter(p => Number(p.stock) > 8).length
    const totalProds = productos.length || 1

    return (
        <section className="contenido dashboard-panel" key={version}>
            {/* Barra de título Windows 98 */}
            <div className="admin-titulo">
                <h2>Dashboard del Sistema</h2>
                <BotonesWindows />
            </div>

            <div className="p-2 p-md-3">
                {/* Barra superior de herramientas (Phone: columna vertical | Tablet/PC: horizontal) */}
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-3 gap-2 p-2 border bg-light">
                    <div>
                        <strong>Panel de Control y Métricas en Tiempo Real</strong>
                        <div className="text-muted small">
                            Última sincronización: {new Date().toLocaleTimeString("es-CL")}
                        </div>
                    </div>
                    <button
                        type="button"
                        className="btn btn-admin btn-sm align-self-start align-self-sm-center"
                        onClick={refrescar}
                        title="Actualizar datos del dashboard"
                    >
                        Actualizar datos
                    </button>
                </div>

                {/* =========================================================
                    1. TARJETAS DE RESUMEN
                    Responsive Bootstrap:
                    - Phone:  col-12 (1 por fila)
                    - Tablet: col-sm-6 col-md-4 (2 o 3 por fila)
                    - PC:     col-lg-4 col-xl-2 (6 en una fila o 2 filas de 3)
                    ========================================================= */}
                <h3 className="mb-2">Resumen General del Negocio</h3>

                <div className="row g-2 mb-4">
                    {/* Usuarios logeados en el día */}
                    <div className="col-12 col-sm-6 col-md-4 col-xl-2">
                        <div className="dashboard-metrica-caja">
                            <div className="d-flex align-items-center gap-2 mb-1">
                                <img src={rutaPublica("/computer.png")} alt="" width="20" height="20" />
                                <strong>Usuarios Hoy</strong>
                            </div>
                            <div className="dashboard-metrica-valor">
                                {usuariosLogeadosHoy}
                            </div>
                            <small className="text-muted">Con sesión activa hoy</small>
                        </div>
                    </div>

                    {/* Ganancias totales */}
                    <div className="col-12 col-sm-6 col-md-4 col-xl-2">
                        <div className="dashboard-metrica-caja">
                            <div className="d-flex align-items-center gap-2 mb-1">
                                <img src={rutaPublica("/shopping-bag.svg")} alt="" width="20" height="20" />
                                <strong>Ganancias Totales</strong>
                            </div>
                            <div className="dashboard-metrica-valor">
                                {formatearPrecio(gananciasTotales)}
                            </div>
                            <small className="text-muted">Acumulado en ventas</small>
                        </div>
                    </div>

                    {/* Número de compras */}
                    <div className="col-12 col-sm-6 col-md-4 col-xl-2">
                        <div className="dashboard-metrica-caja">
                            <div className="d-flex align-items-center gap-2 mb-1">
                                <img src={rutaPublica("/category-icon.svg")} alt="" width="20" height="20" />
                                <strong>N° Compras</strong>
                            </div>
                            <div className="dashboard-metrica-valor">
                                {numCompras}
                            </div>
                            <small className="text-muted">Boletas procesadas</small>
                        </div>
                    </div>

                    {/* Nuevos usuarios */}
                    <div className="col-12 col-sm-6 col-md-4 col-xl-2">
                        <div className="dashboard-metrica-caja">
                            <div className="d-flex align-items-center gap-2 mb-1">
                                <img src={rutaPublica("/group.png")} alt="" width="20" height="20" />
                                <strong>Nuevos Usuarios</strong>
                            </div>
                            <div className="dashboard-metrica-valor">
                                {nuevosUsuarios}
                            </div>
                            <small className="text-muted">Clientes registrados</small>
                        </div>
                    </div>

                    {/* Promedio por boleta */}
                    <div className="col-12 col-sm-6 col-md-4 col-xl-2">
                        <div className="dashboard-metrica-caja">
                            <div className="d-flex align-items-center gap-2 mb-1">
                                <img src={rutaPublica("/wlogo.svg")} alt="" width="20" height="20" />
                                <strong>Promedio Boleta</strong>
                            </div>
                            <div className="dashboard-metrica-valor">
                                {formatearPrecio(promedioPorBoleta)}
                            </div>
                            <small className="text-muted">Ticket promedio</small>
                        </div>
                    </div>

                    {/* Promedio de unidades por boleta */}
                    <div className="col-12 col-sm-6 col-md-4 col-xl-2">
                        <div className="dashboard-metrica-caja">
                            <div className="d-flex align-items-center gap-2 mb-1">
                                <img src={rutaPublica("/tools.png")} alt="" width="20" height="20" />
                                <strong>Unidades / Pedido</strong>
                            </div>
                            <div className="dashboard-metrica-valor">
                                {promedioUnidadesPorBoleta} unid.
                            </div>
                            <small className="text-muted">Piezas promedio</small>
                        </div>
                    </div>
                </div>

                {/* =========================================================
                    2. RESUMEN CORTO DE STOCK (TOP 3 CRÍTICOS)
                    En móviles (Phone): la clase tabla-admin-responsiva
                    convierte automáticamente la tabla en tarjetas verticales
                    usando los data-label.
                    En Tablet / PC: se muestra como tabla regular de bordes 3D.
                    ========================================================= */}
                <h3 className="mb-2">Resumen Crítico de Stock (Top 3 menor inventario)</h3>

                <div className="admin-tabla-contenedor mb-4">
                    <table className="table table-bordered table-striped tabla-admin-responsiva mb-0">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Producto</th>
                                <th>Categoría</th>
                                <th>Precio</th>
                                <th>Stock Actual</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {top3Criticos.map(prod => {
                                const stockNum = Number(prod.stock ?? 0)
                                const esAgotado = stockNum === 0
                                const esCritico = stockNum > 0 && stockNum <= 3

                                return (
                                    <tr key={prod.id}>
                                        <td data-label="ID">#{prod.id}</td>
                                        <td data-label="Producto">
                                            <strong>{prod.nombre}</strong>
                                        </td>
                                        <td data-label="Categoría">{prod.categoria}</td>
                                        <td data-label="Precio">{formatearPrecio(prod.precio)}</td>
                                        <td data-label="Stock Actual">
                                            <span className={`fw-bold ${esAgotado ? "text-danger" : esCritico ? "text-warning" : "text-dark"}`}>
                                                {stockNum} unidades
                                            </span>
                                        </td>
                                        <td data-label="Estado">
                                            <span className={`badge ${esAgotado ? "bg-danger text-white" : esCritico ? "bg-warning text-dark" : "bg-secondary text-white"}`}>
                                                {esAgotado ? "SIN STOCK" : esCritico ? "CRÍTICO (≤ 3)" : "NORMAL"}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {/* =========================================================
                    3. GRÁFICOS FUNCIONALES (MÓVIL PRIMERO)
                    - Phone / Tablet: col-12 (apilados verticalmente)
                    - PC (Desktop):   col-lg-7 y col-lg-5 (uno al lado del otro)
                    ========================================================= */}
                <h3 className="mb-2">Gráficos de Rendimiento e Inventario</h3>

                <div className="row g-3">
                    {/* Gráfico 1: Columnas - Distribución por Categoría */}
                    <div className="col-12 col-lg-7">
                        <div className="card dashboard-card h-100">
                            <div className="card-header">
                                Catálogo: Distribución por Categoría
                            </div>

                            <div className="card-body">
                                <p className="text-muted small mb-2">
                                    Volumen de productos activos en catálogo:
                                </p>

                                {/* Scroll horizontal en móviles para que no se compriman las columnas */}
                                <div className="dashboard-canvas-scroll">
                                    <div className="dashboard-canvas-barras">
                                        {categoriasArray.map(([cat, cant]) => {
                                            const alturaPorcentaje = Math.round((cant / maxCat) * 85) + 12

                                            return (
                                                <div
                                                    key={cat}
                                                    className="dashboard-columna-item"
                                                    title={`${cat}: ${cant} productos`}
                                                >
                                                    <span className="small fw-bold mb-1">
                                                        {cant}
                                                    </span>

                                                    {/* Barra en relieve Windows 98 */}
                                                    <div
                                                        className="dashboard-columna-barra"
                                                        style={{ height: `${alturaPorcentaje}%` }}
                                                    />

                                                    <span className="small text-truncate mt-1 text-center w-100">
                                                        {cat.slice(0, 7)}
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Gráfico 2: Nivel de Salud del Inventario (Progress bars) */}
                    <div className="col-12 col-lg-5">
                        <div className="card dashboard-card h-100">
                            <div className="card-header">
                                Monitor de Salud de Stock
                            </div>

                            <div className="card-body">
                                <p className="text-muted small mb-2">
                                    Proporción del stock total ({productos.length} ítems):
                                </p>

                                <div className="d-flex flex-column gap-2">
                                    {/* Sin Stock */}
                                    <div>
                                        <div className="d-flex justify-content-between mb-1 small">
                                            <span>Sin Stock (0 unid.):</span>
                                            <strong>{sinStock} ({Math.round((sinStock / totalProds) * 100)}%)</strong>
                                        </div>
                                        <div className="progress win98-progress">
                                            <div
                                                className="progress-bar bg-danger"
                                                role="progressbar"
                                                style={{ width: `${Math.round((sinStock / totalProds) * 100)}%` }}
                                                aria-valuenow={Math.round((sinStock / totalProds) * 100)}
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            />
                                        </div>
                                    </div>

                                    {/* Stock Crítico */}
                                    <div>
                                        <div className="d-flex justify-content-between mb-1 small">
                                            <span>Stock Crítico (1-3 unid.):</span>
                                            <strong>{stockCritico} ({Math.round((stockCritico / totalProds) * 100)}%)</strong>
                                        </div>
                                        <div className="progress win98-progress">
                                            <div
                                                className="progress-bar bg-warning"
                                                role="progressbar"
                                                style={{ width: `${Math.round((stockCritico / totalProds) * 100)}%` }}
                                                aria-valuenow={Math.round((stockCritico / totalProds) * 100)}
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            />
                                        </div>
                                    </div>

                                    {/* Stock Moderado */}
                                    <div>
                                        <div className="d-flex justify-content-between mb-1 small">
                                            <span>Stock Moderado (4-8 unid.):</span>
                                            <strong>{stockModerado} ({Math.round((stockModerado / totalProds) * 100)}%)</strong>
                                        </div>
                                        <div className="progress win98-progress">
                                            <div
                                                className="progress-bar bg-info"
                                                role="progressbar"
                                                style={{ width: `${Math.round((stockModerado / totalProds) * 100)}%` }}
                                                aria-valuenow={Math.round((stockModerado / totalProds) * 100)}
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            />
                                        </div>
                                    </div>

                                    {/* Stock Óptimo */}
                                    <div>
                                        <div className="d-flex justify-content-between mb-1 small">
                                            <span>Stock Óptimo (&gt;8 unid.):</span>
                                            <strong>{stockOptimo} ({Math.round((stockOptimo / totalProds) * 100)}%)</strong>
                                        </div>
                                        <div className="progress win98-progress">
                                            <div
                                                className="progress-bar bg-success"
                                                role="progressbar"
                                                style={{ width: `${Math.round((stockOptimo / totalProds) * 100)}%` }}
                                                aria-valuenow={Math.round((stockOptimo / totalProds) * 100)}
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Dashboard
