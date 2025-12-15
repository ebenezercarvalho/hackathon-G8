package br.com.alura.flightontime.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record RequisicaoPrevisaoVooDTO(
        @JsonProperty("aerodromo_origem")
        String origem,

        @JsonProperty("aerodromo_destino")
        String destino,

        @JsonProperty("empresa")
        String companhiaAerea,

        @JsonProperty("periodo_dia")
        String periodoDia,

        @JsonProperty("partida_hora")
        int partidaHora,

        @JsonProperty("partida_dia_semana")
        int partidaDiaDaSemana,

        @JsonProperty("partida_mes")
        int partidaMes){
}
