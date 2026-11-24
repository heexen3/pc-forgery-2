package cl.pcforgery.pedidos.service;

import cl.pcforgery.pedidos.dto.ArmadoRequest;
import cl.pcforgery.pedidos.dto.ArmadoResponse;
import cl.pcforgery.pedidos.exception.NegocioException;
import cl.pcforgery.pedidos.exception.RecursoNoEncontradoException;
import cl.pcforgery.pedidos.model.ArmadoGuardado;
import cl.pcforgery.pedidos.repository.ArmadoGuardadoRepository;
import cl.pcforgery.pedidos.security.UsuarioContexto;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Configuraciones de "Arma tu PC" guardadas por cada usuario. */
@Service
public class ArmadoService {

    private final ArmadoGuardadoRepository armados;
    private final ObjectMapper mapper;

    public ArmadoService(ArmadoGuardadoRepository armados, ObjectMapper mapper) {
        this.armados = armados;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<ArmadoResponse> listar(UsuarioContexto usuario) {
        return armados.findByCorreoIgnoreCaseOrderByFechaAsc(usuario.email()).stream().map(this::aRespuesta).toList();
    }

    @Transactional(readOnly = true)
    public ArmadoResponse obtener(UsuarioContexto usuario, Long id) {
        return aRespuesta(buscarPropio(usuario, id));
    }

    /** Guarda un armado; si ya existe uno con el mismo nombre lo reemplaza (igual que el frontend). */
    @Transactional
    public ArmadoResponse guardar(UsuarioContexto usuario, ArmadoRequest req) {
        Map<String, String> componentes = req.componentes() == null ? Map.of() : req.componentes();
        if (componentes.values().stream().allMatch(id -> id == null || id.isBlank())) {
            throw new NegocioException(HttpStatus.BAD_REQUEST, "Elige al menos un componente antes de guardar.");
        }
        String nombre = req.nombre().trim();
        armados.findByCorreoIgnoreCaseOrderByFechaAsc(usuario.email()).stream()
                .filter(a -> a.getNombre().equalsIgnoreCase(nombre))
                .forEach(armados::delete);
        ArmadoGuardado nuevo = ArmadoGuardado.builder()
                .correo(usuario.email())
                .nombre(nombre)
                .plataforma(req.plataforma())
                .componentesJson(json(componentes))
                .total(req.total())
                .fecha(LocalDateTime.now())
                .build();
        return aRespuesta(armados.save(nuevo));
    }

    @Transactional
    public ArmadoResponse actualizar(UsuarioContexto usuario, Long id, ArmadoRequest req) {
        ArmadoGuardado armado = buscarPropio(usuario, id);
        armado.setNombre(req.nombre().trim());
        if (req.plataforma() != null) {
            armado.setPlataforma(req.plataforma());
        }
        if (req.componentes() != null) {
            armado.setComponentesJson(json(req.componentes()));
        }
        if (req.total() != null) {
            armado.setTotal(req.total());
        }
        return aRespuesta(armados.save(armado));
    }

    @Transactional
    public void eliminar(UsuarioContexto usuario, Long id) {
        armados.delete(buscarPropio(usuario, id));
    }

    private ArmadoGuardado buscarPropio(UsuarioContexto usuario, Long id) {
        ArmadoGuardado armado = armados.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Armado no encontrado."));
        if (!armado.getCorreo().equalsIgnoreCase(usuario.email())) {
            throw new NegocioException(HttpStatus.FORBIDDEN, "Este armado pertenece a otro usuario.");
        }
        return armado;
    }

    private ArmadoResponse aRespuesta(ArmadoGuardado a) {
        Map<String, String> componentes;
        try {
            componentes = mapper.readValue(a.getComponentesJson(), new TypeReference<LinkedHashMap<String, String>>() { });
        } catch (Exception e) {
            componentes = new LinkedHashMap<>();
        }
        String fecha = a.getFecha().atZone(ZoneId.systemDefault()).withZoneSameInstant(ZoneOffset.UTC)
                .format(DateTimeFormatter.ISO_INSTANT);
        return new ArmadoResponse(String.valueOf(a.getId()), a.getNombre(), a.getPlataforma(), componentes,
                a.getTotal(), fecha);
    }

    private String json(Object valor) {
        try {
            return mapper.writeValueAsString(valor);
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }
}
