package cl.pcforgery.inventario.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/** Producto y cantidad a verificar o descontar. nombre es opcional (para el mensaje de error). */
public record ItemStock(
        @NotNull Long productoId,
        @NotNull @Min(value = 1, message = "La cantidad debe ser al menos 1.") Integer cantidad,
        String nombre) {
}
