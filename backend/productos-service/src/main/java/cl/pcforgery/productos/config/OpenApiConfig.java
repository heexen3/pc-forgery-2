package cl.pcforgery.productos.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Documentación Swagger/OpenAPI. El primer servidor es el API Gateway (donde se valida el JWT),
 * el segundo es el servicio directo (solo para desarrollo).
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI openApi(@Value("${app.gateway-url:http://localhost:8080}") String gatewayUrl,
                           @Value("${server.port:8082}") int puerto) {
        return new OpenAPI()
                .info(new Info()
                        .title("PC Forgery - productos-service")
                        .version("1.0.0")
                        .description("Catálogo de productos, categorías y componentes del asistente Arma tu PC."))
                .servers(List.of(
                        new Server().url(gatewayUrl + "/api").description("A través del API Gateway (recomendado)"),
                        new Server().url("http://localhost:" + puerto).description("Servicio directo (sin gateway)")))
                .components(new Components().addSecuritySchemes("bearerAuth",
                        new SecurityScheme().type(SecurityScheme.Type.HTTP).scheme("bearer").bearerFormat("JWT")))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"));
    }
}
