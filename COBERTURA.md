# Cobertura de pruebas – PC Forgery

## Herramientas

- **Vitest 5** con entorno `jsdom` y **React Testing Library** (`@testing-library/react`, `user-event`, `jest-dom`).
- **@vitest/coverage-v8**: mide la cobertura con el motor V8 de Node.
- La configuración está en `vite.config.js` (`test.coverage`):
  - `provider: 'v8'`
  - reportes `text` (en la consola) y `html` (carpeta `coverage/`)
  - incluye `src/**/*.{js,jsx}` y excluye `src/test/**`, los `*.test.*` y `src/main.jsx`.
- La carpeta `coverage/` está en `.gitignore`, así que no se sube al repositorio.

## Cómo ejecutar

```bash
npm install            # una vez
npm test               # modo watch
npm test -- --run      # una sola pasada (la usamos para entregar)
npm run coverage       # pruebas + reporte de cobertura
```

Para ver el reporte HTML, abre `coverage/index.html` en el navegador después de `npm run coverage`.

## Qué cubre cada archivo de pruebas

Todos los archivos están en `src/test/` y cada uno tiene 2 pruebas (22 en total).

| Archivo | Qué prueba |
|---|---|
| `Admin.test.jsx` | Muestra el panel de administración con su menú y cambia a la vista Historial. |
| `ArmaTuPC.test.jsx` | No deja agregar un armado incompleto o incompatible; arma un PC paso a paso y lo agrega al carrito. |
| `BarraTituloPago.test.jsx` | La barra de título muestra título e ícono, minimizar oculta la ventana y la barra de tareas la restaura; un pago fallido vuelve al carrito intacto. |
| `BoletaRut.test.jsx` | Valida y formatea el RUT (rechaza uno incorrecto); la boleta muestra emisor, folio, detalle, neto, IVA, total y timbre. |
| `Carrito.test.jsx` | Agrega productos respetando el stock y calcula subtotal/IVA/total; finaliza la compra, genera boleta, historial y descuenta stock. |
| `EscritorioNosotros.test.jsx` | Íconos del escritorio y los 3 hilos destacados; Quiénes Somos muestra Misión y Visión. |
| `Login.test.jsx` | Inicia sesión con credenciales correctas y rechaza una contraseña incorrecta. |
| `Product.test.jsx` | Muestra el detalle del producto según su id y un mensaje si no existe. |
| `Register.test.jsx` | Registra un usuario válido y rechaza un nombre de usuario duplicado. |
| `RutaProtegida.test.jsx` | Protección de `/Admin`: sin sesión va a `/Login` con aviso, un usuario normal vuelve al inicio y el admin entra al panel. |
| `TiendaResenas.test.jsx` | Filtra, ordena y busca en la tienda; valida y publica una reseña con estrellas guardada en localStorage. |

## Resultado (`npm run coverage`, 2 de noviembre de 2026)

**Total:** 43,84 % de sentencias · 41,86 % de ramas · 43,8 % de funciones · 44,27 % de líneas.

| Carpeta | % Sentencias | % Ramas | % Funciones | % Líneas |
|---|---:|---:|---:|---:|
| `src` (páginas) | 37,05 | 45,87 | 39,89 | 36,72 |
| `src/components` | 77,03 | 70,54 | 68,57 | 77,77 |
| `src/components/admin` | 0,64 | 0,34 | 0,86 | 0,66 |
| `src/components/armado` | 46,72 | 58,06 | 62,85 | 47,45 |
| `src/components/carrito` | 82,05 | 71,29 | 83,92 | 83,78 |
| `src/components/dialogo` | 77,50 | 53,33 | 72,22 | 76,31 |
| `src/components/escritorio` | 40,44 | 25,71 | 52,38 | 43,05 |
| `src/components/noticias` | 0 | 0 | 0 | 0 |
| `src/components/resenas` | 85,29 | 77,77 | 75 | 90,32 |
| `src/components/tienda` | 88,23 | 87,87 | 80 | 93,33 |
| `src/data` | 54,07 | 40,35 | 52,77 | 53,96 |
| `src/utils` | 66,66 | 57,14 | 100 | 100 |

## Lectura del resultado

- Lo mejor cubierto es la lógica de compra (carrito, boleta, RUT), la tienda, las reseñas y los componentes compartidos.
- El submódulo `admin` casi no tiene cobertura: sus pruebas solo revisan el menú, no los formularios internos (usuarios, productos y noticias). Esos flujos se revisaron a mano en el navegador.
- Las páginas Usuario, Noticias y Comunidad (hilos) aún no tienen pruebas propias. Son las siguientes candidatas para subir el porcentaje.
