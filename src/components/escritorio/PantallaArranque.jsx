import { useCallback, useEffect, useState } from "react"
import "./PantallaArranque.css"
import { CLAVE_ARRANQUE, DURACION_ARRANQUE_MS, debeMostrarArranque } from "./Escritorio.js"


function PantallaArranque() {
    const [visible, setVisible] = useState(debeMostrarArranque)

    const omitir = useCallback(() => {
        try {
            sessionStorage.setItem(CLAVE_ARRANQUE, "1")
        } catch {
            // sin sessionStorage simplemente se oculta
        }
        setVisible(false)
    }, [])

    useEffect(() => {
        if (!visible) return undefined
        const temporizador = setTimeout(omitir, DURACION_ARRANQUE_MS)
        window.addEventListener("keydown", omitir)
        return () => {
            clearTimeout(temporizador)
            window.removeEventListener("keydown", omitir)
        }
    }, [visible, omitir])

    if (!visible) return null

    return (
        <div className="pantalla-arranque" onClick={omitir} role="presentation">
            <div className="arranque-logo">
                <img src="/wlogo.svg" alt="" />
                <p className="arranque-titulo">
                    PC Forgery <span>98</span>
                </p>
                <p className="arranque-subtitulo">Iniciando tienda de hardware...</p>
            </div>
            <div className="arranque-progreso" aria-hidden="true">
                <div className="arranque-progreso-barra" />
            </div>
            <p className="arranque-omitir">Haz clic o presiona cualquier tecla para omitir</p>
        </div>
    )
}

export default PantallaArranque
