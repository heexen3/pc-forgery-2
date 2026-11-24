package cl.pcforgery.pedidos.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Pedido de un cliente. Los precios se toman de productos-service al momento de comprar. */
@Entity
@Table(name = "pedidos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usuario_id")
    private Long usuarioId;

    /** Nombre de usuario (para mostrar en la boleta). */
    @Column(nullable = false, length = 40)
    private String usuario;

    @Column(nullable = false, length = 120)
    private String correo;

    @Column(nullable = false)
    private LocalDateTime fecha;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 12)
    private EstadoPedido estado;

    @Column(name = "metodo_pago", nullable = false, length = 20)
    private String metodoPago;

    @Column(name = "rut_cliente", length = 15)
    private String rutCliente;

    /** Neto sin IVA. */
    @Column(nullable = false)
    private Integer subtotal;

    @Column(nullable = false)
    private Integer iva;

    /** Total con IVA (los precios de la tienda incluyen IVA). */
    @Column(nullable = false)
    private Integer total;

    @Column(name = "codigo_transaccion", length = 40)
    private String codigoTransaccion;

    /** Motivo de rechazo o anulación. */
    private String observacion;

    @Builder.Default
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @OrderBy("id ASC")
    private List<DetallePedido> detalles = new ArrayList<>();

    public void agregarDetalle(DetallePedido detalle) {
        detalle.setPedido(this);
        detalles.add(detalle);
    }
}
