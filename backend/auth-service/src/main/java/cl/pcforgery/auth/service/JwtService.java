package cl.pcforgery.auth.service;

import cl.pcforgery.auth.model.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Genera y verifica los access tokens (JWT firmados con HS256).
 * El API Gateway usa el mismo secreto (JWT_SECRET) para verificarlos.
 */
@Service
public class JwtService {

    public static final String TIPO_ACCESS = "access";

    private final SecretKey clave;
    private final Duration duracionAccess;

    public JwtService(@Value("${app.jwt.secret}") String secreto,
                      @Value("${app.jwt.access-minutos:15}") long minutosAccess) {
        this.clave = Keys.hmacShaKeyFor(secreto.getBytes(StandardCharsets.UTF_8));
        this.duracionAccess = Duration.ofMinutes(minutosAccess);
    }

    public String generarAccessToken(Usuario usuario) {
        Instant ahora = Instant.now();
        return Jwts.builder()
                .subject(usuario.getEmail())
                .claim("uid", usuario.getId())
                .claim("usuario", usuario.getUsuario())
                .claim("rol", usuario.getRol().name())
                .claim("typ", TIPO_ACCESS)
                .issuer("pc-forgery-auth")
                .issuedAt(Date.from(ahora))
                .expiration(Date.from(ahora.plus(duracionAccess)))
                .signWith(clave)
                .compact();
    }

    /** Verifica firma y expiración. Lanza JwtException si el token no es válido. */
    public Claims verificar(String token) {
        return Jwts.parser().verifyWith(clave).build().parseSignedClaims(token).getPayload();
    }

    public long segundosAccess() {
        return duracionAccess.toSeconds();
    }
}
