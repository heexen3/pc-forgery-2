package cl.pcforgery.inventario.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

/** Lista de ítems a verificar/descontar, con una referencia (ej: "pedido 15"). */
public record MovimientoRequest(@NotEmpty(message = "Debe incluir al menos un ítem.") List<@Valid ItemStock> items,
                                String referencia) {
}
