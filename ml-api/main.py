from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import pandas as pd
from typing import Optional
import logging
from datetime import datetime
from contextlib import asynccontextmanager

# Configuração de Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Carregar Modelo na Inicialização (Lifespan) ---
modelo_completo = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global modelo_completo
    try:
        # Caminho robusto para o modelo (independente de onde o comando é rodado)
        import os
        current_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(current_dir, 'modelo_flight_delay.pkl')
        
        modelo_completo = joblib.load(model_path)
        logger.info(f"✓ Modelo carregado de: {model_path}")
        logger.info(f"  Data de Treinamento: {modelo_completo['data_treinamento']}")
        logger.info(f"  ROC-AUC: {modelo_completo['metricas']['roc_auc']:.4f}")
    except FileNotFoundError:
        logger.error(f"✗ Modelo não encontrado em: {model_path}")
    except Exception as e:
        logger.error(f"✗ Erro ao carregar o modelo: {str(e)}")
    
    yield
    
    modelo_completo = None

description_text = """
API REST para previsão de atrasos de voos utilizando dados de machine learning.

Projeto desenvolvido pela **Equipe Chronos** durante o **Hackathon G8 ONE**.

### 👥 Integrantes

**Ebenézer Carvalho** | Data Scientist | Líder
* LinkedIn: [https://www.linkedin.com/in/ebenezercarvalho/](https://www.linkedin.com/in/ebenezercarvalho/)
* GitHub: [https://github.com/ebenezercarvalho](https://github.com/ebenezercarvalho)

**Cassiano Baldin** | Data Scientist
* LinkedIn: [https://www.linkedin.com/in/cassiano-baldin/](https://www.linkedin.com/in/cassiano-baldin/)
* GitHub: [https://github.com/obaldin](https://github.com/obaldin)

**Daniela Vieira** | Backend Developer
* LinkedIn: [https://www.linkedin.com/in/dani-vieira/](https://www.linkedin.com/in/dani-vieira/)
* GitHub: [https://github.com/danielavieiratester](https://github.com/danielavieiratester)

**Lucas Soares** | Backend Developer
* LinkedIn: [https://www.linkedin.com/in/lucass-soaress/](https://www.linkedin.com/in/lucass-soaress/)
* GitHub: [https://github.com/lucastnsoares](https://github.com/lucastnsoares)

**Wallen Silva** | Backend Developer
* LinkedIn: [https://www.linkedin.com/in/wallensilva/](https://www.linkedin.com/in/wallensilva/)
* GitHub: [https://github.com/wallenoliveira](https://github.com/wallenoliveira)

### 🚀 Funcionalidades
* **🔮 Previsão de Atrasos:** Estime a pontualidade de voos com IA.

### 🛠️ Tecnologias
* Python 3.14
* FastAPI
* Pandas
* Scikit-learn

[Repositório do Projeto no GitHub](https://github.com/ebenezercarvalho/hackathon-G8)
"""

# Inicializar FastAPI com lifespan
app = FastAPI(
    title="FlightOnTime - Machine Learning",
    description=description_text,
    version="1.0.0",
    lifespan=lifespan,
    root_path="/ml-api",
    servers=[{"url": "/ml-api", "description": "Default Server"}]
)

origins = [
    "http://localhost:3000",      # Frontend em desenvolvimento
    "http://flightontime-nginx",  # Comunicação interna via Docker
    "http://localhost",           # Acesso direto
]

