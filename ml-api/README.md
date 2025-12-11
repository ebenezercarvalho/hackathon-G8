# ✈️ Flight Delay - Previsão de Atrasos de Voos

Microserviço de Machine Learning desenvolvido com **FastAPI** e **scikit-learn** para prever atrasos de voos. Este serviço foi projetado para operar como um *sidecar* ou microserviço independente, consumido por um backend Java (Spring Boot).

## 📋 Pré-requisitos

- Python 3.10 ou superior
- Pip (Gerenciador de pacotes Python)
- Arquivo do modelo treinado: `modelo_flight_delay.pkl` (Deve estar na raiz deste diretório)

## 🚀 Instalação e Execução Local

### 1. Configurar Ambiente Virtual
É altamente recomendado usar um ambiente virtual para isolar as dependências.

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Linux/Mac:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 2. Instalar Dependências
```bash
pip install -r requirements.txt
```

### 3. Verificar o Modelo
Certifique-se de que o arquivo `modelo_flight_delay.pkl` está presente pasta `ml-api`.
> **Nota:** O modelo é carregado automaticamente ao iniciar a API. Se ele não for encontrado, a API iniciará, mas os endpoints de predição retornarão erro 503.

### 4. Rodar a API
Você pode rodar diretamente com Python (que invocará o uvicorn):

```bash
python main.py
```

Ou usando o comando uvicorn diretamente (útil para desenvolvimento com reload):

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

A API estará disponível em: `http://localhost:8000`

---

## 📡 Documentação da API

Acesse a documentação interativa automática (Swagger UI) para testar os endpoints:
- **URL:** `http://localhost:8000/docs`

### Endpoint Principal: `/predict` [POST]

Recebe os dados do voo e retorna a probabilidade de atraso.

**Exemplo de Payload (JSON):**
⚠️ **Atenção:** Números inteiros (como mês e hora) **NÃO** podem ter zero à esquerda (ex: use `6` em vez de `06`).

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

**Exemplo de Resposta:**
```json
{
  "previsao": "Atrasado",
  "probabilidade_atraso": 0.7823,
  "confianca_percentual": "78.2%",
  "timestamp": "2025-12-11T10:15:30.123456"
}
```

---

## ☕ Integração com Spring Boot

Este microserviço foi desenhado para ser consumido pelo seu backend Java. Abaixo estão os exemplos de implementação.

### 1. DTOs (Data Transfer Objects)

Crie classes Java equivalentes aos contratos da API.

**VooRequest.java**
```java
public class VooRequest {
    private String aerodromo_origem;
    private String aerodromo_destino;
    private String empresa;
    private String periodo_dia;
    private Integer partida_hora;
    private Integer partida_dia_semana;
    private Integer partida_mes;

    // Getters, Setters e Construtores
}
```

**PrevisaoResponse.java**
```java
public class PrevisaoResponse {
    private String previsao;
    private Double probabilidade_atraso;
    private String confianca_percentual;
    private String timestamp;
    
    // Getters, Setters
}
```

### 2. Service Client (Exemplo com RestTemplate)

```java
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class FlightDelayPredictionService {

    private final RestTemplate restTemplate = new RestTemplate();
    // URL do sidecar ou serviço dockerizado
    private final String ML_API_URL = "http://localhost:8000/predict";

    public PrevisaoResponse preverAtraso(VooRequest request) {
        try {
            return restTemplate.postForObject(ML_API_URL, request, PrevisaoResponse.class);
        } catch (Exception e) {
            // Tratamento de erro (ex: modelo indisponível)
            return new PrevisaoResponse("Indisponível", 0.0, "0%", null);
        }
    }
}
```

### 3. Service Client (Exemplo com WebClient / WebFlux)
Mais moderno e não-bloqueante.

```java
@Service
public class FlightDelayPredictionAsyncService {
    
    private final WebClient webClient;

    public FlightDelayPredictionAsyncService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("http://localhost:8000").build();
    }

    public Mono<PrevisaoResponse> preverAtraso(VooRequest request) {
        return this.webClient.post()
                .uri("/predict")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(PrevisaoResponse.class);
    }
}
```

---

## 🐳 Docker (Deployment em Produção)

Para rodar este microserviço em container (ex: Kubernetes, ECS ou Docker Compose junto com o Spring Boot).

**1. Construir a Imagem:**
```bash
docker build -t flight-delay-ml-api .
```

**2. Rodar o Container:**
```bash
docker run -p 8000:8000 flight-delay-ml-api
```

**3. Docker Compose (Exemplo):**
```yaml
version: '3'
services:
  backend-java:
    build: ./backend
    ports: ["8080:8080"]
    depends_on:
      - ml-api
      
  ml-api:
    build: ./ml-api
    ports: ["8000:8000"]
    restart: always
```

---

## 🛠️ Solução de Problemas Comuns

| Erro | Causa Provável | Solução |
|------|----------------|---------|
| **503 Service Unavailable** | Modelo `.pkl` não encontrado ou corrompido. | Verifique se `modelo_flight_delay.pkl` está na pasta `ml-api`. Confirme os logs de inicialização. |
| **422 Unprocessable Entity** | Erro de formato JSON. Frequentemente causado por zeros à esquerda em números (ex: `05`). | Envie números limpos: `5` em vez de `05`. Valide o JSON. |
| **Connection Refused** | API não está rodando ou porta 8000 bloqueada. | Verifique se o processo Python está ativo. Se usar Docker, verifique o mapeamento de portas (`-p 8000:8000`). |

---

**Desenvolvido por Antigravity Team 🚀**
