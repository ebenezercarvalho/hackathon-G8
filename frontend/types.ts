
export type Language = 'en' | 'pt' | 'es';

// Fix: Added missing PeriodOfDay enum required by constants.ts
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
  origin: string; 
  destination: string; 
  airline: string; 
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

// Fix: Updated PredictionResult to include all fields returned by predictionService.ts
export interface PredictionResult {
  isDelayed: boolean;
  confidence: number;
  delayMinutes: number;
  reason?: string;
  weather: WeatherCondition;
  historicalDelayRate: number;
  alternativeAirports: Airport[];
  bestDepartureTime: string;
}
