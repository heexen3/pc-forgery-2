package cl.pcforgery.pedidos.service;

import cl.pcforgery.pedidos.client.InventarioClient;
import cl.pcforgery.pedidos.client.PagosClient;
import cl.pcforgery.pedidos.client.ProductosClient;
import cl.pcforgery.pedidos.dto.BoletaResponse;
import cl.pcforgery.pedidos.dto.CheckoutRequest;
import cl.pcforgery.pedidos.dto.ComponenteItem;
import cl.pcforgery.pedidos.dto.EstadoRequest;
import cl.pcforgery.pedidos.dto.ItemCarrito;
import cl.pcforgery.pedidos.dto.PedidoResponse;
import cl.pcforgery.pedidos.exception.NegocioException;
import cl.pcforgery.pedidos.exception.RecursoNoEncontradoException;
import cl.pcforgery.pedidos.model.Boleta;
import cl.pcforgery.pedidos.model.DetallePedido;
import cl.pcforgery.pedidos.model.EstadoPedido;
import cl.pcforgery.pedidos.model.Pedido;
import cl.pcforgery.pedidos.repository.BoletaRepository;
import cl.pcforgery.pedidos.repository.PedidoRepository;
import cl.pcforgery.pedidos.security.UsuarioContexto;
import cl.pcforgery.pedidos.util.Rut;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Orquesta el checkout entre microservicios:
 * productos (precio vigente) -> inventario (verificar stock) -> pagos (cobro simulado)
 * -> inventario (descontar) -> boleta.
 */
@Service
public class PedidoService {

    public static final List<String> METODOS_PAGO = List.of("Débito", "Crédito", "Transferencia");
    public static final double IVA = 0.19;

    private final PedidoRepository pedidos;
    private final BoletaRepository boletas;
    private final ProductosClient productosClient;
    private final InventarioClient inventarioClient;
    private final PagosClient pagosClient;
    private final BoletaMapper boletaMapper;
    private final ObjectMapper mapper;

    public PedidoService(PedidoRepository pedidos, BoletaRepository boletas, ProductosClient productosClient,
                         InventarioClient inventarioClient, PagosClient pagosClient, BoletaMapper boletaMapper,
                         ObjectMapper mapper) {
        this.pedidos = pedidos;
        this.boletas = boletas;
        this.productosClient = productosClient;
        this.inventarioClient = inventarioClient;
        this.pagosClient = pagosClient;
        this.boletaMapper = boletaMapper;
        this.mapper = mapper;
    }

