import { WeatherCondition } from '../types';

const API_KEY = 'YOUR_OPENWEATHER_API_KEY';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const fetchFlightWeather = async (city: string): Promise<WeatherCondition> => {
  if (!API_KEY || API_KEY === 'YOUR_OPENWEATHER_API_KEY') {
    return getMockWeather();
  }

  try {
    const response = await fetch(`${BASE_URL}?q=${city},br&units=metric&appid=${API_KEY}`);
    if (!response.ok) throw new Error('Weather API failed');
    const data = await response.json();

    return {
      temp: data.main.temp,
      minTemp: data.main.temp_min,
      maxTemp: data.main.temp_max,
      condition: data.weather[0].main,
      windSpeed: data.wind.speed * 3.6,
      humidity: data.main.humidity,
      rainProbability: data.rain ? 85 : 15, // Simple heuristic for mock/real mix
      pressure: data.main.pressure,
      clouds: data.clouds.all
    };
  } catch (error) {
    return getMockWeather();
  }
};

const getMockWeather = (): WeatherCondition => {
  const conditions = ['Clear', 'Clouds', 'Rain', 'Thunderstorm', 'Light Rain'];
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
  const baseTemp = Math.floor(Math.random() * 15) + 20;
  
  return {
    temp: baseTemp,
    minTemp: baseTemp - (Math.floor(Math.random() * 5)),
    maxTemp: baseTemp + (Math.floor(Math.random() * 5)),
    condition: randomCondition,
    windSpeed: Math.floor(Math.random() * 30) + 5,
    humidity: Math.floor(Math.random() * 40) + 40,
    rainProbability: ['Rain', 'Thunderstorm', 'Light Rain'].includes(randomCondition) 
      ? Math.floor(Math.random() * 40) + 60 
      : Math.floor(Math.random() * 20),
    pressure: 1013,
    clouds: Math.floor(Math.random() * 100)
  };
};