package cl.pcforgery.pedidos.dto;

import cl.pcforgery.pedidos.model.DetallePedido;
import java.time.LocalDateTime;
import java.util.List;

public record PedidoResponse(Long id, Long usuarioId, String usuario, String correo, LocalDateTime fecha, String estado,
                             String metodoPago, String rutCliente, Integer subtotal, Integer iva, Integer total,
                             String codigoTransaccion, String observacion, Integer numeroBoleta,
                             List<DetallePedido> detalles) {
}
