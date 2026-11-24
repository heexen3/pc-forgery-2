package cl.pcforgery.comunidad.controller;

import cl.pcforgery.comunidad.dto.NoticiaRequest;
import cl.pcforgery.comunidad.model.Noticia;
import cl.pcforgery.comunidad.service.NoticiaService;
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
@RequestMapping("/noticias")
@Tag(name = "Noticias", description = "GET público; crear/editar/borrar solo ADMIN")
public class NoticiaController {

    private final NoticiaService noticiaService;

    public NoticiaController(NoticiaService noticiaService) {
        this.noticiaService = noticiaService;
    }

    @GetMapping
    @Operation(summary = "Listar noticias (más recientes primero)")
    public List<Noticia> listar() {
        return noticiaService.listar();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener una noticia")
    public Noticia obtener(@PathVariable Long id) {
        return noticiaService.obtener(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Publicar noticia (ADMIN)")
    public Noticia crear(@Valid @RequestBody NoticiaRequest req) {
        return noticiaService.crear(req);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Editar noticia (ADMIN)")
    public Noticia actualizar(@PathVariable Long id, @Valid @RequestBody NoticiaRequest req) {
        return noticiaService.actualizar(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Eliminar noticia (ADMIN)")
    public void eliminar(@PathVariable Long id) {
        noticiaService.eliminar(id);
    }
}
