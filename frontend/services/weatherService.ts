import { WeatherCondition } from '../types';

// Open-Meteo APIs (No key required)
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

interface GeoLocation {
  latitude: number;
  longitude: number;
  name: string;
}

export const fetchFlightWeather = async (city: string, flightDate?: string): Promise<WeatherCondition | null> => {
  try {
    // 1. Validate Date (Max 16 days)
    if (flightDate) {
      const today = new Date();
      // Reset time part of today to ensure correct day difference calculation
      today.setHours(0, 0, 0, 0);

      const flight = new Date(flightDate);
      flight.setHours(0, 0, 0, 0);

      const diffTime = flight.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Open-Meteo allows up to 16 days (0-15 index). 
      // User requested > 15 days message.
      if (diffDays > 15) {
        console.warn(`Flight date is ${diffDays} days ahead. Weather forecast unavailable.`);
        return null;
      }
    }

    // 2. Get coordinates for the city
    const location = await fetchCoordinates(city);
    if (!location) {
      throw new Error(`Location not found for: ${city}`);
    }

    // 3. Get weather for coordinates
    const weatherData = await fetchWeather(location.latitude, location.longitude, flightDate);

    return weatherData;

  } catch (error) {
    console.error('Weather service error:', error);
    return getFallbackWeather();
  }
};

const fetchCoordinates = async (city: string): Promise<GeoLocation | null> => {
  try {
    const response = await fetch(`${GEOCODING_URL}?name=${encodeURIComponent(city)}&count=1&language=pt&format=json`);
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      console.warn(`Geocoding found no results for city: '${city}'`);
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

const fetchWeather = async (lat: number, lon: number, date?: string): Promise<WeatherCondition> => {
  // requesting current weather variables
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,cloud_cover,pressure_msl,wind_speed_10m',
    daily: 'temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max,wind_speed_10m_max',
    timezone: 'auto',
    forecast_days: '16'
  });

  const response = await fetch(`${WEATHER_URL}?${params.toString()}`);
  if (!response.ok) throw new Error('Open-Meteo API failed');

  const data = await response.json();
  const current = data.current;
  const daily = data.daily;

  let temp = current.temperature_2m;
  let minTemp = daily.temperature_2m_min[0];
  let maxTemp = daily.temperature_2m_max[0];
  let conditionCode = current.weather_code;
  let windSpeed = current.wind_speed_10m;
  let humidity = current.relative_humidity_2m;
  let rainProb = current.precipitation > 0 ? 100 : 0;

  // Logic to pick the specific day from forecast
  if (date) {
    const dateIndex = daily.time.findIndex((d: string) => d === date);
    if (dateIndex !== -1) {
      temp = (daily.temperature_2m_max[dateIndex] + daily.temperature_2m_min[dateIndex]) / 2;
      minTemp = daily.temperature_2m_min[dateIndex];
      maxTemp = daily.temperature_2m_max[dateIndex];
      conditionCode = daily.weather_code[dateIndex];
      windSpeed = daily.wind_speed_10m_max[dateIndex];
      humidity = 50; // Approximated

      // Robust rain probability calculation
      if (daily.precipitation_probability_max && daily.precipitation_probability_max[dateIndex] !== null) {
        rainProb = daily.precipitation_probability_max[dateIndex];
      } else if (daily.precipitation_sum && daily.precipitation_sum[dateIndex] !== null) {
        rainProb = daily.precipitation_sum[dateIndex] > 0 ? 60 : 10;
      } else {
        rainProb = 0;
      }
    }
  }

  return {
    temp: temp || 0,
    minTemp: minTemp || 0,
    maxTemp: maxTemp || 0,
    condition: mapWmoCodeToCondition(conditionCode || 0),
    windSpeed: windSpeed || 0,
    humidity: humidity || 0,
    rainProbability: rainProb || 0,
    pressure: current.pressure_msl || 0,
    clouds: current.cloud_cover || 0
  };
}

const mapWmoCodeToCondition = (code: number): string => {
  if (code === 0) return 'Clear';
  if (code >= 1 && code <= 3) return 'Clouds';
  if ((code >= 45 && code <= 48) || (code >= 51 && code <= 55) || (code >= 56 && code <= 57)) return 'Clouds';
  if (code >= 61 && code <= 67) return 'Rain';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Rain';
  if (code >= 85 && code <= 86) return 'Snow';
  if (code >= 95 && code <= 99) return 'Thunderstorm';

  return 'Clear';
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