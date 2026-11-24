# 🛡️ Guía de Defensa y Evaluación - PC Forgery 2
**Profesor:** Freddy  
**Proyecto:** PC Forgery (React 19 + Vite + Windows 98 Retro Style)  
**Estudiante:** Juan Vargas  

---

## 📌 Pregunta 1: "Muéstreme un componente en el que haya trabajado, también un componente con parámetros (props) y uno sin parámetros."

### 🗣️ Qué responderle al profesor en voz alta:
> *"Trabajé fuertemente en el módulo de usuario y en el panel de administración. Por ejemplo, en `Usuario.jsx` implementé el perfil con estética retro de Windows 98, permitiendo edición inline con `editar.svg`, cambio de foto, persistencia en localStorage y una sección colapsable con las configuraciones guardadas de Arma tu PC.*  
>  
> *Como **componente sin parámetros**, un gran ejemplo es el propio `Usuario.jsx` (o `ArmaTuPC.jsx` o `Nav.jsx`), ya que no recibe props externas: se encarga de leer la sesión activa desde el `localStorage`, inicializar sus propios estados internos con `useState` y coordinar la vista.*  
>  
> *Como **componente con parámetros (props)**, trabajé en `EditarUsuario.jsx`. Este componente recibe dos props: `usuarioSeleccionadoInicial` (el objeto del usuario que el admin escogió editar desde la tabla) y `onVolver` (una función callback para regresar a la vista de lista cuando se cancela o finaliza la edición)."*

---

### 💻 Código de respaldo para mostrar en pantalla:

#### 1. Componente CON parámetros (Props):
📁 **Archivo:** `src/components/admin/EditarUsuario.jsx`
```jsx
// Recibe como props el usuario a editar y la función para volver al listado
function EditarUsuario({ usuarioSeleccionadoInicial = null, onVolver = null }) {
    const [usuarios, setUsuarios] = useState(() => obtenerUsuarios())
    
    // Inicializa el formulario a partir de la prop recibida
    const [correoSeleccionado, setCorreoSeleccionado] = useState(() => {
        return usuarioSeleccionadoInicial
            ? (usuarioSeleccionadoInicial.correo || usuarioSeleccionadoInicial.email || "")
            : ""
    })
    ...
```

*Otro ejemplo muy claro con props:*  
📁 **Archivo:** `src/components/admin/MostrarUsuarios.jsx`
```jsx
function MostrarUsuarios({ onEditarUsuario }) {
    // onEditarUsuario es una función callback que se ejecuta al presionar "Editar"
    ...
    <button onClick={() => onEditarUsuario && onEditarUsuario(usuario)}>
        Editar
    </button>
}
```

*Otro ejemplo visual con props:*  
📁 **Archivo:** `src/components/VentanaColapsable.jsx`
```jsx
function VentanaColapsable({ titulo, className, children }) {
    const [colapsada, setColapsada] = useState(false)
    return (
        <section className={className}>
            <span>{titulo}</span>
            <div>{children}</div>
        </section>
    )
}
```

---

#### 2. Componente SIN parámetros:
📁 **Archivo:** `src/Usuario.jsx` (o `src/ArmaTuPC.jsx`, `src/components/Nav.jsx`, `src/Admin.jsx`)
```jsx
function Usuario() {
    // No recibe props. Maneja su propio estado interno:
    const navigate = useNavigate()
    const [usuarioActual, setUsuarioActual] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("usuarioActual"))
        } catch {
            return null
        }
    })
    const [armados, setArmados] = useState(() => obtenerArmados(usuarioActual))
    ...
```

---

## 📌 Pregunta 2: "Muéstreme una prueba unitaria y explíquela."

### 🗣️ Qué responderle al profesor en voz alta:
> *"Para las pruebas unitarias utilizamos **Vitest** con **React Testing Library** y `@testing-library/user-event`. Tenemos 16 pruebas automatizadas divididas en 8 suites que validan autenticación, catálogo, carrito, boleta y el asistente de armado de PC.*  
>  
> *Una de las pruebas más completas e interesantes está en `src/test/ArmaTuPC.test.jsx`, donde validamos el flujo completo de construcción de un computador y su compatibilidad.*  
>  
> *En la primera prueba comprobamos que si un usuario intenta agregar un armado incompleto o incompatible, el sistema bloquea la acción, muestra una alerta indicando qué piezas faltan (CPU, placa, RAM, etc.) y no añade nada al carrito.*  
>  
> *En la segunda prueba simulamos con `userEvent` a un cliente eligiendo paso a paso cada pieza compatible (Intel i5, placa B760, RAM DDR4, GPU RTX 4060, SSD, Fuente de 550W y Gabinete), comprobamos que el cálculo total dé exactamente `$821.000` y verificamos que al hacer clic en 'Agregar al Carrito', el ítem quede correctamente registrado en el carrito del localStorage."*

