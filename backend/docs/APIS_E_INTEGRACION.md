# Documento de APIs e Integración — PC Forgery (borrador)

**Asignatura:** DSY1104 — Desarrollo Fullstack · EV3 / Examen Transversal
**Equipo:** Luis Echevarría, Daniel, Juan Vargas
**Repositorio:** https://github.com/heexen3/pc-forgery-2 (frontend en `src/`, backend en `backend/`)

## 1. Visión general

PC Forgery es una tienda de computadores con estética Windows 98. El frontend (React 19 + Vite,
React Router con BrowserRouter) consume un backend de **microservicios Spring Boot** a través de un
único **API Gateway**. Cada microservicio tiene su propia base de datos PostgreSQL.

| Capa | Tecnología |
|---|---|
| Frontend | React 19, Vite, React Router, Bootstrap (solo panel admin), Vitest + Testing Library |
| Gateway | Spring Cloud Gateway (WebFlux), filtro JWT propio, CORS, springdoc (Swagger unificado) |
| Microservicios | Spring Boot 3.5, Spring Web, Spring Data JPA, Bean Validation, springdoc-openapi, Lombok |
| Seguridad | JWT HS256 (jjwt), refresh token en BD, BCrypt |
| Datos | PostgreSQL 16 (6 bases), H2 para desarrollo |
| Pruebas | JUnit 5 + Mockito + JaCoCo (back), Vitest + jsdom (front) |
| Ejecución | Docker Compose |

## 2. Arquitectura

```
React (:5173) ──HTTP/JSON──▶ api-gateway (:8080)
                               │  verifica JWT · reglas por rol · CORS
         ┌─────────────┬───────┼──────────────┬──────────────┬──────────────┐
         ▼             ▼       ▼              ▼              ▼              ▼
     auth :8081  productos :8082  inventario :8083  pedidos :8084  pagos :8085  comunidad :8086
                       ▲               ▲              │  │              ▲
                       └───────────────┴── REST ──────┘  └──── REST ────┘
                                    (checkout orquestado por pedidos-service)
```

Comunicación entre servicios: **REST síncrono** con `RestClient` de Spring, URLs configuradas por
variables de entorno (`PRODUCTOS_URL`, `INVENTARIO_URL`, `PAGOS_URL`). No se usa descubrimiento de servicios.

## 3. Autenticación y sesión

### 3.1 Flujo
1. `POST /api/auth/login` `{ identificador (correo o usuario), password }` →
   `{ accessToken, refreshToken, tipo: "Bearer", expiraEn (segundos), usuario }`.
2. El front guarda `sesion = { accessToken, refreshToken, expiraEn }` y `usuarioActual` en `localStorage`
   → la sesión **persiste al recargar**.
3. Cada petición lleva `Authorization: Bearer <accessToken>`.
4. El gateway verifica firma, expiración y tipo (`typ=access`); si es válido reenvía `X-Usuario-Id`,
   `X-Usuario-Email`, `X-Usuario-Nombre`, `X-Usuario-Rol`.
5. Si el gateway responde **401**, `peticion()` llama una sola vez a `POST /api/auth/refresh`
   `{ refreshToken }`, guarda los tokens nuevos (el refresh se **rota**) y reintenta. Si el refresh falla,
   se borra la sesión.
6. `POST /api/auth/logout` revoca el refresh token.

### 3.2 Roles
| Rol backend | Rol en el front | Puede |
|---|---|---|
| `ADMIN` | `admin` | Panel `/Admin`: CRUD de productos/stock, usuarios, noticias; ver todas las boletas y pedidos |
| `CLIENTE` | `usuario` | Comprar, ver sus compras/boletas, guardar armados, publicar hilos, respuestas y reseñas |

Control en dos niveles:
- **Front:** `RutaProtegida` (rol + sesión JWT) para ocultar o bloquear vistas.
- **Back:** el gateway responde 401/403. Aunque alguien edite `localStorage`, no obtiene permisos reales.

## 4. Catálogo de APIs

La tabla completa de endpoints (método, ruta, acceso y descripción) está en `backend/README.md`
§Endpoints y en Swagger:
- Swagger unificado: http://localhost:8080/swagger-ui.html
- Por servicio: http://localhost:808X/swagger-ui.html

Resumen por recurso:

