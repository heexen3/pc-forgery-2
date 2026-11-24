package cl.pcforgery.comunidad.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Mismas reglas que NuevoHilo.jsx. */
public record HiloRequest(
        @NotBlank(message = "El título debe tener al menos 5 caracteres.")
        @Size(min = 5, max = 100, message = "El título debe tener entre 5 y 100 caracteres.") String titulo,
        @NotBlank(message = "Selecciona una categoría válida.")
        @Pattern(regexp = "Armado de PC|Soporte técnico|Showcase|General|Tarjetas de video|Armados|Procesadores|Refrigeración",
                message = "Selecciona una categoría válida.") String categoria,
        @NotBlank(message = "El mensaje debe tener al menos 10 caracteres.")
        @Size(min = 10, max = 5000, message = "El mensaje debe tener al menos 10 caracteres.") String mensaje) {
}
