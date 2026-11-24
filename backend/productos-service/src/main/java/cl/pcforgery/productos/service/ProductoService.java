package cl.pcforgery.productos.service;

import cl.pcforgery.productos.dto.ProductoRequest;
import cl.pcforgery.productos.dto.ProductoResponse;
import cl.pcforgery.productos.exception.NegocioException;
import cl.pcforgery.productos.exception.RecursoNoEncontradoException;
import cl.pcforgery.productos.model.Producto;
import cl.pcforgery.productos.repository.CategoriaRepository;
import cl.pcforgery.productos.repository.ProductoRepository;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductoService {

    private final ProductoRepository productos;
    private final CategoriaRepository categorias;

    public ProductoService(ProductoRepository productos, CategoriaRepository categorias) {
        this.productos = productos;
        this.categorias = categorias;
    }

    /** Lista el catálogo, opcionalmente filtrado por categoría y/o texto (nombre o marca). */
    @Transactional(readOnly = true)
    public List<ProductoResponse> listar(String categoria, String texto) {
        List<Producto> lista = categoria == null || categoria.isBlank()
                ? productos.findAllByOrderByIdAsc()
                : productos.findByCategoriaIgnoreCaseOrderByIdAsc(categoria);
        String filtro = texto == null ? "" : texto.trim().toLowerCase(Locale.ROOT);
        return lista.stream()
                .filter(p -> filtro.isEmpty()
                        || p.getNombre().toLowerCase(Locale.ROOT).contains(filtro)
                        || (p.getMarca() != null && p.getMarca().toLowerCase(Locale.ROOT).contains(filtro)))
                .map(ProductoResponse::de)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductoResponse obtener(Long id) {
        return ProductoResponse.de(buscar(id));
    }

    @Transactional
    public ProductoResponse crear(ProductoRequest req) {
        validarCategoria(req.categoria());
        Producto nuevo = new Producto();
        copiar(req, nuevo);
        return ProductoResponse.de(productos.save(nuevo));
    }

    @Transactional
    public ProductoResponse actualizar(Long id, ProductoRequest req) {
        validarCategoria(req.categoria());
        Producto existente = buscar(id);
        copiar(req, existente);
        return ProductoResponse.de(productos.save(existente));
    }

    @Transactional
    public void eliminar(Long id) {
        productos.delete(buscar(id));
    }

    private void validarCategoria(String categoria) {
        if (!categorias.existsByValorIgnoreCase(categoria)) {
            throw new NegocioException(HttpStatus.BAD_REQUEST, "La categoría \"" + categoria + "\" no existe.");
        }
    }

    private static void copiar(ProductoRequest req, Producto destino) {
        destino.setNombre(req.nombre().trim());
        destino.setCategoria(req.categoria());
        destino.setMarca(req.marca());
        destino.setPrecio(req.precio());
        destino.setDescripcion(req.descripcion());
        destino.setImagen(req.imagen());
        destino.setNuevo(Boolean.TRUE.equals(req.nuevo()));
        destino.setEspecificaciones(req.especificaciones() == null
                ? new LinkedHashMap<>() : new LinkedHashMap<>(req.especificaciones()));
    }

    private Producto buscar(Long id) {
        return productos.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Producto " + id + " no encontrado."));
    }
}
