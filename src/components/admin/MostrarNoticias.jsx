import { useNoticias } from "../noticias/useNoticias.js"
import { formatearFecha } from "../../data/catalogoNoticias.js"
import { rutaPublica } from "../../utils/rutaPublica.js"

function MostrarNoticias() {
    const { noticias, eliminarNoticia } = useNoticias()

    return (
        <div className="admin-tabla-contenedor p-2 p-md-3">
            <table className="table table-bordered table-striped tabla-admin-responsiva mb-0">
                <thead>
                    <tr>
                        <th>Imagen</th>
                        <th>Titulo</th>
                        <th>Resumen</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {noticias.map(noticia => (
                        <tr key={noticia.id}>
                            <td>
                                <img
                                    src={rutaPublica(noticia.imagen)}
                                    alt=""
                                    style={{ width: "60px", height: "40px", objectFit: "cover" }}
                                />
                            </td>
                            <td>{noticia.titulo}</td>
                            <td>{noticia.resumen}</td>
                            <td>{formatearFecha(noticia.fecha)}</td>
                            <td data-label="Acciones">
                                <button
                                    type="button"
                                    className="btn btn-danger btn-sm"
                                    onClick={() => eliminarNoticia(noticia.id)}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}

                    {noticias.length === 0 && (
                        <tr>
                            <td colSpan="5" className="text-center py-3">
                                No hay noticias registradas.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default MostrarNoticias