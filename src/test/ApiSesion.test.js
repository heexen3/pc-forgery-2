import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { guardarSesion, haySesion, obtenerSesion, peticion } from "../utils/api.js"

// Respuesta falsa de fetch (no se necesita el backend encendido)
function respuestaFalsa(status, cuerpo) {
    return { ok: status >= 200 && status < 300, status, json: async () => cuerpo }
}

describe("Sesión JWT del frontend (utils/api.js)", () => {
    beforeEach(() => localStorage.clear())
    afterEach(() => vi.unstubAllGlobals())

    it("guarda access y refresh token en localStorage para que la sesión sobreviva a recargar", () => {
        guardarSesion({
            accessToken: "access-1",
            refreshToken: "refresh-1",
            expiraEn: 900,
            usuario: { id: 2, usuario: "cliente", email: "cliente@duocuc.cl", rol: "CLIENTE" }
        })

        expect(obtenerSesion().accessToken).toBe("access-1")
        expect(haySesion()).toBe(true)
        const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"))
        expect(usuarioActual.rol).toBe("usuario")
        expect(usuarioActual.correo).toBe("cliente@duocuc.cl")
    })

    it("si el gateway responde 401 renueva el token con /auth/refresh y reintenta la petición", async () => {
        guardarSesion({ accessToken: "vencido", refreshToken: "refresh-1", expiraEn: 1 })
        const fetchFalso = vi.fn()
            .mockResolvedValueOnce(respuestaFalsa(401, { mensaje: "Token expirado" }))
            .mockResolvedValueOnce(respuestaFalsa(200, { accessToken: "nuevo", refreshToken: "refresh-2", expiraEn: 900 }))
            .mockResolvedValueOnce(respuestaFalsa(200, [{ id: 1 }]))
        vi.stubGlobal("fetch", fetchFalso)

        const datos = await peticion("/pedidos/mios")

        expect(datos).toEqual([{ id: 1 }])
        expect(fetchFalso.mock.calls[1][0]).toMatch(/\/api\/auth\/refresh$/)
        expect(fetchFalso.mock.calls[2][1].headers.Authorization).toBe("Bearer nuevo")
        expect(obtenerSesion().refreshToken).toBe("refresh-2")
    })
})
