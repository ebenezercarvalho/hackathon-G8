package br.com.alura.flightontime.dto;

import lombok.Getter;
import lombok.Setter;

// Lombok: Gera os métodos getter e setter para todos os campos.
@Getter
@Setter
public class VooDTO {

        // Características do Voo para Predição

        private String mes;
        private String diaDaSemana;
        private String companhiaAerea;
        private String aeroportoOrigem;
        private String aeroportoDestino;
        private String horaPartida; // Ex: "08:30"
        private int distancia;

        // Você pode adicionar um método toString() para facilitar o log, se desejar.
        @Override
        public String toString() {
                return "VooDTO{" +
                        "mes='" + mes + '\'' +
                        ", companhiaAerea='" + companhiaAerea + '\'' +
                        ", aeroportoOrigem='" + aeroportoOrigem + '\'' +
                        '}';
        }
}