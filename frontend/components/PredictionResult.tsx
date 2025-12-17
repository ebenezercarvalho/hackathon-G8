import React from 'react';
import { PredictionResult } from '../types';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface PredictionResultProps {
  result: PredictionResult;
}

const PredictionResultCard: React.FC<PredictionResultProps> = ({ result }) => {
  return (
    <div className={`
      relative overflow-hidden rounded-xl border-2 p-8 text-center transition-all duration-500
      ${result.isDelayed 
        ? 'border-red-500 bg-red-950/20 shadow-[0_0_50px_-12px_rgba(239,68,68,0.25)]' 
        : 'border-green-500 bg-green-950/20 shadow-[0_0_50px_-12px_rgba(34,197,94,0.25)]'
      }
    `}>
      {/* Decorative scan lines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:100%_4px] opacity-20 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center">
        {result.isDelayed ? (
          <>
            <AlertTriangle size={64} className="text-red-500 mb-4 animate-pulse" />
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 uppercase mb-2 tracking-tighter">
              High Probability of Delay
            </h2>
            <p className="text-red-200 text-lg mb-6 max-w-md mx-auto">
              {result.reason || "Operational conditions indicate a delay."}
            </p>
          </>
        ) : (
          <>
            <CheckCircle size={64} className="text-green-500 mb-4" />
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 uppercase mb-2 tracking-tighter">
              On Time Departure Likely
            </h2>
            <p className="text-green-200 text-lg mb-6">
              Conditions are favorable for a scheduled departure.
            </p>
          </>
        )}

        <div className="grid grid-cols-2 gap-8 w-full max-w-lg mt-4 border-t border-white/10 pt-6">
          <div className="flex flex-col items-center">
            <span className="text-xs uppercase tracking-widest text-slate-400 mb-1">Confidence Score</span>
            <span className={`text-3xl font-mono font-bold ${result.isDelayed ? 'text-red-400' : 'text-green-400'}`}>
              {result.confidence}%
            </span>
          </div>
          {result.isDelayed && result.delayMinutes && (
             <div className="flex flex-col items-center">
             <span className="text-xs uppercase tracking-widest text-slate-400 mb-1">Est. Delay</span>
             <span className="text-3xl font-mono font-bold text-orange-400 flex items-center gap-2">
               <Clock size={20} /> ~{result.delayMinutes}m
             </span>
           </div>
          )}
          {!result.isDelayed && (
             <div className="flex flex-col items-center">
             <span className="text-xs uppercase tracking-widest text-slate-400 mb-1">Historical Rate</span>
             <span className="text-3xl font-mono font-bold text-cyan-400">
               {result.historicalDelayRate}%
             </span>
           </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictionResultCard;