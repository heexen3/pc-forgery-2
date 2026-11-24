package cl.pcforgery.pedidos.service;

import cl.pcforgery.pedidos.dto.BoletaResponse;
import cl.pcforgery.pedidos.dto.ComponenteItem;
import cl.pcforgery.pedidos.model.Boleta;
import cl.pcforgery.pedidos.model.DetallePedido;
import cl.pcforgery.pedidos.model.Pedido;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;

/** Convierte Boleta + Pedido al formato de boleta que usa el frontend. */
@Component
public class BoletaMapper {

    /** Datos ficticios del emisor (iguales a EMISOR de Boletas.js). */
    public static final Map<String, String> EMISOR = Map.of(
            "razonSocial", "PC Forgery SpA",
            "rut", "76.543.210-3",
            "giro", "Venta al por menor de computadores y componentes",
            "direccion", "Av. Providencia 1234, Of. 98, Providencia, Santiago",
            "telefono", "+56 2 2345 6789",
            "correo", "ventas@pcforgery.cl");

    private final ObjectMapper mapper;

    public BoletaMapper(ObjectMapper mapper) {
        this.mapper = mapper;
    }

    public BoletaResponse aRespuesta(Boleta boleta) {
        Pedido p = boleta.getPedido();
        Map<String, String> cliente = new LinkedHashMap<>();
        cliente.put("nombre", p.getUsuario());
        cliente.put("correo", p.getCorreo());
        cliente.put("rut", p.getRutCliente() == null ? "" : p.getRutCliente());
        List<BoletaResponse.ItemBoleta> items = p.getDetalles().stream().map(this::item).toList();
        return new BoletaResponse("BOLETA ELECTRÓNICA", boleta.getNumero(), fechaIso(boleta), p.getUsuario(),
                p.getCorreo(), EMISOR, cliente, p.getMetodoPago(), items, p.getSubtotal(), p.getIva(), p.getTotal(),
                boleta.getCodigoVerificacion(), p.getId(), p.getEstado().name(), p.getCodigoTransaccion());
    }

    private BoletaResponse.ItemBoleta item(DetallePedido d) {
        return new BoletaResponse.ItemBoleta(d.getItemId(), d.getCodigo(), d.getTipo(), d.getProductoId(),
                d.getNombre(), d.getPrecio(), d.getCantidad(), componentes(d.getComponentesJson()), d.getTotalLinea());
    }

    private List<ComponenteItem> componentes(String json) {
        if (json == null || json.isBlank()) {
            return null;
        }
        try {
            return mapper.readValue(json, new TypeReference<List<ComponenteItem>>() { });
        } catch (Exception e) {
            return null;
        }
    }

    /** Fecha en ISO-8601 UTC (como new Date().toISOString() en el frontend). */
    public static String fechaIso(Boleta boleta) {
        return boleta.getFecha().atZone(ZoneId.systemDefault()).withZoneSameInstant(ZoneOffset.UTC)
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"));
    }

    /** Mismo algoritmo que codigoVerificacion() de Boletas.js (hash 31 sin signo de 32 bits). */
    public static String codigoVerificacion(int numero, String fechaIso, int total, String correo) {
        String texto = numero + "|" + fechaIso + "|" + total + "|" + correo;
        long hash = 0;
        for (int i = 0; i < texto.length(); i++) {
            hash = (hash * 31 + texto.charAt(i)) & 0xFFFFFFFFL;
        }
        String hex = Long.toHexString(hash).toUpperCase();
        return "0".repeat(Math.max(0, 8 - hex.length())) + hex;
    }
}
