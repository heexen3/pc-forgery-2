import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { inicializarHilos } from './data/hilosData.js'

// Primera ejecución: carga los hilos de ejemplo de la comunidad
inicializarHilos()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
