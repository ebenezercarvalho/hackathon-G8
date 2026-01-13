FROM python:3.11-slim

# Definir diretório de trabalho
WORKDIR /app

# Copiar requirements
COPY requirements.txt .

# Instalar dependências
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código da aplicação
COPY main.py .

# Copiar o modelo (ajuste o caminho se necessário)
# Copiar o modelo (arquivo deve estar no mesmo diretório do Dockerfile)
COPY modelo_flight_delay.pkl /app/modelo_flight_delay.pkl

# Expor porta
EXPOSE 8000

# Comando de inicialização
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--root-path", "/ml-api"]
