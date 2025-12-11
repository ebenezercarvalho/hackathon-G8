package br.com.alura.flightontime.service;

import br.com.alura.flightontime.dto.VooDTO;
import br.com.alura.flightontime.dto.PrevisaoResponseDTO; // ⬅️ Importe o DTO de Resposta
import org.springframework.stereotype.Service;

@Service // Marca esta classe como um componente Spring de Serviço.
public class VooService {

    /**
     * Método que será chamado pelo Controller para fazer a previsão.
     * Retorna o DTO de Resposta com a Previsão e Probabilidade.
     */
    // ⬇️ Mude o tipo de retorno de 'String' para 'PrevisaoResponseDTO' ⬇️
    public PrevisaoResponseDTO preverAtraso(VooDTO dto) {

        // -----------------------------------------------------------
        // 🚨 A LÓGICA DE INTEGRAÇÃO COM O MODELO DE DATA SCIENCE ENTRA AQUI 🚨
        // -----------------------------------------------------------

        // Por enquanto, vamos SIMULAR o resultado da previsão:
        double probabilidadeAtraso = 0.78; // 78% de chance de atrasar (Exemplo)
        String statusPrevisao = "Atrasado";

        // -----------------------------------------------------------

        // ⬇️ Retorna o objeto DTO que será convertido em JSON ⬇️
        // Usamos o construtor do Lombok que criamos (Graças ao @AllArgsConstructor)
        return new PrevisaoResponseDTO(statusPrevisao, probabilidadeAtraso);
    }
}