| Recurso | Servicio | Create | Read | Update | Delete |
|---|---|---|---|---|---|
| Usuarios | auth | `POST /usuarios`, `POST /auth/register` | `GET /usuarios`, `/usuarios/{id}`, `/auth/me` | `PUT /usuarios/{id}`, `PUT /auth/me` | `DELETE /usuarios/{id}` |
| Productos | productos | `POST /productos` | `GET /productos?categoria=&q=`, `/productos/{id}` | `PUT /productos/{id}` | `DELETE /productos/{id}` |
| Categorías | productos | `POST /categorias` | `GET /categorias[/{id}]` | `PUT` | `DELETE` |
| Componentes | productos | `POST /componentes` | `GET /componentes[/{id}]`, `/componentes/agrupados` | `PUT` | `DELETE` |
| Inventario | inventario | `POST /inventario` | `GET /inventario[/{productoId}]`, `/criticos`, `/{id}/movimientos` | `PUT /inventario/{productoId}` | `DELETE` |
| Pedidos | pedidos | `POST /pedidos` (checkout) | `GET /pedidos`, `/pedidos/mios`, `/pedidos/{id}` | `PUT /pedidos/{id}/estado` | `DELETE /pedidos/{id}` |
| Boletas | pedidos | (las crea el checkout) | `GET /boletas`, `/boletas/{numero}` | — | (con el pedido) |
| Armados | pedidos | `POST /armados` | `GET /armados[/{id}]` | `PUT /armados/{id}` | `DELETE /armados/{id}` |
| Pagos | pagos | `POST /pagos` (interno) | `GET /pagos`, `/pagos/{id}`, `/pagos/pedido/{id}` | `PUT /pagos/{id}/estado` | `DELETE /pagos/{id}` |
| Hilos / respuestas | comunidad | `POST /hilos`, `POST /hilos/{id}/respuestas` | `GET /hilos[/{id}]` | `PUT /hilos/{id}` | `DELETE /hilos/{id}`, `/hilos/{id}/respuestas/{rid}` |
| Reseñas | comunidad | `POST /resenas` | `GET /resenas?productoId=` | `PUT /resenas/{id}` | `DELETE /resenas/{id}` |
| Noticias | comunidad | `POST /noticias` | `GET /noticias[/{id}]` | `PUT /noticias/{id}` | `DELETE /noticias/{id}` |

### 4.1 Códigos de respuesta
| Código | Cuándo |
|---|---|
| 200 / 201 / 204 | OK / creado / eliminado |
| 400 | Validación (`detalles` trae el error por campo) |
| 401 | Sin token, token inválido o vencido, credenciales incorrectas, refresh revocado |
| 402 | Pago rechazado en el checkout |
| 403 | Rol insuficiente o recurso de otro usuario |
| 404 | No existe |
| 409 | Conflicto: sin stock, correo/usuario repetido, etc. |

Formato de error único: `{ timestamp, status, error, mensaje, ruta, detalles }`. El front muestra `mensaje`.

### 4.2 Ejemplo: checkout
```http
POST /api/pedidos
Authorization: Bearer eyJ...
Content-Type: application/json

{
  "metodoPago": "Débito",
  "rut": "11.111.111-1",
  "simularRechazo": false,
  "items": [
    { "id": "producto-1", "tipo": "producto", "productoId": 1, "nombre": "...", "cantidad": 2 },
    { "id": "armado-...", "tipo": "armado", "nombre": "Mi PC", "cantidad": 1,
      "componentes": [ { "id": "cpu-intel-13400f" }, { "id": "ram-corsair-16-ddr4" } ] }
  ]
}
```
Respuesta `201`: la boleta en el mismo formato que ya usaba el front (`numero`, `fecha`, `emisor`,
`cliente`, `items`, `subtotal`, `iva`, `total`, `metodoPago`, `codigoVerificacion`) más `pedidoId`,
`estado` y `codigoTransaccion`.

## 5. Integración del frontend

Principio: **no cambiar la estructura del front**. Las vistas siguen llamando a las mismas funciones de
`src/data/*.js` y `src/components/*/*.js`; esas funciones ahora consultan al backend.

