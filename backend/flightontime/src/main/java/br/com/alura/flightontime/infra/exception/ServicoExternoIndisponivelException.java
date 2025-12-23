package br.com.alura.flightontime.infra.exception;

public class ServicoExternoIndisponivelException extends RuntimeException {
    public ServicoExternoIndisponivelException(String message, Throwable cause ) {
        super(message, cause);
    }
}
