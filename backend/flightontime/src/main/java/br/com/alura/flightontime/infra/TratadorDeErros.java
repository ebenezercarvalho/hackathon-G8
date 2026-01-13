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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.stream.Collectors;

@ControllerAdvice
public class TratadorDeErros extends ResponseEntityExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(TratadorDeErros.class);

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
    public ResponseEntity<String> handleServicoExterno(ServicoExternoIndisponivelException ex) {       
        logger.error("Serviço externo indisponível: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE) // 503
                .body("O serviço de previsão está temporariamente indisponível. Por favor, tente novamente em alguns instantes.");
    }

    @ExceptionHandler(RespostaInvalidaServicoExternoException.class)
    public ResponseEntity<String> handleRespostaInvalida(RespostaInvalidaServicoExternoException ex) {
        logger.error("Resposta inválida do serviço externo: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.BAD_GATEWAY) // 502
                .body("Erro ao processar a resposta do serviço de previsão. Por favor, tente novamente mais tarde.");
    }


    @ExceptionHandler(ErroConfiguracaoApiException.class)
    public ResponseEntity<String> handleErroConfiguracaoApi(ErroConfiguracaoApiException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
    }



}
