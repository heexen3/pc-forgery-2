package cl.pcforgery.comunidad.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Hilo del foro de la comunidad. El id es texto (ej: "semilla-1", "hilo-1732400000000"). */
@Entity
@Table(name = "hilos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hilo {

    @Id
    @Column(length = 60)
    private String id;

    @Column(nullable = false, length = 100)
    private String titulo;

    @Column(nullable = false, length = 60)
    private String autor;

    /** Correo del autor (para permitir editar/borrar solo al dueño). No se expone en la API. */
    @JsonIgnore
    @Column(name = "correo_autor", length = 120)
    private String correoAutor;

    @Column(nullable = false, length = 40)
    private String categoria;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String mensaje;

    @Column(nullable = false)
    private Instant fecha;

    @Column(name = "ultima_actividad", nullable = false)
    private Instant ultimaActividad;

    @Builder.Default
    @OneToMany(mappedBy = "hilo", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @OrderBy("fecha ASC")
    private List<Respuesta> respuestas = new ArrayList<>();
}
