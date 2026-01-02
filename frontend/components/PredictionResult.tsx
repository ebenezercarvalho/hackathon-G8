import React from 'react';
import { PredictionResult, Language } from '../types';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { translations } from '../translations';
import ConfidenceGauge from './ConfidenceGauge';
import OnTimeProgressBar from './OnTimeProgressBar';

interface PredictionResultProps {
  result: PredictionResult;
  lang: Language;
}

const PredictionResultCard: React.FC<PredictionResultProps> = ({ result, lang }) => {
  const t = translations[lang];

  // Calculate on-time probability for the progress bar
  const onTimeProb = result.isDelayed ? 100 - result.confidence : result.confidence;

  return (
    <div className={`
      relative overflow-hidden rounded-xl border-2 p-6 md:p-10 text-center transition-all duration-500
      ${result.isDelayed
        ? 'border-red-500 bg-red-950/20 shadow-[0_0_50px_-12px_rgba(239,68,68,0.25)]'
        : 'border-green-500 bg-green-950/20 shadow-[0_0_50px_-12px_rgba(34,197,94,0.25)]'
      }
    `}>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:100%_4px] opacity-20 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 flex flex-col items-center justify-center">
        {result.isDelayed ? (
          <>
            <AlertTriangle size={64} className="text-red-500 mb-4 animate-pulse" aria-hidden="true" />
            <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 uppercase mb-8 tracking-tighter">
              {t.highDelayProb}
            </h2>
          </>
        ) : (
          <>
            <CheckCircle size={64} className="text-green-500 mb-4" aria-hidden="true" />
            <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 uppercase mb-8 tracking-tighter">
              {t.onTimeLikely}
            </h2>
          </>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-4 border-t border-white/10 pt-8">
          <ConfidenceGauge confidence={result.confidence} lang={lang} />
          <OnTimeProgressBar
            confidence={onTimeProb}
            isDelayed={result.isDelayed}
            lang={lang}
          />
        </div>
      </div>
    </div>
  );
};

export default PredictionResultCard;