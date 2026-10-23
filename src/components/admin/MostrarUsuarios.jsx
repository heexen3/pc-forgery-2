import { useEffect, useState } from "react"

function MostrarUsuarios() {
    const [usuarios, setUsuarios] = useState([])

    useEffect(() => {
        const usuariosGuardados = JSON.parse(
            localStorage.getItem("usuarios")
        ) || []

        setUsuarios(usuariosGuardados)
    }, [])

    return (
        <div className="p-3">
            <h3>Usuarios registrados</h3>

            {usuarios.length === 0 ? (
                <p>No hay usuarios registrados.</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Rol</th>
                            </tr>
                        </thead>

                        <tbody>
                            {usuarios.map((usuario, indice) => (
                                <tr key={usuario.correo || indice}>
                                    <td>{usuario.nombre}</td>
                                    <td>{usuario.correo}</td>
                                    <td>{usuario.rol}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                        </div>
                    )}
        </div>
    )
}

export default MostrarUsuarios