package cl.pcforgery.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Alta o edición de un usuario desde el panel admin.
 * password es obligatoria al crear y opcional al editar (si viene vacía no se cambia).
 */
public record UsuarioRequest(
        @NotBlank(message = "El nombre es obligatorio.") @Size(max = 100) String nombre,
        @Size(max = 40) String usuario,
        @NotBlank(message = "El correo es obligatorio.") @Email(message = "El correo no es válido.") String email,
        @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres.") String password,
        @Pattern(regexp = "(?i)ADMIN|CLIENTE|admin|usuario", message = "El rol debe ser ADMIN o CLIENTE.") String rol,
        Boolean activo) {
}
