import { WeatherCondition } from '../types';

// Open-Meteo APIs (No key required)
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

interface GeoLocation {
  latitude: number;
  longitude: number;
  name: string;
}

export const fetchFlightWeather = async (city: string): Promise<WeatherCondition> => {
  try {
    // 1. Get coordinates for the city
    const location = await fetchCoordinates(city);
    if (!location) {
      throw new Error(`Location not found for: ${city}`);
    }

    // 2. Get weather for coordinates
    const weatherData = await fetchWeather(location.latitude, location.longitude);

    return weatherData;

  } catch (error) {
    console.error('Weather service error:', error);
    // Fallback to a "neutral/unknown" state or re-throw. 
    // Given the requirement for "Real Data", we mainly want to avoid mocks if possible.
    // However, if the API fails (e.g. offline), we return a safe default to not break the UI.
    return getFallbackWeather();
  }
};

const fetchCoordinates = async (city: string): Promise<GeoLocation | null> => {
  try {
    const response = await fetch(`${GEOCODING_URL}?name=${encodeURIComponent(city)}&count=1&language=pt&format=json`);
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return null;
    }

    return {
      latitude: data.results[0].latitude,
      longitude: data.results[0].longitude,
      name: data.results[0].name
    };
  } catch (e) {
    console.error("Geocoding failed", e);
    return null;
  }
};

const fetchWeather = async (lat: number, lon: number): Promise<WeatherCondition> => {
  // requesting current weather variables
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,cloud_cover,pressure_msl,wind_speed_10m',
    daily: 'temperature_2m_max,temperature_2m_min',
    timezone: 'auto'
  });

  const response = await fetch(`${WEATHER_URL}?${params.toString()}`);
  if (!response.ok) throw new Error('Open-Meteo API failed');

  const data = await response.json();
  const current = data.current;
  const daily = data.daily;

  return {
    temp: current.temperature_2m,
    minTemp: daily.temperature_2m_min[0],
    maxTemp: daily.temperature_2m_max[0],
    condition: mapWmoCodeToCondition(current.weather_code),
    windSpeed: current.wind_speed_10m,
    humidity: current.relative_humidity_2m,
    rainProbability: current.precipitation > 0 ? 100 : 0, // Open-Meteo gives current precip. For forecast prob we'd need hourly/daily prob. Using simple logic for "now".
    pressure: current.pressure_msl,
    clouds: current.cloud_cover
  };
}

// Maps WMO Weather interpretation codes (0-99) to our string types
// https://open-meteo.com/en/docs
const mapWmoCodeToCondition = (code: number): string => {
  if (code === 0) return 'Clear';
  if (code >= 1 && code <= 3) return 'Clouds';
  if ((code >= 45 && code <= 48) || (code >= 51 && code <= 55) || (code >= 56 && code <= 57)) return 'Clouds'; // Fog/Drizzle as Clouds or similar
  if (code >= 61 && code <= 67) return 'Rain';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Rain';
  if (code >= 85 && code <= 86) return 'Snow';
  if (code >= 95 && code <= 99) return 'Thunderstorm';

  return 'Clear'; // Default
};

const getFallbackWeather = (): WeatherCondition => {
  return {
    temp: 0,
    minTemp: 0,
    maxTemp: 0,
    condition: 'Unknown',
    windSpeed: 0,
    humidity: 0,
    rainProbability: 0,
    pressure: 0,
    clouds: 0
  };
};