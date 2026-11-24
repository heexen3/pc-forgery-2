package cl.pcforgery.productos.model;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapKeyColumn;
import jakarta.persistence.Table;
import java.util.LinkedHashMap;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Producto del catálogo. El stock NO vive aquí: lo administra inventario-service. */
@Entity
@Table(name = "productos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String nombre;

    /** Valor de la categoría (ver tabla categorias). */
    @Column(nullable = false, length = 60)
    private String categoria;

    @Column(length = 60)
    private String marca;

    /** Precio en CLP con IVA incluido. */
    @Column(nullable = false)
    private Integer precio;

    @Column(length = 1000)
    private String descripcion;

    private String imagen;

    @Builder.Default
    private boolean nuevo = false;

    @Builder.Default
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "producto_especificaciones", joinColumns = @JoinColumn(name = "producto_id"))
    @MapKeyColumn(name = "nombre")
    @Column(name = "valor", length = 200)
    private Map<String, String> especificaciones = new LinkedHashMap<>();
}
