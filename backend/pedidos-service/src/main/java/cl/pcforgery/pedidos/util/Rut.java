package cl.pcforgery.pedidos.util;

/** Validación del RUT chileno (módulo 11), igual que src/components/carrito/Rut.js. */
public final class Rut {

    private Rut() {
    }

    public static String limpiar(String rut) {
        return rut == null ? "" : rut.replaceAll("[^0-9kK]", "").toUpperCase();
    }

    public static String calcularDv(String cuerpo) {
        int suma = 0;
        int multiplicador = 2;
        for (int i = cuerpo.length() - 1; i >= 0; i--) {
            suma += Character.getNumericValue(cuerpo.charAt(i)) * multiplicador;
            multiplicador = multiplicador == 7 ? 2 : multiplicador + 1;
        }
        int resto = 11 - (suma % 11);
        if (resto == 11) {
            return "0";
        }
        if (resto == 10) {
            return "K";
        }
        return String.valueOf(resto);
    }

    public static boolean esValido(String rut) {
        String limpio = limpiar(rut);
        if (!limpio.matches("^\\d{7,8}[0-9K]$")) {
            return false;
        }
        return calcularDv(limpio.substring(0, limpio.length() - 1)).equals(limpio.substring(limpio.length() - 1));
    }

    /** "123456785" -> "12.345.678-5". */
    public static String formatear(String rut) {
        String limpio = limpiar(rut);
        if (limpio.length() < 2) {
            return limpio;
        }
        String cuerpo = limpio.substring(0, limpio.length() - 1).replaceAll("\\B(?=(\\d{3})+(?!\\d))", ".");
        return cuerpo + "-" + limpio.substring(limpio.length() - 1);
    }
}
