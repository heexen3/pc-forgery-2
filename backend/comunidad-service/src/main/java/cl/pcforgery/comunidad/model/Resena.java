package cl.pcforgery.comunidad.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Reseña de un producto. Cada usuario tiene como máximo una reseña por producto. */
@Entity
@Table(name = "resenas", uniqueConstraints = @UniqueConstraint(columnNames = {"producto_id", "correo"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resena {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "producto_id", nullable = false)
    private Long productoId;

    @Column(nullable = false, length = 60)
    private String autor;

    @Column(nullable = false, length = 120)
    private String correo;

    /** 1 a 5. */
    @Column(nullable = false)
    private Integer estrellas;

    @Column(nullable = false, length = 1000)
    private String comentario;

    @Column(nullable = false)
    private Instant fecha;
}
