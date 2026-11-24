package cl.pcforgery.auth.config;

import cl.pcforgery.auth.model.Rol;
import cl.pcforgery.auth.model.Usuario;
import cl.pcforgery.auth.repository.UsuarioRepository;
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

/**
 * Carga los usuarios base (los mismos de src/data/usuariosData.js del frontend) si la tabla está vacía.
 * El archivo seed/usuarios.json trae las contraseñas ya cifradas con BCrypt.
 */
@Component
public class DatosIniciales implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatosIniciales.class);

    private final UsuarioRepository usuarios;
    private final ObjectMapper mapper;

    public DatosIniciales(UsuarioRepository usuarios, ObjectMapper mapper) {
        this.usuarios = usuarios;
        this.mapper = mapper;
    }

    @Override
    public void run(String... args) throws Exception {
        if (usuarios.count() > 0) {
            return;
        }
        try (InputStream in = new ClassPathResource("seed/usuarios.json").getInputStream()) {
            List<Map<String, String>> base = mapper.readValue(in, new TypeReference<>() { });
            base.forEach(u -> usuarios.save(Usuario.builder()
                    .nombre(u.get("nombre"))
                    .usuario(u.get("usuario"))
                    .email(u.get("email"))
                    .passwordHash(u.get("passwordHash"))
                    .rol(Rol.valueOf(u.get("rol")))
                    .activo(true)
                    .build()));
            log.info("Usuarios base cargados: {}", base.size());
        }
    }
}
