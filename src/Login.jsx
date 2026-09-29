import { Link, useNavigate } from "react-router-dom"
import "./Login.css"
import ValidacionLogin from "./components/ValidacionLogin"


function Login() {
    // Lógica
    const navigate = useNavigate()
    // Renderizado
    return(
        <main>
        <section className="formulario-login">
            <h1>Iniciar sesión</h1>
            <form onSubmit={(event) => ValidacionLogin(event,navigate)}>
            <label htmlFor="usuario" >Correo electrónico o Nombre de usuario:</label>
            <input type="text" id="usuario" name="usuario" minLength="3" required placeholder="john_doe OR john.doe@example.com" />
            <label htmlFor="password">Contraseña:</label>
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