# CORS 
app.add_middleware(
    CORSMiddleware,
    # allow_origins=["*"],
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Modelos Pydantic (Validação) ---
class VooInput(BaseModel):
    aerodromo_origem: str = Field(..., json_schema_extra={"example": "SBGR"}, description="Código ICAO do aeroporto de origem")
    aerodromo_destino: str = Field(..., json_schema_extra={"example": "SBRJ"}, description="Código ICAO do aeroporto de destino")
    empresa: str = Field(..., json_schema_extra={"example": "LATAM"}, description="Nome da companhia aérea")
    periodo_dia: str = Field(..., json_schema_extra={"example": "Tarde"}, description="Manhã, Tarde, Noite ou Madrugada")
    partida_hora: int = Field(..., ge=0, le=23, json_schema_extra={"example": 14}, description="Hora da partida (0-23)")
    partida_dia_semana: int = Field(..., ge=0, le=6, json_schema_extra={"example": 4}, description="Dia da semana (0=Seg, 6=Dom)")
    partida_mes: int = Field(..., ge=1, le=12, json_schema_extra={"example": 12}, description="Mês da partida (1-12)")

class PrevisaoOutput(BaseModel):
    previsao: str = Field(..., description="Pontual ou Atrasado")
    probabilidade_atraso: float = Field(..., description="Probabilidade de atraso (0.0 a 1.0)")
    confianca_percentual: str = Field(..., description="Probabilidade formatada como porcentagem")
    timestamp: str = Field(..., description="Timestamp da previsão")

# --- Endpoints ---
@app.get("/")
async def root():
    """Endpoint de healthcheck"""
    return {
        "status": "online",
        "service": "Flight Delay Prediction API",
        "version": "1.0.0"
    }

@app.get("/health")
async def health():
    """Endpoint de healthcheck detalhado"""
    if modelo_completo is None:
        raise HTTPException(status_code=503, detail="Modelo não carregado")
    
    return {
        "status": "healthy",
        "modelo_carregado": True,
        "data_treinamento": modelo_completo['data_treinamento'],
        "metricas": modelo_completo['metricas']
    }

@app.post("/predict", response_model=PrevisaoOutput)
async def predict(voo: VooInput):
    """
    Endpoint principal de predição de atraso
    """
    try:
        if modelo_completo is None:
            raise HTTPException(status_code=503, detail="Modelo não disponível")
        
        # Extrair componentes do modelo
        rf_class = modelo_completo['modelo']
        mapas_de_risco = modelo_completo['mapas_de_risco']
        features_finais = modelo_completo['features_finais']
        taxa_base_atraso = modelo_completo['taxa_base_atraso']
        
        # 1. Criar DataFrame
        dados_voo = voo.dict()
        df_input = pd.DataFrame([dados_voo])
        
        # 2. Feature Engineering - Temporais
        df_input['is_weekend'] = df_input['partida_dia_semana'].isin([5, 6]).astype(int)
        df_input['alta_temporada'] = df_input['partida_mes'].isin([12, 1, 7]).astype(int)
        
        # 3. Feature Engineering - Target Encoding
        for col in ['aerodromo_origem', 'aerodromo_destino', 'empresa', 'periodo_dia']:
            nome_col_risco = f'risco_{col}'
            # Usar o mapa de risco se a chave existir, senão usa a média global
            # Precisamos tratar casos de categorias novas não vistas no treino
            if col in mapas_de_risco:
                df_input[nome_col_risco] = df_input[col].map(mapas_de_risco[col]).fillna(taxa_base_atraso)
            else:
                 df_input[nome_col_risco] = taxa_base_atraso
        
        # 4. Selecionar features
        X_input = df_input[features_finais]
        
        # 5. Predição
        prob_atraso = float(rf_class.predict_proba(X_input)[0, 1])
        status = "Atrasado" if prob_atraso > 0.5 else "Pontual"
        
        # 6. Retornar resultado
        return PrevisaoOutput(
            previsao=status,
            probabilidade_atraso=round(prob_atraso, 4),
            confianca_percentual=f"{prob_atraso:.1%}",
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Erro na predição: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro ao processar predição: {str(e)}")

@app.get("/model-info")
async def model_info():
    """Retorna informações sobre o modelo"""
    if modelo_completo is None:
        raise HTTPException(status_code=503, detail="Modelo não carregado")
    
    return {
        "data_treinamento": modelo_completo['data_treinamento'],
        "metricas": modelo_completo['metricas'],
        "features": modelo_completo['features_finais'],
        "taxa_base_atraso": modelo_completo['taxa_base_atraso']
    }

if __name__ == "__main__":
    import uvicorn
    # Em desenvolvimento, o reload é útil. Em produção, removeríamos ou usaríamos configuração externa.
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
