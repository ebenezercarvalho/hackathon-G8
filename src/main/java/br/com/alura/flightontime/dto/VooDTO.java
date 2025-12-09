package br.com.alura.flightontime.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;

public record VooDTO (
        @NotBlank(message = "O nome da companhia aérea é obrigatório.")
        String companhia,

        @NotBlank(message = "A origem do vôo é obrigatória.")
        String origem,

        @NotBlank(message = "O destino do vôo é obrigatório.")
        String destino,

        @NotNull(message = "A data de partida é obrigatória.")
        LocalDateTime dataPartida,

        @NotNull(message = "A distância é obrigatória.")
        @Positive(message = "A distância deve ser maior que 0.")
        Double distancia) {
}
