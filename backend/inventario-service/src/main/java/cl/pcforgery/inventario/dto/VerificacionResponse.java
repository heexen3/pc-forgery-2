package cl.pcforgery.inventario.dto;

/** ok=false trae el mensaje con el primer producto sin stock suficiente. */
public record VerificacionResponse(boolean ok, String mensaje) {
}
