import { WeatherCondition } from '../types';

const API_KEY = 'YOUR_OPENWEATHER_API_KEY'; // Replace with env var in real prod
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const fetchFlightWeather = async (city: string): Promise<WeatherCondition> => {
  // If no API key or purely mock mode requested, return mock data
  if (!API_KEY || API_KEY === 'YOUR_OPENWEATHER_API_KEY') {
    return getMockWeather();
  }

  try {
    const response = await fetch(`${BASE_URL}?q=${city},br&units=metric&appid=${API_KEY}`);
    if (!response.ok) throw new Error('Weather API failed');
    const data = await response.json();

    return {
      temp: data.main.temp,
      condition: data.weather[0].main,
      windSpeed: data.wind.speed * 3.6, // convert m/s to km/h
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      clouds: data.clouds.all,
      snow: data.snow ? data.snow['1h'] || 0 : 0
    };
  } catch (error) {
    console.warn("Weather API fetch failed, falling back to mock data", error);
    return getMockWeather();
  }
};

const getMockWeather = (): WeatherCondition => {
  const conditions = ['Clear', 'Clouds', 'Rain', 'Thunderstorm', 'Snow'];
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
  
  // Synthesize consistent mock data
  return {
    temp: Math.floor(Math.random() * 15) + 20, // 20-35 C
    condition: randomCondition,
    windSpeed: Math.floor(Math.random() * 30) + 5, // 5-35 km/h
    humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
    pressure: 1013 + Math.floor(Math.random() * 20) - 10, // 1003-1023 hPa
    clouds: randomCondition === 'Clear' ? 0 : Math.floor(Math.random() * 80) + 20,
    snow: randomCondition === 'Snow' ? Math.floor(Math.random() * 50) : 0
  };
};