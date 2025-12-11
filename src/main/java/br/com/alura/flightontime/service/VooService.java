package br.com.alura.flightontime.service;

import br.com.alura.flightontime.dto.VooDTO;
import org.springframework.stereotype.Service;

@Service
public class VooService {

    // 1. Não usamos 'final' para evitar o erro de compilação.
    private boolean modeloCarregado;

    // NOVO CONSTRUTOR: Executa a lógica de inicialização.
    public VooService() {
        try {
            // Lógica de Inicialização (Simula o carregamento do modelo)
            System.out.println("--- INICIALIZAÇÃO DO ML VIA CONSTRUTOR ---");
            this.modeloCarregado = true; // Define como TRUE
            System.out.println("Modelo de Machine Learning carregado com SUCESSO! (Simulação)");
        } catch (Exception e) {
            System.err.println("ERRO INESPERADO NA INICIALIZAÇÃO: " + e.getMessage());
            this.modeloCarregado = false;
        }
        System.out.println("---------------------------");
    }

    // Método principal de predição
    public String preverAtraso(VooDTO dto) {
        // Verifica o estado da variável inicializada no construtor
        if (!modeloCarregado) {
            return "Erro Interno: O modelo de predição não está disponível.";
        }

        System.out.println("Dados de entrada recebidos: " + dto.toString());

        // Simulação de Regra de Negócio:
        if (dto.getDistancia() > 1500 && dto.getMes().equalsIgnoreCase("DEZ")) {
            return "ALTA PROBABILIDADE de atraso (89% de chance).";
        } else {
            return "BAIXA PROBABILIDADE de atraso (8% de chance).";
        }
    }
}