import { FlightFormData, PredictionResult } from '../types';
import { fetchFlightWeather } from './weatherService';
import { BRAZILIAN_AIRPORTS } from '../constants';

export const predictFlightDelay = async (data: FlightFormData): Promise<PredictionResult> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 1500));

  // 1. Get origin airport details to fetch weather
  const originAirport = BRAZILIAN_AIRPORTS.find(a => a.code === data.origin);
  const originCity = originAirport?.city || 'Sao Paulo';

  // 2. Fetch (or mock) weather
  const weather = await fetchFlightWeather(originCity);

  // 3. Mock ML Rule-Based Logic
  // Probability of delay increases with:
  // - Rain/Snow/Thunderstorm
  // - High wind
  // - Evening/Afternoon periods
  
  let delayScore = 0;
  
  if (['Rain', 'Thunderstorm', 'Snow'].includes(weather.condition)) delayScore += 40;
  if (weather.windSpeed > 20) delayScore += 20;
  if (data.period.includes('Afternoon') || data.period.includes('Evening')) delayScore += 15;
  if (weather.clouds > 80) delayScore += 10;
  
  // Add some randomness
  delayScore += Math.floor(Math.random() * 20);

  const isDelayed = delayScore > 50;
  const confidence = Math.min(Math.floor(50 + (delayScore / 2)), 98); // Cap at 98%

  // Find alternatives (just picking random other airports excluding current)
  const alternativeAirports = BRAZILIAN_AIRPORTS
    .filter(a => a.code !== data.origin && a.code !== data.destination)
    .sort(() => 0.5 - Math.random())
    .slice(0, 2);

  return {
    isDelayed,
    confidence,
    delayMinutes: isDelayed ? Math.floor(Math.random() * 120) + 15 : 0,
    reason: isDelayed ? `Adverse weather (${weather.condition}) and high traffic volume` : undefined,
    weather,
    historicalDelayRate: Math.floor(Math.random() * 30) + 5,
    alternativeAirports,
    bestDepartureTime: "06:30 AM" // Mock recommendation
  };
};