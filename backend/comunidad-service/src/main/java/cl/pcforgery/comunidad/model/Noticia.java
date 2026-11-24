package cl.pcforgery.comunidad.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Noticia publicada por el administrador. */
@Entity
@Table(name = "noticias")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Noticia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(nullable = false, length = 300)
    private String resumen;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String texto;

    /** Ruta pública o data URL de la imagen. */
    @Column(columnDefinition = "TEXT")
    private String imagen;

    @Column(nullable = false)
    private LocalDate fecha;
}
