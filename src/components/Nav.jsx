import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Nav.css'

function Nav() {
    const [menuAbierto, setMenuAbierto] = useState(false)

    return (
    <header>
      <div className="barra-ventana">
        <div className="marca">
          <img src="/wlogo.svg" alt="" className="wlogo" width="25px" />
          <span>PC Forgery</span>
        </div>
        <div className="botones-windows">
          <button>_</button>
          <button>□</button>
          <button>×</button>
        </div>
      </div>
      <button
        className="boton-menu"
        id="boton-menu"
        onClick={() => setMenuAbierto(!menuAbierto)}
        >☰ Menú</button>
      <nav id="menu-navegacion" className={menuAbierto ? "menu-abierto" : ""}>
        <Link to="/">Inicio</Link>
        <Link to="/tienda">Tienda</Link>
        <Link to="/arma-tu-pc">Arma tu PC</Link>
        <Link to="/comunidad">Comunidad</Link>
        <Link to="/noticias">Noticias</Link>
        <Link to="/nosotros">Quiénes somos</Link>
        <Link to="/contacto">Contacto</Link>
        <Link to="/login" id="login-link">Login</Link>
        <Link to="/usuario" id="usuario-link" style={{ display: "none" }}>Usuario</Link>
        <Link to="/admin" id="admin-link" style={{ display: "none" }}>Admin</Link>
        <Link to="/historial" id="admin-historial-link" style={{ display: "none" }}>Ver Historial</Link>
        <a href="#" id="logout-link" style={{ display: "none" }}>Cerrar sesión</a>
      </nav>
    </header>)
}

export default Nav