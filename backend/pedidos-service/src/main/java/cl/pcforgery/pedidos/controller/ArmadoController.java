package cl.pcforgery.pedidos.controller;

import cl.pcforgery.pedidos.dto.ArmadoRequest;
import cl.pcforgery.pedidos.dto.ArmadoResponse;
import cl.pcforgery.pedidos.security.UsuarioContexto;
import cl.pcforgery.pedidos.service.ArmadoService;
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
@RequestMapping("/armados")
@Tag(name = "Armados guardados", description = "Configuraciones de Arma tu PC del usuario (requiere sesión)")
public class ArmadoController {

    private final ArmadoService armadoService;

    public ArmadoController(ArmadoService armadoService) {
        this.armadoService = armadoService;
    }

    @GetMapping
    @Operation(summary = "Mis armados guardados")
    public List<ArmadoResponse> listar(UsuarioContexto usuario) {
        return armadoService.listar(usuario);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un armado propio")
    public ArmadoResponse obtener(UsuarioContexto usuario, @PathVariable Long id) {
        return armadoService.obtener(usuario, id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Guardar armado (reemplaza si ya existe uno con el mismo nombre)")
    public ArmadoResponse guardar(UsuarioContexto usuario, @Valid @RequestBody ArmadoRequest req) {
        return armadoService.guardar(usuario, req);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Editar un armado propio (ej. cambiar el nombre)")
    public ArmadoResponse actualizar(UsuarioContexto usuario, @PathVariable Long id, @Valid @RequestBody ArmadoRequest req) {
        return armadoService.actualizar(usuario, id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Eliminar un armado propio")
    public void eliminar(UsuarioContexto usuario, @PathVariable Long id) {
        armadoService.eliminar(usuario, id);
    }
}