    /**
     * Checkout completo. Si el pago se rechaza el pedido queda RECHAZADO, el stock no se toca
     * y se responde 402 (el frontend deja el carrito intacto).
     */
    @Transactional(noRollbackFor = NegocioException.class)
    public BoletaResponse checkout(UsuarioContexto usuario, CheckoutRequest req) {
        if (!METODOS_PAGO.contains(req.metodoPago())) {
            throw new NegocioException(HttpStatus.BAD_REQUEST, "Selecciona un método de pago válido.");
        }
        String rut = req.rut() == null ? "" : req.rut().trim();
        if (!rut.isEmpty() && !Rut.esValido(rut)) {
            throw new NegocioException(HttpStatus.BAD_REQUEST, "El RUT ingresado no es válido. Revisa el dígito verificador.");
        }

        // 1) Precios vigentes desde productos-service (no se confía en el precio del navegador)
        Pedido pedido = Pedido.builder()
                .usuarioId(usuario.id())
                .usuario(usuario.usuario() == null ? usuario.email() : usuario.usuario())
                .correo(usuario.email())
                .fecha(LocalDateTime.now())
                .estado(EstadoPedido.PENDIENTE)
                .metodoPago(req.metodoPago())
                .rutCliente(rut.isEmpty() ? null : Rut.formatear(rut))
                .build();
        List<InventarioClient.Item> itemsStock = new ArrayList<>();
        for (ItemCarrito item : req.items()) {
            DetallePedido detalle = item.esArmado() ? detalleArmado(item) : detalleProducto(item);
            pedido.agregarDetalle(detalle);
            if (!item.esArmado()) {
                itemsStock.add(new InventarioClient.Item(detalle.getProductoId(), detalle.getCantidad(), detalle.getNombre()));
            }
        }
        int total = pedido.getDetalles().stream().mapToInt(DetallePedido::getTotalLinea).sum();
        int subtotal = (int) Math.round(total / (1 + IVA));
        pedido.setTotal(total);
        pedido.setSubtotal(subtotal);
        pedido.setIva(total - subtotal);

        // 2) Stock suficiente (inventario-service)
        inventarioClient.verificar(itemsStock);
        pedido = pedidos.save(pedido);

        // 3) Pago simulado (pagos-service)
        PagosClient.ResultadoPago pago = pagosClient.pagar(pedido.getId(), total, req.metodoPago(),
                pedido.getRutCliente(), usuario.email(), Boolean.TRUE.equals(req.simularRechazo()));
        pedido.setCodigoTransaccion(pago.codigoTransaccion());
        if (!pago.aprobado()) {
            pedido.setEstado(EstadoPedido.RECHAZADO);
            pedido.setObservacion(pago.motivo());
            pedidos.save(pedido);
            throw new NegocioException(HttpStatus.PAYMENT_REQUIRED, pago.motivo() == null
                    ? "El pago no pudo completarse." : pago.motivo());
        }

        // 4) Descontar stock y emitir boleta
        try {
            inventarioClient.descontar(itemsStock, "pedido " + pedido.getId());
        } catch (NegocioException e) {
            pedido.setEstado(EstadoPedido.ANULADO);
            pedido.setObservacion(e.getMessage());
            pedidos.save(pedido);
            throw e;
        }
        pedido.setEstado(EstadoPedido.PAGADO);
        pedido = pedidos.save(pedido);

        Boleta boleta = Boleta.builder()
                .numero(boletas.maximoNumero() + 1)
                .pedido(pedido)
                .fecha(pedido.getFecha())
                .codigoVerificacion("")
                .build();
        boleta.setCodigoVerificacion(BoletaMapper.codigoVerificacion(boleta.getNumero(), BoletaMapper.fechaIso(boleta),
                total, pedido.getCorreo()));
        return boletaMapper.aRespuesta(boletas.save(boleta));
    }

    private DetallePedido detalleProducto(ItemCarrito item) {
        if (item.productoId() == null) {
            throw new NegocioException(HttpStatus.BAD_REQUEST, "Falta el productoId de un ítem del carrito.");
        }
        Map<String, Object> producto = productosClient.producto(item.productoId());
        int precio = ((Number) producto.get("precio")).intValue();
        return DetallePedido.builder()
                .itemId(item.id() == null ? "producto-" + item.productoId() : item.id())
                .tipo("producto")
                .productoId(item.productoId())
                .codigo(String.format("PF-%05d", item.productoId()))
                .nombre(String.valueOf(producto.get("nombre")))
                .precio(precio)
                .cantidad(item.cantidad())
                .totalLinea(precio * item.cantidad())
                .build();
    }

    private DetallePedido detalleArmado(ItemCarrito item) {
        if (item.componentes() == null || item.componentes().isEmpty()) {
            throw new NegocioException(HttpStatus.BAD_REQUEST, "El PC armado no tiene componentes.");
        }
        List<ComponenteItem> piezas = new ArrayList<>();
        int precio = 0;
        for (ComponenteItem pieza : item.componentes()) {
            Map<String, Object> componente = productosClient.componente(pieza.id());
            int precioPieza = ((Number) componente.get("precio")).intValue();
            precio += precioPieza;
            piezas.add(new ComponenteItem(pieza.categoria(), pieza.id(), String.valueOf(componente.get("nombre")), precioPieza));
        }
        return DetallePedido.builder()
                .itemId(item.id())
                .tipo("armado")
                .codigo("PF-ARM")
                .nombre(item.nombre() == null || item.nombre().isBlank() ? "PC Armado" : item.nombre())
                .precio(precio)
                .cantidad(item.cantidad())
                .totalLinea(precio * item.cantidad())
                .componentesJson(json(piezas))
                .build();
    }

