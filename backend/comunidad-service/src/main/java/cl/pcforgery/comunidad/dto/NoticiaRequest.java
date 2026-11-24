package cl.pcforgery.comunidad.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record NoticiaRequest(
        @NotBlank(message = "El título es obligatorio.") @Size(max = 150) String titulo,
        @NotBlank(message = "El resumen es obligatorio.") @Size(max = 300) String resumen,
        @NotBlank(message = "El texto es obligatorio.") String texto,
        String imagen,
        LocalDate fecha) {
}
