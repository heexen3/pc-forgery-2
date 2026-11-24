package cl.pcforgery.auth.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import cl.pcforgery.auth.dto.LoginRequest;
import cl.pcforgery.auth.dto.TokenResponse;
import cl.pcforgery.auth.model.RefreshToken;
import cl.pcforgery.auth.model.Rol;
import cl.pcforgery.auth.model.Usuario;
import cl.pcforgery.auth.repository.RefreshTokenRepository;
import cl.pcforgery.auth.repository.UsuarioRepository;
import io.jsonwebtoken.Claims;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/** Pruebas unitarias de AuthService con repositorios simulados (Mockito). */
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UsuarioRepository usuarios;

    @Mock
    private RefreshTokenRepository refreshTokens;

    private final PasswordEncoder encoder = new BCryptPasswordEncoder(4);
    private final JwtService jwtService = new JwtService("clave-de-prueba-para-tests-unitarios-0123456789", 15);
    private AuthService authService;
    private Usuario cliente;

    @BeforeEach
    void preparar() {
        authService = new AuthService(usuarios, refreshTokens, encoder, jwtService, 7);
        cliente = Usuario.builder().id(5L).nombre("Juanito").usuario("Juanito").email("juan@gmail.com")
                .passwordHash(encoder.encode("Juan.123")).rol(Rol.CLIENTE).activo(true).build();
        when(refreshTokens.save(any(RefreshToken.class))).thenAnswer(inv -> inv.getArgument(0));
    }

    @Test
    void loginCorrectoEntregaAccessTokenConRolYRefreshToken() {
        when(usuarios.findByEmailIgnoreCase("juan@gmail.com")).thenReturn(Optional.of(cliente));

        TokenResponse respuesta = authService.login(new LoginRequest("juan@gmail.com", "Juan.123"));

        Claims claims = jwtService.verificar(respuesta.accessToken());
        assertThat(claims.getSubject()).isEqualTo("juan@gmail.com");
        assertThat(claims.get("rol", String.class)).isEqualTo("CLIENTE");
        assertThat(respuesta.refreshToken()).isNotBlank();
        assertThat(respuesta.usuario().usuario()).isEqualTo("Juanito");
    }

    @Test
    void refreshRotaElTokenRevocandoElAnteriorYEntregaUnoNuevo() {
        RefreshToken anterior = RefreshToken.builder().token("token-anterior").usuario(cliente)
                .expiraEn(Instant.now().plus(1, ChronoUnit.DAYS)).revocado(false).build();
        when(refreshTokens.findByToken("token-anterior")).thenReturn(Optional.of(anterior));

        TokenResponse respuesta = authService.refrescar("token-anterior");

        assertThat(anterior.isRevocado()).isTrue();
        assertThat(respuesta.refreshToken()).isNotEqualTo("token-anterior");
        assertThat(jwtService.verificar(respuesta.accessToken()).getSubject()).isEqualTo("juan@gmail.com");
        verify(refreshTokens).save(anterior);
    }
}
