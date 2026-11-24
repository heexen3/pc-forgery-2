package cl.pcforgery.pedidos.security;

import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

/**
 * Permite recibir el usuario autenticado como parámetro de un controller:
 * {@code public X metodo(UsuarioContexto usuario)}. Lo arma desde las cabeceras X-Usuario-* del gateway.
 */
public class UsuarioContextoResolver implements HandlerMethodArgumentResolver {

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return UsuarioContexto.class.equals(parameter.getParameterType());
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
                                  NativeWebRequest request, WebDataBinderFactory binderFactory) {
        return UsuarioContexto.de(request.getHeader(UsuarioContexto.H_ID), request.getHeader(UsuarioContexto.H_EMAIL),
                request.getHeader(UsuarioContexto.H_USUARIO), request.getHeader(UsuarioContexto.H_ROL));
    }
}
