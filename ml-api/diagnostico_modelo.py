import joblib
import os
import sys

print(f"Python executável: {sys.executable}")
print(f"Diretório atual: {os.getcwd()}")

model_path = 'modelo_flight_delay.pkl'
print(f"Tentando carregar modelo de: {os.path.abspath(model_path)}")

if not os.path.exists(model_path):
    print("ERRO: Arquivo não encontrado!")
else:
    print(f"Arquivo encontrado. Tamanho: {os.path.getsize(model_path)} bytes")
    try:
        modelo = joblib.load(model_path)
        print("SUCESSO: Modelo carregado corretamente!")
        print("Chaves encontradas:", modelo.keys())
    except Exception as e:
        print(f"ERRO ao carregar com joblib: {e}")
