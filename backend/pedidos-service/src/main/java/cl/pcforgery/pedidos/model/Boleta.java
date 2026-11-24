package cl.pcforgery.pedidos.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Boleta electrónica (simulada) de un pedido pagado. */
@Entity
@Table(name = "boletas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Boleta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Número correlativo de la boleta (N° 000001...). */
    @Column(nullable = false, unique = true)
    private Integer numero;

    @OneToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "pedido_id", unique = true)
    private Pedido pedido;

    @Column(nullable = false)
    private LocalDateTime fecha;

    @Column(name = "codigo_verificacion", nullable = false, length = 8)
    private String codigoVerificacion;
}
