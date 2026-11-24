package cl.pcforgery.gateway.security;

import java.util.List;
import org.springframework.http.HttpMethod;
import org.springframework.util.AntPathMatcher;

/**
 * Reglas de acceso por ruta y método HTTP (control de acceso basado en roles).
 * Las rutas son las que recibe el gateway (con el prefijo /api).
 */
public final class ReglasAcceso {

    private static final AntPathMatcher MATCHER = new AntPathMatcher();

    /** Rutas abiertas con cualquier método. */
    private static final List<String> PUBLICAS = List.of(
            "/api/auth/login", "/api/auth/register", "/api/auth/refresh", "/api/auth/logout", "/docs/**");

    /** Catálogo y contenido que cualquiera puede leer (solo GET). */
    private static final List<String> LECTURA_PUBLICA = List.of(
            "/api/productos/**", "/api/categorias/**", "/api/componentes/**", "/api/inventario/**",
            "/api/hilos/**", "/api/resenas/**", "/api/noticias/**");

    /** Recursos que solo el ADMIN puede modificar (POST/PUT/DELETE). */
    private static final List<String> ESCRITURA_ADMIN = List.of(
            "/api/productos/**", "/api/categorias/**", "/api/componentes/**", "/api/inventario/**",
            "/api/noticias/**", "/api/pagos/**");

    /** Rutas solo para ADMIN con cualquier método. */
    private static final List<String> SOLO_ADMIN = List.of("/api/usuarios/**");

    private ReglasAcceso() {
    }

    public static NivelAcceso nivel(HttpMethod metodo, String ruta) {
        if (HttpMethod.OPTIONS.equals(metodo) || coincide(PUBLICAS, ruta)) {
            return NivelAcceso.PUBLICO;
        }
        if (coincide(SOLO_ADMIN, ruta)) {
            return NivelAcceso.ADMIN;
        }
        boolean lectura = HttpMethod.GET.equals(metodo) || HttpMethod.HEAD.equals(metodo);
        if (lectura && coincide(LECTURA_PUBLICA, ruta)) {
            return NivelAcceso.PUBLICO;
        }
        if (!lectura && coincide(ESCRITURA_ADMIN, ruta)) {
            return NivelAcceso.ADMIN;
        }
        // auth/me, pedidos, boletas, armados, pagos (GET), publicar hilos/reseñas...
        return NivelAcceso.AUTENTICADO;
    }

    private static boolean coincide(List<String> patrones, String ruta) {
        return patrones.stream().anyMatch(p -> MATCHER.match(p, ruta));
    }
}
