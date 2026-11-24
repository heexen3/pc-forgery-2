package cl.pcforgery.pedidos.dto;

import java.util.Map;

/** Mismo formato que armadosGuardados del frontend (id como texto). */
public record ArmadoResponse(String id, String nombre, String plataforma, Map<String, String> componentes,
                             Integer total, String fecha) {
}
