# PC Forgery — Backend (microservicios Spring Boot)

Backend de PC Forgery para la **EV3** y el **Examen Transversal** de DSY1104.
Son 7 microservicios Spring Boot 3 (Java 21, Maven), un API Gateway con seguridad JWT
y una base PostgreSQL por servicio. Todo se levanta con `docker compose`.

```
Navegador (React + Vite, :5173)
        │  fetch  Authorization: Bearer <access token>
        ▼
api-gateway :8080  ── valida el JWT, aplica reglas por rol, CORS, Swagger unificado
   ├── /api/auth, /api/usuarios ............ auth-service       :8081  → auth_db
   ├── /api/productos, /categorias, /componentes  productos-service :8082 → productos_db
   ├── /api/inventario ..................... inventario-service :8083  → inventario_db
   ├── /api/pedidos, /boletas, /armados .... pedidos-service    :8084  → pedidos_db
   │        └─ checkout llama por REST a productos, inventario y pagos
   ├── /api/pagos .......................... pagos-service      :8085  → pagos_db
   └── /api/hilos, /resenas, /noticias ..... comunidad-service  :8086  → comunidad_db
                                   PostgreSQL 16 :5432 (6 bases, una por servicio)
```

## Requisitos (Windows)

- **Docker Desktop** (con WSL 2) encendido.
- **Git Bash** (viene con Git for Windows).
- Node.js 20+ para el frontend.
- Java 21 **solo** si quieres correr los tests o un servicio fuera de Docker (`./mvnw` descarga Maven solo).

## Levantar el backend (Git Bash)

```bash
cd pc-forgery-2/backend
cp .env.example .env          # opcional: cambia secretos, minutos del token, etc.
docker compose up -d --build  # la primera vez tarda (descarga dependencias Maven)
docker compose ps             # todos "Up"; postgres "healthy"
curl http://localhost:8080/actuator/health   # {"status":"UP"}
```

Los servicios esperan a que PostgreSQL esté listo; si alguno arranca antes, Docker lo reinicia solo
(`restart: unless-stopped`). Dale ~1 minuto en el primer arranque.

Apagar: `docker compose down` (conserva los datos) o `docker compose down -v` (borra la base y
vuelve a cargar los datos iniciales en el próximo arranque).

## Levantar el frontend conectado al backend

```bash
cd pc-forgery-2
npm install
npm run dev          # http://localhost:5173/pc-forgery-2/
```

- El frontend usa `VITE_API_URL` (por defecto `http://localhost:8080`). Para cambiarlo crea
  `pc-forgery-2/.env.local` con `VITE_API_URL=http://otra-url:8080`.
- Con `VITE_API_URL=off` la app vuelve al modo anterior (solo localStorage). Es el modo que
  conviene para GitHub Pages, que no puede llegar a un backend en `localhost`.
- `npm test -- --run` siempre usa el modo local (no necesita el backend).

## Usuarios de prueba

Los datos iniciales replican los del frontend (`src/data/usuariosData.js`): un usuario **ADMIN**
(`admin`) y un **CLIENTE** (`cliente`). Las contraseñas son las mismas de ese archivo y en la base
se guardan **hasheadas con BCrypt** (`auth-service/src/main/resources/seed/usuarios.json`).
También se puede registrar un cliente nuevo desde `/Register`.

## Puertos y Swagger

| Servicio | Puerto | Swagger UI | OpenAPI |
|---|---|---|---|
| **api-gateway (todas las APIs)** | 8080 | http://localhost:8080/swagger-ui.html | `/docs/{servicio}/v3/api-docs` |
| auth-service | 8081 | http://localhost:8081/swagger-ui.html | http://localhost:8081/v3/api-docs |
| productos-service | 8082 | http://localhost:8082/swagger-ui.html | http://localhost:8082/v3/api-docs |
| inventario-service | 8083 | http://localhost:8083/swagger-ui.html | http://localhost:8083/v3/api-docs |
| pedidos-service | 8084 | http://localhost:8084/swagger-ui.html | http://localhost:8084/v3/api-docs |
| pagos-service | 8085 | http://localhost:8085/swagger-ui.html | http://localhost:8085/v3/api-docs |
| comunidad-service | 8086 | http://localhost:8086/swagger-ui.html | http://localhost:8086/v3/api-docs |
| PostgreSQL | 5432 | — | usuario/clave en `.env` |

En el Swagger del gateway se elige el servicio arriba a la derecha. Para probar rutas protegidas:
1. `POST /api/auth/login` con `{"identificador": "admin", "password": "..."}`.
2. Copiar `accessToken`, botón **Authorize** → pegarlo (sin escribir "Bearer").
3. Usar el servidor `http://localhost:8080/api` en el desplegable *Servers*.

