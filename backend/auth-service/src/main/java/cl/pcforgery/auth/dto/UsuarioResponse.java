package cl.pcforgery.auth.dto;

import cl.pcforgery.auth.model.Usuario;
import java.time.LocalDateTime;

/** Usuario sin datos sensibles (nunca incluye la contraseña). */
public record UsuarioResponse(Long id, String nombre, String usuario, String email, String rol,
                              String descripcion, String foto, boolean activo, LocalDateTime fechaRegistro) {

    public static UsuarioResponse de(Usuario u) {
        return new UsuarioResponse(u.getId(), u.getNombre(), u.getUsuario(), u.getEmail(), u.getRol().name(),
                u.getDescripcion(), u.getFoto(), u.isActivo(), u.getFechaRegistro());
    }
}
