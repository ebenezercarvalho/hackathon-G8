package br.com.alura.flightontime.controller;

import br.com.alura.flightontime.dto.VooDTO;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/predict")
public class PredictController {
    @PostMapping
    public ResponseEntity<String> predict(@RequestBody @Valid VooDTO vooDTO) {
        return ResponseEntity.ok(String.format("""
                                **** Dados Recebidos
                                Companhia Aérea: %s,
                                Origem: %s,
                                Destino: %s,
                                Data de Partida: %s,
                                Distancia: %f
              
                """,vooDTO.companhia(), vooDTO.origem(), vooDTO.destino(), vooDTO.dataPartida(), vooDTO.distancia()));
    }
}
