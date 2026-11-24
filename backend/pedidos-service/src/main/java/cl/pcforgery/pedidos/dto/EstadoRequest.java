package cl.pcforgery.pedidos.dto;

import cl.pcforgery.pedidos.model.EstadoPedido;
import jakarta.validation.constraints.NotNull;

public record EstadoRequest(@NotNull(message = "El estado es obligatorio.") EstadoPedido estado, String observacion) {
}
