package br.com.alura.flightontime.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;

@Schema(description = "Resposta à solicitação de busca autocomplete de aeroporto.")
public record AutoCompleteAeroportoDTO (
        @Schema(description = "Nome do aeroporto", example = "Guarulhos - Governador Andre Franco Montoro International Airport")
        String nome,

        @Schema(description = "Código IATA do aeroporto", example = "GRU")
        @Size(min = 3, max = 3, message = "O código IATA do aeroporto possui 3 caracteres.")
        String codigoIata,

        @Schema(description = "Código ICAO do aeroporto", example = "SBGR")
        @Size(min = 4, max = 4, message = "O código ICAO do aeroporto possui 4 caracteres.")
        String codigoIcao,

        @Schema(description = "Latitude da localização do aeroporto", example = "-23.4355564117")
        Double latitude,

        @Schema(description = "Longitude da localização do aeroporto", example = "-46.4730567932")
        Double longitude) {
}
