package cl.pcforgery.pagos.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Solicitud de pago. simularRechazo=true corresponde al botón "Simular pago no exitoso" del frontend.
 */
public record PagoRequest(
        @NotNull(message = "El pedidoId es obligatorio.") Long pedidoId,
        @NotNull(message = "El monto es obligatorio.") @Min(value = 1, message = "El monto debe ser mayor a 0.") Integer monto,
        @NotBlank(message = "El método de pago es obligatorio.") String metodoPago,
        String rut,
        String correo,
        Boolean simularRechazo) {
}
