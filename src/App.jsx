import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import Home from './Home.jsx'
import Shop from './Shop.jsx'
import Product from './Product.jsx'
import Login from './Login.jsx'
import Register from './Register.jsx'
import Noticias from './Noticias.jsx'
import NoticiaDetalle from './NoticiaDetalle.jsx'
import Comunidad from './Comunidad.jsx'
import NuevoHilo from './NuevoHilo.jsx'
import Contacto from './Contacto.jsx'
function App() {
  return (
    <>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Home" element={<Home />} />
          {/* Conjunto de tienda y detalle de productos */}
          <Route path="/Shop" element={<Shop />} />
          <Route path="/Shop/Product" element={<Product />} />
          {/* Registro y Login */}
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          {/* Noticias y detalles de noticias */}
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/noticias/detalle" element={<NoticiaDetalle />} />
          {/* Comunidad y nuevos hilos */}
          <Route path="/comunidad" element={<Comunidad />} />
          <Route path="/comunidad/nuevo-hilo" element={<NuevoHilo />} />
          {/* Contacto */}
          <Route path="/contacto" element={<Contacto />} />
          {/* si el usuario pone cualquier otra ruta va a ir al Home*/}
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </>
  )
}

export default App