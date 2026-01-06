import React from 'react';
import { PredictionResult, Language } from '../types';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { translations } from '../translations';

interface PredictionResultProps {
  result: PredictionResult;
  lang: Language;
}

const PredictionResultCard: React.FC<PredictionResultProps> = ({ result, lang }) => {
  const t = translations[lang];

  return (
    <div className={`
      relative overflow-hidden rounded-2xl border border-white/10 p-8 md:p-12 text-center transition-all duration-700
      ${result.isDelayed
        ? 'bg-red-950/20 shadow-[0_0_50px_-12px_rgba(239,68,68,0.15)]'
        : 'bg-green-950/20 shadow-[0_0_50px_-12px_rgba(34,197,94,0.15)]'
      }
    `}>
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 flex flex-col items-center justify-center">
        {result.isDelayed ? (
          <>
            <div className="p-4 bg-red-500/10 rounded-full mb-6 ring-1 ring-red-500/20">
              <AlertTriangle size={48} className="text-red-500 animate-pulse" aria-hidden="true" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase mb-2 tracking-tighter">
              {t.highDelayProb}
            </h2>
          </>
        ) : (
          <>
            <div className="p-4 bg-green-500/10 rounded-full mb-6 ring-1 ring-green-500/20">
              <CheckCircle size={48} className="text-green-500" aria-hidden="true" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase mb-2 tracking-tighter">
              {t.onTimeLikely}
            </h2>
          </>
        )}

        <div className="w-full mt-10 border-t border-white/5 pt-10 flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">
              {t.confidence}
            </span>
            <span className={`text-5xl font-black font-mono tracking-tighter ${result.confidence < 30 ? 'text-green-500' : result.confidence < 60 ? 'text-yellow-500' : 'text-red-500'
              }`}>
              {result.confidence}%
            </span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">
              {t.routing} (Risk Level)
            </span>
            <span className={`text-2xl font-bold tracking-tight ${result.confidence < 30 ? 'text-green-500' : result.confidence < 60 ? 'text-yellow-500' : 'text-red-500'
              }`}>
              {(t as any).delayLevel?.[result.probabilityLabel] || result.probabilityLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionResultCard;