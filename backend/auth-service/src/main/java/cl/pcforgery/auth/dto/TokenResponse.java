package cl.pcforgery.auth.dto;

/**
 * Respuesta de login y refresh.
 * expiraEn: segundos de vida del access token.
 */
public record TokenResponse(String accessToken, String refreshToken, String tipo, long expiraEn,
                            UsuarioResponse usuario) {
}
