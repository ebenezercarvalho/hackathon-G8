package br.com.alura.flightontime.dto.response;

import br.com.alura.flightontime.model.ProbabilidadeAtraso;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;

@Schema(description = "Representa a resposta da previsão de atraso")
public record ResponsePrevisaoDTO(
        @Schema(description = "Probabilidade do vôo partir atrasado", example = "Alta") 
        ProbabilidadeAtraso probabilidadeAtraso, 

        @Schema(description = "Probabilidade do vôo partir atrasado em porcentagem", example = "0.22")
        @Size(min = 0, max = 1)
        Double probabilidadeAtrasoPercentual) {
}
