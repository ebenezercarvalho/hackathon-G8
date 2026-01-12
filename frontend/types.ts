
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
  latitude?: number;
  longitude?: number;
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

// Matches ResponsePrevisaoDTO from new Swagger images
export interface ResponsePrevisaoDTO {
  probabilidadeAtraso: 'Muito alta' | 'Alta' | 'Média' | 'Baixa' | 'Muito baixa';
  probabilidadeAtrasoPercentual: number;
  timestamp?: string; // Kept if backend still provides it, though not visible in Swagger snippet
}

// Keeping the old one for compatibility during transition if needed, 
// but will update service to use the new one.
export type RespostaPrevisaoDTO = ResponsePrevisaoDTO;

export interface PredictionResult {
  isDelayed: boolean;
  confidence: number;
  probabilityLabel: string;
  weather?: WeatherCondition | null;
  timestamp: string;
}
