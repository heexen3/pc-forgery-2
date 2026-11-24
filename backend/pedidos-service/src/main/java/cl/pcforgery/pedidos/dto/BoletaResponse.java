package cl.pcforgery.pedidos.dto;

import java.util.List;
import java.util.Map;

/**
 * Boleta con el mismo formato que usaba el frontend en localStorage ("boletas"),
 * así las páginas Boleta, Mis compras y el panel admin no cambian.
 */
public record BoletaResponse(String tipoDocumento, Integer numero, String fecha, String usuario, String correo,
                             Map<String, String> emisor, Map<String, String> cliente, String metodoPago,
                             List<ItemBoleta> items, Integer subtotal, Integer iva, Integer total,
                             String codigoVerificacion, Long pedidoId, String estado, String codigoTransaccion) {

    public record ItemBoleta(String id, String codigo, String tipo, Long productoId, String nombre, Integer precio,
                             Integer cantidad, List<ComponenteItem> componentes, Integer totalLinea) {
    }
}