    @Transactional(readOnly = true)
    public List<PedidoResponse> listarTodos(UsuarioContexto usuario) {
        usuario.exigirAdmin();
        return pedidos.findAllByOrderByFechaDesc().stream().map(this::aRespuesta).toList();
    }

    @Transactional(readOnly = true)
    public List<PedidoResponse> listarMios(UsuarioContexto usuario) {
        return pedidos.findByCorreoIgnoreCaseOrderByFechaDesc(usuario.email()).stream().map(this::aRespuesta).toList();
    }

    @Transactional(readOnly = true)
    public PedidoResponse obtener(UsuarioContexto usuario, Long id) {
        Pedido pedido = buscar(id);
        exigirDuenoOAdmin(usuario, pedido.getCorreo());
        return aRespuesta(pedido);
    }

    @Transactional
    public PedidoResponse cambiarEstado(UsuarioContexto usuario, Long id, EstadoRequest req) {
        usuario.exigirAdmin();
        Pedido pedido = buscar(id);
        pedido.setEstado(req.estado());
        pedido.setObservacion(req.observacion());
        return aRespuesta(pedidos.save(pedido));
    }

    @Transactional
    public void eliminar(UsuarioContexto usuario, Long id) {
        usuario.exigirAdmin();
        Pedido pedido = buscar(id);
        boletas.findByPedidoId(id).ifPresent(boletas::delete);
        pedidos.delete(pedido);
    }

    // ---- Boletas ----

    /** El ADMIN ve todas las boletas; el cliente solo las suyas. */
    @Transactional(readOnly = true)
    public List<BoletaResponse> listarBoletas(UsuarioContexto usuario) {
        List<Boleta> lista = usuario.esAdmin()
                ? boletas.findAllByOrderByNumeroAsc()
                : boletas.findByPedidoCorreoIgnoreCaseOrderByNumeroAsc(usuario.email());
        return lista.stream().map(boletaMapper::aRespuesta).toList();
    }

    @Transactional(readOnly = true)
    public BoletaResponse obtenerBoleta(UsuarioContexto usuario, Integer numero) {
        Boleta boleta = boletas.findByNumero(numero)
                .orElseThrow(() -> new RecursoNoEncontradoException("Boleta " + numero + " no encontrada."));
        exigirDuenoOAdmin(usuario, boleta.getPedido().getCorreo());
        return boletaMapper.aRespuesta(boleta);
    }

    private void exigirDuenoOAdmin(UsuarioContexto usuario, String correo) {
        if (!usuario.esAdmin() && !usuario.email().equalsIgnoreCase(correo)) {
            throw new NegocioException(HttpStatus.FORBIDDEN, "No tienes permiso para ver este recurso.");
        }
    }

    private PedidoResponse aRespuesta(Pedido p) {
        Integer numero = boletas.findByPedidoId(p.getId()).map(Boleta::getNumero).orElse(null);
        return new PedidoResponse(p.getId(), p.getUsuarioId(), p.getUsuario(), p.getCorreo(), p.getFecha(),
                p.getEstado().name(), p.getMetodoPago(), p.getRutCliente(), p.getSubtotal(), p.getIva(), p.getTotal(),
                p.getCodigoTransaccion(), p.getObservacion(), numero, p.getDetalles());
    }

    private Pedido buscar(Long id) {
        return pedidos.findById(id).orElseThrow(() -> new RecursoNoEncontradoException("Pedido " + id + " no encontrado."));
    }

    private String json(Object valor) {
        try {
            return mapper.writeValueAsString(valor);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException(e);
        }
    }
}
