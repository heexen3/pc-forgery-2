import { useState } from "react"
import { crearNoticia } from "../../data/catalogoNoticias.js"
import { mostrarAlerta } from "../dialogo/Dialogo.js"

// Limite del resumen
const LIMITE_CARACTERES_RESUMEN = 150

function NuevaNoticia() {
    const [noticia, setNoticia] = useState({
        titulo: "",
        resumen: "",
        texto: ""
    })
    const [imagen, setImagen] = useState("")
    const [previsualizacion, setPrevisualizacion] = useState("")

    function manejarCambio(event) {
        const { name, value } = event.target

        setNoticia({
            ...noticia,
            [name]: value
        })
    }

    function manejarImagen(event) {
        const archivo = event.target.files?.[0]
        if (!archivo) return

        // se guarda como data URL para no depender de subir el archivo a public/
        const lector = new FileReader()
        lector.onload = () => {
            setImagen(lector.result)
            setPrevisualizacion(lector.result)
        }
        lector.readAsDataURL(archivo)
    }

    function manejarEnvio(event) {
        event.preventDefault()

        if (
            !noticia.titulo.trim() ||
            !noticia.resumen.trim() ||
            !noticia.texto.trim() ||
            !imagen
        ) {
            mostrarAlerta("Completa todos los campos, incluyendo la imagen.", { icono: "advertencia" })
            return
        }

        if (noticia.resumen.trim().length > LIMITE_CARACTERES_RESUMEN) {
            mostrarAlerta(`El resumen no puede superar los ${LIMITE_CARACTERES_RESUMEN} caracteres.`, { icono: "advertencia" })
            return
        }

        crearNoticia({
            titulo: noticia.titulo.trim(),
            resumen: noticia.resumen.trim(),
            texto: noticia.texto.trim(),
            imagen
        })

        mostrarAlerta("Noticia creada correctamente.")

        setNoticia({ titulo: "", resumen: "", texto: "" })
        setImagen("")
        setPrevisualizacion("")
        event.target.reset()
    }

    return (
        <form onSubmit={manejarEnvio} className="p-3">
            <div className="mb-3">
                <label htmlFor="titulo" className="form-label">
                    Titulo *
                </label>

                <input
                    type="text"
                    id="titulo"
                    name="titulo"
                    className="form-control"
                    value={noticia.titulo}
                    onChange={manejarCambio}
                    required
                />
            </div>

            <div className="mb-3">
                <label htmlFor="resumen" className="form-label">
                    Resumen *
                </label>

                <textarea
                    id="resumen"
                    name="resumen"
                    className="form-control"
                    rows="2"
                    maxLength={LIMITE_CARACTERES_RESUMEN}
                    value={noticia.resumen}
                    onChange={manejarCambio}
                    required
                />

                <small className="form-text">
                    {noticia.resumen.length}/{LIMITE_CARACTERES_RESUMEN} caracteres
                </small>
            </div>

            <div className="mb-3">
                <label htmlFor="texto" className="form-label">
                    Texto de la noticia *
                </label>

                <textarea
                    id="texto"
                    name="texto"
                    className="form-control"
                    rows="6"
                    value={noticia.texto}
                    onChange={manejarCambio}
                    required
                />
            </div>

            <div className="mb-3">
                <label htmlFor="imagen" className="form-label">
                    Imagen *
                </label>

                <input
                    type="file"
                    id="imagen"
                    name="imagen"
                    accept="image/*"
                    className="form-control"
                    onChange={manejarImagen}
                    required
                />

                {previsualizacion && (
                    <img
                        src={previsualizacion}
                        alt="Previsualización de la noticia"
                        className="mt-2"
                        style={{ maxWidth: "200px", display: "block", border: "2px inset #ffffff" }}
                    />
                )}
            </div>

            <button type="submit" className="btn btn-admin">
                Publicar noticia
            </button>
        </form>
    )
}

export default NuevaNoticia