package cl.pcforgery.pedidos.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Map;

public record ArmadoRequest(
        @NotBlank(message = "El nombre del armado debe tener al menos 3 caracteres.")
        @Size(min = 3, max = 60, message = "El nombre del armado debe tener entre 3 y 60 caracteres.") String nombre,
        String plataforma,
        Map<String, String> componentes,
        Integer total) {
}
