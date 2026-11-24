package cl.pcforgery.productos.repository;

import cl.pcforgery.productos.model.Producto;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

    List<Producto> findByCategoriaIgnoreCaseOrderByIdAsc(String categoria);

    List<Producto> findAllByOrderByIdAsc();

    boolean existsByCategoriaIgnoreCase(String categoria);
}