---

### 💻 Código de respaldo para mostrar en pantalla:

📁 **Archivo:** `src/test/ArmaTuPC.test.jsx`
```jsx
describe("Arma tu PC conectado al carrito", () => {
    beforeEach(() => {
        localStorage.clear()
        vi.spyOn(window, "alert").mockImplementation(() => {})
    })

    // PRUEBA 1: Validación de armado incompleto
    test("no agrega al carrito un armado incompleto o incompatible", async () => {
        const user = userEvent.setup()
        renderArmaTuPC()

        // El usuario hace clic en agregar sin elegir componentes
        await user.click(screen.getByRole("button", { name: "Agregar al Carrito" }))

        // Se comprueba que window.alert advierta los faltantes
        expect(window.alert).toHaveBeenCalledWith(
            "Faltan componentes por elegir: CPU, Placa Madre, RAM, GPU, Disco, Fuente, Gabinete."
        )
        // Se comprueba que el carrito siga vacío
        expect(obtenerCarrito()).toHaveLength(0)

        // Comprobación de regla de negocio: socket Intel en placa AMD genera conflicto
        const incompatible = { ...armadoAMD(), procesadores: buscar("procesadores", "cpu-intel-13400f") }
        expect(detectarConflicto(incompatible)).toBe("CPU y Placa tienen sockets diferentes.")
    })

    // PRUEBA 2: Flujo exitoso de armado y persistencia
    test("arma un PC paso a paso y lo agrega al carrito", async () => {
        const user = userEvent.setup()
        renderArmaTuPC()

        // Selección paso a paso
        await user.click(screen.getByRole("button", { name: "Elegir Intel" }))
        await user.click(screen.getByRole("button", { name: "Elegir Intel Core i5-13400F" }))
        await user.click(screen.getByRole("button", { name: /siguiente/i }))
        // ... (selecciona placa, RAM, GPU, SSD, fuente, gabinete)

        // Verificaciones
        expect(screen.getByText("Sistema compatible hasta el momento.")).toBeTruthy()
        expect(screen.getByTestId("total-armado").textContent).toBe("$821.000")

        await user.click(screen.getByRole("button", { name: "Agregar al Carrito" }))

        const carrito = obtenerCarrito()
        expect(carrito).toHaveLength(1)
        expect(carrito[0]).toMatchObject({
            tipo: "armado",
            nombre: "PC Armado Intel",
            precio: 821000,
            cantidad: 1
        })
    })
})
```

> 💡 **Comando para ejecutar la prueba en vivo ante el profe:**  
> `npx vitest run src/test/ArmaTuPC.test.jsx` (pasan las 2 en ~2 segundos).

---

## 📌 Pregunta 3: "Saber dónde se guardan los datos, si hay datos hardcodeados (como el usuario admin) hay que saber dónde está estipulado."

### 🗣️ Qué responderle al profesor en voz alta:
> *"La aplicación almacena y persiste todos sus datos en el **`localStorage` del navegador**. De esta forma, si el usuario cierra el navegador o recarga la página, los datos de sesión, usuarios registrados, compras, productos y configuraciones se mantienen intactos.*  
>  
> *Para que la app funcione desde la primera vez sin requerir una base de datos externa obligatoria, existen **datos iniciales o 'semilla' (seed data) estipulados en archivos dedicados dentro de la carpeta `src/data/`**:*  
>  
> 1. *El usuario **Admin** y el cliente inicial están estipulados en `src/data/usuariosData.js` dentro del array `usuariosBase`. Si `localStorage` no tiene la clave `'usuarios'`, la función `inicializarUsuarios()` los carga automáticamente.*  
> 2. *El catálogo inicial de productos de la tienda vive en `src/data/catalogoProductos.js` (`catalogoInicial`).*  
> 3. *Los componentes de hardware para armar el PC viven en `src/data/componentesData.js` (`DB_COMPONENTES`)."*

---

### 💻 Ubicación exacta de los datos:

