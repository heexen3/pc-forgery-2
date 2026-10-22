import "./Contacto.css"

function Contacto() {
    function enviarFormulario(event) {
        event.preventDefault()
        alert("Gracias por tu mensaje. Esta función estará disponible próximamente.")
        event.target.reset()
    }
    return (
        <main className="contacto-contenido">
            <section className="contacto-info">
                <div className="contacto-titulo">
                    <h2>Contacto</h2>
                </div>
                <div className="contacto-formulario">
                    <form className="formulario" onSubmit={enviarFormulario}>
                        <label htmlFor="nombre">Nombre:</label>
                        <input type="text" id="nombre" name="nombre" required />

                        <label htmlFor="email">Correo electrónico:</label>
                        <input type="email" id="email" name="email" required />

                        <label htmlFor="mensaje">Mensaje:</label>
                        <textarea id="mensaje" name="mensaje" rows="5" required></textarea>

                        <button type="submit">Enviar</button>
                    </form>
                    <p>¿Tienes alguna pregunta? ¡Estamos aquí para ayudarte!</p>
                </div>
            </section>
        </main>
    )
}
export default Contacto