package cl.pcforgery.auth.repository;

import cl.pcforgery.auth.model.RefreshToken;
import cl.pcforgery.auth.model.Usuario;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByToken(String token);

    @Modifying
    @Query("delete from RefreshToken r where r.usuario = :usuario")
    void deleteByUsuario(Usuario usuario);
}
