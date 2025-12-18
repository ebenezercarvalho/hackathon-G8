package br.com.alura.flightontime.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;

@Schema(description = "Resposta à solicitação de busca autocomplete de companhia aérea.")
public record AutoCompleteCompanhiaAereaDTO(
        @Schema(description = "Nome da companhia aérea", example = "Gol Transportes Aéreos")
        String nome,

        @Schema(description = "Código IATA da companhia aérea", example = "G3")
        @Size(min = 2, max = 2, message = "O código IATA da companhia aérea possui 2 caracteres.")
        String codigoIata,

        @Schema(description = "Código ICAO da companhia aérea", example = "GLO")
        @Size(min = 3, max = 3, message = "O código ICAO da companhia aérea possui 3 caracteres.")
        String codigoIcao) {
}
