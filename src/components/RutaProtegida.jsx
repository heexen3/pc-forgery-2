import { useEffect, useRef } from "react"
import { Navigate } from "react-router-dom"
import { mostrarAlerta } from "./dialogo/Dialogo.js"

// Lee la sesión guardada por ValidacionLogin (localStorage "usuarioActual")
function obtenerSesion() {
    try {
        return JSON.parse(localStorage.getItem("usuarioActual"))
    } catch {
        return null
    }
}

/**
 * Protege una ruta según la sesión y el rol del usuario.
 * - Sin sesión: redirige a /Login.
 * - Con sesión pero sin el rol pedido: redirige al Home.
 * En ambos casos muestra el diálogo retro "Acceso restringido".
 *
 * Uso: <Route path="/Admin" element={<RutaProtegida rol="admin"><Admin /></RutaProtegida>} />
 *
 * @param {object} props
 * @param {string} [props.rol] Rol requerido (ej. "admin"). Si no se indica basta con haber iniciado sesión.
 * @param {React.ReactNode} props.children Página protegida.
 */
function RutaProtegida({ rol, children }) {
    const usuario = obtenerSesion()
    const permitido = usuario && (!rol || usuario.rol === rol)

    const avisado = useRef(false)
    const conSesion = Boolean(usuario)

    // El aviso va en un efecto (no durante el render) y una sola vez,
    // aunque StrictMode ejecute los efectos dos veces en desarrollo.
    useEffect(() => {
        if (permitido || avisado.current) return
        avisado.current = true
        // Se difiere un tick para que <DialogoWindows /> (montado después de las rutas)
        // ya esté escuchando y el aviso salga con la ventana retro y no con alert().
        // Sin limpieza: <Navigate> desmonta este componente enseguida y el aviso debe salir igual.
        setTimeout(() => {
            mostrarAlerta(
                conSesion
                    ? "No tienes permisos de administrador para entrar a esta sección."
                    : "Debes iniciar sesión como administrador para entrar a esta sección.",
                { titulo: "Acceso restringido", icono: "error" }
            )
        }, 0)
    }, [permitido, conSesion])

    if (!usuario) return <Navigate to="/Login" replace />
    if (!permitido) return <Navigate to="/" replace />
    return children
}

export default RutaProtegida
