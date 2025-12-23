import { FlightFormData, PredictionResult, RespostaPrevisaoDTO } from '../types';
import { fetchFlightWeather } from './weatherService';

const API_BASE_URL = 'http://localhost:8080';

export const predictFlightDelay = async (data: FlightFormData): Promise<PredictionResult> => {
  if (!data.origin || !data.destination || !data.airline) {
    throw new Error("Missing flight data");
  }

  // 1. Prepare the VooDTO for the backend
  // Format date and time to ISO string: 2025-12-25T14:30:00
  const dateTimeStr = `${data.date}T${data.time}:00`;

  const vooDto = {
    codigoIcaoCompanhiaAerea: data.airline.codigoIcao,
    codigoIcaoVooOrigem: data.origin.codigoIcao,
    codigoIcaoVooDestino: data.destination.codigoIcao,
    dataPartida: dateTimeStr
  };

  // 2. Call the Real Backend
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(vooDto)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch prediction from server');
  }

  const result: RespostaPrevisaoDTO = await response.json();

  // 3. Fetch Weather for UI (Origin City)
  // Extract city from "City Name - Airport Name" or similar
  const cityName = data.origin.nome.split('-')[0].trim() || 'Sao Paulo';
  const weather = await fetchFlightWeather(cityName);

  return {
    isDelayed: result.previsao === "Atrasado",
    confidence: Math.round(result.probabilidade_atraso * 100),
    timestamp: result.timestamp,
    weather
  };
};