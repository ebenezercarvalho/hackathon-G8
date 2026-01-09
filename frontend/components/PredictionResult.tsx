import React from 'react';
import { PredictionResult, Language } from '../types';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { translations } from '../translations';

interface PredictionResultProps {
  result: PredictionResult;
  lang: Language;
}

const PredictionResultCard: React.FC<PredictionResultProps> = ({ result, lang }) => {
  const t = translations[lang];

  const getProbabilityColor = (label: string) => {
    switch (label) {
      case 'Muito baixa':
      case 'Baixa':
        return 'text-green-500';
      case 'Média':
        return 'text-yellow-500';
      case 'Alta':
      case 'Muito alta':
        return 'text-red-500';
      default:
        return 'text-white';
    }
  };

  const getProbabilityIcon = (label: string) => {
    switch (label) {
      case 'Muito baixa':
      case 'Baixa':
        return <CheckCircle className="text-green-500" size={48} />;
      case 'Média':
        return <Clock className="text-yellow-500" size={48} />;
      case 'Alta':
      case 'Muito alta':
        return <AlertTriangle className="text-red-500" size={48} />;
      default:
        return null;
    }
  };

  const getBackgroundColor = (label: string) => {
    switch (label) {
      case 'Muito baixa':
      case 'Baixa':
        return 'bg-green-950/20 shadow-[0_0_50px_-12px_rgba(34,197,94,0.15)]';
      case 'Média':
        return 'bg-yellow-950/20 shadow-[0_0_50px_-12px_rgba(234,179,8,0.15)]';
      case 'Alta':
      case 'Muito alta':
        return 'bg-red-950/20 shadow-[0_0_50px_-12px_rgba(239,68,68,0.15)]';
      default:
        return 'bg-slate-950/20';
    }
  };

  return (
    <div className={`
      relative overflow-hidden rounded-2xl border border-white/10 p-8 md:p-12 text-center transition-all duration-700
      ${getBackgroundColor(result.probabilityLabel)}
    `}>
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 flex flex-col items-center justify-center gap-6">
        <div className="mb-2">
          {getProbabilityIcon(result.probabilityLabel)}
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-base font-mono text-white uppercase tracking-[0.2em] mb-2">
            {t.delayProbTitle} {result.confidence}%
          </span>
          <h2 className={`text-2xl md:text-3xl font-black uppercase tracking-tight ${getProbabilityColor(result.probabilityLabel)}`}>
            {(t as any).delayLevel?.[result.probabilityLabel] || result.probabilityLabel}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default PredictionResultCard;