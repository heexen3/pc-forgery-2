package cl.pcforgery.productos.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import cl.pcforgery.productos.dto.ProductoRequest;
import cl.pcforgery.productos.dto.ProductoResponse;
import cl.pcforgery.productos.exception.NegocioException;
import cl.pcforgery.productos.model.Producto;
import cl.pcforgery.productos.repository.CategoriaRepository;
import cl.pcforgery.productos.repository.ProductoRepository;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ProductoServiceTest {

    @Mock
    private ProductoRepository productos;

    @Mock
    private CategoriaRepository categorias;

    @InjectMocks
    private ProductoService productoService;

    @Test
    void listarFiltraPorTextoEnNombreOMarca() {
        when(productos.findAllByOrderByIdAsc()).thenReturn(List.of(
                Producto.builder().id(1L).nombre("Corsair K70 RGB Pro").categoria("Perifericos").marca("Corsair").precio(129990).build(),
                Producto.builder().id(2L).nombre("Razer DeathAdder V3").categoria("Perifericos").marca("Razer").precio(69990).build()));

        List<ProductoResponse> resultado = productoService.listar(null, "razer");

        assertThat(resultado).extracting(ProductoResponse::nombre).containsExactly("Razer DeathAdder V3");
    }

    @Test
    void crearConCategoriaInexistenteSeRechazaSinGuardar() {
        when(categorias.existsByValorIgnoreCase("Juguetes")).thenReturn(false);
        ProductoRequest req = new ProductoRequest("Peluche", "Juguetes", "Marca", 1000, "desc", null, false, Map.of());

        assertThatThrownBy(() -> productoService.crear(req))
                .isInstanceOf(NegocioException.class)
                .hasMessageContaining("no existe");
        verify(productos, never()).save(any());
    }
}
