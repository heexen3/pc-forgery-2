# PC Forgery

Tienda online de componentes de PC con estética **Windows 98**, hecha como proyecto de la asignatura **Desarrollo Fullstack II (DUOC UC)**.

🔗 **Demo en vivo:** https://heexen3.github.io/pc-forgery-2/

## Funcionalidades

- **Escritorio retro:** pantalla de arranque, íconos de escritorio, barra de tareas con bandeja del sistema y ventanas que se pueden minimizar y restaurar.
- **`BarraTitulo` reutilizable:** la barra de título estilo Win98 (ícono, título y botones) que usan todas las ventanas.
- **Tienda** con filtros por categoría, orden por precio y búsqueda por texto.
- **Detalle de producto** con reseñas y estrellas (se guardan en `localStorage`).
- **Arma tu PC:** armado paso a paso que valida la compatibilidad y se agrega al carrito.
- **Carrito** que respeta el stock y calcula subtotal, IVA y total.
- **Pago simulado** con resultado exitoso o fallido.
- **Boleta electrónica imprimible:** valida el RUT y desglosa neto, IVA y total con timbre simulado. El historial queda en *Mis compras*.
- **Comunidad / foro** con hilos, respuestas y creación de hilos nuevos.
- **Noticias** con su vista de detalle.
- **Quiénes somos** (misión, visión e historia) y **Contacto**.
- **Login, registro y perfil de usuario.**
- **Panel de administración** (con Bootstrap) para usuarios, productos, noticias, reportes e historial de compras. Está protegido por `RutaProtegida`, que solo deja entrar al rol `admin`.

## Tecnologías

| Herramienta | Versión |
|---|---|
| React / React DOM | 19.2 |
| React Router DOM | 7.18 |
| Vite (+ @vitejs/plugin-react) | 8.3 |
| Bootstrap (solo en el panel admin) | 5.3 |
| Vitest + @vitest/coverage-v8 | 5.x |
| Testing Library (react, user-event, jest-dom) + jsdom | 16.3 / 14.6 / 7.0 |
| ESLint | 10 |
| gh-pages | 6.3 |

Los datos (productos, usuarios, hilos, carrito y compras) viven en `localStorage`; no hay backend.

## Requisitos

- Node.js 20.19+ o 22.12+ (lo exige Vite 8), con npm
- Git

## Instalación y comandos

```bash
git clone https://github.com/heexen3/pc-forgery-2.git
cd pc-forgery-2
npm install
```

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo (http://localhost:5173/pc-forgery-2/) |
| `npm test` | Pruebas en modo watch (`npm test -- --run` para una sola pasada) |
| `npm run coverage` | Pruebas + reporte de cobertura (`coverage/index.html`) |
| `npm run lint` | Revisión con ESLint |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Sirve el build localmente |
| `npm run deploy` | Build + publicación en GitHub Pages |

## Estructura

```
src/
├── App.jsx                # Rutas (BrowserRouter)
├── main.jsx
├── Home.jsx, Shop.jsx, Product.jsx, Carrito.jsx, Pago.jsx, Boleta.jsx, ...   # Páginas (+ su .css)
├── components/
│   ├── BarraTitulo.jsx, Nav.jsx, RutaProtegida.jsx, ValidacionLogin.jsx, ...
│   ├── admin/             # Panel de administración
│   ├── armado/            # Lógica de Arma tu PC
│   ├── carrito/           # Carrito, boletas, RUT, timbre
│   ├── dialogo/           # Diálogos estilo Windows (mostrarAlerta / confirmar)
│   ├── escritorio/        # Escritorio, barra de tareas, arranque
│   ├── noticias/, resenas/, tienda/
├── data/                  # Catálogos y datos semilla (productos, noticias, hilos, usuarios)
├── utils/                 # rutaPublica.js (rutas de /public con el basename)
├── assets/
└── test/                  # Pruebas Vitest
```

## Rutas

| Ruta | Página |
|---|---|
| `/`, `/Home` | Escritorio / inicio |
| `/Shop` | Tienda |
| `/producto/:id` (`/Shop/Product`) | Detalle de producto |
| `/arma-tu-pc` | Arma tu PC |
| `/Carrito` | Carrito |
| `/pago` | Pago simulado |
| `/Boleta` | Boleta electrónica |
| `/MisCompras` | Historial de compras |
| `/Login`, `/Register` | Inicio de sesión y registro |
| `/Usuario` | Perfil de usuario |
| `/Admin` | Panel admin (solo rol `admin`) |
| `/Noticias`, `/noticias/detalle` | Noticias y su detalle |
| `/comunidad`, `/comunidad/nuevo-hilo`, `/comunidad/hilo/:id` | Foro |
| `/contacto` | Contacto |
| `/nosotros` | Quiénes somos |
| `*` | Vuelve al inicio |

Si alguien entra a `/Admin` sin sesión, se le redirige a `/Login`. Si tiene sesión pero no es admin, se le redirige al inicio. En ambos casos aparece el aviso "Acceso restringido". Los usuarios base, incluido el administrador, están definidos en `src/data/usuariosData.js`, y el inicio de sesión se valida en `src/components/ValidacionLogin.jsx`.

## Pruebas

Las pruebas usan **Vitest** con **Testing Library** sobre `jsdom` y están en `src/test/`: 11 archivos con 22 pruebas. El detalle de qué cubre cada archivo y la tabla de cobertura están en **[COBERTURA.md](COBERTURA.md)**.

## Despliegue (GitHub Pages)

- El sitio se publica en `https://heexen3.github.io/pc-forgery-2/`. Por eso `vite.config.js` usa `base: "/pc-forgery-2/"` y el `BrowserRouter` usa ese mismo `basename`.
- Durante el build se copia `index.html` como `404.html`. Así, al recargar o entrar directo a una ruta como `/Shop`, GitHub Pages carga la app y React Router muestra la página correcta.
- La rama `gh-pages` se maneja **solo** con `npm run deploy`. No se edita a mano.

## Flujo de trabajo

- Cada integrante trabaja en su rama: `luis-dev`, `daniel-dev` y `jvargas-dev`.
- Los cambios llegan a `main` mediante Pull Request, y Luis los revisa antes de hacer merge.

## Equipo

| Integrante | GitHub |
|---|---|
| Luis Echevarría | [@heexen3](https://github.com/heexen3) |
| Daniel | [@dniel314](https://github.com/dniel314) |
| J. Vargas | [@JuanVargas8](https://github.com/JuanVargas8) |
