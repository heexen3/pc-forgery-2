import { useEffect, useRef, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import useCarrito from "../carrito/useCarrito.js"
import { contarProductos } from "../carrito/Carrito.js"
import { rutaPublica } from "../../utils/rutaPublica.js"

function leerUsuario() {
    try {
        return JSON.parse(localStorage.getItem("usuarioActual"))
    } catch {
        return null
    }
}

// Íconos chicos junto al reloj: cuenta de usuario y carrito con su cantidad
function BandejaSistema() {
    const [menuAbierto, setMenuAbierto] = useState(false)
    const contenedor = useRef(null)
    const navigate = useNavigate()
    // useLocation hace que la bandeja se vuelva a leer al cambiar de página (ej. después del login)
    useLocation()
    const usuario = leerUsuario()
    const cantidad = contarProductos(useCarrito())

    useEffect(() => {
        if (!menuAbierto) return undefined
        function clicFuera(event) {
            if (contenedor.current && !contenedor.current.contains(event.target)) setMenuAbierto(false)
        }
        function tecla(event) {
            if (event.key === "Escape") setMenuAbierto(false)
        }
        document.addEventListener("mousedown", clicFuera)
        document.addEventListener("keydown", tecla)
        return () => {
            document.removeEventListener("mousedown", clicFuera)
            document.removeEventListener("keydown", tecla)
        }
    }, [menuAbierto])

    function cerrarSesion() {
        localStorage.removeItem("usuarioActual")
        setMenuAbierto(false)
        navigate("/Home")
    }

    const textoCarrito = `Carrito: ${cantidad} ${cantidad === 1 ? "producto" : "productos"}`

    return (
        <div className="bandeja-iconos" ref={contenedor}>
            {usuario ? (
                <button
                    type="button"
                    className="bandeja-icono"
                    aria-haspopup="menu"
                    aria-expanded={menuAbierto}
                    aria-label={`Cuenta de ${usuario.usuario}`}
                    title={`Sesión iniciada como ${usuario.usuario}`}
                    onClick={() => setMenuAbierto(!menuAbierto)}
                >
                    <img src={rutaPublica("/us.png")} alt="" />
                    <span className="bandeja-nombre">{usuario.usuario}</span>
                </button>
            ) : (
                <Link to="/Login" className="bandeja-icono" aria-label="Iniciar sesión" title="Iniciar sesión">
                    <img src={rutaPublica("/us.png")} alt="" />
                </Link>
            )}

            <Link to="/Carrito" className="bandeja-icono" aria-label={textoCarrito} title={textoCarrito}>
                <img src={rutaPublica("/carrito-retro.svg")} alt="" />
                {cantidad > 0 && (
                    <span className="bandeja-insignia" aria-hidden="true">
                        {cantidad > 99 ? "99+" : cantidad}
                    </span>
                )}
            </Link>

            {menuAbierto && usuario && (
                <div className="menu-bandeja" role="menu" onClick={() => setMenuAbierto(false)}>
                    <p className="menu-bandeja-titulo">{usuario.usuario}</p>
                    <Link to="/Usuario" role="menuitem">Mi perfil</Link>
                    {usuario.rol === "admin" && (
                        <Link to="/Admin" role="menuitem">Panel de administración</Link>
                    )}
                    <Link to="/MisCompras" role="menuitem">Mis compras</Link>
                    <hr />
                    <button type="button" role="menuitem" onClick={cerrarSesion}>Cerrar sesión</button>
                </div>
            )}
        </div>
    )
}

export default BandejaSistema
