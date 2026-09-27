import { useState } from 'react'
import './Header.css'


function Nav() {
    // logica
    const [menuAbierto, setMenuAbierto] = useState(false)

    // renderizado
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
        <a href="/">Inicio</a>
        <a href="/tienda">Tienda</a>
        <a href="/arma-tu-pc">Arma tu PC</a>
        <a href="/comunidad">Comunidad</a>
        <a href="/noticias">Noticias</a>
        <a href="/nosotros">Quiénes somos</a>
        <a href="/contacto">Contacto</a>
        <a href="/login" id="login-link">Login</a>
        <a href="/usuario" id="usuario-link" style={{ display: "none" }}>Usuario</a>
        <a href="/admin" id="admin-link" style={{ display: "none" }}>Admin</a>
        <a href="/historial" id="admin-historial-link" style={{ display: "none" }}>Ver Historial</a>
        <a href="#" id="logout-link" style={{ display: "none" }}>Cerrar sesión</a>
      </nav>
    </header>)
}

export default Nav