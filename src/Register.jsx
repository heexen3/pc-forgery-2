import { Link, useNavigate } from "react-router-dom"
import "./Register.css"
import ValidacionRegistro from "./components/ValidacionRegistro"


function Register() {
    // Lógica
    const navigate = useNavigate()
    // Renderizado
    return(
    <main>
        <section className="formulario-registro">
            <h1>Registrarse</h1>
            <form onSubmit={(event) => ValidacionRegistro(event,navigate)}>
                {/* <!-- Nombre de usuario --> */}
            <label htmlFor="usuario">Nombre de Usuario:</label>
            <input type="text" id="usuario" name="usuario" minLength="6" required placeholder="john_doe" />
                {/*<!-- Correo Electrónico --> */}
            <label htmlFor="email">Correo Electrónico:</label>
            <input type="email" id="email" name="email" required placeholder="john.doe@example.com" />
                {/* <!-- contraseña y confirmación de contraseña --> */}
            <label htmlFor="password">Contraseña:</label>
            <input type="password" id="password" name="password" minLength="6" required placeholder="password" />
            <label htmlFor="confirm_password">Confirmar Contraseña:</label>
            <input type="password" id="confirm_password" name="confirm_password" required placeholder="password confirmation" />
                {/* <!-- Botón de registro --> */}
            <button type="submit">Registrarse</button>
        </form>
        <p className="registro"> ¿Tienes una cuenta?
                    <Link to="/Login" className="login-boton"> Iniciar sesión </Link>
                </p>
        </section>
    </main>
    )
}

export default Register