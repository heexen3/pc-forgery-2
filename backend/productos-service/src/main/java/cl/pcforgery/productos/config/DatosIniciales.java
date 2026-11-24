package cl.pcforgery.productos.config;

import cl.pcforgery.productos.dto.ComponenteDto;
import cl.pcforgery.productos.model.Categoria;
import cl.pcforgery.productos.model.Producto;
import cl.pcforgery.productos.repository.CategoriaRepository;
import cl.pcforgery.productos.repository.ComponenteRepository;
import cl.pcforgery.productos.repository.ProductoRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.io.InputStream;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

/**
 * Carga el catálogo base (productosBase, CATEGORIAS y DB_COMPONENTES del frontend)
 * solo si las tablas están vacías. Los productos se insertan en orden, así conservan los ids 1..N.
 */
@Component
public class DatosIniciales implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatosIniciales.class);

    private final CategoriaRepository categorias;
    private final ProductoRepository productos;
    private final ComponenteRepository componentes;
    private final ObjectMapper mapper;

    public DatosIniciales(CategoriaRepository categorias, ProductoRepository productos,
                          ComponenteRepository componentes, ObjectMapper mapper) {
        this.categorias = categorias;
        this.productos = productos;
        this.componentes = componentes;
        this.mapper = mapper;
    }

    @Override
    public void run(String... args) throws IOException {
        if (categorias.count() == 0) {
            List<Categoria> base = leer("seed/categorias.json", new TypeReference<>() { });
            categorias.saveAll(base);
            log.info("Categorías base cargadas: {}", base.size());
        }
        if (productos.count() == 0) {
            List<Map<String, Object>> base = leer("seed/productos.json", new TypeReference<>() { });
            for (Map<String, Object> p : base) {
                @SuppressWarnings("unchecked")
                Map<String, String> specs = (Map<String, String>) p.getOrDefault("especificaciones", Map.of());
                productos.save(Producto.builder()
                        .nombre((String) p.get("nombre"))
                        .categoria((String) p.get("categoria"))
                        .marca((String) p.get("marca"))
                        .precio(((Number) p.get("precio")).intValue())
                        .descripcion((String) p.get("descripcion"))
                        .imagen((String) p.get("imagen"))
                        .nuevo(Boolean.TRUE.equals(p.get("nuevo")))
                        .especificaciones(new LinkedHashMap<>(specs))
                        .build());
            }
            log.info("Productos base cargados: {}", base.size());
        }
        if (componentes.count() == 0) {
            List<ComponenteDto> base = leer("seed/componentes.json", new TypeReference<>() { });
            componentes.saveAll(base.stream().map(ComponenteDto::aEntidad).toList());
            log.info("Componentes base cargados: {}", base.size());
        }
    }

    private <T> T leer(String ruta, TypeReference<T> tipo) throws IOException {
        try (InputStream in = new ClassPathResource(ruta).getInputStream()) {
            return mapper.readValue(in, tipo);
        }
    }
}
