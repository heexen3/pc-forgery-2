package cl.pcforgery.comunidad.service;

import cl.pcforgery.comunidad.dto.ResenaRequest;
import cl.pcforgery.comunidad.exception.NegocioException;
import cl.pcforgery.comunidad.exception.RecursoNoEncontradoException;
import cl.pcforgery.comunidad.model.Resena;
import cl.pcforgery.comunidad.repository.ResenaRepository;
import cl.pcforgery.comunidad.security.UsuarioContexto;
import java.time.Instant;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Reseñas de productos (una por usuario y producto; si ya opinó, se actualiza). */
@Service
public class ResenaService {

    private final ResenaRepository resenas;

    public ResenaService(ResenaRepository resenas) {
        this.resenas = resenas;
    }

    @Transactional(readOnly = true)
    public List<Resena> listar(Long productoId) {
        return productoId == null ? resenas.findAllByOrderByFechaDesc() : resenas.findByProductoIdOrderByFechaDesc(productoId);
    }

    @Transactional(readOnly = true)
    public Resena obtener(Long id) {
        return buscar(id);
    }

    /** Crea la reseña o, si el usuario ya opinó sobre ese producto, la reemplaza. */
    @Transactional
    public Resena publicar(UsuarioContexto usuario, ResenaRequest req) {
        Resena resena = resenas.findByProductoIdAndCorreoIgnoreCase(req.productoId(), usuario.email())
                .orElseGet(() -> Resena.builder().productoId(req.productoId()).correo(usuario.email()).build());
        resena.setAutor(usuario.usuario() == null ? usuario.email() : usuario.usuario());
        resena.setEstrellas(req.estrellas());
        resena.setComentario(req.comentario().trim());
        resena.setFecha(Instant.now());
        return resenas.save(resena);
    }

    @Transactional
    public Resena actualizar(UsuarioContexto usuario, Long id, ResenaRequest req) {
        Resena resena = buscar(id);
        exigirAutorOAdmin(usuario, resena);
        resena.setEstrellas(req.estrellas());
        resena.setComentario(req.comentario().trim());
        resena.setFecha(Instant.now());
        return resenas.save(resena);
    }

    @Transactional
    public void eliminar(UsuarioContexto usuario, Long id) {
        Resena resena = buscar(id);
        exigirAutorOAdmin(usuario, resena);
        resenas.delete(resena);
    }

    private static void exigirAutorOAdmin(UsuarioContexto usuario, Resena resena) {
        if (!usuario.esAdmin() && !resena.getCorreo().equalsIgnoreCase(usuario.email())) {
            throw new NegocioException(HttpStatus.FORBIDDEN, "Solo el autor o un administrador puede hacer esto.");
        }
    }

    private Resena buscar(Long id) {
        return resenas.findById(id).orElseThrow(() -> new RecursoNoEncontradoException("Reseña no encontrada."));
    }
}
