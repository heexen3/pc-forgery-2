package cl.pcforgery.pedidos.dto;

/** Pieza de un PC armado tal como viene del carrito del frontend. */
public record ComponenteItem(String categoria, String id, String nombre, Integer precio) {
}
