package br.com.alura.flightontime.dto.response;

import br.com.alura.flightontime.infra.exception.RespostaInvalidaServicoExternoException;
import com.fasterxml.jackson.annotation.JsonAlias;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

public record ResponsePrevisaoDataScienceDTO(
        @JsonAlias("probabilidade_atraso") 
        Double probabilidadeAtraso) {

    public ResponsePrevisaoDataScienceDTO {
        if (probabilidadeAtraso != null) {
            probabilidadeAtraso = BigDecimal.valueOf(probabilidadeAtraso)
                    .setScale(2, RoundingMode.HALF_UP)
                    .doubleValue();
        }
    }

    public void validacao() throws RespostaInvalidaServicoExternoException {
        List<String> erros = new ArrayList<>();

        if (probabilidadeAtraso == null || probabilidadeAtraso < 0 || probabilidadeAtraso > 1)
            erros.add("Campo probabilidadeAtraso inválido");

        if (!erros.isEmpty()) {
            throw new RespostaInvalidaServicoExternoException("Resposta inválida do serviço de previsão");
        }
    }
}
