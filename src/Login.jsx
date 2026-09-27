import { Link } from "react-router-dom"
import "./Login.css"


function Login() {
    // Lógica

    // Renderizado
    return(
        <main>
        <section class="formulario-login">
            <h1>Iniciar sesión</h1>
            <form>
            <label for="usuario" >Correo electrónico o Nombre de usuario:</label>
            <input type="text" id="usuario" name="usuario" minlength="3" required placeholder="john_doe OR john.doe@example.com" />
            <label for="password">Contraseña:</label>
            <input type="password" id="password" name="password" required placeholder="password" />
            <button type="submit" id="btnInicio">Iniciar sesión</button>
        </form>
        <p className="registro">
            ¿No tienes una cuenta?
            <Link to="/Register" className="registrarse-boton">
                Registrarse
            </Link>
        </p>
        </section>
    </main>
    )
}

export default Login