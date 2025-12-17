import React, { useState } from 'react';
import { Plane, Calendar, Clock, MapPin, RefreshCw, Activity, ArrowRight } from 'lucide-react';
import { FlightFormData, PredictionResult } from './types';
import { BRAZILIAN_AIRPORTS, PERIODS } from './constants';
import { predictFlightDelay } from './services/predictionService';
import PredictionResultCard from './components/PredictionResult';
import WeatherPanel from './components/WeatherPanel';
import ReportGenerator from './components/ReportGenerator';
import StatsChart from './components/StatsChart';

function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [formData, setFormData] = useState<FlightFormData>({
    origin: '',
    destination: '',
    date: '',
    period: '',
    time: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleReset = () => {
    setFormData({
      origin: '',
      destination: '',
      date: '',
      period: '',
      time: ''
    });
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!formData.origin || !formData.destination || !formData.date) {
      alert("Please fill in all required fields.");
      return;
    }
    
    setLoading(true);
    try {
      const prediction = await predictFlightDelay(formData);
      setResult(prediction);
    } catch (error) {
      console.error(error);
      alert("Error predicting delay");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] bg-grid bg-fixed text-slate-300 font-sans selection:bg-cyan-500/30">
      
      {/* Header */}
      <header className="relative w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.5)]">
              <Plane className="text-white transform -rotate-45" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">FlightOps <span className="text-cyan-400">Control</span></h1>
              <p className="text-xs font-mono text-cyan-600 tracking-widest uppercase">Real-time Delay Prediction System</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-500">
             <span className="flex items-center gap-1"><Activity size={14} className="text-green-500" /> SYSTEM ONLINE</span>
             <span className="text-slate-700">|</span>
             <span>V.2.0.4-BETA</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: FORM */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 lg:p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>
              
              <div className="grid grid-cols-1 gap-6">
                
                {/* Route Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-cyan-400 mb-2">
                    <MapPin size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">Flight Route</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400 font-mono">ORIGIN AIRPORT</label>
                      <select 
                        name="origin" 
                        value={formData.origin}
                        onChange={handleInputChange}
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded p-3 text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all outline-none"
                      >
                        <option value="">Select Origin</option>
                        {BRAZILIAN_AIRPORTS.map(airport => (
                          <option key={airport.code} value={airport.code}>{airport.code} - {airport.city}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-slate-400 font-mono">DESTINATION</label>
                      <select 
                        name="destination"
                        value={formData.destination}
                        onChange={handleInputChange}
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded p-3 text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all outline-none"
                      >
                         <option value="">Select Dest</option>
                         {BRAZILIAN_AIRPORTS.map(airport => (
                          <option key={airport.code} value={airport.code}>{airport.code} - {airport.city}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Timing Section */}
                <div className="space-y-4 pt-4 border-t border-slate-800">
                  <div className="flex items-center gap-2 text-cyan-400 mb-2">
                    <Clock size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">Schedule Info</span>
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs text-slate-400 font-mono">FLIGHT DATE</label>
                     <div className="relative">
                       <input 
                         type="date" 
                         name="date"
                         value={formData.date}
                         onChange={handleInputChange}
                         className="w-full bg-slate-950 border border-slate-700 text-white rounded p-3 text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all outline-none pl-10 custom-calendar"
                       />
                       <Calendar size={16} className="absolute left-3 top-3.5 text-slate-500" />
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400 font-mono">PERIOD OF DAY</label>
                      <select 
                        name="period"
                        value={formData.period}
                        onChange={handleInputChange}
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded p-3 text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all outline-none"
                      >
                        <option value="">Select Period</option>
                        {PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400 font-mono">DEPARTURE TIME</label>
                      <input 
                        type="time" 
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded p-3 text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 flex gap-3">
                  <button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 px-6 rounded shadow-lg shadow-cyan-900/50 hover:shadow-cyan-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
                  >
                    {loading ? (
                      <>Processing <Activity className="animate-spin" size={16} /></>
                    ) : (
                      <>Predict Delay <ArrowRight size={16} /></>
                    )}
                  </button>
                  <button 
                    onClick={handleReset}
                    className="px-6 py-4 bg-slate-800 border border-slate-700 text-slate-300 font-bold rounded hover:bg-slate-700 hover:text-white transition-all uppercase tracking-wider text-sm"
                  >
                    Reset
                  </button>
                </div>

              </div>
            </div>
            
            {/* Helper Stat */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
               <StatsChart />
            </div>
          </div>

          {/* RIGHT COLUMN: RESULTS */}
          <div className="lg:col-span-7 space-y-6">
            {result ? (
              <div className="animate-fade-in-up space-y-6">
                
                {/* Main Prediction Card */}
                <PredictionResultCard result={result} />
                
                {/* Weather Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                     <WeatherPanel weather={result.weather} />
                  </div>
                  
                  {/* Alternative Airports Recommendation */}
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Alternative Route Suggestions</h3>
                    <div className="space-y-3">
                      {result.alternativeAirports.map((airport, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 bg-slate-950 rounded border border-slate-800 hover:border-slate-600 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-bold text-cyan-500">{airport.code}</span>
                            <span className="text-sm text-slate-400">{airport.city}</span>
                          </div>
                          <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded">Low Delay Risk</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Best Time Recommendation */}
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 flex flex-col justify-center items-center text-center">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Optimal Departure</h3>
                    <div className="text-3xl font-mono font-bold text-white mb-1">{result.bestDepartureTime}</div>
                    <p className="text-xs text-slate-500">Based on historical weather patterns for this date</p>
                  </div>
                </div>

                {/* PDF Report Button */}
                <ReportGenerator flightData={formData} prediction={result} />

              </div>
            ) : (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-slate-900/30 border border-slate-800/50 rounded-xl border-dashed">
                <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                  <Plane className="text-slate-600" size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-500 uppercase tracking-widest mb-2">Ready for Analysis</h3>
                <p className="text-slate-600 text-center max-w-xs">
                  Enter flight details in the control panel to generate a delay prediction and weather report.
                </p>
              </div>
            )}
          </div>

        </div>
      </main>
      
      <footer className="w-full text-center py-8 text-slate-600 text-xs font-mono uppercase tracking-widest">
        Powered by ML Prediction Engine &bull; FlightOps Control Systems &copy; 2024
      </footer>
    </div>
  );
}

export default App;