| Dato | Dónde está estipulado el valor inicial | Clave en localStorage |
|---|---|---|
| **Usuario Admin y Cliente inicial** | `src/data/usuariosData.js` (`usuariosBase`) | `"usuarios"` |
| **Sesión activa actual** | No hardcodeado (se asigna al loguearse) | `"usuarioActual"` |
| **Productos de la tienda** | `src/data/catalogoProductos.js` (`catalogoInicial`) | `"productos"` |
| **Configuraciones de Arma tu PC** | Creadas por cada usuario en `/arma-tu-pc` o `/Usuario` | `"armadosGuardados"` |
| **Bolsa de compras** | Creada dinámicamente al agregar productos | `"carrito"` |
| **Boletas e historial de compras** | Creadas al finalizar pago en Carrito | `"compras"` |

#### Código exacto donde está estipulado el Admin:
📁 **Archivo:** `src/data/usuariosData.js` (Líneas 3 a 30)
```javascript
export const usuariosBase = [
    {
        nombre: "Administrador PC Forgery",
        usuario: "admin",
        correo: "admin@pcforgery.cl",
        email: "admin@pcforgery.cl",
        password: "admin",
        contrasena: "admin",
        rol: "admin",
        fechaRegistro: "2026-01-01"
    },
    {
        nombre: "Cliente Demostración",
        usuario: "cliente",
        correo: "cliente@pcforgery.cl",
        email: "cliente@pcforgery.cl",
        password: "123",
        contrasena: "123",
        rol: "usuario",
        fechaRegistro: "2026-01-15"
    }
]
```

---

## 📌 Pregunta 4: "Explicar cómo se hizo la migración HTML/CSS a React."

### 🗣️ Qué responderle al profesor en voz alta:
> *"La migración desde el proyecto HTML/CSS/JS clásico a React 19 con Vite se estructuró en 4 pilares fundamentales:*  
>  
> 1. ***De páginas estáticas sueltas a Componentes Reutilizables (SPA):***  
>    *Originalmente teníamos archivos `.html` independientes (`index.html`, `shop.html`, `login.html`, `admin.html`). En React dividimos la aplicación en componentes modulares (`<Nav />`, `<Footer />`, `<Home />`, `<Shop />`, `<ArmaTuPC />`, `<Usuario />`, `<Admin />`). El encabezado y pie ahora no se repiten en cada archivo, sino que se renderizan una sola vez en `App.jsx`.*  
>  
> 2. ***Enrutamiento declarativo con React Router:***  
>    *Reemplazamos la navegación clásica de recarga completa (`<a href="shop.html">`) por el enrutador `<BrowserRouter>`, `<Routes>` y componentes `<Link to="/Shop">`. Esto transformó la web en una Single Page Application (SPA), donde el cambio de sección es instantáneo sin parpadeos de recarga.*  
>  
> 3. ***Migración de lógica imperativa (DOM) a Estado Reactivo (Hooks):***  
>    *En el HTML original se usaban funciones con `document.getElementById()`, `innerHTML` y variables globales. Eso se reemplazó por:*  
>    - *`useState`: para el estado de formularios, pasos del asistente, cálculo de compatibilidad en vivo y modales.*  
>    - *`useEffect`: para sincronizar con el `localStorage` y montar recursos.*  
>    - *`useRef`: para controlar inputs de archivos o realizar scroll suave a formularios.*  
>  
> 4. ***Aislamiento de estilos y preservación de la estética Windows 98:***  
>    *Se mantuvieron todos los estilos CSS originales retro (`App.css`, `Nav.css`, `Usuario.css`). Además, para cumplir con el requerimiento de que Bootstrap solo se use en el Admin, implementamos una **inyección dinámica de Bootstrap**: cuando el usuario entra a `/Admin`, un `useEffect` inserta la hoja de estilos de Bootstrap en el `<head>`, y cuando sale a la tienda o su perfil, la remueve del DOM. Así, la capa de cliente permanece 100% fiel a la estética nativa de PC-Forgery sin interferencias de Bootstrap."*

---

## 🚀 Resumen rápido de comandos para demostrarle al profesor en la terminal:

```bash
# 1. Correr todos los tests unitarios (16 tests pasando):
npx vitest run

# 2. Correr una prueba específica (ej: Arma tu PC):
npx vitest run src/test/ArmaTuPC.test.jsx

# 3. Compilar el proyecto a producción (Vite build):
npm run build
```

---
*Documento preparado para defensa de proyecto - PC Forgery 2026*

