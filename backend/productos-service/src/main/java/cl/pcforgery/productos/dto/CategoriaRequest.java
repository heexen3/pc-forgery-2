package cl.pcforgery.productos.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoriaRequest(
        @NotBlank(message = "El valor es obligatorio.") @Size(max = 60) String valor,
        @NotBlank(message = "La etiqueta es obligatoria.") @Size(max = 60) String etiqueta,
        String icono) {
}
