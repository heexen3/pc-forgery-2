package cl.pcforgery.pagos.exception;

import java.time.Instant;
import java.util.Map;

/** Formato único de error de la API: {timestamp, status, error, mensaje, ruta, detalles}. */
public record ApiError(Instant timestamp, int status, String error, String mensaje, String ruta,
                       Map<String, String> detalles) {
}
