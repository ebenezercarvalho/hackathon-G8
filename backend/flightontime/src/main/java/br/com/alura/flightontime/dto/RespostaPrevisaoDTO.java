package br.com.alura.flightontime.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.sql.Timestamp;

public record RespostaPrevisaoDTO (
        @JsonProperty("previsao")
        String previsao,

        @JsonProperty("probabilidade_atraso")
        Double probabilidadeAtraso,

        @JsonProperty("timestamp")
        Timestamp timestamp) {
}
