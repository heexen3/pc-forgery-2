package cl.pcforgery.comunidad.config;

import cl.pcforgery.comunidad.security.UsuarioContexto;
import cl.pcforgery.comunidad.security.UsuarioContextoResolver;
import java.util.List;
import org.springdoc.core.utils.SpringDocUtils;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    static {
        // UsuarioContexto viene de cabeceras del gateway: no se muestra como parámetro en Swagger
        SpringDocUtils.getConfig().addRequestWrapperToIgnore(UsuarioContexto.class);
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(new UsuarioContextoResolver());
    }
}
