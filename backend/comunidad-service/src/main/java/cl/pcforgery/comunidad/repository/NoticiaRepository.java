package cl.pcforgery.comunidad.repository;

import cl.pcforgery.comunidad.model.Noticia;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoticiaRepository extends JpaRepository<Noticia, Long> {

    List<Noticia> findAllByOrderByFechaDescIdDesc();
}
