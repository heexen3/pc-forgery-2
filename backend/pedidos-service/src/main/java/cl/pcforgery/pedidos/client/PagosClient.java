package cl.pcforgery.pedidos.client;

import cl.pcforgery.pedidos.exception.NegocioException;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;

/** Cliente REST de pagos-service. */
@Component
public class PagosClient {

    /** Resultado del pago: estado APROBADO o RECHAZADO. */
    public record ResultadoPago(String estado, String motivo, String codigoTransaccion) {

        public boolean aprobado() {
            return "APROBADO".equals(estado);
        }
    }

    private final RestClient rest;

    public PagosClient(RestClient.Builder builder, @Value("${app.servicios.pagos}") String url) {
        this.rest = builder.baseUrl(url).build();
    }

    public ResultadoPago pagar(Long pedidoId, int monto, String metodoPago, String rut, String correo,
                               boolean simularRechazo) {
        Map<String, Object> cuerpo = new HashMap<>();
        cuerpo.put("pedidoId", pedidoId);
        cuerpo.put("monto", monto);
        cuerpo.put("metodoPago", metodoPago);
        cuerpo.put("rut", rut);
        cuerpo.put("correo", correo);
        cuerpo.put("simularRechazo", simularRechazo);
        try {
            Map<String, Object> r = rest.post().uri("/pagos").body(cuerpo).retrieve()
                    .body(new ParameterizedTypeReference<Map<String, Object>>() { });
            if (r == null) {
                throw new NegocioException(HttpStatus.BAD_GATEWAY, "Respuesta vacía del servicio de pagos.");
            }
            return new ResultadoPago(String.valueOf(r.get("estado")), (String) r.get("motivo"),
                    (String) r.get("codigoTransaccion"));
        } catch (HttpClientErrorException e) {
            throw new NegocioException(HttpStatus.BAD_REQUEST, "El servicio de pagos rechazó la solicitud.");
        } catch (ResourceAccessException e) {
            throw new NegocioException(HttpStatus.SERVICE_UNAVAILABLE, "El servicio de pagos no está disponible.");
        }
    }
}
