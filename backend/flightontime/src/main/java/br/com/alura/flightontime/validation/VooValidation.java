package br.com.alura.flightontime.validation;

import java.util.List;

import br.com.alura.flightontime.dto.request.RequestPrevisaoDTO;

public interface VooValidation {
    List<String> validar(RequestPrevisaoDTO dto);
}
