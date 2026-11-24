package cl.pcforgery.productos.service;

import cl.pcforgery.productos.dto.ComponenteDto;
import cl.pcforgery.productos.exception.NegocioException;
import cl.pcforgery.productos.exception.RecursoNoEncontradoException;
import cl.pcforgery.productos.model.Componente;
import cl.pcforgery.productos.repository.ComponenteRepository;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Componentes del asistente Arma tu PC. */
@Service
public class ComponenteService {

    private static final List<String> ORDEN_TIPOS =
            List.of("procesadores", "placas", "ram", "gpu", "almacenamiento", "fuentes", "gabinetes");

    private final ComponenteRepository componentes;

    public ComponenteService(ComponenteRepository componentes) {
        this.componentes = componentes;
    }

    @Transactional(readOnly = true)
    public List<ComponenteDto> listar(String tipo) {
        List<Componente> lista = tipo == null || tipo.isBlank()
                ? componentes.findAll() : componentes.findByTipoOrderByPrecioAsc(tipo);
        return lista.stream()
                .sorted(Comparator.comparingInt((Componente c) -> ORDEN_TIPOS.indexOf(c.getTipo()))
                        .thenComparing(Componente::getPrecio))
                .map(ComponenteDto::de)
                .toList();
    }

    /** Mismo formato que DB_COMPONENTES del frontend: { procesadores: [...], placas: [...], ... }. */
    @Transactional(readOnly = true)
    public Map<String, List<ComponenteDto>> agrupados() {
        return listar(null).stream().collect(Collectors.groupingBy(ComponenteDto::getTipo,
                java.util.LinkedHashMap::new, Collectors.toList()));
    }

    @Transactional(readOnly = true)
    public ComponenteDto obtener(String id) {
        return ComponenteDto.de(buscar(id));
    }

    @Transactional
    public ComponenteDto crear(ComponenteDto dto) {
        if (componentes.existsById(dto.getId())) {
            throw new NegocioException(HttpStatus.CONFLICT, "Ya existe un componente con id " + dto.getId() + ".");
        }
        return ComponenteDto.de(componentes.save(dto.aEntidad()));
    }

    @Transactional
    public ComponenteDto actualizar(String id, ComponenteDto dto) {
        buscar(id);
        dto.setId(id);
        return ComponenteDto.de(componentes.save(dto.aEntidad()));
    }

    @Transactional
    public void eliminar(String id) {
        componentes.delete(buscar(id));
    }

    private Componente buscar(String id) {
        return componentes.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Componente " + id + " no encontrado."));
    }
}
