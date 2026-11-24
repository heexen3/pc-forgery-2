package cl.pcforgery.auth.dto;

import jakarta.validation.constraints.NotBlank;

/** identificador: correo o nombre de usuario. */
public record LoginRequest(
        @NotBlank(message = "Ingresa tu correo o nombre de usuario.") String identificador,
        @NotBlank(message = "Ingresa tu contraseña.") String password) {
}
