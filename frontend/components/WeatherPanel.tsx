import React from 'react';
import { WeatherCondition, Language } from '../types';
import { Cloud, Droplets, Wind, Thermometer, CloudRain } from 'lucide-react';
import { translations } from '../translations';

interface WeatherPanelProps {
  weather: WeatherCondition;
  lang: Language;
}

const WeatherPanel: React.FC<WeatherPanelProps> = ({ weather, lang }) => {
  const t = translations[lang];

  const items = [
    { 
      icon: <Thermometer size={24} />, 
      label: t.tempMinMax, 
      value: `${Math.round(weather.minTemp)}° / ${Math.round(weather.maxTemp)}°C`, 
      color: "text-orange-400" 
    },
    { 
      icon: <Wind size={24} />, 
      label: t.windSpeed, 
      value: `${weather.windSpeed.toFixed(1)} km/h`, 
      color: "text-cyan-400" 
    },
    { 
      icon: <Droplets size={24} />, 
      label: t.humidity, 
      value: `${weather.humidity}%`, 
      color: "text-blue-400" 
    },
    { 
      icon: <CloudRain size={24} />, 
      label: t.rainProb, 
      value: `${weather.rainProbability}%`, 
      color: "text-indigo-400" 
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 shadow-2xl">
      <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
        <h3 className="text-sm font-mono font-bold text-cyan-500 tracking-[0.2em] uppercase">{t.weatherForecast}</h3>
        <div className="flex items-center gap-3">
           <Cloud className="text-slate-500" size={20} aria-hidden="true" />
           <span className="text-lg font-bold text-white uppercase tracking-tight">
             {weather.condition}
           </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center justify-center p-6 bg-slate-950/50 rounded-xl border border-slate-800 hover:border-cyan-500/30 transition-all group">
            <div className={`mb-3 ${item.color} transform group-hover:scale-110 transition-transform`} aria-hidden="true">{item.icon}</div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">{item.label}</span>
            <span className="text-xl font-mono font-bold text-slate-100">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherPanel;