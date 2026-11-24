package cl.pcforgery.pedidos.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Línea de un pedido: un producto de la tienda o un PC armado. */
@Entity
@Table(name = "detalle_pedido")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DetallePedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "pedido_id")
    private Pedido pedido;

    /** Id del ítem en el carrito del frontend (ej: "producto-3" o "armado-cpu..."). */
    @Column(name = "item_id", length = 300)
    private String itemId;

    /** "producto" o "armado". */
    @Column(nullable = false, length = 10)
    private String tipo;

    @Column(name = "producto_id")
    private Long productoId;

    /** Código en la boleta: PF-00001 o PF-ARM. */
    @Column(nullable = false, length = 20)
    private String codigo;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(nullable = false)
    private Integer precio;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(name = "total_linea", nullable = false)
    private Integer totalLinea;

    /** Piezas del PC armado en JSON (null para productos). */
    @Column(name = "componentes_json", columnDefinition = "TEXT")
    private String componentesJson;
}
