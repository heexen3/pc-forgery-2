package cl.pcforgery.gateway.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/** Verifica firma, expiración y tipo de los access tokens emitidos por auth-service. */
@Component
public class JwtVerificador {

    private final SecretKey clave;

    public JwtVerificador(@Value("${app.jwt.secret}") String secreto) {
        this.clave = Keys.hmacShaKeyFor(secreto.getBytes(StandardCharsets.UTF_8));
    }

    /** Devuelve los claims o lanza JwtException si el token es inválido, expiró o no es de acceso. */
    public Claims verificar(String token) {
        Claims claims = Jwts.parser().verifyWith(clave).build().parseSignedClaims(token).getPayload();
        if (!"access".equals(claims.get("typ", String.class))) {
            throw new io.jsonwebtoken.MalformedJwtException("No es un access token");
        }
        return claims;
    }
}
