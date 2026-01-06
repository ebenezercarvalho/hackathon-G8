package br.com.alura.flightontime.dto.response;

import com.fasterxml.jackson.annotation.JsonAlias;
import java.math.BigDecimal;
import java.math.RoundingMode;

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
}
