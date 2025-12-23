# ✈️ Flight Delay Prediction API

Este projeto consiste em um microserviço de **Machine Learning** desenvolvido com **FastAPI** para prever a probabilidade de atrasos em voos comerciais. Ele utiliza um modelo *Random Forest* treinado com dados históricos para fornecer estimativas em tempo real.

O serviço foi projetado para operar como um componente *sidecar* ou microserviço independente, ideal para ser consumido por backends robustos (como aplicações Spring Boot).

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

## 🚀 Como Executar Localmente

Siga os passos abaixo para colocar a API no ar em sua máquina.

### 1. Configuração do Ambiente

É recomendável usar um ambiente virtual para isolar as dependências do projeto.

**Windows:**
```powershell
python -m venv venv
.\venv\Scripts\activate
```

**Linux/Mac:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 2. Instalação de Dependências

```bash
pip install -r requirements.txt
```

### 3. Execução do Servidor

Você pode iniciar o servidor de duas formas:

**Via Python (Script facilitador):**
```bash
python main.py
```

**Via Uvicorn (Recomendado para desenvolvimento):**
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

A API estará acessível em: `http://localhost:8000`

---

## 📡 Documentação dos Endpoints

Abaixo estão detalhados os endpoints disponíveis na API.

### 📚 Documentação Interativa (Swagger UI)
Acesse `http://localhost:8000/docs` para testar os endpoints diretamente pelo navegador.

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

Verifica se a API está online e se o modelo de Machine Learning foi carregado corretamente na memória. Útil para *liveness probes* em orquestradores como Kubernetes.

**Resposta Exemplo:**
```json
{
  "status": "healthy",
  "modelo_carregado": true,
  "data_treinamento": "2024-12-10",
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
String url = "http://localhost:8000/predict";
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

**Desenvolvido pelo Time Antigravity 🚀**
