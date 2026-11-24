package cl.pcforgery.inventario.repository;

import cl.pcforgery.inventario.model.MovimientoStock;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovimientoStockRepository extends JpaRepository<MovimientoStock, Long> {

    List<MovimientoStock> findByProductoIdOrderByFechaDesc(Long productoId);
}
