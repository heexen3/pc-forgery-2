import { useState } from "react"
import { obtenerNoticias, eliminarNoticia as eliminarNoticiaCatalogo, sincronizarNoticias } from "../../data/catalogoNoticias.js"
import { cuandoListo, useSincronizacion } from "../../utils/api.js"
import { mostrarAlerta, confirmar } from "../dialogo/Dialogo.js"

// Hook compartido por la pagina publica de Noticias y el panel de admin
export function useNoticias() {
    const [noticias, setNoticias] = useState(() => obtenerNoticias())
    // con backend: noticias desde comunidad-service
    useSincronizacion(sincronizarNoticias, () => setNoticias(obtenerNoticias()))

    async function eliminarNoticia(id) {
        const confirmado = await confirmar("¿Estás seguro de que deseas eliminar esta noticia?")
        if (!confirmado) return

        try {
            await cuandoListo(eliminarNoticiaCatalogo(id), setNoticias)
            mostrarAlerta("Noticia eliminada correctamente.")
        } catch (error) {
            mostrarAlerta(error.message, { icono: "error" })
        }
    }

    return { noticias, eliminarNoticia }
}

export default useNoticias