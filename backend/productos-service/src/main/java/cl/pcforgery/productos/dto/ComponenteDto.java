package cl.pcforgery.productos.dto;

import cl.pcforgery.productos.model.Componente;
import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.util.LinkedHashMap;
import java.util.Map;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Componente con el mismo formato plano que usa el frontend:
 * {id, tipo, nombre, precio, consumoWatts, img, socket, plataforma, ...}.
 */
@Getter
@Setter
@NoArgsConstructor
public class ComponenteDto {

    @NotBlank(message = "El id es obligatorio.")
    private String id;

    @NotBlank(message = "El tipo es obligatorio.")
    @Pattern(regexp = "procesadores|placas|ram|gpu|almacenamiento|fuentes|gabinetes",
            message = "Tipo inválido (procesadores, placas, ram, gpu, almacenamiento, fuentes o gabinetes).")
    private String tipo;

    @NotBlank(message = "El nombre es obligatorio.")
    private String nombre;

    @NotNull(message = "El precio es obligatorio.")
    @Min(value = 1, message = "El precio debe ser mayor a 0.")
    private Integer precio;

    private Integer consumoWatts;

    private String img;

    private Map<String, Object> atributos = new LinkedHashMap<>();

    @JsonAnyGetter
    public Map<String, Object> getAtributos() {
        return atributos;
    }

    @JsonAnySetter
    public void agregarAtributo(String nombre, Object valor) {
        atributos.put(nombre, valor);
    }

    public static ComponenteDto de(Componente c) {
        ComponenteDto dto = new ComponenteDto();
        dto.setId(c.getId());
        dto.setTipo(c.getTipo());
        dto.setNombre(c.getNombre());
        dto.setPrecio(c.getPrecio());
        dto.setConsumoWatts(c.getConsumoWatts());
        dto.setImg(c.getImg());
        dto.atributos = new LinkedHashMap<>(c.getAtributos());
        return dto;
    }

    public Componente aEntidad() {
        return Componente.builder()
                .id(id)
                .tipo(tipo)
                .nombre(nombre)
                .precio(precio)
                .consumoWatts(consumoWatts)
                .img(img)
                .atributos(new LinkedHashMap<>(atributos))
                .build();
    }
}
