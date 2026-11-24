package cl.pcforgery.productos.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.Map;

public record ProductoRequest(
        @NotBlank(message = "El nombre es obligatorio.") @Size(max = 120) String nombre,
        @NotBlank(message = "La categoría es obligatoria.") String categoria,
        @Size(max = 60) String marca,
        @NotNull(message = "El precio es obligatorio.") @Min(value = 1, message = "El precio debe ser mayor a 0.") Integer precio,
        @Size(max = 1000, message = "La descripción no puede superar 1000 caracteres.") String descripcion,
        String imagen,
        Boolean nuevo,
        Map<String, String> especificaciones) {
}
