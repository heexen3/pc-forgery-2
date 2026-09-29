import { useState } from 'react'
import "../components/Header.css"
import { useNavigate, Link } from 'react-router-dom';
import BotonesWindows from './BotonesWindows'

function Nav() {
    // logica
    const [menuAbierto, setMenuAbierto] = useState(false);
    const navigate = useNavigate()

    const usuario = JSON.parse(localStorage.getItem("usuarioActual"))

    function cerrarSesion() {
        localStorage.removeItem("usuarioActual")
        navigate("/Home")
    }
    // renderizado
    return (
    <header>
      <div className="barra-ventana">
        <div className="marca">
          <img src="/wlogo.svg" alt="" className="wlogo" width="25px" />
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
        <a href="/">Inicio</a>
        <a href="/Shop">Tienda</a>
        <a href="/arma-tu-pc">Arma tu PC</a>
        <a href="/comunidad">Comunidad</a>
        <a href="/noticias">Noticias</a>
        <a href="/nosotros">Quiénes somos</a>
        <a href="/contacto">Contacto</a>
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

                <Link to="/Historial">
                    Ver Historial
                </Link>
            </>
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