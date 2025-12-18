package br.com.alura.flightontime.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Dados que serão enviados ao endpoint do modelo de previsão de atrasos.")
public record RequisicaoPrevisaoVooDTO(
        @JsonProperty("aerodromo_origem")
        @Schema(description = "Código ICAO do aeroporto de origem", example = "SBGR")
        String origem,

        @JsonProperty("aerodromo_destino")
        @Schema(description = "Código ICAO do aeroporto de destino", example = "SBGL")
        String destino,

        @JsonProperty("empresa")
        @Schema(description = "Código ICAO da companhia aérea", example = "GLO")
        String companhiaAerea,

        @JsonProperty("periodo_dia")
        @Schema(description = "Período do dia com base na hora prevista de partida", example = "Tarde")
        String periodoDia,

        @JsonProperty("partida_hora")
        @Schema(description = "Hora prevista para partida", example = "14")
        int partidaHora,

        @JsonProperty("partida_dia_semana")
        @Schema(description = "Dia da semana com base na data prevista para partida. Retorna valores de 1 a 7, sendo 1 para Segunda e 7 para Domingo", example = "4")
        int partidaDiaDaSemana,

        @JsonProperty("partida_mes")
        @Schema(description = "Mês do ano com base na data prevista para partida", example = "12")
        int partidaMes){
}