## Seguridad (JWT + roles)

- `auth-service` genera el **access token** (JWT HS256, 15 min por defecto, claims `sub`, `email`,
  `nombre`, `rol`, `typ=access`) y un **refresh token** opaco (7 días) guardado en `auth_db`.
- `POST /api/auth/refresh` **rota** el refresh token (el anterior queda revocado);
  `POST /api/auth/logout` lo revoca.
- `api-gateway` **verifica** firma y expiración del JWT en cada petición, aplica las reglas por rol
  y reenvía `X-Usuario-Id`, `X-Usuario-Email`, `X-Usuario-Nombre`, `X-Usuario-Rol` a los servicios
  (borra esos encabezados si vienen del cliente, para que no se puedan falsificar).
- Respuestas: **401** sin token / token inválido o vencido, **403** rol insuficiente.
- Demo de renovación: en `.env` pon `JWT_ACCESS_MINUTOS=1`, `docker compose up -d`, inicia sesión,
  espera 1 minuto y navega: el frontend recibe 401, llama a `/auth/refresh` y reintenta solo.

Reglas del gateway (`api-gateway/.../security/ReglasAcceso.java`):

| Ruta | Acceso |
|---|---|
| `/api/auth/login`, `register`, `refresh`, `logout`, `/docs/**` | Público |
| `GET` productos, categorías, componentes, inventario, hilos, reseñas, noticias | Público |
| `/api/usuarios/**` (cualquier método) | ADMIN |
| `POST/PUT/DELETE` productos, categorías, componentes, inventario, noticias, pagos | ADMIN |
| Todo lo demás (pedidos, boletas, armados, `/auth/me`, publicar hilos/reseñas, ver pagos) | Usuario autenticado |

## Flujo de compra (checkout)

`POST /api/pedidos` (cliente autenticado) en `pedidos-service`:
1. Pide los precios a **productos-service** (el precio del carrito no se confía; un armado vale la suma de sus componentes).
2. Verifica stock en **inventario-service** → `409` si falta.
3. Guarda el pedido `PENDIENTE` y cobra en **pagos-service**.
   - Rechazo → pedido `RECHAZADO`, respuesta `402`. Se rechaza si el cliente pulsa
     *"Simular pago no exitoso"* (`simularRechazo: true`) o si el monto supera $10.000.000.
4. Descuenta stock (todo o nada), marca el pedido `PAGADO` y emite la **boleta** (número correlativo,
   neto/IVA 19%, código de verificación igual al del frontend).

## Endpoints

Todas las rutas se llaman a través del gateway con el prefijo `/api`
(ej. `http://localhost:8080/api/productos`). Cada servicio también responde directo en su puerto
sin el prefijo (ej. `http://localhost:8082/productos`), útil para Swagger y pruebas.

### auth-service (puerto 8081)

| Método | Ruta en el gateway | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/usuarios` | ADMIN | Listar usuarios |
| POST | `/api/usuarios` | ADMIN | Crear usuario (admin o cliente) |
| POST | `/api/auth/login` | Público | Iniciar sesión con correo o usuario; entrega access token (JWT) y refresh token |
| POST | `/api/auth/logout` | Público | Cerrar sesión (revoca el refresh token) |
| GET | `/api/auth/me` | Autenticado | Perfil del usuario autenticado |
| PUT | `/api/auth/me` | Autenticado | Actualizar el perfil propio (nombre, usuario, descripción, foto) |
| POST | `/api/auth/refresh` | Público | Renovar la sesión con el refresh token (rota el refresh token) |
| POST | `/api/auth/register` | Público | Registrar un cliente nuevo (rol CLIENTE) |
| GET | `/api/usuarios/{id}` | ADMIN | Obtener un usuario |
| PUT | `/api/usuarios/{id}` | ADMIN | Editar usuario (la contraseña es opcional) |
| DELETE | `/api/usuarios/{id}` | ADMIN | Eliminar usuario |

### productos-service (puerto 8082)

| Método | Ruta en el gateway | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/categorias` | Público | Listar categorías |
| POST | `/api/categorias` | ADMIN | Crear categoría (ADMIN) |
| GET | `/api/componentes` | Público | Listar componentes (filtro opcional por tipo) |
| POST | `/api/componentes` | ADMIN | Crear componente (ADMIN) |
| GET | `/api/productos` | Público | Listar productos (filtros opcionales: categoria, q) |
| POST | `/api/productos` | ADMIN | Crear producto (ADMIN) |
| GET | `/api/categorias/{id}` | Público | Obtener una categoría |
| PUT | `/api/categorias/{id}` | ADMIN | Editar categoría (ADMIN) |
| DELETE | `/api/categorias/{id}` | ADMIN | Eliminar categoría sin productos (ADMIN) |
| GET | `/api/componentes/agrupados` | Público | Componentes agrupados por tipo (mismo formato que DB_COMPONENTES del frontend) |
| GET | `/api/componentes/{id}` | Público | Obtener un componente |
| PUT | `/api/componentes/{id}` | ADMIN | Editar componente (ADMIN) |
| DELETE | `/api/componentes/{id}` | ADMIN | Eliminar componente (ADMIN) |
| GET | `/api/productos/{id}` | Público | Obtener un producto |
| PUT | `/api/productos/{id}` | ADMIN | Editar producto (ADMIN) |
| DELETE | `/api/productos/{id}` | ADMIN | Eliminar producto (ADMIN) |

