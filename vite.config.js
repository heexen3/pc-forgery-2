
import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// GitHub Pages no sabe nada de las rutas de React Router: si alguien entra directo
// a /pc-forgery-2/Shop (o recarga la página) busca ese archivo, no lo encuentra y
// responde con su 404.html. Copiando index.html como 404.html, ese "error" carga
// la misma aplicación y BrowserRouter muestra la ruta correcta.
function copiarIndexA404() {
  let carpetaSalida = 'dist'
  return {
    name: 'copiar-index-a-404',
    apply: 'build',
    configResolved(config) {
      carpetaSalida = resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      const indice = resolve(carpetaSalida, 'index.html')
      if (existsSync(indice)) copyFileSync(indice, resolve(carpetaSalida, '404.html'))
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  // Subdirectorio donde GitHub Pages publica el sitio (https://heexen3.github.io/pc-forgery-2/)
  base: "/pc-forgery-2/",
  plugins: [react(), copiarIndexA404()],
  test: {
    environment: 'jsdom',
  },
})
