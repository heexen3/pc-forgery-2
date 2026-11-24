package cl.pcforgery.pedidos.controller;

import cl.pcforgery.pedidos.dto.BoletaResponse;
import cl.pcforgery.pedidos.dto.CheckoutRequest;
import cl.pcforgery.pedidos.dto.EstadoRequest;
import cl.pcforgery.pedidos.dto.PedidoResponse;
import cl.pcforgery.pedidos.security.UsuarioContexto;
import cl.pcforgery.pedidos.service.PedidoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/pedidos")
@Tag(name = "Pedidos", description = "Checkout y pedidos (requiere sesión)")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Checkout: crea el pedido, cobra (simulado), descuenta stock y devuelve la boleta",
            description = "Responde 409 si no hay stock y 402 si el pago es rechazado.")
    public BoletaResponse checkout(UsuarioContexto usuario, @Valid @RequestBody CheckoutRequest req) {
        return pedidoService.checkout(usuario, req);
    }

    @GetMapping
    @Operation(summary = "Listar todos los pedidos (ADMIN)")
    public List<PedidoResponse> listarTodos(UsuarioContexto usuario) {
        return pedidoService.listarTodos(usuario);
    }

    @GetMapping("/mios")
    @Operation(summary = "Pedidos del usuario autenticado")
    public List<PedidoResponse> listarMios(UsuarioContexto usuario) {
        return pedidoService.listarMios(usuario);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un pedido (dueño o ADMIN)")
    public PedidoResponse obtener(UsuarioContexto usuario, @PathVariable Long id) {
        return pedidoService.obtener(usuario, id);
    }

    @PutMapping("/{id}/estado")
    @Operation(summary = "Cambiar el estado de un pedido (ADMIN)")
    public PedidoResponse cambiarEstado(UsuarioContexto usuario, @PathVariable Long id,
                                        @Valid @RequestBody EstadoRequest req) {
        return pedidoService.cambiarEstado(usuario, id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Eliminar un pedido y su boleta (ADMIN)")
    public void eliminar(UsuarioContexto usuario, @PathVariable Long id) {
        pedidoService.eliminar(usuario, id);
    }
}
