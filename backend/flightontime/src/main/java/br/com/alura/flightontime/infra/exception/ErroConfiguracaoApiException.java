package br.com.alura.flightontime.infra.exception;

public class ErroConfiguracaoApiException extends RuntimeException{
    public ErroConfiguracaoApiException(String message) {
        super(message);
    }
}
