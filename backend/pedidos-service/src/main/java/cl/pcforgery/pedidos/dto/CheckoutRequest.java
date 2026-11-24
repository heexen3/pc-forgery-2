package cl.pcforgery.pedidos.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

/**
 * Datos del checkout: carrito + método de pago + RUT opcional.
 * simularRechazo=true corresponde al botón "Simular pago no exitoso".
 */
public record CheckoutRequest(
        @NotEmpty(message = "El carrito está vacío.") List<@Valid ItemCarrito> items,
        @NotBlank(message = "Selecciona un método de pago válido.") String metodoPago,
        String rut,
        Boolean simularRechazo) {
}
