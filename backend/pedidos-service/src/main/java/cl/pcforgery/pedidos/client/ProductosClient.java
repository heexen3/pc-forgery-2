package cl.pcforgery.pedidos.client;

import cl.pcforgery.pedidos.exception.NegocioException;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;

/** Cliente REST de productos-service (precios vigentes de productos y componentes). */
@Component
public class ProductosClient {

    private static final ParameterizedTypeReference<Map<String, Object>> MAPA = new ParameterizedTypeReference<>() { };

    private final RestClient rest;

    public ProductosClient(RestClient.Builder builder, @Value("${app.servicios.productos}") String url) {
        this.rest = builder.baseUrl(url).build();
    }

    /** Devuelve {id, nombre, precio, ...} del producto o lanza 400 si ya no existe. */
    public Map<String, Object> producto(Long id) {
        return obtener("/productos/{id}", id, "El producto " + id + " ya no existe en el catálogo.");
    }

    public Map<String, Object> componente(String id) {
        return obtener("/componentes/{id}", id, "El componente " + id + " ya no existe.");
    }

    private Map<String, Object> obtener(String ruta, Object id, String mensaje404) {
        try {
            return rest.get().uri(ruta, id).retrieve().body(MAPA);
        } catch (HttpClientErrorException.NotFound e) {
            throw new NegocioException(HttpStatus.BAD_REQUEST, mensaje404);
        } catch (ResourceAccessException e) {
            throw new NegocioException(HttpStatus.SERVICE_UNAVAILABLE, "El servicio de productos no está disponible.");
        }
    }
}
