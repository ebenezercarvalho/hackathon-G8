package br.com.alura.flightontime.dto;

import br.com.alura.flightontime.infra.exception.RespostaInvalidaServicoExternoException;
import br.com.alura.flightontime.model.StatusPrevisao;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

public record RespostaPrevisaoDTO (
        @JsonProperty("previsao")
        @Schema(description = "Previsão do status do voo", example = "Atrasado", allowableValues = {"Atrasado", "No horário"})
        StatusPrevisao previsao,

        @JsonProperty("probabilidade_atraso")
        @Schema(description = "Probabilidade do vôo partir atrasado", example = "0.22")
        Double probabilidadeAtraso,

        @JsonProperty("timestamp")
        @Schema(description = "Data e hora que a resposta foi processada", example = "2025-12-22T02:43:59.078Z")
        Timestamp timestamp) {

    public RespostaPrevisaoDTO {
        if (probabilidadeAtraso != null) {
            probabilidadeAtraso = BigDecimal.valueOf(probabilidadeAtraso)
                    .setScale(2, RoundingMode.HALF_UP)
                    .doubleValue();
        }
    }

    public void validacao() throws RespostaInvalidaServicoExternoException {
        List<String> erros = new ArrayList<>();

        if (previsao == null) erros.add("Campo previsao inválido");
        if (probabilidadeAtraso == null) erros.add("Campo probabilidadeAtraso inválido");
        if (timestamp == null) erros.add("Campo timestamp inválido");

        if (!erros.isEmpty()) {
            throw new RespostaInvalidaServicoExternoException("Resposta inválida do serviço de previsão");
        }
    }
}
