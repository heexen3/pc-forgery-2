package cl.pcforgery.pagos.security;

import cl.pcforgery.pagos.exception.NegocioException;
import org.springframework.http.HttpStatus;

/**
 * Usuario autenticado que llega desde el API Gateway en las cabeceras X-Usuario-*.
 * El gateway valida el JWT y elimina cualquier cabecera X-Usuario-* enviada por el cliente.
 */
public record UsuarioContexto(Long id, String email, String usuario, String rol) {

    public static final String H_ID = "X-Usuario-Id";
    public static final String H_EMAIL = "X-Usuario-Email";
    public static final String H_USUARIO = "X-Usuario-Nombre";
    public static final String H_ROL = "X-Usuario-Rol";

    public static UsuarioContexto de(String id, String email, String usuario, String rol) {
        if (email == null || email.isBlank()) {
            throw new NegocioException(HttpStatus.UNAUTHORIZED, "Debes iniciar sesión.");
        }
        Long idNumerico = null;
        try {
            idNumerico = id == null ? null : Long.valueOf(id);
        } catch (NumberFormatException ignorado) {
            // id no numérico: se deja nulo
        }
        return new UsuarioContexto(idNumerico, email.toLowerCase(), usuario, rol);
    }

    public boolean esAdmin() {
        return "ADMIN".equalsIgnoreCase(rol);
    }

    public void exigirAdmin() {
        if (!esAdmin()) {
            throw new NegocioException(HttpStatus.FORBIDDEN, "Solo un administrador puede realizar esta acción.");
        }
    }
}
