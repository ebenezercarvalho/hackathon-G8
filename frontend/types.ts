
export type Language = 'en' | 'pt' | 'es';

// Fix: Added missing PeriodOfDay enum to resolve the error in constants.ts line 1
export enum PeriodOfDay {
  Morning = 'Morning',
  Afternoon = 'Afternoon',
  Evening = 'Evening',
  Night = 'Night'
}

export interface Airport {
  nome: string;
  codigoIata: string;
  codigoIcao: string;
}

export interface Airline {
  nome: string;
  codigoIata: string;
  codigoIcao: string;
}

export interface FlightFormData {
  origin: Airport | null;
  destination: Airport | null;
  airline: Airline | null;
  date: string;
  time: string;
}

export interface WeatherCondition {
  temp: number;
  minTemp: number;
  maxTemp: number;
  condition: string;
  windSpeed: number;
  humidity: number;
  rainProbability: number;
  pressure: number;
  clouds: number;
}

// Matches RespostaPrevisaoDTO from Swagger
export interface RespostaPrevisaoDTO {
  previsao: "Atrasado" | "Pontual" | "No horário";
  probabilidadeAtraso?: number; // Old field (camelCase from backend)
  probabilidade_atraso?: number; // Old field (snake_case)
  confianca_percentual?: {
    source: string;
    parsedValue: number;
  };
  timestamp: string;
}

export interface PredictionResult {
  isDelayed: boolean;
  confidence: number;
  weather: WeatherCondition | null;
  timestamp: string;
}