### inventario-service (puerto 8083)

| Método | Ruta en el gateway | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/inventario` | Público | Listar stock de todos los productos |
| POST | `/api/inventario` | ADMIN | Crear registro de inventario para un producto (ADMIN) |
| GET | `/api/inventario/criticos` | Público | Productos con stock igual o menor al mínimo |
| POST | `/api/inventario/descontar` | ADMIN | Descontar stock de una compra, todo o nada (lo usa pedidos-service) |
| POST | `/api/inventario/verificar` | ADMIN | Verificar stock de varios ítems sin descontar (lo usa pedidos-service) |
| GET | `/api/inventario/{productoId}` | Público | Stock de un producto |
| PUT | `/api/inventario/{productoId}` | ADMIN | Fijar el stock de un producto (ADMIN) |
| DELETE | `/api/inventario/{productoId}` | ADMIN | Eliminar el inventario de un producto (ADMIN) |
| GET | `/api/inventario/{productoId}/movimientos` | Público | Historial de movimientos de stock de un producto |

### pedidos-service (puerto 8084)

| Método | Ruta en el gateway | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/armados` | Autenticado | Mis armados guardados |
| POST | `/api/armados` | Autenticado | Guardar armado (reemplaza si ya existe uno con el mismo nombre) |
| GET | `/api/boletas` | Autenticado | Listar boletas: el ADMIN ve todas, el cliente solo las suyas |
| GET | `/api/pedidos` | Autenticado | Listar todos los pedidos (ADMIN) |
| POST | `/api/pedidos` | Autenticado | Checkout: crea el pedido, cobra (simulado), descuenta stock y devuelve la boleta |
| GET | `/api/armados/{id}` | Autenticado | Obtener un armado propio |
| PUT | `/api/armados/{id}` | Autenticado | Editar un armado propio (ej. cambiar el nombre) |
| DELETE | `/api/armados/{id}` | Autenticado | Eliminar un armado propio |
| GET | `/api/boletas/{numero}` | Autenticado | Obtener una boleta por número (dueño o ADMIN) |
| GET | `/api/pedidos/mios` | Autenticado | Pedidos del usuario autenticado |
| GET | `/api/pedidos/{id}` | Autenticado | Obtener un pedido (dueño o ADMIN) |
| DELETE | `/api/pedidos/{id}` | Autenticado | Eliminar un pedido y su boleta (ADMIN) |
| PUT | `/api/pedidos/{id}/estado` | Autenticado | Cambiar el estado de un pedido (ADMIN) |

### pagos-service (puerto 8085)

