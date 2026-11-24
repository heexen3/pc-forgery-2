package cl.pcforgery.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Datos del formulario de registro (mismas reglas que valida el frontend). */
public record RegistroRequest(
        @Size(max = 100, message = "El nombre no puede superar 100 caracteres.")
        String nombre,

        @NotBlank(message = "El usuario es obligatorio.")
        @Pattern(regexp = "^(?=.*[a-zA-Z])[a-zA-Z0-9]{3,40}$",
                message = "El usuario debe tener al menos 3 caracteres, contener al menos una letra y no tener caracteres especiales.")
        String usuario,

        @NotBlank(message = "El correo es obligatorio.")
        @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@(gmail\\.com|outlook\\.com|duocuc\\.cl)$",
                message = "El correo debe ser Gmail, Outlook o Duoc UC.")
        String email,

        @NotBlank(message = "La contraseña es obligatoria.")
        @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&.-]).{6,}$",
                message = "La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula, un número y un carácter especial.")
        String password) {
}
