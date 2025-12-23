package br.com.alura.flightontime.infra.exception;


public class RespostaInvalidaServicoExternoException extends RuntimeException {
    public RespostaInvalidaServicoExternoException(String message) {
        super(message);
    }
}
