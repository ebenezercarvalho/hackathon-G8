package br.com.alura.flightontime.model;

import com.fasterxml.jackson.annotation.JsonValue;

public enum PeriodoDia {
    MANHA("Manhã"),
    TARDE("Tarde"),
    NOITE("Noite"),
    MADRUGADA("Madrugada");

    private final String periodo;

    PeriodoDia(String periodo) {
        this.periodo = periodo;
    }

    @JsonValue
    public String getPeriodo() {
        return periodo;
    }

    public static PeriodoDia retornaPeriodo(int hora) {
        if (hora >= 0 && hora < 6) return MADRUGADA;
        if (hora >= 6 && hora < 12) return MANHA;
        if (hora >= 12 && hora < 18) return TARDE;
        return NOITE;
    }
}
