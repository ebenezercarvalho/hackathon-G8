export interface Airport {
  code: string;
  name: string;
  city: string;
}

export enum PeriodOfDay {
  MORNING = "Morning (06:00 - 12:00)",
  AFTERNOON = "Afternoon (12:00 - 18:00)",
  EVENING = "Evening (18:00 - 00:00)",
  NIGHT = "Night (00:00 - 06:00)"
}

export interface FlightFormData {
  origin: string;
  destination: string;
  date: string;
  period: string;
  time: string;
}

export interface WeatherCondition {
  temp: number;
  condition: string;
  windSpeed: number;
  humidity: number;
  pressure: number;
  clouds: number;
  snow: number; // volume in mm
}

export interface PredictionResult {
  isDelayed: boolean;
  confidence: number;
  delayMinutes?: number;
  reason?: string;
  weather: WeatherCondition;
  historicalDelayRate: number; // percentage
  alternativeAirports: Airport[];
  bestDepartureTime: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}
