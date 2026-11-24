package cl.pcforgery.productos.model;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.util.LinkedHashMap;
import java.util.Map;

/** Guarda un Map como texto JSON en una sola columna. */
@Converter
public class MapaJsonConverter implements AttributeConverter<Map<String, Object>, String> {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(Map<String, Object> mapa) {
        try {
            return MAPPER.writeValueAsString(mapa == null ? Map.of() : mapa);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("No se pudo convertir a JSON", e);
        }
    }

    @Override
    public Map<String, Object> convertToEntityAttribute(String json) {
        if (json == null || json.isBlank()) {
            return new LinkedHashMap<>();
        }
        try {
            return MAPPER.readValue(json, new TypeReference<LinkedHashMap<String, Object>>() { });
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("JSON inválido en la base de datos", e);
        }
    }
}
