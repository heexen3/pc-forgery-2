package cl.pcforgery.pagos.service;

import cl.pcforgery.pagos.dto.EstadoRequest;
import cl.pcforgery.pagos.dto.PagoRequest;
import cl.pcforgery.pagos.exception.NegocioException;
import cl.pcforgery.pagos.exception.RecursoNoEncontradoException;
import cl.pcforgery.pagos.model.EstadoPago;
import cl.pcforgery.pagos.model.Pago;
import cl.pcforgery.pagos.repository.PagoRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Pasarela de pago SIMULADA. Regla de rechazo determinista:
 * <ol>
 *   <li>Si el cliente eligió "Simular pago no exitoso" (simularRechazo = true) se rechaza.</li>
 *   <li>Si el monto supera el cupo máximo simulado (MONTO_MAXIMO) se rechaza.</li>
 * </ol>
 * En cualquier otro caso el pago se aprueba.
 */
@Service
public class PagoService {

    public static final List<String> METODOS = List.of("Débito", "Crédito", "Transferencia");
    public static final int MONTO_MAXIMO = 10_000_000;
    public static final String MOTIVO_SIMULADO = "El pago no pudo completarse (rechazo simulado por el cliente).";
    public static final String MOTIVO_CUPO = "El monto supera el cupo disponible del medio de pago.";

    private final PagoRepository pagos;

    public PagoService(PagoRepository pagos) {
        this.pagos = pagos;
    }

    @Transactional
    public Pago procesar(PagoRequest req) {
        if (!METODOS.contains(req.metodoPago())) {
            throw new NegocioException(HttpStatus.BAD_REQUEST, "Selecciona un método de pago válido.");
        }
        String motivo = motivoRechazo(req);
        Pago pago = Pago.builder()
                .pedidoId(req.pedidoId())
                .monto(req.monto())
                .metodoPago(req.metodoPago())
                .rut(req.rut())
                .correo(req.correo() == null ? null : req.correo().toLowerCase())
                .estado(motivo == null ? EstadoPago.APROBADO : EstadoPago.RECHAZADO)
                .motivo(motivo)
                .codigoTransaccion("TX-" + UUID.randomUUID().toString().substring(0, 13).toUpperCase())
                .fecha(LocalDateTime.now())
                .build();
        return pagos.save(pago);
    }

    /** Devuelve el motivo del rechazo, o null si el pago se aprueba. */
    public static String motivoRechazo(PagoRequest req) {
        if (Boolean.TRUE.equals(req.simularRechazo())) {
            return MOTIVO_SIMULADO;
        }
        if (req.monto() > MONTO_MAXIMO) {
            return MOTIVO_CUPO;
        }
        return null;
    }

    @Transactional(readOnly = true)
    public List<Pago> listar(String correo) {
        return correo == null ? pagos.findAllByOrderByFechaDesc() : pagos.findByCorreoIgnoreCaseOrderByFechaDesc(correo);
    }

    @Transactional(readOnly = true)
    public Pago obtener(Long id) {
        return pagos.findById(id).orElseThrow(() -> new RecursoNoEncontradoException("Pago no encontrado."));
    }

    @Transactional(readOnly = true)
    public List<Pago> porPedido(Long pedidoId) {
        return pagos.findByPedidoIdOrderByFechaDesc(pedidoId);
    }

    /** Cambia el estado (ej: el admin anula un pago). */
    @Transactional
    public Pago cambiarEstado(Long id, EstadoRequest req) {
        Pago pago = obtener(id);
        pago.setEstado(req.estado());
        pago.setMotivo(req.motivo());
        return pagos.save(pago);
    }

    @Transactional
    public void eliminar(Long id) {
        pagos.delete(obtener(id));
    }
}
