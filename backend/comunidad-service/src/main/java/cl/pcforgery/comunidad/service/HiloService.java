package cl.pcforgery.comunidad.service;

import cl.pcforgery.comunidad.dto.HiloRequest;
import cl.pcforgery.comunidad.dto.RespuestaRequest;
import cl.pcforgery.comunidad.exception.NegocioException;
import cl.pcforgery.comunidad.exception.RecursoNoEncontradoException;
import cl.pcforgery.comunidad.model.Hilo;
import cl.pcforgery.comunidad.model.Respuesta;
import cl.pcforgery.comunidad.repository.HiloRepository;
import cl.pcforgery.comunidad.security.UsuarioContexto;
import java.time.Instant;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Foro: hilos y respuestas. Editar/borrar solo el autor o un ADMIN. */
@Service
public class HiloService {

    private final HiloRepository hilos;

    public HiloService(HiloRepository hilos) {
        this.hilos = hilos;
    }

    @Transactional(readOnly = true)
    public List<Hilo> listar(String categoria) {
        return categoria == null || categoria.isBlank()
                ? hilos.findAllByOrderByUltimaActividadDesc()
                : hilos.findByCategoriaOrderByUltimaActividadDesc(categoria);
    }

    @Transactional(readOnly = true)
    public Hilo obtener(String id) {
        return buscar(id);
    }

    @Transactional
    public Hilo crear(UsuarioContexto usuario, HiloRequest req) {
        Instant ahora = Instant.now();
        String id = "hilo-" + ahora.toEpochMilli();
        int n = 1;
        while (hilos.existsById(id)) {
            id = "hilo-" + ahora.toEpochMilli() + "-" + n++;
        }
        Hilo hilo = Hilo.builder()
                .id(id)
                .titulo(req.titulo().trim())
                .categoria(req.categoria())
                .mensaje(req.mensaje().trim())
                .autor(nombreVisible(usuario))
                .correoAutor(usuario.email())
                .fecha(ahora)
                .ultimaActividad(ahora)
                .build();
        return hilos.save(hilo);
    }

    @Transactional
    public Hilo actualizar(UsuarioContexto usuario, String id, HiloRequest req) {
        Hilo hilo = buscar(id);
        exigirAutorOAdmin(usuario, hilo.getCorreoAutor());
        hilo.setTitulo(req.titulo().trim());
        hilo.setCategoria(req.categoria());
        hilo.setMensaje(req.mensaje().trim());
        return hilos.save(hilo);
    }

    @Transactional
    public void eliminar(UsuarioContexto usuario, String id) {
        Hilo hilo = buscar(id);
        exigirAutorOAdmin(usuario, hilo.getCorreoAutor());
        hilos.delete(hilo);
    }

    @Transactional
    public Hilo responder(UsuarioContexto usuario, String id, RespuestaRequest req) {
        Hilo hilo = buscar(id);
        Instant ahora = Instant.now();
        Respuesta respuesta = Respuesta.builder()
                .id(id + "-r" + ahora.toEpochMilli() + "-" + (hilo.getRespuestas().size() + 1))
                .hilo(hilo)
                .autor(nombreVisible(usuario))
                .correoAutor(usuario.email())
                .texto(req.texto().trim())
                .fecha(ahora)
                .build();
        hilo.getRespuestas().add(respuesta);
        hilo.setUltimaActividad(ahora);
        return hilos.save(hilo);
    }

    @Transactional
    public Hilo eliminarRespuesta(UsuarioContexto usuario, String id, String respuestaId) {
        Hilo hilo = buscar(id);
        Respuesta respuesta = hilo.getRespuestas().stream().filter(r -> r.getId().equals(respuestaId)).findFirst()
                .orElseThrow(() -> new RecursoNoEncontradoException("Respuesta no encontrada."));
        exigirAutorOAdmin(usuario, respuesta.getCorreoAutor());
        hilo.getRespuestas().remove(respuesta);
        return hilos.save(hilo);
    }

    private static String nombreVisible(UsuarioContexto usuario) {
        return usuario.usuario() == null || usuario.usuario().isBlank() ? usuario.email() : usuario.usuario();
    }

    private static void exigirAutorOAdmin(UsuarioContexto usuario, String correoAutor) {
        if (!usuario.esAdmin() && (correoAutor == null || !correoAutor.equalsIgnoreCase(usuario.email()))) {
            throw new NegocioException(HttpStatus.FORBIDDEN, "Solo el autor o un administrador puede hacer esto.");
        }
    }

    private Hilo buscar(String id) {
        return hilos.findById(id).orElseThrow(() -> new RecursoNoEncontradoException("El hilo no existe."));
    }
}
