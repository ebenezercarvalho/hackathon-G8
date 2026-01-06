package br.com.alura.flightontime.controller;

import br.com.alura.flightontime.dto.response.ResponseAutoCompleteAeroportoDTO;
import br.com.alura.flightontime.dto.response.ResponseAutoCompleteCompanhiaAereaDTO;
import br.com.alura.flightontime.service.AutoCompleteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/autocomplete")
@Tag(name = "Autocomplete", description = "Endpoints relacionados ao serviço de autocomplete")
public class AutoCompleteController {

    @Autowired
    private AutoCompleteService autoCompleteService;

    @Operation(summary = "Autocomplete de busca de aeroportos", description = "Retorna uma lista de aeroportos que correspondem ao termo pesquisado. Se nenhum registro for encontrado ou o termo pesquisado for curto demais, retorna uma lista vazia [].")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de aeroportos encontrada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Parâmetros inválidos", content = @Content),
            @ApiResponse(responseCode = "500", description = "Erro interno ao processar a previsão", content = @Content)
    })
    @CrossOrigin(origins = "*")
    @GetMapping("/aeroportos")
    public ResponseEntity<List<ResponseAutoCompleteAeroportoDTO>> autoCompleteAeroporto(
            @Parameter(
                    description = "Texto para busca por nome do aeroporto, código IATA ou ICAO",
                    example = "GRU",
                    required = true)
            @RequestParam String termo) {
        if (termo == null || termo.length() < 3) {
            return ResponseEntity.ok(List.of());
        }

        return ResponseEntity.ok(autoCompleteService.autoCompleteAeroportos(termo));
    }

    @Operation(summary = "Autocomplete de busca de companhias aéreas", description = "Retorna uma lista de companhias aéreas que correspondem ao termo pesquisado. Se nenhum registro for encontrado ou o termo pesquisado for curto demais, retorna uma lista vazia [].")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de companhias aéreas encontrada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Parâmetros inválidos ou incompletos", content = @Content),
            @ApiResponse(responseCode = "500", description = "Erro interno ao processar a previsão", content = @Content)
    })
    @CrossOrigin(origins = "*")
    @GetMapping("/companhia-aerea")
    public ResponseEntity<List<ResponseAutoCompleteCompanhiaAereaDTO>> autoCompleteCompanhiaAerea(
            @Parameter(
                    description = "Texto para busca por nome, código IATA ou ICAO",
                    example = "GLO",
                    required = true)
            @RequestParam String termo) {
        if (termo == null || termo.length() < 2) {
            return ResponseEntity.ok(List.of());
        }

        return ResponseEntity.ok(autoCompleteService.autoCompleteCompanhiaAerea(termo));
    }
}
