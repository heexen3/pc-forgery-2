package cl.pcforgery.productos.repository;

import cl.pcforgery.productos.model.Componente;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComponenteRepository extends JpaRepository<Componente, String> {

    List<Componente> findByTipoOrderByPrecioAsc(String tipo);
}
