package cl.pcforgery.productos.repository;

import cl.pcforgery.productos.model.Categoria;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    Optional<Categoria> findByValorIgnoreCase(String valor);

    boolean existsByValorIgnoreCase(String valor);
}
