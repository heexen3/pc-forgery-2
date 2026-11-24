package cl.pcforgery.inventario.config;

import cl.pcforgery.inventario.model.Inventario;
import cl.pcforgery.inventario.repository.InventarioRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.InputStream;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

/** Carga el stock inicial de productosBase del frontend si la tabla está vacía. */
@Component
public class DatosIniciales implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatosIniciales.class);

    private final InventarioRepository inventario;
    private final ObjectMapper mapper;

    public DatosIniciales(InventarioRepository inventario, ObjectMapper mapper) {
        this.inventario = inventario;
        this.mapper = mapper;
    }

    @Override
    public void run(String... args) throws Exception {
        if (inventario.count() > 0) {
            return;
        }
        try (InputStream in = new ClassPathResource("seed/inventario.json").getInputStream()) {
            List<Map<String, Number>> base = mapper.readValue(in, new TypeReference<>() { });
            base.forEach(fila -> inventario.save(Inventario.builder()
                    .productoId(fila.get("productoId").longValue())
                    .stock(fila.get("stock").intValue())
                    .build()));
            log.info("Stock inicial cargado: {} productos", base.size());
        }
    }
}
