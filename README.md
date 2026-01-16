# ✈️ FlightOnTime - Previsão de Atrasos de Voos

O **FlightOnTime** é uma solução completa para previsão de pontualidade de voos utilizando Inteligência Artificial. O sistema é composto por uma arquitetura de microsserviços que integra um modelo de Machine Learning, um Backend robusto e um Frontend interativo, todos orquestrados via Docker.

> **Projeto desenvolvido pela Equipe Chronos durante o Hackathon G8 ONE.**

## 🏗️ Arquitetura de Microsserviços

O projeto é dividido em 5 serviços principais, gerenciados via `docker-compose`:

* **🖥️ Frontend (`frontend`)**: Aplicação React (construída com Vite) responsável pela interface do usuário.
* **⚙️ Backend (`backend`)**: API REST desenvolvida em **Java Spring Boot**. Gerencia regras de negócio e comunica-se com a API de ML e o Banco de Dados.
* **🧠 ML API (`ml-api`)**: Serviço em **Python (FastAPI)** que hospeda o modelo de Machine Learning para prever a probabilidade de atraso.
* **🗄️ Database (`db`)**: Banco de dados **PostgreSQL 15** para persistência dos dados.
* **🌐 Nginx (`nginx`)**: Proxy Reverso que centraliza o acesso na porta `80`, roteando para o frontend ou backend conforme necessário.

## 🚀 Como Executar o Projeto com Docker

### Pré-requisitos
* **Docker** e **Docker Compose** instalados na máquina.

### Passo a Passo

1.  **Clone o repositório** para sua máquina local.

2.  **Configuração de Ambiente**:
    Crie um arquivo `.env` na raiz do projeto definindo as variáveis obrigatórias (veja a seção [Variáveis de Ambiente](#variáveis-de-ambiente) abaixo).

3.  **Build e Execução**:
    Na raiz do projeto, execute o comando para construir as imagens e subir os containers:

    ```bash
    docker-compose up -d --build
    ```

4.  **Acessar a Aplicação**:
    Após a inicialização, os serviços estarão disponíveis através do Nginx na porta 80:
    * **Aplicação Web:** `http://localhost`
    * **Documentação da API (Swagger):** `http://localhost/api/docs`
    * **ML API Healthcheck:** `http://localhost/ml-api/`

## 🔧 Variáveis de Ambiente

As seguintes variáveis devem ser definidas no arquivo `.env` na raiz do projeto, pois são utilizadas pelo `docker-compose.yml` para configurar os serviços.

### Obrigatórias (Configuração do Banco de Dados)

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `DB_NAME` | Nome do banco de dados PostgreSQL | `flightontime` |
| `DB_USER` | Usuário do banco de dados | `postgres` |
| `DB_PASSWORD` | Senha do banco de dados | `minhasenha` |
| `TZ` | Fuso horário dos containers | `America/Sao_Paulo` |

### Opcionais / Específicas dos Serviços

Estas variáveis possuem valores padrão definidos no `Dockerfile` ou `docker-compose.yml`, mas podem ser sobrescritas no `.env`.

**Backend (Spring Boot):**
* `SERVER_PORT`: Porta interna do servidor (Padrão: `8080`)
* `API_PREVISAO`: URL de comunicação com o serviço de ML (Padrão no Docker: `http://ml-api:8000/predict`)
* `SWAGGER_ENABLED`: Habilita/desabilita o Swagger UI (Padrão: `true`)

**Frontend:**
* `VITE_API_BASE_URL`: URL base da API para o frontend. Em ambiente Docker com Nginx, o padrão `/api` é recomendado.

**ML API:**
* `LOG_LEVEL`: Nível de log da aplicação Python (Ex: `INFO`, `DEBUG`)

## 👥 Autores - Equipe Chronos

* **Ebenézer Carvalho** (Data Scientist | Líder) - [GitHub](https://github.com/ebenezercarvalho)
* **Cassiano Baldin** (Data Scientist) - [GitHub](https://github.com/obaldin)
* **Daniela Vieira** (Backend Developer) - [GitHub](https://github.com/danielavieiratester)
* **Lucas Soares** (Backend Developer) - [GitHub](https://github.com/lucastnsoares)
* **Wallen Silva** (Backend Developer) - [GitHub](https://github.com/wallenoliveira)
