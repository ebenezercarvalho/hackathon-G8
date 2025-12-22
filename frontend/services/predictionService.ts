import { FlightFormData, PredictionResult } from '../types';
import { fetchFlightWeather } from './weatherService';
import { BRAZILIAN_AIRPORTS } from '../constants';

export const predictFlightDelay = async (data: FlightFormData): Promise<PredictionResult> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 1500));

  // 1. Get origin airport details to fetch weather
  const originAirport = BRAZILIAN_AIRPORTS.find(a => a.codigoIata === data.origin);
  const originCity = originAirport?.nome.split('/')[0] || 'Sao Paulo';

  // 2. Fetch (or mock) weather
  const weather = await fetchFlightWeather(originCity);

  // 3. Mock ML Rule-Based Logic
  let delayScore = 0;
  
  if (['Rain', 'Thunderstorm', 'Snow'].includes(weather.condition)) delayScore += 40;
  if (weather.windSpeed > 20) delayScore += 20;
  
  // Estimate period from time for mock logic
  // Typically afternoon (12-18) and evening (18-00) have more delays
  if (data.time) {
    const hour = parseInt(data.time.split(':')[0], 10);
    if (hour >= 12 && hour < 23) {
      delayScore += 15;
    }
  }
  
  // Specific airline "performance" mock
  if (data.airline === 'G3') delayScore += 5;

  delayScore += Math.floor(Math.random() * 20);

  const isDelayed = delayScore > 50;
  const confidence = Math.min(Math.floor(50 + (delayScore / 2)), 98);

  const alternativeAirports = BRAZILIAN_AIRPORTS
    .filter(a => a.codigoIata !== data.origin && a.codigoIata !== data.destination)
    .sort(() => 0.5 - Math.random())
    .slice(0, 2);

  return {
    isDelayed,
    confidence,
    delayMinutes: isDelayed ? Math.floor(Math.random() * 120) + 15 : 0,
    reason: isDelayed ? `Adverse weather (${weather.condition}) and operational constraints` : undefined,
    weather,
    historicalDelayRate: Math.floor(Math.random() * 30) + 5,
    alternativeAirports,
    bestDepartureTime: "06:45 AM"
  };
};