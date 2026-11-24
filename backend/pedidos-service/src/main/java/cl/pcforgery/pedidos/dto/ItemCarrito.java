package cl.pcforgery.pedidos.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.util.List;

/**
 * Ítem del carrito. El precio NO se recibe: se consulta a productos-service
 * (para un armado se suma el precio de cada componente).
 */
public record ItemCarrito(
        String id,
        @Pattern(regexp = "producto|armado", message = "El tipo debe ser producto o armado.") String tipo,
        Long productoId,
        String nombre,
        @NotNull(message = "La cantidad es obligatoria.") @Min(value = 1, message = "La cantidad debe ser al menos 1.") Integer cantidad,
        List<ComponenteItem> componentes) {

    public boolean esArmado() {
        return "armado".equals(tipo);
    }
}
