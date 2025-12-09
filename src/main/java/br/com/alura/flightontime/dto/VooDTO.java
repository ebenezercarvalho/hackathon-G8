package br.com.alura.flightontime.dto;

import java.time.LocalDateTime;

public record VooDTO (
        String companhia,
        String origem,
        String destino,
        LocalDateTime dataPartida,
        Double distancia) {
}