| Método | Ruta en el gateway | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/pagos` | Autenticado | Listar pagos: el ADMIN ve todos, el cliente solo los suyos |
| POST | `/api/pagos` | ADMIN | Procesar un pago (lo llama pedidos-service durante el checkout) |
| GET | `/api/pagos/{id}` | Autenticado | Obtener un pago |
| DELETE | `/api/pagos/{id}` | ADMIN | Eliminar un pago (ADMIN) |
| GET | `/api/pagos/pedido/{pedidoId}` | Autenticado | Pagos de un pedido |
| PUT | `/api/pagos/{id}/estado` | ADMIN | Cambiar el estado de un pago, ej. anularlo (ADMIN) |

### comunidad-service (puerto 8086)

| Método | Ruta en el gateway | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/hilos` | Público | Listar hilos (más activos primero; filtro opcional por categoría) |
| POST | `/api/hilos` | Autenticado | Publicar un hilo nuevo |
| GET | `/api/noticias` | Público | Listar noticias (más recientes primero) |
| POST | `/api/noticias` | ADMIN | Publicar noticia (ADMIN) |
| GET | `/api/resenas` | Público | Listar reseñas (filtro opcional productoId) |
| POST | `/api/resenas` | Autenticado | Publicar reseña (si ya opinaste sobre ese producto, se actualiza) |
| GET | `/api/hilos/{id}` | Público | Obtener un hilo con sus respuestas |
| PUT | `/api/hilos/{id}` | Autenticado | Editar un hilo (autor o ADMIN) |
| DELETE | `/api/hilos/{id}` | Autenticado | Eliminar un hilo (autor o ADMIN) |
| GET | `/api/noticias/{id}` | Público | Obtener una noticia |
| PUT | `/api/noticias/{id}` | ADMIN | Editar noticia (ADMIN) |
| DELETE | `/api/noticias/{id}` | ADMIN | Eliminar noticia (ADMIN) |
| GET | `/api/resenas/{id}` | Público | Obtener una reseña |
| PUT | `/api/resenas/{id}` | Autenticado | Editar reseña (autor o ADMIN) |
| DELETE | `/api/resenas/{id}` | Autenticado | Eliminar reseña (autor o ADMIN) |
| POST | `/api/hilos/{id}/respuestas` | Autenticado | Responder un hilo (devuelve el hilo actualizado) |
| DELETE | `/api/hilos/{id}/respuestas/{respuestaId}` | Autenticado | Eliminar una respuesta (autor o ADMIN) |

Errores: todas las respuestas de error usan el mismo formato
`{ "timestamp", "status", "error", "mensaje", "ruta", "detalles" }` (`detalles` trae los errores de validación por campo).

## Tests y cobertura (JUnit 5 + Mockito + JaCoCo)

```bash
cd backend
./mvnw test          # en Git Bash; en CMD/PowerShell: mvnw.cmd test
```

Reporte de cobertura de cada servicio: `{servicio}/target/site/jacoco/index.html`.

| Servicio | Test | Qué prueba |
|---|---|---|
| auth | `AuthServiceTest` | el login entrega JWT con el rol + refresh; el refresh rota el token |
| productos | `ProductoServiceTest` | filtro por texto; rechaza categoría inexistente |
| inventario | `InventarioServiceTest` | descuenta stock; si falta stock no descuenta nada |
| pagos | `PagoServiceTest` | pago aprobado; rechazo simulado |
| pedidos | `PedidoServiceTest` | checkout aprobado (totales, IVA, boleta); pago rechazado → `RECHAZADO` sin descontar |
| comunidad | `ResenaServiceTest` | reseña se actualiza si ya existe; no se puede borrar la de otro |
| api-gateway | `ReglasAccesoTest` | rutas públicas / autenticadas / solo ADMIN |

## Correr un servicio sin Docker

Cada servicio tiene un perfil `h2` (base en memoria) para desarrollo rápido:

```bash
cd backend
./mvnw -pl productos-service spring-boot:run -Dspring-boot.run.profiles=h2
```

Sin el perfil `h2` se conecta a `localhost:5432/{servicio}_db` (usuario/clave `postgres`), configurable con
`DB_URL`, `DB_USER`, `DB_PASSWORD`.

## Estructura

```
backend/
├── docker-compose.yml        # postgres + 7 servicios
├── docker/postgres/init.sql  # crea las 6 bases
├── pom.xml                   # agregador Maven (módulos)
├── mvnw, mvnw.cmd, .mvn/     # Maven Wrapper
├── docs/APIS_E_INTEGRACION.md
├── api-gateway/
└── {auth,productos,inventario,pedidos,pagos,comunidad}-service/
    └── src/main/java/cl/pcforgery/{servicio}/
        ├── controller/  service/  repository/  model/  dto/
        ├── config/ (OpenAPI, datos iniciales)  exception/  security/
        └── resources/application.yml, seed/*.json
```

## Problemas comunes

- **`port is already allocated`**: algo usa el 8080/5432. Cierra ese programa o cambia el puerto publicado en `docker-compose.yml`.
- **El frontend muestra datos viejos**: el navegador guarda una caché en localStorage; recarga o usa el botón "Borrar LocalStorage" del panel admin (conserva la sesión).
- **CORS**: el gateway solo acepta `http://localhost:5173` y `https://heexen3.github.io` (variable `CORS_ORIGINS`).
- **`./mvnw: Permission denied` o `bad interpreter`**: `chmod +x mvnw` y revisa que el archivo tenga fin de línea LF (`.gitattributes` ya lo fuerza).
