package cl.pcforgery.gateway.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

/**
 * Filtro que corre en cada petición enrutada:
 * 1) borra cabeceras X-Usuario-* que mande el cliente (no se pueden falsificar),
 * 2) valida el JWT del header Authorization,
 * 3) aplica las reglas de rol (ReglasAcceso) y
 * 4) reenvía al microservicio el usuario en X-Usuario-Id / Email / Nombre / Rol.
 */
@Component
public class JwtFiltroGlobal implements GlobalFilter, Ordered {

    private final JwtVerificador verificador;

    public JwtFiltroGlobal(JwtVerificador verificador) {
        this.verificador = verificador;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        NivelAcceso nivel = ReglasAcceso.nivel(request.getMethod(), request.getPath().value());

        String header = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        String token = header != null && header.startsWith("Bearer ") ? header.substring(7).trim() : null;

        Claims claims = null;
        String error = null;
        if (token != null && !token.isEmpty()) {
            try {
                claims = verificador.verificar(token);
            } catch (ExpiredJwtException e) {
                error = "El token expiró. Renueva la sesión con /api/auth/refresh.";
            } catch (JwtException | IllegalArgumentException e) {
                error = "Token inválido.";
            }
        }

        if (nivel != NivelAcceso.PUBLICO) {
            if (claims == null) {
                return responder(exchange, HttpStatus.UNAUTHORIZED, error != null ? error : "Debes iniciar sesión.");
            }
            if (nivel == NivelAcceso.ADMIN && !"ADMIN".equals(claims.get("rol", String.class))) {
                return responder(exchange, HttpStatus.FORBIDDEN, "Acceso restringido: se requiere rol ADMIN.");
            }
        }

        final Claims usuario = claims;
        ServerHttpRequest mutada = request.mutate().headers(h -> {
            h.remove("X-Usuario-Id");
            h.remove("X-Usuario-Email");
            h.remove("X-Usuario-Nombre");
            h.remove("X-Usuario-Rol");
            if (usuario != null) {
                h.set("X-Usuario-Id", String.valueOf(usuario.get("uid")));
                h.set("X-Usuario-Email", usuario.getSubject());
                h.set("X-Usuario-Nombre", usuario.get("usuario", String.class));
                h.set("X-Usuario-Rol", usuario.get("rol", String.class));
            }
        }).build();
        return chain.filter(exchange.mutate().request(mutada).build());
    }

    private Mono<Void> responder(ServerWebExchange exchange, HttpStatus status, String mensaje) {
        var response = exchange.getResponse();
        response.setStatusCode(status);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);
        String json = String.format(
                "{\"timestamp\":\"%s\",\"status\":%d,\"error\":\"%s\",\"mensaje\":\"%s\",\"ruta\":\"%s\"}",
                Instant.now(), status.value(), status.getReasonPhrase(), mensaje.replace("\"", "'"),
                exchange.getRequest().getPath().value());
        DataBuffer buffer = response.bufferFactory().wrap(json.getBytes(StandardCharsets.UTF_8));
        return response.writeWith(Mono.just(buffer));
    }

    @Override
    public int getOrder() {
        return -100;
    }
}
