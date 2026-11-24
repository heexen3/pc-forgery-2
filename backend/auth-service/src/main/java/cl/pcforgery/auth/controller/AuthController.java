package cl.pcforgery.auth.controller;

import cl.pcforgery.auth.dto.LoginRequest;
import cl.pcforgery.auth.dto.PerfilRequest;
import cl.pcforgery.auth.dto.RefreshRequest;
import cl.pcforgery.auth.dto.RegistroRequest;
import cl.pcforgery.auth.dto.TokenResponse;
import cl.pcforgery.auth.dto.UsuarioResponse;
import cl.pcforgery.auth.security.UsuarioContexto;
import cl.pcforgery.auth.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@Tag(name = "Autenticación", description = "Registro, login, renovación de token y perfil propio")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Registrar un cliente nuevo (rol CLIENTE)")
    public UsuarioResponse registrar(@Valid @RequestBody RegistroRequest req) {
        return authService.registrar(req);
    }

    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión con correo o usuario; entrega access token (JWT) y refresh token")
    public TokenResponse login(@Valid @RequestBody LoginRequest req) {
        return authService.login(req);
    }

    @PostMapping("/refresh")
    @Operation(summary = "Renovar la sesión con el refresh token (rota el refresh token)")
    public TokenResponse refrescar(@Valid @RequestBody RefreshRequest req) {
        return authService.refrescar(req.refreshToken());
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Cerrar sesión (revoca el refresh token)")
    public void logout(@Valid @RequestBody RefreshRequest req) {
        authService.logout(req.refreshToken());
    }

    @GetMapping("/me")
    @Operation(summary = "Perfil del usuario autenticado")
    public UsuarioResponse perfil(@Parameter(hidden = true) @RequestHeader(UsuarioContexto.H_ID) Long id) {
        return authService.perfil(id);
    }

    @PutMapping("/me")
    @Operation(summary = "Actualizar el perfil propio (nombre, usuario, descripción, foto)")
    public UsuarioResponse actualizarPerfil(@Parameter(hidden = true) @RequestHeader(UsuarioContexto.H_ID) Long id,
                                            @Valid @RequestBody PerfilRequest req) {
        return authService.actualizarPerfil(id, req);
    }
}
