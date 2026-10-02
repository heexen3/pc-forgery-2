import { Routes, Route } from 'react-router-dom'
import './App.css'
import Nav from './components/Nav'
import Home from './Home'
import Noticias from './Noticias'
import ArmaTuPC from './ArmaTuPC'

function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/noticias" element={<Noticias />} />
        <Route path="/arma-tu-pc" element={<ArmaTuPC />} />
        {/* faltan: /tienda, /comunidad, /nosotros, /contacto, /login, etc. */}
      </Routes>
    </>
  )
}

export default App