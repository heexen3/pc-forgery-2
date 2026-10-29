import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import Home from './Home.jsx'
import Shop from './Shop.jsx'
import Product from './Product.jsx'
import Login from './Login.jsx'
import Register from './Register.jsx'
import Admin from './Admin.jsx'
import Noticia from './Noticias.jsx'
import NoticiaDetalle from './NoticiaDetalle.jsx'
import Comunidad from './Comunidad.jsx'
import Contacto from './Contacto.jsx'
import NuevoHilo from './NuevoHilo.jsx'
function App() {
    return (
      <>
        <BrowserRouter>
            <Nav />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Home" element={<Home />}/>
                {/* Conjunto de tienda y detalle de productos */}
                <Route path="/Shop" element={<Shop />}/>
                <Route path="/Shop/Product" element={<Product />}/>
                {/* Registro y Login */}
                <Route path="/Login" element={<Login />} />
                <Route path="/Register" element={<Register />} />
                {/* Rutas de usuario y admin */}
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
        </BrowserRouter>
        <Footer/>
      </>
    )
}

export default App