package cl.pcforgery.comunidad.config;

import cl.pcforgery.comunidad.model.Hilo;
import cl.pcforgery.comunidad.model.Noticia;
import cl.pcforgery.comunidad.model.Respuesta;
import cl.pcforgery.comunidad.repository.HiloRepository;
import cl.pcforgery.comunidad.repository.NoticiaRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.io.InputStream;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

/** Carga hilosBase y noticiasBase del frontend si las tablas están vacías. */
@Component
public class DatosIniciales implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatosIniciales.class);

    private final HiloRepository hilos;
    private final NoticiaRepository noticias;
    private final ObjectMapper mapper;

    public DatosIniciales(HiloRepository hilos, NoticiaRepository noticias, ObjectMapper mapper) {
        this.hilos = hilos;
        this.noticias = noticias;
        this.mapper = mapper;
    }

    @Override
    @SuppressWarnings("unchecked")
    public void run(String... args) throws IOException {
        if (hilos.count() == 0) {
            List<Map<String, Object>> base = leer("seed/hilos.json");
            for (Map<String, Object> h : base) {
                Hilo hilo = Hilo.builder()
                        .id((String) h.get("id"))
                        .titulo((String) h.get("titulo"))
                        .autor((String) h.get("autor"))
                        .categoria((String) h.get("categoria"))
                        .mensaje((String) h.get("mensaje"))
                        .fecha(Instant.parse((String) h.get("fecha")))
                        .ultimaActividad(Instant.parse((String) h.get("ultimaActividad")))
                        .build();
                for (Map<String, Object> r : (List<Map<String, Object>>) h.get("respuestas")) {
                    hilo.getRespuestas().add(Respuesta.builder()
                            .id((String) r.get("id"))
                            .hilo(hilo)
                            .autor((String) r.get("autor"))
                            .texto((String) r.get("texto"))
                            .fecha(Instant.parse((String) r.get("fecha")))
                            .build());
                }
                hilos.save(hilo);
            }
            log.info("Hilos base cargados: {}", base.size());
        }
        if (noticias.count() == 0) {
            List<Map<String, Object>> base = leer("seed/noticias.json");
            base.forEach(n -> noticias.save(Noticia.builder()
                    .titulo((String) n.get("titulo"))
                    .resumen((String) n.get("resumen"))
                    .texto((String) n.get("texto"))
                    .imagen((String) n.get("imagen"))
                    .fecha(LocalDate.parse((String) n.get("fecha")))
                    .build()));
            log.info("Noticias base cargadas: {}", base.size());
        }
    }

    private List<Map<String, Object>> leer(String ruta) throws IOException {
        try (InputStream in = new ClassPathResource(ruta).getInputStream()) {
            return mapper.readValue(in, new TypeReference<>() { });
        }
    }
}
