package cl.pcforgery.comunidad.repository;

import cl.pcforgery.comunidad.model.Resena;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResenaRepository extends JpaRepository<Resena, Long> {

    List<Resena> findByProductoIdOrderByFechaDesc(Long productoId);

    Optional<Resena> findByProductoIdAndCorreoIgnoreCase(Long productoId, String correo);

    List<Resena> findAllByOrderByFechaDesc();
}
