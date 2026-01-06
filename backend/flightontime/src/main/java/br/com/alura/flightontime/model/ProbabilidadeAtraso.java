package br.com.alura.flightontime.model;

import com.fasterxml.jackson.annotation.JsonValue;

public enum ProbabilidadeAtraso {
    MUITO_ALTA("Muito alta"),
    ALTA("Alta"),
    MEDIA("Média"),
    BAIXA("Baixa"),
    MUITO_BAIXA("Muito baixa");

    private final String descricao;

    ProbabilidadeAtraso(String descricao) {
        this.descricao = descricao;
    }

    @JsonValue
    public String getDescricao() {
        return descricao;
    }
}
