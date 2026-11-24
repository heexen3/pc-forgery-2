package cl.pcforgery.auth.service;

import cl.pcforgery.auth.dto.LoginRequest;
import cl.pcforgery.auth.dto.PerfilRequest;
import cl.pcforgery.auth.dto.RegistroRequest;
import cl.pcforgery.auth.dto.TokenResponse;
import cl.pcforgery.auth.dto.UsuarioResponse;
import cl.pcforgery.auth.exception.NegocioException;
import cl.pcforgery.auth.exception.RecursoNoEncontradoException;
import cl.pcforgery.auth.model.RefreshToken;
import cl.pcforgery.auth.model.Rol;
import cl.pcforgery.auth.model.Usuario;
import cl.pcforgery.auth.repository.RefreshTokenRepository;
import cl.pcforgery.auth.repository.UsuarioRepository;
import java.time.Duration;
import java.time.Instant;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Registro, login, renovación (refresh) y cierre de sesión. */
@Service
public class AuthService {

    private static final String CREDENCIALES_INVALIDAS =
            "Usuario o contraseña incorrectos, por favor, inténtelo de nuevo.";

    private final UsuarioRepository usuarios;
    private final RefreshTokenRepository refreshTokens;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final Duration duracionRefresh;

    public AuthService(UsuarioRepository usuarios, RefreshTokenRepository refreshTokens,
                       PasswordEncoder passwordEncoder, JwtService jwtService,
                       @Value("${app.jwt.refresh-dias:7}") long diasRefresh) {
        this.usuarios = usuarios;
        this.refreshTokens = refreshTokens;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.duracionRefresh = Duration.ofDays(diasRefresh);
    }

    @Transactional
    public UsuarioResponse registrar(RegistroRequest req) {
        if (usuarios.existsByUsuarioIgnoreCase(req.usuario().trim())) {
            throw new NegocioException(HttpStatus.CONFLICT, "El nombre de usuario ya está registrado.");
        }
        if (usuarios.existsByEmailIgnoreCase(req.email().trim())) {
            throw new NegocioException(HttpStatus.CONFLICT, "Ya existe un usuario registrado con ese correo.");
        }
        String nombre = req.nombre() == null || req.nombre().isBlank() ? req.usuario().trim() : req.nombre().trim();
        Usuario nuevo = Usuario.builder()
                .nombre(nombre)
                .usuario(req.usuario().trim())
                .email(req.email().trim().toLowerCase())
                .passwordHash(passwordEncoder.encode(req.password()))
                .rol(Rol.CLIENTE)
                .activo(true)
                .build();
        return UsuarioResponse.de(usuarios.save(nuevo));
    }

    @Transactional
    public TokenResponse login(LoginRequest req) {
        String identificador = req.identificador().trim();
        Usuario usuario = usuarios.findByEmailIgnoreCase(identificador)
                .or(() -> usuarios.findByUsuarioIgnoreCase(identificador))
                .orElseThrow(() -> new NegocioException(HttpStatus.UNAUTHORIZED, CREDENCIALES_INVALIDAS));

        if (!passwordEncoder.matches(req.password(), usuario.getPasswordHash())) {
            throw new NegocioException(HttpStatus.UNAUTHORIZED, CREDENCIALES_INVALIDAS);
        }
        if (!usuario.isActivo()) {
            throw new NegocioException(HttpStatus.FORBIDDEN, "La cuenta está desactivada. Contacta al administrador.");
        }
        return emitirTokens(usuario);
    }

    /** Renueva la sesión: valida el refresh token, lo revoca y entrega un par nuevo (rotación). */
    @Transactional
    public TokenResponse refrescar(String token) {
        RefreshToken actual = refreshTokens.findByToken(token)
                .orElseThrow(() -> new NegocioException(HttpStatus.UNAUTHORIZED, "Sesión inválida. Inicia sesión de nuevo."));
        if (actual.isRevocado() || actual.getExpiraEn().isBefore(Instant.now())) {
            throw new NegocioException(HttpStatus.UNAUTHORIZED, "Tu sesión expiró. Inicia sesión de nuevo.");
        }
        Usuario usuario = actual.getUsuario();
        if (!usuario.isActivo()) {
            throw new NegocioException(HttpStatus.FORBIDDEN, "La cuenta está desactivada. Contacta al administrador.");
        }
        actual.setRevocado(true);
        refreshTokens.save(actual);
        return emitirTokens(usuario);
    }

    @Transactional
    public void logout(String token) {
        refreshTokens.findByToken(token).ifPresent(refresh -> {
            refresh.setRevocado(true);
            refreshTokens.save(refresh);
        });
    }

    @Transactional(readOnly = true)
    public UsuarioResponse perfil(Long id) {
        return UsuarioResponse.de(buscar(id));
    }

    @Transactional
    public UsuarioResponse actualizarPerfil(Long id, PerfilRequest req) {
        Usuario usuario = buscar(id);
        if (req.usuario() != null && !req.usuario().equalsIgnoreCase(usuario.getUsuario())) {
            if (usuarios.existsByUsuarioIgnoreCase(req.usuario())) {
                throw new NegocioException(HttpStatus.CONFLICT, "El nombre de usuario ya está registrado.");
            }
            usuario.setUsuario(req.usuario().trim());
        }
        if (req.nombre() != null && !req.nombre().isBlank()) {
            usuario.setNombre(req.nombre().trim());
        }
        if (req.descripcion() != null) {
            usuario.setDescripcion(req.descripcion().trim());
        }
        if (req.foto() != null) {
            usuario.setFoto(req.foto());
        }
        return UsuarioResponse.de(usuarios.save(usuario));
    }

    private Usuario buscar(Long id) {
        return usuarios.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado."));
    }

    private TokenResponse emitirTokens(Usuario usuario) {
        RefreshToken refresh = refreshTokens.save(RefreshToken.builder()
                .token(UUID.randomUUID() + "-" + UUID.randomUUID().toString().substring(0, 8))
                .usuario(usuario)
                .expiraEn(Instant.now().plus(duracionRefresh))
                .revocado(false)
                .build());
        return new TokenResponse(jwtService.generarAccessToken(usuario), refresh.getToken(), "Bearer",
                jwtService.segundosAccess(), UsuarioResponse.de(usuario));
    }
}
