import { useState } from "react"
import { obtenerUsuarios } from "../../data/usuariosData.js"

function MostrarUsuarios({ onEditarUsuario }) {
    const [usuarios] = useState(() => obtenerUsuarios())

    return (
        <div className="admin-tabla-contenedor p-2 p-md-3">
            <h3 className="mb-3">Usuarios registrados</h3>

            {usuarios.length === 0 ? (
                <p>No hay usuarios registrados.</p>
            ) : (
                <table className="table table-bordered table-striped tabla-admin-responsiva mb-0">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Usuario</th>
                            <th>Correo</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {usuarios.map((usuario, indice) => (
                            <tr key={usuario.correo || usuario.email || indice}>
                                <td data-label="Nombre">
                                    <strong>{usuario.nombre || usuario.usuario}</strong>
                                </td>
                                <td data-label="Usuario">
                                    {usuario.usuario || usuario.nombre}
                                </td>
                                <td data-label="Correo">
                                    {usuario.correo || usuario.email}
                                </td>
                                <td data-label="Rol">
                                    <span className="badge">
                                        {usuario.rol === "admin" ? "Administrador" : "Usuario"}
                                    </span>
                                </td>
                                <td data-label="Acciones">
                                    <button
                                        type="button"
                                        className="btn btn-admin btn-sm"
                                        onClick={() => onEditarUsuario && onEditarUsuario(usuario)}
                                    >
                                        Editar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default MostrarUsuarios
