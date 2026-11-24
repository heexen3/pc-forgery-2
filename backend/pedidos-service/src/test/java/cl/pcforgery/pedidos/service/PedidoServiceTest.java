package cl.pcforgery.pedidos.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import cl.pcforgery.pedidos.client.InventarioClient;
import cl.pcforgery.pedidos.client.PagosClient;
import cl.pcforgery.pedidos.client.ProductosClient;
import cl.pcforgery.pedidos.dto.BoletaResponse;
import cl.pcforgery.pedidos.dto.CheckoutRequest;
import cl.pcforgery.pedidos.dto.ItemCarrito;
import cl.pcforgery.pedidos.exception.NegocioException;
import cl.pcforgery.pedidos.model.Boleta;
import cl.pcforgery.pedidos.model.EstadoPedido;
import cl.pcforgery.pedidos.model.Pedido;
import cl.pcforgery.pedidos.repository.BoletaRepository;
import cl.pcforgery.pedidos.repository.PedidoRepository;
import cl.pcforgery.pedidos.security.UsuarioContexto;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

/** Checkout con los otros microservicios simulados (Mockito). */
@ExtendWith(MockitoExtension.class)
class PedidoServiceTest {

    @Mock
    private PedidoRepository pedidos;
    @Mock
    private BoletaRepository boletas;
    @Mock
    private ProductosClient productosClient;
    @Mock
    private InventarioClient inventarioClient;
    @Mock
    private PagosClient pagosClient;

    private PedidoService pedidoService;
    private final UsuarioContexto juan = new UsuarioContexto(5L, "juan@gmail.com", "Juanito", "CLIENTE");
    private final CheckoutRequest compra = new CheckoutRequest(
            List.of(new ItemCarrito("producto-1", "producto", 1L, "Corsair K70 RGB Pro", 2, null)), "Débito", "", false);

    @BeforeEach
    void preparar() {
        ObjectMapper mapper = new ObjectMapper();
        pedidoService = new PedidoService(pedidos, boletas, productosClient, inventarioClient, pagosClient,
                new BoletaMapper(mapper), mapper);
        when(productosClient.producto(1L)).thenReturn(Map.of("id", 1, "nombre", "Corsair K70 RGB Pro", "precio", 129990));
        when(pedidos.save(any(Pedido.class))).thenAnswer(inv -> {
            Pedido p = inv.getArgument(0);
            if (p.getId() == null) {
                p.setId(10L);
            }
            return p;
        });
    }

    @Test
    void checkoutAprobadoDescuentaStockYGeneraBoletaConTotalesConIva() {
        when(pagosClient.pagar(eq(10L), eq(259980), eq("Débito"), any(), eq("juan@gmail.com"), eq(false)))
                .thenReturn(new PagosClient.ResultadoPago("APROBADO", null, "TX-1"));
        when(boletas.maximoNumero()).thenReturn(4);
        when(boletas.save(any(Boleta.class))).thenAnswer(inv -> inv.getArgument(0));

        BoletaResponse boleta = pedidoService.checkout(juan, compra);

        assertThat(boleta.numero()).isEqualTo(5);
        assertThat(boleta.total()).isEqualTo(259980);
        assertThat(boleta.subtotal()).isEqualTo(218471);
        assertThat(boleta.iva()).isEqualTo(259980 - 218471);
        assertThat(boleta.estado()).isEqualTo("PAGADO");
        assertThat(boleta.items().get(0).codigo()).isEqualTo("PF-00001");
        verify(inventarioClient).descontar(anyList(), eq("pedido 10"));
    }

    @Test
    void pagoRechazadoDejaElPedidoRechazadoYNoTocaElStock() {
        when(pagosClient.pagar(any(), anyInt(), anyString(), any(), anyString(), anyBoolean()))
                .thenReturn(new PagosClient.ResultadoPago("RECHAZADO", "El pago no pudo completarse.", "TX-2"));

        assertThatThrownBy(() -> pedidoService.checkout(juan, compra))
                .isInstanceOf(NegocioException.class)
                .satisfies(e -> assertThat(((NegocioException) e).getStatus()).isEqualTo(HttpStatus.PAYMENT_REQUIRED));

        ArgumentCaptor<Pedido> guardado = ArgumentCaptor.forClass(Pedido.class);
        verify(pedidos, org.mockito.Mockito.atLeastOnce()).save(guardado.capture());
        assertThat(guardado.getValue().getEstado()).isEqualTo(EstadoPedido.RECHAZADO);
        verify(inventarioClient, never()).descontar(anyList(), anyString());
        verify(boletas, never()).save(any());
    }
}
