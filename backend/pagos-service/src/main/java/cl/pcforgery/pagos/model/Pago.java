package cl.pcforgery.pagos.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Pago simulado de un pedido (no se cobra nada real). */
@Entity
@Table(name = "pagos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "pedido_id", nullable = false)
    private Long pedidoId;

    @Column(nullable = false)
    private Integer monto;

    /** Débito, Crédito o Transferencia (los mismos de METODOS_PAGO del frontend). */
    @Column(name = "metodo_pago", nullable = false, length = 20)
    private String metodoPago;

    @Column(length = 20)
    private String rut;

    @Column(length = 120)
    private String correo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private EstadoPago estado;

    /** Motivo del rechazo (vacío si se aprobó). */
    private String motivo;

    @Column(name = "codigo_transaccion", nullable = false, unique = true, length = 40)
    private String codigoTransaccion;

    @Column(nullable = false)
    private LocalDateTime fecha;
}
