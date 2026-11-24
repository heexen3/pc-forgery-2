import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { inicializarHilos, sincronizarHilos } from './data/hilosData.js'
import { sincronizarProductos } from './data/catalogoProductos.js'
import { sincronizarNoticias } from './data/catalogoNoticias.js'
import { sincronizarResenas } from './components/resenas/Resenas.js'
import { apiHabilitada } from './utils/api.js'

// Primera ejecución: carga los hilos de ejemplo de la comunidad
inicializarHilos()

// Con backend: antes de mostrar la app se trae el catálogo, el stock, las noticias,
// los hilos y las reseñas desde el API Gateway (máximo 3 segundos; si el backend no
// responde, la app sigue con los datos guardados en el navegador).
function cargarDatosIniciales() {
  if (!apiHabilitada()) return Promise.resolve()
  const datos = Promise.allSettled([
    sincronizarProductos(),
    sincronizarNoticias(),
    sincronizarHilos(),
    sincronizarResenas()
  ])
  const limite = new Promise(resolver => setTimeout(resolver, 3000))
  return Promise.race([datos, limite])
}

cargarDatosIniciales().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
