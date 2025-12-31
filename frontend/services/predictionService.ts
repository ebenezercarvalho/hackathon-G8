import { FlightFormData, PredictionResult, RespostaPrevisaoDTO } from '../types';
import { fetchFlightWeather } from './weatherService';

const API_BASE_URL = 'http://localhost:8080';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export const predictFlightDelay = async (data: FlightFormData): Promise<PredictionResult> => {
  if (!data.origin || !data.destination || !data.airline) {
    throw new ApiError("Missing flight data", 400);
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

  try {
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
      throw new ApiError(errorData.message || 'Failed to fetch prediction', response.status);
    }

    const result: RespostaPrevisaoDTO = await response.json();

    // 3. Fetch Weather for UI (Origin City)
    // Extract city from "City Name - Airport Name" or "City/State"
    // Remove "Aeroporto", "Intl", etc. if present in the city part
    let cityName = data.origin.nome.split('-')[0].trim();
    cityName = cityName.replace(/Aeroporto|International|Intl|Airport/gi, '').trim();

    // Fallback if empty
    if (!cityName || cityName.length < 3) {
      console.warn(`Extracted city name '${cityName}' is too short or empty. Using default.`);
      cityName = 'Sao Paulo';
    }

    console.log(`Fetching weather for extracted city: '${cityName}' (Origin: ${data.origin.nome})`);
    const weather = await fetchFlightWeather(cityName, data.date);

    return {
      isDelayed: result.previsao === "Atrasado",
      confidence: (() => {
        // Try new field first (confianca_percentual.parsedValue)
        if (result.confianca_percentual?.parsedValue !== undefined &&
          !isNaN(result.confianca_percentual.parsedValue)) {
          return Math.round(result.confianca_percentual.parsedValue);
        }
        // Fallback to old probabilidade_atraso field (calculate from delay probability)
        const delayProb = result.probabilidadeAtraso ?? result.probabilidade_atraso;
        if (typeof delayProb === 'number' && !isNaN(delayProb)) {
          return Math.round((1 - delayProb) * 100);
        }
        // Default to 0 if no valid data
        return 0;
      })(),
      timestamp: result.timestamp,
      weather
    };
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network errors or other fetch issues
    throw new ApiError(error.message || 'Network Error', 0);
  }
};