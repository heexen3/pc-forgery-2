package cl.pcforgery.productos.service;

import cl.pcforgery.productos.dto.CategoriaRequest;
import cl.pcforgery.productos.exception.NegocioException;
import cl.pcforgery.productos.exception.RecursoNoEncontradoException;
import cl.pcforgery.productos.model.Categoria;
import cl.pcforgery.productos.repository.CategoriaRepository;
import cl.pcforgery.productos.repository.ProductoRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CategoriaService {

    private final CategoriaRepository categorias;
    private final ProductoRepository productos;

    public CategoriaService(CategoriaRepository categorias, ProductoRepository productos) {
        this.categorias = categorias;
        this.productos = productos;
    }

    @Transactional(readOnly = true)
    public List<Categoria> listar() {
        return categorias.findAll();
    }

    @Transactional(readOnly = true)
    public Categoria obtener(Long id) {
        return buscar(id);
    }

    @Transactional
    public Categoria crear(CategoriaRequest req) {
        if (categorias.existsByValorIgnoreCase(req.valor())) {
            throw new NegocioException(HttpStatus.CONFLICT, "Ya existe la categoría " + req.valor() + ".");
        }
        return categorias.save(Categoria.builder().valor(req.valor()).etiqueta(req.etiqueta()).icono(req.icono()).build());
    }

    @Transactional
    public Categoria actualizar(Long id, CategoriaRequest req) {
        Categoria existente = buscar(id);
        existente.setEtiqueta(req.etiqueta());
        existente.setIcono(req.icono());
        return categorias.save(existente);
    }

    @Transactional
    public void eliminar(Long id) {
        Categoria existente = buscar(id);
        if (productos.existsByCategoriaIgnoreCase(existente.getValor())) {
            throw new NegocioException(HttpStatus.CONFLICT, "No se puede eliminar: hay productos en esta categoría.");
        }
        categorias.delete(existente);
    }

    private Categoria buscar(Long id) {
        return categorias.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Categoría no encontrada."));
    }
}
