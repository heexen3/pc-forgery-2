package cl.pcforgery.inventario.repository;

import cl.pcforgery.inventario.model.Inventario;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventarioRepository extends JpaRepository<Inventario, Long> {

    Optional<Inventario> findByProductoId(Long productoId);

    List<Inventario> findAllByOrderByProductoIdAsc();

    boolean existsByProductoId(Long productoId);
}
