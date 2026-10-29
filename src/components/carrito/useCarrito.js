import { useMemo, useSyncExternalStore } from "react"
import { CLAVE_CARRITO, EVENTO_CARRITO, parsearCarrito } from "./Carrito.js"

function suscribir(callback) {
    window.addEventListener(EVENTO_CARRITO, callback)
    // "storage" sincroniza el carrito entre pestañas
    window.addEventListener("storage", callback)
    return () => {
        window.removeEventListener(EVENTO_CARRITO, callback)
        window.removeEventListener("storage", callback)
    }
}

function leerCarrito() {
    return localStorage.getItem(CLAVE_CARRITO)
}

// Hook que entrega el carrito actual y se actualiza cada vez que cambia
function useCarrito() {
    const carritoGuardado = useSyncExternalStore(suscribir, leerCarrito)
    return useMemo(() => parsearCarrito(carritoGuardado), [carritoGuardado])
}

export default useCarrito
