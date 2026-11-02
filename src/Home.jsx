import { useState } from "react"
import { Link } from "react-router-dom"
import './Home.css'
import './App.css'
import { rutaPublica } from "./utils/rutaPublica.js"
import IconosEscritorio from "./components/escritorio/IconosEscritorio.jsx"
import { obtenerHilosRecientes } from "./data/hilosData.js"

function textoRespuestas(cantidad) {
  return `${cantidad} ${cantidad === 1 ? "respuesta" : "respuestas"}`
}

function Home() {
  // Los 3 hilos más recientes de la comunidad (más adelante: los más votados)
  const [destacados] = useState(() => obtenerHilosRecientes(3))

  return (
    <main className="escritorio">
      {/* Los íconos del escritorio hacen de menú de navegación en el Home */}
      <IconosEscritorio />

      <div className="escritorio-ventanas">
        <section className="ventana-home ventana-bienvenida" aria-labelledby="titulo-bienvenida">
          <div className="barra-ventana">
            <img src={rutaPublica("/wlogo.svg")} alt="" className="wlogo" width="25px" />
            <span>Bienvenida - PC Forgery 98</span>
          </div>
          <div className="bienvenida-cabecera">
            <img src={rutaPublica("/wlogo.svg")} alt="Logo de PC Forgery" className="bienvenida-logo" />
            <h1 id="titulo-bienvenida">
              <span className="bienvenida-saludo">Bienvenido a</span>
              <span className="bienvenida-marca">PC Forgery</span>
            </h1>
          </div>
          <div className="ventana-home-contenido">
            <p>¡Tu primer PC lo armas aquí! Elige tus componentes, aprende qué hace cada pieza y comparte tu armado con la comunidad.</p>
            <p className="hero-pista">Haz doble clic en un ícono del escritorio para abrirlo.</p>
            <div className="bienvenida-acciones">
              <Link to="/Shop" className="boton-retro">Tienda</Link>
              <Link to="/arma-tu-pc" className="boton-retro">Arma tu PC</Link>
              <Link to="/nosotros" className="boton-retro">Quiénes Somos</Link>
            </div>
          </div>
        </section>

        <section className="ventana-home ventana-destacados" aria-labelledby="titulo-destacados">
          <div className="barra-ventana">
            <img src={rutaPublica("/group.png")} alt="" className="wlogo" width="20px" />
            <span>Destacados - Comunidad</span>
          </div>
          <div className="ventana-home-contenido">
            <h2 id="titulo-destacados">Últimos hilos de la comunidad</h2>
            {destacados.length === 0 ? (
              <p>Aún no hay hilos. <Link to="/comunidad/nuevo-hilo">¡Crea el primero!</Link></p>
            ) : (
              <ul className="lista-destacados">
                {destacados.map(hilo => {
                  const cantidad = Array.isArray(hilo.respuestas) ? hilo.respuestas.length : 0
                  return (
                    <li key={hilo.id} className="destacado-item">
                      <Link to={`/comunidad/hilo/${hilo.id}`} className="destacado-titulo">{hilo.titulo}</Link>
                      <span className="destacado-meta">por {hilo.autor} · {hilo.categoria}</span>
                      <span className="destacado-respuestas">{textoRespuestas(cantidad)}</span>
                    </li>
                  )
                })}
              </ul>
            )}
            <div className="bienvenida-acciones">
              <Link to="/comunidad" className="boton-retro">Ver toda la comunidad</Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Home
