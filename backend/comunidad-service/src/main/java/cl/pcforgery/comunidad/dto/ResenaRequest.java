package cl.pcforgery.comunidad.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/** Mismas reglas que Resenas.js (1 a 5 estrellas, comentario de al menos 5 caracteres). */
public record ResenaRequest(
        @NotNull(message = "Falta el producto.") Long productoId,
        @NotNull(message = "Selecciona una calificación de 1 a 5 estrellas.")
        @Min(value = 1, message = "Selecciona una calificación de 1 a 5 estrellas.")
        @Max(value = 5, message = "Selecciona una calificación de 1 a 5 estrellas.") Integer estrellas,
        @NotBlank(message = "El comentario debe tener al menos 5 caracteres.")
        @Size(min = 5, max = 1000, message = "El comentario debe tener al menos 5 caracteres.") String comentario) {
}
