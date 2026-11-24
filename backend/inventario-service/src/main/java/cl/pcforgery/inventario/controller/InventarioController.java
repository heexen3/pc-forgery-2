package cl.pcforgery.inventario.controller;

import cl.pcforgery.inventario.dto.InventarioRequest;
import cl.pcforgery.inventario.dto.MovimientoRequest;
import cl.pcforgery.inventario.dto.VerificacionResponse;
import cl.pcforgery.inventario.model.Inventario;
import cl.pcforgery.inventario.model.MovimientoStock;
import cl.pcforgery.inventario.service.InventarioService;
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
@RequestMapping("/inventario")
@Tag(name = "Inventario", description = "Stock por producto (GET público; cambios solo ADMIN o servicios internos)")
public class InventarioController {

    private final InventarioService inventarioService;

    public InventarioController(InventarioService inventarioService) {
        this.inventarioService = inventarioService;
    }

    @GetMapping
    @Operation(summary = "Listar stock de todos los productos")
    public List<Inventario> listar() {
        return inventarioService.listar();
    }

    @GetMapping("/criticos")
    @Operation(summary = "Productos con stock igual o menor al mínimo")
    public List<Inventario> criticos() {
        return inventarioService.criticos();
    }

    @GetMapping("/{productoId}")
    @Operation(summary = "Stock de un producto")
    public Inventario obtener(@PathVariable Long productoId) {
        return inventarioService.obtener(productoId);
    }

    @GetMapping("/{productoId}/movimientos")
    @Operation(summary = "Historial de movimientos de stock de un producto")
    public List<MovimientoStock> movimientos(@PathVariable Long productoId) {
        return inventarioService.movimientos(productoId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Crear registro de inventario para un producto (ADMIN)")
    public Inventario crear(@Valid @RequestBody InventarioRequest req) {
        return inventarioService.crear(req);
    }

    @PutMapping("/{productoId}")
    @Operation(summary = "Fijar el stock de un producto (ADMIN)")
    public Inventario fijar(@PathVariable Long productoId, @Valid @RequestBody InventarioRequest req) {
        return inventarioService.fijarStock(productoId, req);
    }

    @DeleteMapping("/{productoId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Eliminar el inventario de un producto (ADMIN)")
    public void eliminar(@PathVariable Long productoId) {
        inventarioService.eliminar(productoId);
    }

    @PostMapping("/verificar")
    @Operation(summary = "Verificar stock de varios ítems sin descontar (lo usa pedidos-service)")
    public VerificacionResponse verificar(@Valid @RequestBody MovimientoRequest req) {
        return inventarioService.verificar(req.items());
    }

    @PostMapping("/descontar")
    @Operation(summary = "Descontar stock de una compra, todo o nada (lo usa pedidos-service)")
    public List<Inventario> descontar(@Valid @RequestBody MovimientoRequest req) {
        return inventarioService.descontar(req);
    }
}
