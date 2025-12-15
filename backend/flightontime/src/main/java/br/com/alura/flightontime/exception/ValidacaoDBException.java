package br.com.alura.flightontime.exception;

import java.util.List;

public class ValidacaoDBException extends RuntimeException {

    private final List<String> listaErros;

    public ValidacaoDBException(List<String> listaErros) {
        this.listaErros = listaErros;
    }

    public List<String> getErros() {
        return listaErros;
    }
}