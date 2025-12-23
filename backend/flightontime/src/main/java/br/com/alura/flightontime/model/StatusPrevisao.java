package br.com.alura.flightontime.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum StatusPrevisao {
    ATRASADO("Atrasado"),
    PONTUAL("Pontual");

    private final String descricao;

    StatusPrevisao(String descricao) {
        this.descricao = descricao;
    }

    @JsonValue
    public String getDescricao() {
        return descricao;
    }

    @JsonCreator
    public static StatusPrevisao fromString(String previsao) {
        if (previsao == null) return null;
        if (previsao.equalsIgnoreCase("Atrasado")) return ATRASADO;
        else if (previsao.equalsIgnoreCase("Pontual")) return PONTUAL;
        return null;

    }
}
