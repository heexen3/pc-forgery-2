package cl.pcforgery.productos.model;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.LinkedHashMap;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Pieza del asistente "Arma tu PC" (mismos datos que DB_COMPONENTES del frontend).
 * Los atributos propios de cada tipo (socket, tipoRam, potenciaWatts...) van en "atributos" como JSON.
 */
@Entity
@Table(name = "componentes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Componente {

    /** Identificador legible, ej: "cpu-amd-7600x". */
    @Id
    @Column(length = 60)
    private String id;

    /** procesadores, placas, ram, gpu, almacenamiento, fuentes o gabinetes. */
    @Column(nullable = false, length = 30)
    private String tipo;

    @Column(nullable = false, length = 120)
    private String nombre;

    @Column(nullable = false)
    private Integer precio;

    private Integer consumoWatts;

    private String img;

    @Builder.Default
    @Convert(converter = MapaJsonConverter.class)
    @Column(columnDefinition = "TEXT")
    private Map<String, Object> atributos = new LinkedHashMap<>();
}
