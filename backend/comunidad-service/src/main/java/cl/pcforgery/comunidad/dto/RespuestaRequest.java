package cl.pcforgery.comunidad.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RespuestaRequest(
        @NotBlank(message = "La respuesta no puede estar vacía.")
        @Size(min = 3, max = 3000, message = "La respuesta debe tener al menos 3 caracteres.") String texto) {
}
