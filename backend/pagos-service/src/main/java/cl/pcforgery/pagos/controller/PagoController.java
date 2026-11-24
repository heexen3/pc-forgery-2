package cl.pcforgery.pagos.controller;

import cl.pcforgery.pagos.dto.EstadoRequest;
import cl.pcforgery.pagos.dto.PagoRequest;
import cl.pcforgery.pagos.model.Pago;
import cl.pcforgery.pagos.security.UsuarioContexto;
import cl.pcforgery.pagos.service.PagoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/pagos")
@Tag(name = "Pagos", description = "Pasarela de pago simulada")
public class PagoController {

    private final PagoService pagoService;

    public PagoController(PagoService pagoService) {
        this.pagoService = pagoService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Procesar un pago (lo llama pedidos-service durante el checkout)")
    public Pago procesar(@Valid @RequestBody PagoRequest req) {
        return pagoService.procesar(req);
    }

    @GetMapping
    @Operation(summary = "Listar pagos: el ADMIN ve todos, el cliente solo los suyos")
    public List<Pago> listar(@Parameter(hidden = true) @RequestHeader(value = UsuarioContexto.H_EMAIL, required = false) String email,
                             @Parameter(hidden = true) @RequestHeader(value = UsuarioContexto.H_ROL, required = false) String rol) {
        UsuarioContexto usuario = UsuarioContexto.de(null, email, null, rol);
        return pagoService.listar(usuario.esAdmin() ? null : usuario.email());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un pago")
    public Pago obtener(@PathVariable Long id) {
        return pagoService.obtener(id);
    }

    @GetMapping("/pedido/{pedidoId}")
    @Operation(summary = "Pagos de un pedido")
    public List<Pago> porPedido(@PathVariable Long pedidoId) {
        return pagoService.porPedido(pedidoId);
    }

    @PutMapping("/{id}/estado")
    @Operation(summary = "Cambiar el estado de un pago, ej. anularlo (ADMIN)")
    public Pago cambiarEstado(@PathVariable Long id, @Valid @RequestBody EstadoRequest req) {
        return pagoService.cambiarEstado(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Eliminar un pago (ADMIN)")
    public void eliminar(@PathVariable Long id) {
        pagoService.eliminar(id);
    }
}
