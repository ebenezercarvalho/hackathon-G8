package br.com.alura.flightontime.controller;

import br.com.alura.flightontime.dto.VooDTO;
import br.com.alura.flightontime.dto.PrevisaoResponseDTO; // ⬅️ IMPORTANTE
import br.com.alura.flightontime.service.VooService;
// ... demais imports ...
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/predict") // Mantenha o mapping ajustado
public class PredictController { // Ou VooController

    private final VooService vooService;

    // Construtor
    public PredictController(VooService vooService) {
        this.vooService = vooService;
    }

    // ⬇️ CORREÇÃO: Altere o tipo de retorno para PrevisaoResponseDTO ⬇️
    @PostMapping
    @ResponseStatus(HttpStatus.OK)
    public PrevisaoResponseDTO predict(@RequestBody @Valid VooDTO vooDTO) {

        // CORREÇÃO: A chamada do Service AGORA retorna o DTO correto
        PrevisaoResponseDTO resultado = vooService.preverAtraso(vooDTO);

        // ⬇️ Retorne o DTO diretamente! O Spring cuida de convertê-lo para JSON ⬇️
        return resultado;
    }
}