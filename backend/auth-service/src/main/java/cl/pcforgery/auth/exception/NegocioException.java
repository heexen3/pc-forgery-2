package cl.pcforgery.auth.exception;

import org.springframework.http.HttpStatus;

/** Error de una regla de negocio. Lleva el código HTTP que se debe responder. */
public class NegocioException extends RuntimeException {

    private final HttpStatus status;

    public NegocioException(HttpStatus status, String mensaje) {
        super(mensaje);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
