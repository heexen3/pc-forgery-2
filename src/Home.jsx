import VentanaColapsable from './components/VentanaColapsable'
import './Home.css'

function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-titulo">
          <img src="/img/computer.png" alt="" />
          <h1>¡Bienvenido a PC Forgery!</h1>
        </div>
        <div className="hero-contenido">
          <p>¡Tu primer PC lo armas aquí!</p>
          <p>Aprende, elige tus componentes y construye tu propio computador.</p>
          <a href="/tienda">Llévame a la tienda</a>
        </div>
      </section>

      <VentanaColapsable titulo="¿Por dónde empiezo?" className="what-to-do">
        <div className="wtd-contenido">
          <div className="wtd-nosotros">
            <img src="/img/tools.png" alt="" />
            <h3>¿Qué es PC Forgery?</h3>
          </div>
          <div className="wtd-armado">
            <img src="/img/computer2.png" alt="" />
            <h3>¡Quiero armar mi nuevo PC!</h3>
          </div>
          <div className="wtd-diy">
            <img src="/img/help.png" alt="" />
            <h3>Aprende más sobre tu PC</h3>
          </div>
        </div>
      </VentanaColapsable>

      <VentanaColapsable titulo="¿Cómo armo un PC?" className="primer-pc">
        <div className="guia-contenido">
          <div className="guia-titulo">
            <img src="/img/frodo4.png" alt="" height="95px" />
            <h2>"Pero Gandalf, es mi primera vez..."</h2>
          </div>
          <div className="guia-respuesta">
            <h2>"¡No te preocupes mi querido Frodo, tenemos la guía perfecta para tí!"</h2>
            <img src="/img/gandalf4.png" alt="" height="108px" />
          </div>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta nulla at laboriosam unde laborum. Placeat nesciunt, illum quis ratione et sint? Numquam, deserunt alias nobis exercitationem accusamus sapiente. Earum, cupiditate.</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta nulla at laboriosam unde laborum. Placeat nesciunt, illum quis ratione et sint? Numquam, deserunt alias nobis exercitationem accusamus sapiente. Earum, cupiditate.</p>
        </div>
      </VentanaColapsable>

      <VentanaColapsable titulo="¿De qué está hablando la comunidad?" className="comunidad">
        <div className="comunidad-contenido">
          <div className="comunidad-destacado">
            <h3>Título de Post 1</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque, omnis nobis. Ad omnis accusamus doloribus molestias aut quo pariatur impedit excepturi? Repellendus nam perspiciatis, animi deleniti incidunt neque ex quasi.</p>
            <div className="destacado-pie">
              <strong>69 respuestas</strong>
              <button>Ver post</button>
            </div>
          </div>
          <div className="comunidad-destacado">
            <h3>Título de Post 2</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque, omnis nobis. Ad omnis accusamus doloribus molestias aut quo pariatur impedit excepturi? Repellendus nam perspiciatis, animi deleniti incidunt neque ex quasi.</p>
            <div className="destacado-pie">
              <strong>69 respuestas</strong>
              <button>Ver post</button>
            </div>
          </div>
          <div className="comunidad-destacado">
            <h3>Título de Post 3</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque, omnis nobis. Ad omnis accusamus doloribus molestias aut quo pariatur impedit excepturi? Repellendus nam perspiciatis, animi deleniti incidunt neque ex quasi.</p>
            <div className="destacado-pie">
              <strong>69 respuestas</strong>
              <button>Ver post</button>
            </div>
          </div>
        </div>
      </VentanaColapsable>
    </main>
  )
}

export default Home