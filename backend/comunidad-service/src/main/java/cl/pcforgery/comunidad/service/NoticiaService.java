package cl.pcforgery.comunidad.service;

import cl.pcforgery.comunidad.dto.NoticiaRequest;
import cl.pcforgery.comunidad.exception.RecursoNoEncontradoException;
import cl.pcforgery.comunidad.model.Noticia;
import cl.pcforgery.comunidad.repository.NoticiaRepository;
import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Noticias de la tienda. Crear/editar/borrar solo ADMIN (lo exige el gateway). */
@Service
public class NoticiaService {

    private final NoticiaRepository noticias;

    public NoticiaService(NoticiaRepository noticias) {
        this.noticias = noticias;
    }

    @Transactional(readOnly = true)
    public List<Noticia> listar() {
        return noticias.findAllByOrderByFechaDescIdDesc();
    }

    @Transactional(readOnly = true)
    public Noticia obtener(Long id) {
        return buscar(id);
    }

    @Transactional
    public Noticia crear(NoticiaRequest req) {
        Noticia noticia = new Noticia();
        copiar(req, noticia);
        return noticias.save(noticia);
    }

    @Transactional
    public Noticia actualizar(Long id, NoticiaRequest req) {
        Noticia noticia = buscar(id);
        copiar(req, noticia);
        return noticias.save(noticia);
    }

    @Transactional
    public void eliminar(Long id) {
        noticias.delete(buscar(id));
    }

    private static void copiar(NoticiaRequest req, Noticia destino) {
        destino.setTitulo(req.titulo().trim());
        destino.setResumen(req.resumen().trim());
        destino.setTexto(req.texto().trim());
        destino.setImagen(req.imagen());
        destino.setFecha(req.fecha() == null ? (destino.getFecha() == null ? LocalDate.now() : destino.getFecha()) : req.fecha());
    }

    private Noticia buscar(Long id) {
        return noticias.findById(id).orElseThrow(() -> new RecursoNoEncontradoException("Noticia no encontrada."));
    }
}
