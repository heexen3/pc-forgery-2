import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import Home from './Home.jsx'
import Shop from './Shop.jsx'
import Product from './Product.jsx'
import Login from './Login.jsx'
import Register from './Register.jsx'
import Admin from './Admin.jsx'
import Usuario from './Usuario.jsx'
import Noticia from './Noticias.jsx'
import NoticiaDetalle from './NoticiaDetalle.jsx'
import Comunidad from './Comunidad.jsx'
import Contacto from './Contacto.jsx'
import NuevoHilo from './NuevoHilo.jsx'
import Carrito from './Carrito.jsx'
import Boleta from './Boleta.jsx'
import MisCompras from './MisCompras.jsx'
import ArmaTuPC from './ArmaTuPC.jsx'
import BarraTareas from './components/escritorio/BarraTareas.jsx'
import PantallaArranque from './components/escritorio/PantallaArranque.jsx'
import DialogoWindows from './components/dialogo/DialogoWindows.jsx'
// Base del sitio definida en vite.config.js ("/pc-forgery-2/" para GitHub Pages; "/" si no se configura).
// React Router espera el basename sin la barra final.
const BASENAME = import.meta.env.BASE_URL.replace(/\/+$/, "") || "/"

function App() {
    return (
      <>
        <BrowserRouter basename={BASENAME}>
            <Nav />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Home" element={<Home />}/>
                {/* Conjunto de tienda y detalle de productos */}
                <Route path="/Shop" element={<Shop />}/>
                <Route path="/producto/:id" element={<Product />}/>
                {/* ruta antigua del detalle (?id=), se mantiene por compatibilidad */}
                <Route path="/Shop/Product" element={<Product />}/>
                {/* Carrito de compras y boletas */}
                <Route path="/Carrito" element={<Carrito />} />
                <Route path="/Boleta" element={<Boleta />} />
                <Route path="/MisCompras" element={<MisCompras />} />
                {/* Arma tu PC */}
                <Route path="/arma-tu-pc" element={<ArmaTuPC />} />
                {/* Registro y Login */}
                <Route path="/Login" element={<Login />} />
                <Route path="/Register" element={<Register />} />
                {/* Rutas de usuario y admin */}
                <Route path="/Usuario" element={<Usuario />} />
                <Route path="/Admin" element={<Admin />} />
                {/* Noticias */}
                <Route path="/Noticias" element={<Noticia />} />
                <Route path="/noticias/detalle" element={<NoticiaDetalle />} />
                {/* Comunidad */}
                <Route path="/comunidad" element={<Comunidad />} />
                <Route path="/comunidad/nuevo-hilo" element={<NuevoHilo />} />
                {/* Contacto */}
                <Route path="/contacto" element={<Contacto />} />
                {/* si el usuario pone cualquier otra ruta va a ir al Home*/}
                <Route path="*" element={<Home />} />
            </Routes>
            <Footer/>
            {/* Elementos del "escritorio": barra de tareas, diálogos y arranque */}
            <BarraTareas />
            <DialogoWindows />
            <PantallaArranque />
        </BrowserRouter>
      </>
    )
}

export default App
