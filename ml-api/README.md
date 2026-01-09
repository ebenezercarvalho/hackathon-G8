# ✈️ API de Previsão de Atrasos de Voos

Nosso projeto consiste em um microserviço de **Machine Learning** desenvolvido com **FastAPI** para prever a probabilidade de atrasos em voos comerciais. Ele utiliza um modelo *Random Forest* treinado com dados históricos da ANAC para fornecer estimativas de atrasos.

O projeto foi criado para operar como um microserviço independente, ideal para ser consumido por backends (como aplicações Spring Boot).

---

## 📋 Funcionalidades Principais

- **Predição de Atraso**: Analisa dados do voo (origem, destino, companhia, horário) e retorna:
  - Classificação ("Atrasado" ou "Pontual").
  - Probabilidade calculada (0.0 a 1.0).
  - Nível de confiança.
- **Robustez**: O modelo é capaz de lidar com novos aeroportos ou empresas aéreas não vistas no treinamento, utilizando uma "taxa base" de atraso para imputação segura de dados desconhecidos.
- **Alta Performance**: Construído sobre FastAPI e Uvicorn para respostas assíncronas rápidas.
- **Diagnóstico**: Endpoints de saúde (`/health`) e informações do modelo (`/model-info`) para monitoramento.

---

## �️ Pré-requisitos

- **Python 3.10+** instalado.
- **Pip** (Gerenciador de pacotes Python).
- Arquivo do modelo: **`modelo_flight_delay.pkl`** (Deve estar obrigatoriamente na raiz do diretório `ml-api`).

---

## 📡 Documentação dos Endpoints

Abaixo estão detalhados os endpoints disponíveis na API.

### 📚 Documentação Interativa (Swagger UI)
Acesse `https://flapi.synapsisweb.com/docs` para testar os endpoints.

---

### 1. Predição de Atraso
**Rota:** `POST /predict`

Recebe os detalhes de um voo e retorna a análise de risco de atraso.

> **Nota sobre Robustez:** Se um código de aeroporto ou empresa informada não for reconhecido pelo modelo (não existia no treino), a API **não retornará erro**. Ela utilizará a média global de atrasos como base para o cálculo. Isso garante que o serviço continue operando mesmo com novos dados.

**Corpo da Requisição (JSON):**

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| `aerodromo_origem` | string | Código ICAO do aeroporto de origem | `"SBGR"` |
| `aerodromo_destino` | string | Código ICAO do aeroporto de destino | `"SBRJ"` |
| `empresa` | string | Sigla ou nome da companhia aérea | `"LATAM"` |
| `periodo_dia` | string | Período do voo (Manhã, Tarde, Noite, Madrugada) | `"Tarde"` |
| `partida_hora` | int | Hora da partida (0-23) | `14` |
| `partida_dia_semana` | int | Dia da semana (0=Segunda ... 6=Domingo) | `4` |
| `partida_mes` | int | Mês da partida (1-12) | `6` |

**Exemplo de Payload:**
```json
{
  "aerodromo_origem": "SBGR",
  "aerodromo_destino": "SBRJ",
  "empresa": "LATAM",
  "periodo_dia": "Tarde",
  "partida_hora": 14,
  "partida_dia_semana": 4,
  "partida_mes": 6
}
```

**Exemplo de Resposta (200 OK):**
```json
{
  "previsao": "Atrasado",
  "probabilidade_atraso": 0.7823,
  "confianca_percentual": "78.2%",
  "timestamp": "2025-12-18T20:30:15.123456"
}
```

---

### 2. Health Check
**Rota:** `GET /health`

Verifica se a API está online e se o modelo de Machine Learning foi carregado corretamente na memória. 

**Resposta Exemplo:**
```json
{
  "status": "healthy",
  "modelo_carregado": true,
  "data_treinamento": "2025-12-25",
  "metricas": { "roc_auc": 0.68 }
}
```

---

### 3. Informações do Modelo
**Rota:** `GET /model-info`

Retorna metadados técnicos sobre a versão do modelo que está sendo executada, incluindo métricas de performance obtidas durante o treinamento.

---

## ☕ Exemplo de Integração (Java Spring Boot)

Se você está consumindo esta API de um backend Java, pode utilizar o padrão DTO e `RestTemplate` ou `WebClient`.

**Exemplo de DTO (Request):**
```java
public class VooRequest {
    private String aerodromo_origem;
    private String aerodromo_destino;
    private String empresa;
    private String periodo_dia;
    private Integer partida_hora;
    private Integer partida_dia_semana;
    private Integer partida_mes;
    // Getters e Setters...
}
```

**Chamada via RestTemplate:**
```java
String url = "https://flapi.synapsisweb.com/predict";
PrevisaoResponse resposta = restTemplate.postForObject(url, vooRequest, PrevisaoResponse.class);
```

---

## 🐳 Executando com Docker

Para facilitar o deploy, o projeto inclui um `Dockerfile` otimizado.

1. **Construir a imagem:**
   ```bash
   docker build -t flight-delay-api .
   ```

2. **Rodar o container:**
   ```bash
   docker run -d -p 8000:8000 --name ml-api flight-delay-api
   ```

---
