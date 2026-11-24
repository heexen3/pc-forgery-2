package cl.pcforgery.comunidad.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import cl.pcforgery.comunidad.dto.ResenaRequest;
import cl.pcforgery.comunidad.exception.NegocioException;
import cl.pcforgery.comunidad.model.Resena;
import cl.pcforgery.comunidad.repository.ResenaRepository;
import cl.pcforgery.comunidad.security.UsuarioContexto;
import java.time.Instant;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ResenaServiceTest {

    @Mock
    private ResenaRepository resenas;

    @InjectMocks
    private ResenaService resenaService;

    private final UsuarioContexto ana = new UsuarioContexto(3L, "ana@gmail.com", "ana", "CLIENTE");

    @Test
    void siElUsuarioYaOpinoSeActualizaSuResenaEnVezDeDuplicarla() {
        Resena existente = Resena.builder().id(7L).productoId(1L).correo("ana@gmail.com").autor("ana")
                .estrellas(2).comentario("Regular").fecha(Instant.parse("2026-01-01T00:00:00Z")).build();
        when(resenas.findByProductoIdAndCorreoIgnoreCase(1L, "ana@gmail.com")).thenReturn(Optional.of(existente));
        when(resenas.save(any(Resena.class))).thenAnswer(inv -> inv.getArgument(0));

        Resena resultado = resenaService.publicar(ana, new ResenaRequest(1L, 5, "  Excelente teclado  "));

        assertThat(resultado.getId()).isEqualTo(7L);
        assertThat(resultado.getEstrellas()).isEqualTo(5);
        assertThat(resultado.getComentario()).isEqualTo("Excelente teclado");
    }

    @Test
    void unUsuarioNoPuedeBorrarLaResenaDeOtro() {
        Resena deOtro = Resena.builder().id(8L).productoId(1L).correo("pedro@gmail.com").build();
        when(resenas.findById(8L)).thenReturn(Optional.of(deOtro));

        assertThatThrownBy(() -> resenaService.eliminar(ana, 8L))
                .isInstanceOf(NegocioException.class)
                .hasMessageContaining("Solo el autor");
        verify(resenas, never()).delete(any());
    }
}
