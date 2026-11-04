import { useState } from "react"
import { obtenerNoticias, eliminarNoticia as eliminarNoticiaCatalogo } from "../../data/catalogoNoticias.js"
import { mostrarAlerta, confirmar } from "../dialogo/Dialogo.js"

// Hook compartido por la pagina publica de Noticias y el panel de admin
export function useNoticias() {
    const [noticias, setNoticias] = useState(() => obtenerNoticias())

    async function eliminarNoticia(id) {
        const confirmado = await confirmar("¿Estás seguro de que deseas eliminar esta noticia?")
        if (!confirmado) return

        setNoticias(eliminarNoticiaCatalogo(id))
        mostrarAlerta("Noticia eliminada correctamente.")
    }

    return { noticias, eliminarNoticia }
}

export default useNoticias