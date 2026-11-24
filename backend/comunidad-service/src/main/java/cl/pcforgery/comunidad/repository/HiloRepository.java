package cl.pcforgery.comunidad.repository;

import cl.pcforgery.comunidad.model.Hilo;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HiloRepository extends JpaRepository<Hilo, String> {

    List<Hilo> findAllByOrderByUltimaActividadDesc();

    List<Hilo> findByCategoriaOrderByUltimaActividadDesc(String categoria);
}
