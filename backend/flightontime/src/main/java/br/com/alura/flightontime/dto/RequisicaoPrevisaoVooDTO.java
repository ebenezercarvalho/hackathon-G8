package br.com.alura.flightontime.dto;

import br.com.alura.flightontime.model.PeriodoDia;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;

@Schema(description = "Dados que serão enviados ao endpoint do modelo de previsão de atrasos.")
public record RequisicaoPrevisaoVooDTO(
        @JsonProperty("aerodromo_origem")
        @Schema(description = "Código ICAO do aeroporto de origem", example = "SBGR")
        @Size(min = 4, max = 4)
        String origem,

        @JsonProperty("aerodromo_destino")
        @Schema(description = "Código ICAO do aeroporto de destino", example = "SBGL")
        @Size(min = 4, max = 4)
        String destino,

        @JsonProperty("empresa")
        @Schema(description = "Código ICAO da companhia aérea", example = "GLO")
        @Size(min = 3, max = 3)
        String companhiaAerea,

        @JsonProperty("periodo_dia")
        @Schema(description = "Período do dia com base na hora prevista de partida", example = "Tarde")
        PeriodoDia periodoDia,

        @JsonProperty("partida_hora")
        @Schema(description = "Hora prevista para partida", example = "14")
        @Size(max = 23)
        Integer partidaHora,

        @JsonProperty("partida_dia_semana")
        @Schema(description = "Dia da semana com base na data prevista para partida. Retorna valores de 0 a 6, sendo 0 para Segunda e 6 para Domingo", example = "4")
        @Size(max = 6)
        Integer partidaDiaDaSemana,

        @JsonProperty("partida_mes")
        @Schema(description = "Mês do ano com base na data prevista para partida", example = "12")
        @Size(min = 1, max = 12)
        Integer partidaMes){
}
