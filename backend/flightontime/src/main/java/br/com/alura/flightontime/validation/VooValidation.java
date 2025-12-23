package br.com.alura.flightontime.validation;

import br.com.alura.flightontime.dto.VooDTO;
import java.util.List;

public interface VooValidation {
    List<String> validar(VooDTO vooDTO);
}
