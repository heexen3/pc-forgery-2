import { Link } from "react-router-dom"
import "./Register.css"


function Register() {
    // Lógica

    // Renderizado
    return(
    <main>
        <section className="formulario-registro">
            <h1>Registrarse</h1>
            <form >
                {/* <!-- Nombre de usuario --> */}
            <label htmlFor="usuario">Nombre de Usuario:</label>
            <input type="text" id="usuario" name="usuario" minlength="3" required placeholder="john_doe" />
                {/*<!-- Correo Electrónico --> */}
            <label htmlFor="email">Correo Electrónico:</label>
            <input type="email" id="email" name="email" required placeholder="john.doe@example.com" />
                {/* <!-- contraseña y confirmación de contraseña --> */}
            <label htmlFor="password">Contraseña:</label>
            <input type="password" id="password" name="password" minlength="6" required placeholder="password" />
            <label htmlFor="confirm_password">Confirmar Contraseña:</label>
            <input type="password" id="confirm_password" name="confirm_password" required placeholder="password confirmation" />
                {/* <!-- Botón de registro --> */}
            <button type="submit">Registrarse</button>
        </form>
        <p className="registro"> ¿Tienes una cuenta?
                    <Link to="/login" className="login-boton"> Iniciar sesión </Link>
                </p>
        </section>
    </main>
    )
}

export default Register