package cl.pcforgery.pagos.repository;

import cl.pcforgery.pagos.model.Pago;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PagoRepository extends JpaRepository<Pago, Long> {

    List<Pago> findByPedidoIdOrderByFechaDesc(Long pedidoId);

    List<Pago> findByCorreoIgnoreCaseOrderByFechaDesc(String correo);

    List<Pago> findAllByOrderByFechaDesc();
}
