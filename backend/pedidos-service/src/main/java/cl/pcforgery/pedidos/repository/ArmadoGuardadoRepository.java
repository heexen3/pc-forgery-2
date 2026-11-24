package cl.pcforgery.pedidos.repository;

import cl.pcforgery.pedidos.model.ArmadoGuardado;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArmadoGuardadoRepository extends JpaRepository<ArmadoGuardado, Long> {

    List<ArmadoGuardado> findByCorreoIgnoreCaseOrderByFechaAsc(String correo);
}