| Archivo | Cambio |
|---|---|
| `src/utils/api.js` (nuevo) | `API_URL` (`VITE_API_URL`), `peticion()` con renovación ante 401, sesión (`guardarSesion`, `cerrarSesion`, `renovarSesion`), `cuandoListo`, hook `useSincronizacion` |
| `src/main.jsx` | Antes de renderizar trae productos+stock, noticias, hilos y reseñas (máx. 3 s) |
| `src/data/usuariosData.js`, `ValidacionLogin.jsx`, `ValidacionRegistro.jsx` | login/registro contra `auth-service` |
| `src/components/RutaProtegida.jsx` | además del rol exige sesión JWT |
| `src/data/catalogoProductos.js`, `Shop.jsx`, `Product.jsx`, admin `NuevoProducto` / `MostrarProductos` | catálogo y stock desde productos + inventario; CRUD admin |
| `src/components/carrito/Boletas.js`, `Pago.jsx`, `Boleta.jsx`, `MisCompras.jsx` | checkout `POST /pedidos`, boletas `GET /boletas` |
| `src/components/armado/ArmadosGuardados.js`, `ArmaTuPC.jsx`, `Usuario.jsx` | armados guardados por usuario |
| `src/components/resenas/Resenas.js` | reseñas |
| `src/data/hilosData.js`, `Comunidad.jsx`, `NuevoHilo.jsx`, `HiloDetalle.jsx`, `Home.jsx` | foro |
| `src/data/catalogoNoticias.js`, `useNoticias.js`, `NuevaNoticia.jsx`, `NoticiaDetalle.jsx` | noticias |
| admin `NuevoUsuario`, `EditarUsuario`, `PerfilAdmin`, `Admin.jsx` | CRUD de usuarios y sincronización del panel |
| `Nav.jsx`, `BandejaSistema.jsx` | cerrar sesión revoca el refresh token |

`localStorage` queda como **caché** de lo que respondió el backend, para que las vistas existentes
(que leen sincrónicamente) sigan funcionando. Con `VITE_API_URL=off`, y en los tests, la app usa
el modo anterior, solo localStorage.

## 6. Configuración y ejecución
Ver `backend/README.md` (Docker Desktop + Git Bash): `docker compose up -d --build` en `backend/` y
`npm run dev` en la raíz. Variables: `JWT_SECRET`, `JWT_ACCESS_MINUTOS`, `CORS_ORIGINS`,
`POSTGRES_USER/PASSWORD` (`backend/.env.example`), `VITE_API_URL` (front).

## 7. Pruebas y cobertura (base para el Documento de cobertura)

### Backend (`./mvnw test`, JaCoCo)
| Servicio | Tests | Cobertura instrucciones (total / capa service+security) |
|---|---|---|
| api-gateway | 2 | 27% / 31% |
| auth-service | 2 | 23% / 26% |
| productos-service | 2 | 14% / 15% |
| inventario-service | 2 | 28% / 41% |
| pedidos-service | 2 | 33% / 41% |
| pagos-service | 2 | 25% / 39% |
| comunidad-service | 2 | 10% / 16% |

Se priorizó probar las reglas de negocio críticas (login/JWT, checkout, stock todo-o-nada, rechazo de
pago, permisos). Para subir la cobertura: tests de controllers con `@WebMvcTest` + MockMvc.

### Frontend (`npm test -- --run`, `npx vitest run --coverage`)
- 26 tests en 13 archivos (24 originales + `ApiSesion.test.js`: persistencia de sesión y renovación con refresh ante 401, con `fetch` simulado).
- Cobertura global aprox. 41% de líneas (las ramas de API no se ejecutan en jsdom porque los tests corren en modo local).

### Pruebas de integración realizadas (gateway, docker compose)
Login admin/cliente, credenciales malas (401), catálogo público (22 productos), cliente en `/api/usuarios` (403),
sin token (401), token falso (401), checkout de producto y de armado (201, stock descontado),
pago rechazado (402, pedido RECHAZADO), sin stock (409), refresh con rotación (el refresh antiguo da 401),
hilos/respuestas/reseñas, CORS preflight desde `localhost:5173`, Swagger del gateway (200).
En navegador (Chrome headless contra `npm run dev`): login, sesión tras recargar, bloqueo de `/Admin` para cliente,
checkout desde el código del front y renovación automática del token, sin errores de JavaScript.

## 8. Limitaciones conocidas
- El carrito sigue en el navegador (se envía completo en el checkout; los precios los recalcula el backend).
- Arma tu PC usa la lista estática `DB_COMPONENTES` del front; el backend ya expone `/api/componentes/agrupados` con el mismo formato.
- La UI no tiene botón para eliminar usuarios (sí existe `DELETE /api/usuarios/{id}`).
- Los puertos 8081–8086 se publican para mostrar Swagger por servicio. En producción solo debería exponerse el gateway, porque los servicios confían en los encabezados `X-Usuario-*`.
- GitHub Pages (https) no puede llamar al backend local; ahí conviene compilar con `VITE_API_URL=off`.
