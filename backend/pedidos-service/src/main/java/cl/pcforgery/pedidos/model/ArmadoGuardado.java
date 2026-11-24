package cl.pcforgery.pedidos.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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

/** Configuración de PC guardada por un usuario en "Arma tu PC". Solo guarda los ids de las piezas. */
@Entity
@Table(name = "armados_guardados")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArmadoGuardado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String correo;

    @Column(nullable = false, length = 60)
    private String nombre;

    @Column(length = 20)
    private String plataforma;

    /** { "procesadores": "cpu-amd-7600x", "placas": null, ... } en JSON. */
    @Column(name = "componentes_json", nullable = false, columnDefinition = "TEXT")
    private String componentesJson;

    private Integer total;

    @Column(nullable = false)
    private LocalDateTime fecha;
}
