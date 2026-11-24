package cl.pcforgery.auth.repository;

import cl.pcforgery.auth.model.Usuario;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmailIgnoreCase(String email);

    Optional<Usuario> findByUsuarioIgnoreCase(String usuario);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByUsuarioIgnoreCase(String usuario);
}
