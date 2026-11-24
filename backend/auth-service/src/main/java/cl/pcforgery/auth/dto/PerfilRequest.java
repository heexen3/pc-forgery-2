package cl.pcforgery.auth.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Cambios que el propio usuario puede hacer en su perfil. Los campos nulos no se modifican. */
public record PerfilRequest(
        @Size(max = 100, message = "El nombre no puede superar 100 caracteres.") String nombre,
        @Pattern(regexp = "^[a-zA-Z][a-zA-Z0-9_]{2,19}$",
                message = "El nombre de usuario debe empezar con una letra y tener entre 3 y 20 caracteres (letras, números o _).")
        String usuario,
        @Size(max = 160, message = "La descripción no puede superar 160 caracteres.") String descripcion,
        String foto) {
}
