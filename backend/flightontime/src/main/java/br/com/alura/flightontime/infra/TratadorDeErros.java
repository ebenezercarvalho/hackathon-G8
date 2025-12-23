package br.com.alura.flightontime.infra;

import br.com.alura.flightontime.infra.exception.ErroConfiguracaoApiException;
import br.com.alura.flightontime.infra.exception.RespostaInvalidaServicoExternoException;
import br.com.alura.flightontime.infra.exception.ServicoExternoIndisponivelException;
import br.com.alura.flightontime.infra.exception.ValidacaoDBException;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.List;
import java.util.stream.Collectors;

@ControllerAdvice
public class TratadorDeErros extends ResponseEntityExceptionHandler {

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {

        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .collect(Collectors.toList());

        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST); // 400
    }

    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(
            HttpMessageNotReadableException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request) {

        String mensagemErro = "Formato inválido ou campos com valores incorretos.";

        return new ResponseEntity<>(List.of(mensagemErro), HttpStatus.BAD_REQUEST); // 400
    }

    @ExceptionHandler(ValidacaoDBException.class)
    public ResponseEntity<List<String>> handleValidacaoDB(ValidacaoDBException ex) {
        List<String> erros = ex.getErros();
        return new ResponseEntity<>(erros, HttpStatus.BAD_REQUEST); // 400
    }

    @ExceptionHandler(ServicoExternoIndisponivelException.class)
    public ResponseEntity<String> handleServicoExterno(
            ServicoExternoIndisponivelException ex) {

        return ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE) // 503
                .body(ex.getMessage());
    }

    @ExceptionHandler(RespostaInvalidaServicoExternoException.class)
    public ResponseEntity<String> handleRespostaInvalida(
            RespostaInvalidaServicoExternoException ex) {

        return ResponseEntity
                .status(HttpStatus.BAD_GATEWAY) // 502
                .body(ex.getMessage());
    }


    @ExceptionHandler(ErroConfiguracaoApiException.class)
    public ResponseEntity<String> handleErroConfiguracaoApi(ErroConfiguracaoApiException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
    }



}
