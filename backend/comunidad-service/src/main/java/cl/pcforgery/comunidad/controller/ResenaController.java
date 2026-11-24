package cl.pcforgery.comunidad.controller;

import cl.pcforgery.comunidad.dto.ResenaRequest;
import cl.pcforgery.comunidad.model.Resena;
import cl.pcforgery.comunidad.security.UsuarioContexto;
import cl.pcforgery.comunidad.service.ResenaService;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/resenas")
@Tag(name = "Reseñas", description = "Reseñas de productos (GET público; publicar requiere sesión)")
public class ResenaController {

    private final ResenaService resenaService;

    public ResenaController(ResenaService resenaService) {
        this.resenaService = resenaService;
    }

    @GetMapping
    @Operation(summary = "Listar reseñas (filtro opcional productoId)")
    public List<Resena> listar(@RequestParam(required = false) Long productoId) {
        return resenaService.listar(productoId);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener una reseña")
    public Resena obtener(@PathVariable Long id) {
        return resenaService.obtener(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Publicar reseña (si ya opinaste sobre ese producto, se actualiza)")
    public Resena publicar(UsuarioContexto usuario, @Valid @RequestBody ResenaRequest req) {
        return resenaService.publicar(usuario, req);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Editar reseña (autor o ADMIN)")
    public Resena actualizar(UsuarioContexto usuario, @PathVariable Long id, @Valid @RequestBody ResenaRequest req) {
        return resenaService.actualizar(usuario, id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Eliminar reseña (autor o ADMIN)")
    public void eliminar(UsuarioContexto usuario, @PathVariable Long id) {
        resenaService.eliminar(usuario, id);
    }
}
