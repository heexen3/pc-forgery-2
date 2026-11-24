package cl.pcforgery.inventario.service;

import cl.pcforgery.inventario.dto.InventarioRequest;
import cl.pcforgery.inventario.dto.ItemStock;
import cl.pcforgery.inventario.dto.MovimientoRequest;
import cl.pcforgery.inventario.dto.VerificacionResponse;
import cl.pcforgery.inventario.exception.NegocioException;
import cl.pcforgery.inventario.exception.RecursoNoEncontradoException;
import cl.pcforgery.inventario.model.Inventario;
import cl.pcforgery.inventario.model.MovimientoStock;
import cl.pcforgery.inventario.repository.InventarioRepository;
import cl.pcforgery.inventario.repository.MovimientoStockRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InventarioService {

    private final InventarioRepository inventario;
    private final MovimientoStockRepository movimientos;

    public InventarioService(InventarioRepository inventario, MovimientoStockRepository movimientos) {
        this.inventario = inventario;
        this.movimientos = movimientos;
    }

    @Transactional(readOnly = true)
    public List<Inventario> listar() {
        return inventario.findAllByOrderByProductoIdAsc();
    }

    /** Productos con stock bajo el mínimo (para "Productos críticos" del admin). */
    @Transactional(readOnly = true)
    public List<Inventario> criticos() {
        return listar().stream().filter(i -> i.getStock() <= i.getStockMinimo()).toList();
    }

    @Transactional(readOnly = true)
    public Inventario obtener(Long productoId) {
        return buscar(productoId);
    }

    @Transactional(readOnly = true)
    public List<MovimientoStock> movimientos(Long productoId) {
        return movimientos.findByProductoIdOrderByFechaDesc(productoId);
    }

    @Transactional
    public Inventario crear(InventarioRequest req) {
        if (inventario.existsByProductoId(req.productoId())) {
            throw new NegocioException(HttpStatus.CONFLICT, "El producto " + req.productoId() + " ya tiene inventario.");
        }
        Inventario nuevo = Inventario.builder()
                .productoId(req.productoId())
                .stock(req.stock())
                .stockMinimo(req.stockMinimo() == null ? 5 : req.stockMinimo())
                .build();
        registrar(req.productoId(), req.stock(), MovimientoStock.Tipo.ENTRADA, "stock inicial");
        return inventario.save(nuevo);
    }

    /** Fija el stock (lo usa el admin al editar un producto). Si no existe, lo crea. */
    @Transactional
    public Inventario fijarStock(Long productoId, InventarioRequest req) {
        Inventario registro = inventario.findByProductoId(productoId)
                .orElseGet(() -> Inventario.builder().productoId(productoId).stock(0).build());
        int diferencia = req.stock() - registro.getStock();
        registro.setStock(req.stock());
        if (req.stockMinimo() != null) {
            registro.setStockMinimo(req.stockMinimo());
        }
        registrar(productoId, diferencia, MovimientoStock.Tipo.AJUSTE, "ajuste admin");
        return inventario.save(registro);
    }

    @Transactional
    public void eliminar(Long productoId) {
        inventario.delete(buscar(productoId));
    }

    /** Revisa que haya stock para todos los ítems, sin modificar nada. */
    @Transactional(readOnly = true)
    public VerificacionResponse verificar(List<ItemStock> items) {
        for (ItemStock item : items) {
            int disponible = inventario.findByProductoId(item.productoId()).map(Inventario::getStock).orElse(0);
            if (item.cantidad() > disponible) {
                String nombre = item.nombre() == null ? "el producto " + item.productoId() : item.nombre();
                return new VerificacionResponse(false, "No hay stock suficiente de " + nombre + ".");
            }
        }
        return new VerificacionResponse(true, "");
    }

    /**
     * Descuenta el stock de una compra. Primero verifica todos los ítems: si alguno no alcanza
     * no se descuenta ninguno (todo o nada, dentro de una transacción).
     */
    @Transactional
    public List<Inventario> descontar(MovimientoRequest req) {
        VerificacionResponse verificacion = verificar(req.items());
        if (!verificacion.ok()) {
            throw new NegocioException(HttpStatus.CONFLICT, verificacion.mensaje());
        }
        return req.items().stream().map(item -> {
            Inventario registro = buscar(item.productoId());
            registro.setStock(registro.getStock() - item.cantidad());
            registrar(item.productoId(), -item.cantidad(), MovimientoStock.Tipo.SALIDA, req.referencia());
            return inventario.save(registro);
        }).toList();
    }

    private void registrar(Long productoId, int cantidad, MovimientoStock.Tipo tipo, String referencia) {
        movimientos.save(MovimientoStock.builder()
                .productoId(productoId)
                .cantidad(cantidad)
                .tipo(tipo)
                .referencia(referencia)
                .fecha(LocalDateTime.now())
                .build());
    }

    private Inventario buscar(Long productoId) {
        return inventario.findByProductoId(productoId)
                .orElseThrow(() -> new RecursoNoEncontradoException("No hay inventario para el producto " + productoId + "."));
    }
}
