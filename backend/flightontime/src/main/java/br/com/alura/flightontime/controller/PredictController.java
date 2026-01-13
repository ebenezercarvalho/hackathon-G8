package br.com.alura.flightontime.controller;

import br.com.alura.flightontime.dto.request.RequestPrevisaoDTO;
import br.com.alura.flightontime.dto.response.ResponsePrevisaoDTO;
import br.com.alura.flightontime.service.PrevisaoVooService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/predict")
@Tag(name = "Previsão", description = "Endpoint relacionado à previsão de pontualidade de voos")
public class PredictController {

    @Autowired
    private PrevisaoVooService previsaoVooService;

    @Operation(summary = "Previsão de atrasos de vôo", description = "Retorna a previsão de pontualidade de um determinado vôo.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Previsão realizada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Parâmetros inválidos ou incompletos", content = @Content),
            @ApiResponse(responseCode = "500", description = "Erro interno do servidor", content = @Content),
            @ApiResponse(responseCode = "502", description = "Erro interno ao processar requisição", content = @Content),
            @ApiResponse(responseCode = "503", description = "Serviço de previsão temporariamente indisponível", content = @Content)
})
    @PostMapping
    public ResponseEntity<ResponsePrevisaoDTO> predict(@RequestBody @Valid RequestPrevisaoDTO requestPrevisaoDTO) {
        return ResponseEntity.ok(previsaoVooService.previsao(requestPrevisaoDTO));
    }
}
