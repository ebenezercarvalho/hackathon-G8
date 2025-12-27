package br.com.alura.flightontime.dto;

import lombok.Getter;
import lombok.Setter;
// Opcional, mas recomendado para criar objetos facilmente
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Getter
@Setter
@AllArgsConstructor // Construtor com todos os campos (previsao e probabilidade)
@NoArgsConstructor // Construtor vazio (necessário para o Spring/JSON)
public class PrevisaoResponseDTO {

    private String previsao; // Ex: "Pontual" ou "Atrasado"
    private double probabilidade; // Valor decimal entre 0.0 e 1.0

}