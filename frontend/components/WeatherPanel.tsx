import React from 'react';
import { WeatherCondition } from '../types';
import { Cloud, Droplets, Wind, Thermometer, Gauge, Snowflake } from 'lucide-react';

interface WeatherPanelProps {
  weather: WeatherCondition;
}

const WeatherPanel: React.FC<WeatherPanelProps> = ({ weather }) => {
  const items = [
    { icon: <Thermometer size={20} />, label: "Temp", value: `${Math.round(weather.temp)}°C`, color: "text-orange-400" },
    { icon: <Wind size={20} />, label: "Wind", value: `${weather.windSpeed.toFixed(1)} km/h`, color: "text-cyan-400" },
    { icon: <Droplets size={20} />, label: "Humidity", value: `${weather.humidity}%`, color: "text-blue-400" },
    { icon: <Gauge size={20} />, label: "Pressure", value: `${weather.pressure} hPa`, color: "text-purple-400" },
    { icon: <Cloud size={20} />, label: "Clouds", value: `${weather.clouds}%`, color: "text-gray-400" },
    { icon: <Snowflake size={20} />, label: "Snow", value: `${weather.snow} mm`, color: "text-white" },
  ];

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 shadow-lg shadow-black/50">
      <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-2">
        <h3 className="text-lg font-mono font-bold text-cyan-500 tracking-wider">METEOROLOGY</h3>
        <span className="text-sm font-bold text-white uppercase bg-slate-700 px-2 py-1 rounded">
          {weather.condition}
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center justify-center p-3 bg-slate-800/50 rounded-md border border-slate-700 hover:border-cyan-500/30 transition-colors">
            <div className={`mb-2 ${item.color}`}>{item.icon}</div>
            <span className="text-xs text-slate-400 uppercase tracking-wide">{item.label}</span>
            <span className="text-lg font-bold text-slate-100">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherPanel;