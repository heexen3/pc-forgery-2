package cl.pcforgery.auth.exception;

/** Se lanza cuando el recurso pedido no existe (HTTP 404). */
public class RecursoNoEncontradoException extends RuntimeException {

    public RecursoNoEncontradoException(String mensaje) {
        super(mensaje);
    }
}
