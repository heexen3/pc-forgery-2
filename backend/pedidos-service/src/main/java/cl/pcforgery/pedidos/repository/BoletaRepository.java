package cl.pcforgery.pedidos.repository;

import cl.pcforgery.pedidos.model.Boleta;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface BoletaRepository extends JpaRepository<Boleta, Long> {

    Optional<Boleta> findByNumero(Integer numero);

    Optional<Boleta> findByPedidoId(Long pedidoId);

    List<Boleta> findAllByOrderByNumeroAsc();

    List<Boleta> findByPedidoCorreoIgnoreCaseOrderByNumeroAsc(String correo);

    @Query("select coalesce(max(b.numero), 0) from Boleta b")
    Integer maximoNumero();
}
