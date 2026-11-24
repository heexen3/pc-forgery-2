package cl.pcforgery.gateway.security;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;

class ReglasAccesoTest {

    @Test
    void elCatalogoEsPublicoParaLeerPeroSoloAdminPuedeModificarlo() {
        assertThat(ReglasAcceso.nivel(HttpMethod.GET, "/api/productos/3")).isEqualTo(NivelAcceso.PUBLICO);
        assertThat(ReglasAcceso.nivel(HttpMethod.POST, "/api/productos")).isEqualTo(NivelAcceso.ADMIN);
        assertThat(ReglasAcceso.nivel(HttpMethod.DELETE, "/api/noticias/1")).isEqualTo(NivelAcceso.ADMIN);
    }

    @Test
    void comprasYPerfilRequierenSesionYUsuariosSoloAdmin() {
        assertThat(ReglasAcceso.nivel(HttpMethod.POST, "/api/auth/login")).isEqualTo(NivelAcceso.PUBLICO);
        assertThat(ReglasAcceso.nivel(HttpMethod.POST, "/api/pedidos")).isEqualTo(NivelAcceso.AUTENTICADO);
        assertThat(ReglasAcceso.nivel(HttpMethod.GET, "/api/auth/me")).isEqualTo(NivelAcceso.AUTENTICADO);
        assertThat(ReglasAcceso.nivel(HttpMethod.GET, "/api/usuarios")).isEqualTo(NivelAcceso.ADMIN);
    }
}
