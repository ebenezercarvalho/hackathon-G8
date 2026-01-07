import React, { useState } from 'react';
import { Plane, Calendar, Clock, MapPin, Activity, ArrowRight, Languages, Loader2 } from 'lucide-react';
import { FlightFormData, PredictionResult, Language, Airport, Airline } from './types';
import { predictFlightDelay, ApiError } from './services/predictionService';
import { useToast } from './context/ToastContext';
import { translations } from './translations';
import PredictionResultCard from './components/PredictionResult';
import WeatherPanel from './components/WeatherPanel';
import ReportGenerator from './components/ReportGenerator';
import Autocomplete from './components/Autocomplete';
import logo from './assets/logo.png';

function App() {
  // 2) Set Portuguese as the default host language
  const [lang, setLang] = useState<Language>('pt');
  const t = translations[lang];
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [formData, setFormData] = useState<FlightFormData>({
    origin: null,
    destination: null,
    airline: null,
    date: '',
    time: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAutocompleteChange = (name: 'origin' | 'destination' | 'airline', value: Airport | Airline) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData({ origin: null, destination: null, airline: null, date: '', time: '' });
    setResult(null);
    setHasStarted(false);
    setResetKey(prev => prev + 1);
  };

  const handleSubmit = async () => {
    if (!formData.origin || !formData.destination || !formData.date || !formData.airline || !formData.time) {
      showToast(t.error400, 'error');
      return;
    }

    // Date validation
    const now = new Date();
    const flightDate = new Date(`${formData.date}T${formData.time}:00`);
    if (flightDate <= now) {
      showToast(t.errorDateFuture, 'error');
      setResult(null);
      setHasStarted(false);
      setLoading(false);
      return;
    }

    setHasStarted(true);
    setLoading(true);
    setResult(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      setLoading(false);
      setHasStarted(false);
      setResult(null);
    }, 3000);

    try {
      const prediction = await predictFlightDelay(formData);
      clearTimeout(timeoutId);

      if (!controller.signal.aborted) {
        setResult(prediction);

        if (prediction.weather?.condition === 'Unknown') {
          showToast(t.errorWeather, 'info');
        }
      }

    } catch (error: any) {
      setHasStarted(false);
      setResult(null);
      if (error.name === 'AbortError') {
        return;
      }
      console.error(error);
      if (error instanceof ApiError) {
        switch (error.status) {
          case 400: showToast(t.error400, 'error'); break;
          case 500: showToast(t.error500, 'error'); break;
          case 502: showToast(t.error502, 'error'); break;
          case 503: showToast(t.error503, 'error'); break;
          default: showToast(t.error500, 'error');
        }
      } else {
        showToast(t.errorML, 'error');
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  };

  return (
    // 1) Inverse gradient: from clear (slate-800) to dark (black)
    <div className="min-h-screen bg-gradient-to-b from-slate-800 via-[#020617] to-black bg-fixed text-slate-300 font-sans selection:bg-cyan-500/30">

      {/* Header */}
      <header className="relative w-full h-[106px] border-b border-slate-700 bg-slate-900/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-0.5 h-full flex items-center justify-between">
          <div className="flex items-center gap-[7px]">
            <div className="">
              <img src={logo} alt="Chronos Logo" className="h-[102px] w-auto" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">{t.title}</h1>
              <p className="text-[10px] font-mono text-cyan-600 tracking-widest uppercase">{t.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-950/50 border border-slate-700 rounded-full px-3 py-1.5">
              <Languages size={14} className="text-cyan-500" aria-hidden="true" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
                className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer"
                aria-label="Change language"
              >
                <option value="pt" className="bg-slate-900">PT</option>
                <option value="en" className="bg-slate-900">EN</option>
                <option value="es" className="bg-slate-900">ES</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 space-y-12">

        {/* DATA ENTRY SECTION */}
        <section className="bg-slate-950/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 lg:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" aria-hidden="true"></div>

          <div className="grid grid-cols-1 gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-cyan-400 border-b border-slate-800 pb-2">
                <MapPin size={18} aria-hidden="true" />
                <h2 className="text-sm font-bold uppercase tracking-widest">{t.routing}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Autocomplete
                  key={`origin-${resetKey}`}
                  label={t.origin}
                  placeholder={t.searchPlaceholder}
                  endpoint="aeroportos"
                  value={formData.origin}
                  onChange={(val) => handleAutocompleteChange('origin', val as Airport)}
                  lang={lang}
                />
                <Autocomplete
                  key={`destination-${resetKey}`}
                  label={t.destination}
                  placeholder={t.searchPlaceholder}
                  endpoint="aeroportos"
                  value={formData.destination}
                  onChange={(val) => handleAutocompleteChange('destination', val as Airport)}
                  lang={lang}
                />
              </div>

              <Autocomplete
                key={`airline-${resetKey}`}
                label={t.airline}
                placeholder={t.searchPlaceholder}
                endpoint="companhia-aerea"
                value={formData.airline}
                onChange={(val) => handleAutocompleteChange('airline', val as Airline)}
                lang={lang}
              />
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2 text-cyan-400 border-b border-slate-800 pb-2">
                <Clock size={18} aria-hidden="true" />
                <h2 className="text-sm font-bold uppercase tracking-widest">{t.timing}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="date" className="text-xs text-slate-400 font-mono block uppercase">{t.date}</label>
                  <input
                    id="date"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950/80 border border-slate-700 text-white rounded p-3 text-sm focus:ring-1 focus:ring-cyan-500 transition-all outline-none"
                    aria-required="true"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="time" className="text-xs text-slate-400 font-mono block uppercase">{t.exactTime}</label>
                  <input
                    id="time"
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950/80 border border-slate-700 text-white rounded p-3 text-sm focus:ring-1 focus:ring-cyan-500 outline-none"
                    aria-required="true"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 uppercase tracking-wider text-sm"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
                {loading ? t.analyzing : t.predict}
              </button>
              <button
                onClick={handleReset}
                className="px-8 py-4 bg-slate-900 border border-slate-700 text-slate-300 font-bold rounded-xl hover:bg-slate-800 transition-all uppercase tracking-wider text-sm"
              >
                {t.reset}
              </button>
            </div>
          </div>
        </section>

        {/* RESULTS SECTION */}
        <div aria-live="polite" className="transition-all duration-700">
          {loading && !result && (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
              <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4" aria-hidden="true"></div>
              <h3 className="text-xl font-bold text-cyan-500 uppercase tracking-widest">{t.analyzing}</h3>
              <p className="text-slate-500 text-sm mt-2">{t.connectingNodes}</p>
            </div>
          )}

          {hasStarted && !loading && !result && (
            <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-950/20">
              <Loader2 className="mx-auto text-slate-700 mb-4 animate-spin" size={48} aria-hidden="true" />
              <h3 className="text-lg font-bold text-slate-600 uppercase tracking-widest">{t.waiting}</h3>
              <p className="text-slate-700 text-sm">{t.waitingDesc}</p>
            </div>
          )}

          {result && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
              <PredictionResultCard result={result} lang={lang} />
              <WeatherPanel weather={result.weather} lang={lang} />
              <ReportGenerator
                flightData={{
                  ...formData,
                  origin: formData.origin?.nome || '',
                  destination: formData.destination?.nome || '',
                  airline: formData.airline?.nome || ''
                } as any}
                prediction={result}
                lang={lang}
              />


            </div>
          )}
        </div>
      </main>

      <footer className="w-full text-center py-12 text-slate-600 text-[10px] font-mono uppercase tracking-[0.2em] opacity-50">
        &copy; 2025 Hackaton ONE by Chronos Team
      </footer>
    </div>
  );
}

export default App;