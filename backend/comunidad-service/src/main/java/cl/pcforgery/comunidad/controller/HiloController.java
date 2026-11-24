package cl.pcforgery.comunidad.controller;

import cl.pcforgery.comunidad.dto.HiloRequest;
import cl.pcforgery.comunidad.dto.RespuestaRequest;
import cl.pcforgery.comunidad.model.Hilo;
import cl.pcforgery.comunidad.security.UsuarioContexto;
import cl.pcforgery.comunidad.service.HiloService;
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
@RequestMapping("/hilos")
@Tag(name = "Hilos (foro)", description = "GET público; publicar/responder requiere sesión; editar/borrar autor o ADMIN")
public class HiloController {

    private final HiloService hiloService;

    public HiloController(HiloService hiloService) {
        this.hiloService = hiloService;
    }

    @GetMapping
    @Operation(summary = "Listar hilos (más activos primero; filtro opcional por categoría)")
    public List<Hilo> listar(@RequestParam(required = false) String categoria) {
        return hiloService.listar(categoria);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un hilo con sus respuestas")
    public Hilo obtener(@PathVariable String id) {
        return hiloService.obtener(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Publicar un hilo nuevo")
    public Hilo crear(UsuarioContexto usuario, @Valid @RequestBody HiloRequest req) {
        return hiloService.crear(usuario, req);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Editar un hilo (autor o ADMIN)")
    public Hilo actualizar(UsuarioContexto usuario, @PathVariable String id, @Valid @RequestBody HiloRequest req) {
        return hiloService.actualizar(usuario, id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Eliminar un hilo (autor o ADMIN)")
    public void eliminar(UsuarioContexto usuario, @PathVariable String id) {
        hiloService.eliminar(usuario, id);
    }

    @PostMapping("/{id}/respuestas")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Responder un hilo (devuelve el hilo actualizado)")
    public Hilo responder(UsuarioContexto usuario, @PathVariable String id, @Valid @RequestBody RespuestaRequest req) {
        return hiloService.responder(usuario, id, req);
    }

    @DeleteMapping("/{id}/respuestas/{respuestaId}")
    @Operation(summary = "Eliminar una respuesta (autor o ADMIN)")
    public Hilo eliminarRespuesta(UsuarioContexto usuario, @PathVariable String id, @PathVariable String respuestaId) {
        return hiloService.eliminarRespuesta(usuario, id, respuestaId);
    }
}
