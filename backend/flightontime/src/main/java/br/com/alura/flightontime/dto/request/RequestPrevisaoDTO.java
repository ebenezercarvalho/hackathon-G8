package br.com.alura.flightontime.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

@Schema(description = "Parâmetros necessários para realizar a previsão de atraso de um voo.")
public record RequestPrevisaoDTO(
        @Schema(description = "Código ICAO da companhia aérea", example = "GLO") 
        @NotBlank(message = "Companhia aérea é obrigatória.") 
        @Size(min = 3, max = 3, message = "O código ICAO da companhia aérea deve possuir 3 caracteres.") 
        String codigoIcaoCompanhiaAerea,

        @Schema(description = "Código ICAO do aeroporto de origem", example = "SBGR") 
        @NotBlank(message = "Origem do vôo é obrigatória.") 
        @Size(min = 4, max = 4, message = "O código ICAO do aeroporto de origem deve possuir 4 caracteres.") 
        String codigoIcaoVooOrigem,

        @Schema(description = "Código ICAO do aeroporto de destino", example = "SBGL") 
        @NotBlank(message = "Destino do vôo é obrigatório.") 
        @Size(min = 4, max = 4, message = "O código ICAO do aeroporto de destino deve possuir 4 caracteres.") 
        String codigoIcaoVooDestino,

        @Schema(description = "Data e hora prevista para a partida. Deve ser uma data futura.", example = "2025-12-25T14:30:00") 
        @NotNull(message = "Data de partida é obrigatória.") 
        @Future(message = "A data de partida deve ser uma data futura.")
        LocalDateTime dataPartida) {
}
