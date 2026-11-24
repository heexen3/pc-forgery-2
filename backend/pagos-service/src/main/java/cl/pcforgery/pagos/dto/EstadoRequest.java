package cl.pcforgery.pagos.dto;

import cl.pcforgery.pagos.model.EstadoPago;
import jakarta.validation.constraints.NotNull;

public record EstadoRequest(@NotNull(message = "El estado es obligatorio.") EstadoPago estado, String motivo) {
}
