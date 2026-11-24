package cl.pcforgery.inventario.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import cl.pcforgery.inventario.dto.ItemStock;
import cl.pcforgery.inventario.dto.MovimientoRequest;
import cl.pcforgery.inventario.exception.NegocioException;
import cl.pcforgery.inventario.model.Inventario;
import cl.pcforgery.inventario.repository.InventarioRepository;
import cl.pcforgery.inventario.repository.MovimientoStockRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class InventarioServiceTest {

    @Mock
    private InventarioRepository inventario;

    @Mock
    private MovimientoStockRepository movimientos;

    @InjectMocks
    private InventarioService inventarioService;

    @Test
    void descontarRestaLaCantidadCompradaDelStock() {
        Inventario teclado = Inventario.builder().productoId(1L).stock(15).build();
        when(inventario.findByProductoId(1L)).thenReturn(Optional.of(teclado));
        when(inventario.save(any(Inventario.class))).thenAnswer(inv -> inv.getArgument(0));

        inventarioService.descontar(new MovimientoRequest(List.of(new ItemStock(1L, 2, "Corsair K70")), "pedido 1"));

        assertThat(teclado.getStock()).isEqualTo(13);
    }

    @Test
    void sinStockSuficienteNoSeDescuentaNadaYSeInformaElProducto() {
        Inventario mouse = Inventario.builder().productoId(2L).stock(1).build();
        when(inventario.findByProductoId(2L)).thenReturn(Optional.of(mouse));

        MovimientoRequest req = new MovimientoRequest(List.of(new ItemStock(2L, 3, "Razer DeathAdder V3")), "pedido 2");

        assertThatThrownBy(() -> inventarioService.descontar(req))
                .isInstanceOf(NegocioException.class)
                .hasMessage("No hay stock suficiente de Razer DeathAdder V3.");
        assertThat(mouse.getStock()).isEqualTo(1);
        verify(inventario, never()).save(any());
    }
}
