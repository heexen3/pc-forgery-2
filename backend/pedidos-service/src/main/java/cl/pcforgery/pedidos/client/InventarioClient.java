package cl.pcforgery.pedidos.client;

import cl.pcforgery.pedidos.exception.NegocioException;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;

/** Cliente REST de inventario-service. */
@Component
public class InventarioClient {

    /** Ítem a verificar/descontar. */
    public record Item(Long productoId, Integer cantidad, String nombre) {
    }

    private final RestClient rest;

    public InventarioClient(RestClient.Builder builder, @Value("${app.servicios.inventario}") String url) {
        this.rest = builder.baseUrl(url).build();
    }

    /** Lanza 409 con el mensaje del inventario si algún producto no tiene stock suficiente. */
    public void verificar(List<Item> items) {
        if (items.isEmpty()) {
            return;
        }
        try {
            Map<String, Object> r = rest.post().uri("/inventario/verificar")
                    .body(Map.of("items", items))
                    .retrieve()
                    .body(new ParameterizedTypeReference<Map<String, Object>>() { });
            if (r == null || !Boolean.TRUE.equals(r.get("ok"))) {
                String mensaje = r == null ? "No hay stock suficiente." : String.valueOf(r.get("mensaje"));
                throw new NegocioException(HttpStatus.CONFLICT, mensaje);
            }
        } catch (ResourceAccessException e) {
            throw new NegocioException(HttpStatus.SERVICE_UNAVAILABLE, "El servicio de inventario no está disponible.");
        }
    }

    public void descontar(List<Item> items, String referencia) {
        if (items.isEmpty()) {
            return;
        }
        try {
            rest.post().uri("/inventario/descontar")
                    .body(Map.of("items", items, "referencia", referencia))
                    .retrieve()
                    .toBodilessEntity();
        } catch (HttpClientErrorException e) {
            throw new NegocioException(HttpStatus.CONFLICT, "No hay stock suficiente para completar la compra.");
        } catch (ResourceAccessException e) {
            throw new NegocioException(HttpStatus.SERVICE_UNAVAILABLE, "El servicio de inventario no está disponible.");
        }
    }
}
