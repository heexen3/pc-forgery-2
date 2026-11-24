package cl.pcforgery.productos.controller;

import cl.pcforgery.productos.dto.ComponenteDto;
import cl.pcforgery.productos.service.ComponenteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/componentes")
@Tag(name = "Componentes (Arma tu PC)", description = "Piezas del asistente (GET público; cambios solo ADMIN)")
public class ComponenteController {

    private final ComponenteService componenteService;

    public ComponenteController(ComponenteService componenteService) {
        this.componenteService = componenteService;
    }

    @GetMapping
    @Operation(summary = "Listar componentes (filtro opcional por tipo)")
    public List<ComponenteDto> listar(@RequestParam(required = false) String tipo) {
        return componenteService.listar(tipo);
    }

    @GetMapping("/agrupados")
    @Operation(summary = "Componentes agrupados por tipo (mismo formato que DB_COMPONENTES del frontend)")
    public Map<String, List<ComponenteDto>> agrupados() {
        return componenteService.agrupados();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un componente")
    public ComponenteDto obtener(@PathVariable String id) {
        return componenteService.obtener(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Crear componente (ADMIN)")
    public ComponenteDto crear(@Valid @RequestBody ComponenteDto dto) {
        return componenteService.crear(dto);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Editar componente (ADMIN)")
    public ComponenteDto actualizar(@PathVariable String id, @Valid @RequestBody ComponenteDto dto) {
        return componenteService.actualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Eliminar componente (ADMIN)")
    public void eliminar(@PathVariable String id) {
        componenteService.eliminar(id);
    }
}
