package cl.pcforgery.pedidos.controller;

import cl.pcforgery.pedidos.dto.BoletaResponse;
import cl.pcforgery.pedidos.security.UsuarioContexto;
import cl.pcforgery.pedidos.service.PedidoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Las boletas se crean en el checkout y se eliminan junto con su pedido (DELETE /pedidos/{id}). */
@RestController
@RequestMapping("/boletas")
@Tag(name = "Boletas", description = "Boletas electrónicas simuladas (requiere sesión)")
public class BoletaController {

    private final PedidoService pedidoService;

    public BoletaController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @GetMapping
    @Operation(summary = "Listar boletas: el ADMIN ve todas, el cliente solo las suyas")
    public List<BoletaResponse> listar(UsuarioContexto usuario) {
        return pedidoService.listarBoletas(usuario);
    }

    @GetMapping("/{numero}")
    @Operation(summary = "Obtener una boleta por número (dueño o ADMIN)")
    public BoletaResponse obtener(UsuarioContexto usuario, @PathVariable Integer numero) {
        return pedidoService.obtenerBoleta(usuario, numero);
    }
}
