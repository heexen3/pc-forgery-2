package cl.pcforgery.productos.dto;

import cl.pcforgery.productos.model.Producto;
import java.util.LinkedHashMap;
import java.util.Map;

public record ProductoResponse(Long id, String nombre, String categoria, String marca, Integer precio,
                               String descripcion, String imagen, boolean nuevo,
                               Map<String, String> especificaciones) {

    public static ProductoResponse de(Producto p) {
        return new ProductoResponse(p.getId(), p.getNombre(), p.getCategoria(), p.getMarca(), p.getPrecio(),
                p.getDescripcion(), p.getImagen(), p.isNuevo(), new LinkedHashMap<>(p.getEspecificaciones()));
    }
}
