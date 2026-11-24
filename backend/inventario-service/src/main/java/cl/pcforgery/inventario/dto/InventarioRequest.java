package cl.pcforgery.inventario.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record InventarioRequest(
        @NotNull(message = "El productoId es obligatorio.") Long productoId,
        @NotNull(message = "El stock es obligatorio.") @Min(value = 0, message = "El stock no puede ser negativo.") Integer stock,
        @Min(value = 0, message = "El stock mínimo no puede ser negativo.") Integer stockMinimo) {
}
