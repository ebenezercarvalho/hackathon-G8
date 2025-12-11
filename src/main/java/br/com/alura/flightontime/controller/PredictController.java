package br.com.alura.flightontime.controller;

import br.com.alura.flightontime.dto.VooDTO; // Importe seu DTO!
import br.com.alura.flightontime.service.VooService; // Importe o Service!
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/flights")
public class PredictController {

    // 1. Injeção de Dependência
    private final VooService vooService;

    @Autowired // Opcional a partir do Spring Boot 2.x, mas é boa prática
    public PredictController(VooService vooService) {
        this.vooService = vooService;
    }

    // 2. Endpoint /predict
    @PostMapping("/predict")
    public ResponseEntity<String> predict(@RequestBody VooDTO vooDTO) {

        // Chamando a lógica de negócio do Service
        String resultado = vooService.preverAtraso(vooDTO);

        return ResponseEntity.ok(resultado);
    }
}