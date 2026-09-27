import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import Home from './Home.jsx'
import Shop from './Shop.jsx'
import Product from './Product.jsx'
import Login from './Login.jsx'
import Register from './Register.jsx'
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
                {/* si el usuario pone cualquier otra ruta va a ir al Home*/}
                <Route path="*" element={<Home />} />
            </Routes>
        </BrowserRouter>
        <Footer/>
      </>
    )
}

export default App