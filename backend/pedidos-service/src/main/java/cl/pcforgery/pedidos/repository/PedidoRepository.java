package cl.pcforgery.pedidos.repository;

import cl.pcforgery.pedidos.model.Pedido;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    List<Pedido> findByCorreoIgnoreCaseOrderByFechaDesc(String correo);

    List<Pedido> findAllByOrderByFechaDesc();
}
