import { useState } from 'react'
import "../components/Header.css"
import { useNavigate, Link } from 'react-router-dom';
import BotonesWindows from './BotonesWindows'
import useCarrito from './carrito/useCarrito.js'
import { contarProductos } from './carrito/Carrito.js'
import { rutaPublica } from "../utils/rutaPublica.js"

function Nav() {
    // logica
    const [menuAbierto, setMenuAbierto] = useState(false);
    const navigate = useNavigate()

    const usuario = JSON.parse(localStorage.getItem("usuarioActual"))
    const cantidadCarrito = contarProductos(useCarrito())

    function cerrarSesion() {
        localStorage.removeItem("usuarioActual")
        navigate("/Home")
    }
    // renderizado
    return (
    <header>
      <div className="barra-ventana">
        <div className="marca">
          <img src={rutaPublica("/wlogo.svg")} alt="" className="wlogo" width="25px" />
          <span>PC Forgery</span>
        </div>
        <BotonesWindows/>
      </div>
      <button className="boton-menu" 
      id="boton-menu"
      onClick={() => setMenuAbierto(!menuAbierto)}>
        ☰ Menú
      </button>
      <nav id="menu-navegacion" className={menuAbierto ? "menu-abierto" : ""}>
        <Link to="/">Inicio</Link>
        <Link to="/Shop">Tienda</Link>
        <Link to="/arma-tu-pc">Arma tu PC</Link>
        <Link to="/comunidad">Comunidad</Link>
        <Link to="/noticias">Noticias</Link>
        <Link to="/nosotros">Quiénes somos</Link>
        <Link to="/contacto">Contacto</Link>
        <Link to="/Carrito">
            Carrito ({cantidadCarrito})
        </Link>
        {!usuario && (
            <Link to="/Login">
                Login
            </Link>
        )}

        {usuario && usuario.rol === "usuario" && (
            <Link to="/Usuario">
                Usuario
            </Link>
        )}

        {usuario && usuario.rol === "admin" && (
            <>
                <Link to="/Admin">
                    Admin
                </Link>
            </>
        )}

        {usuario && (
            <Link to="/MisCompras">
                Mis compras
            </Link>
        )}

        {usuario && (
            <a onClick={cerrarSesion}>
                Cerrar sesión
            </a>
        )}
      </nav>
    </header>)
}

export default Nav