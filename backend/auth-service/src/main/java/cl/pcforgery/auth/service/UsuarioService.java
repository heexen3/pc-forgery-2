package cl.pcforgery.auth.service;

import cl.pcforgery.auth.dto.UsuarioRequest;
import cl.pcforgery.auth.dto.UsuarioResponse;
import cl.pcforgery.auth.exception.NegocioException;
import cl.pcforgery.auth.exception.RecursoNoEncontradoException;
import cl.pcforgery.auth.model.Rol;
import cl.pcforgery.auth.model.Usuario;
import cl.pcforgery.auth.repository.RefreshTokenRepository;
import cl.pcforgery.auth.repository.UsuarioRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** CRUD de usuarios para el panel de administración (solo rol ADMIN, lo exige el gateway). */
@Service
public class UsuarioService {

    private final UsuarioRepository usuarios;
    private final RefreshTokenRepository refreshTokens;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarios, RefreshTokenRepository refreshTokens,
                          PasswordEncoder passwordEncoder) {
        this.usuarios = usuarios;
        this.refreshTokens = refreshTokens;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<UsuarioResponse> listar() {
        return usuarios.findAll().stream().map(UsuarioResponse::de).toList();
    }

    @Transactional(readOnly = true)
    public UsuarioResponse obtener(Long id) {
        return UsuarioResponse.de(buscar(id));
    }

    @Transactional
    public UsuarioResponse crear(UsuarioRequest req) {
        if (req.password() == null || req.password().isBlank()) {
            throw new NegocioException(HttpStatus.BAD_REQUEST, "La contraseña es obligatoria.");
        }
        String usuario = nombreUsuario(req);
        if (usuarios.existsByEmailIgnoreCase(req.email().trim())) {
            throw new NegocioException(HttpStatus.CONFLICT, "Ya existe un usuario registrado con ese correo.");
        }
        if (usuarios.existsByUsuarioIgnoreCase(usuario)) {
            throw new NegocioException(HttpStatus.CONFLICT, "El nombre de usuario ya está registrado.");
        }
        Usuario nuevo = Usuario.builder()
                .nombre(req.nombre().trim())
                .usuario(usuario)
                .email(req.email().trim().toLowerCase())
                .passwordHash(passwordEncoder.encode(req.password()))
                .rol(convertirRol(req.rol()))
                .activo(req.activo() == null || req.activo())
                .build();
        return UsuarioResponse.de(usuarios.save(nuevo));
    }

    @Transactional
    public UsuarioResponse actualizar(Long id, UsuarioRequest req) {
        Usuario existente = buscar(id);
        String email = req.email().trim().toLowerCase();
        if (!email.equalsIgnoreCase(existente.getEmail()) && usuarios.existsByEmailIgnoreCase(email)) {
            throw new NegocioException(HttpStatus.CONFLICT, "Ya existe un usuario registrado con ese correo.");
        }
        String usuario = nombreUsuario(req);
        if (!usuario.equalsIgnoreCase(existente.getUsuario()) && usuarios.existsByUsuarioIgnoreCase(usuario)) {
            throw new NegocioException(HttpStatus.CONFLICT, "El nombre de usuario ya está registrado.");
        }
        existente.setNombre(req.nombre().trim());
        existente.setUsuario(usuario);
        existente.setEmail(email);
        if (req.rol() != null) {
            existente.setRol(convertirRol(req.rol()));
        }
        if (req.activo() != null) {
            existente.setActivo(req.activo());
        }
        if (req.password() != null && !req.password().isBlank()) {
            existente.setPasswordHash(passwordEncoder.encode(req.password()));
        }
        return UsuarioResponse.de(usuarios.save(existente));
    }

    @Transactional
    public void eliminar(Long id) {
        Usuario existente = buscar(id);
        refreshTokens.deleteByUsuario(existente);
        usuarios.delete(existente);
    }

    /** Acepta los nombres del backend (ADMIN/CLIENTE) y los del frontend (admin/usuario). */
    public static Rol convertirRol(String rol) {
        if (rol == null || rol.isBlank()) {
            return Rol.CLIENTE;
        }
        return "admin".equalsIgnoreCase(rol) ? Rol.ADMIN : Rol.CLIENTE;
    }

    private static String nombreUsuario(UsuarioRequest req) {
        String usuario = req.usuario() == null || req.usuario().isBlank() ? req.nombre() : req.usuario();
        return usuario.trim();
    }

    private Usuario buscar(Long id) {
        return usuarios.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado."));
    }
}
