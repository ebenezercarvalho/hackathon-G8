package br.com.alura.flightontime.controller;

import br.com.alura.flightontime.dto.RequisicaoPrevisaoVooDTO;
import br.com.alura.flightontime.dto.VooDTO;
import br.com.alura.flightontime.service.PrevisaoVooService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/predict")
public class PredictController {

    @Autowired
    private PrevisaoVooService previsaoVooService;

    @PostMapping
    public ResponseEntity<RequisicaoPrevisaoVooDTO> predict(@RequestBody @Valid VooDTO vooDTO) {
        return ResponseEntity.ok(previsaoVooService.previsao(vooDTO));
    }

    /*@PostMapping
    public ResponseEntity<?> predict(@RequestBody @Valid VooDTO vooDTO, BindingResult result) {
        try {
            return ResponseEntity.ok(previsaoVooService.previsao(vooDTO));
        } catch (ValidacaoDBException e) {
            for (String msg : e.getErros()) {
                // "reject" adiciona um erro global ao BindingResult
                result.reject("ERRO_NEGOCIO", msg);
            }
        } finally {
            if (result.hasErrors()) {
                // Extraímos TODOS os erros acumulados
                List<String> todosOsErros = result.getAllErrors()
                        .stream()
                        .map(error -> error.getDefaultMessage())
                        .collect(Collectors.toList());

                return ResponseEntity.badRequest().body(todosOsErros);
            }
        }
        return null;
    }*/
}
