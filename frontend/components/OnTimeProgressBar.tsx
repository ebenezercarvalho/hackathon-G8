import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';

interface OnTimeProgressBarProps {
    confidence: number; // 0-100
    isDelayed: boolean;
    lang: Language;
}

const OnTimeProgressBar: React.FC<OnTimeProgressBarProps> = ({ confidence, isDelayed, lang }) => {
    const t = translations[lang];

    // Clamp confidence between 0 and 100
    const value = Math.max(0, Math.min(100, confidence));

    // Determine color based on prediction and confidence
    const getColor = () => {
        if (isDelayed) {
            return 'from-red-600 to-red-400';
        }
        if (value >= 70) return 'from-green-600 to-green-400';
        if (value >= 40) return 'from-yellow-600 to-yellow-400';
        return 'from-orange-600 to-orange-400';
    };

    const gradientClass = getColor();

    return (
        <div className="flex flex-col p-6 bg-slate-950/50 rounded-xl border border-slate-700">
            <h3 className="text-sm font-mono font-bold text-cyan-400 uppercase tracking-widest mb-4 text-center">
                {t.onTimeProbability}
            </h3>

            {/* Progress Bar Container */}
            <div className="relative w-full h-8 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                {/* Progress Fill */}
                <div
                    className={`h-full bg-gradient-to-r ${gradientClass} transition-all duration-1000 ease-out flex items-center justify-end pr-3`}
                    style={{ width: `${value}%` }}
                >
                    {value > 15 && (
                        <span className="text-white text-xs font-bold font-mono drop-shadow-lg">
                            {value}%
                        </span>
                    )}
                </div>

                {/* Percentage outside bar if too small */}
                {value <= 15 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-slate-400 text-xs font-bold font-mono">
                            {value}%
                        </span>
                    </div>
                )}
            </div>

            {/* Scale Markers */}
            <div className="flex justify-between mt-2 px-1">
                <span className="text-[10px] text-slate-500 font-mono">0%</span>
                <span className="text-[10px] text-slate-500 font-mono">25%</span>
                <span className="text-[10px] text-slate-500 font-mono">50%</span>
                <span className="text-[10px] text-slate-500 font-mono">75%</span>
                <span className="text-[10px] text-slate-500 font-mono">100%</span>
            </div>

            {/* Status Label */}
            <div className="text-center mt-3">
                <span className={`text-sm font-bold uppercase tracking-wide ${isDelayed ? 'text-red-400' : 'text-green-400'
                    }`}>
                    {isDelayed ? t.highDelayProb : t.onTimeLikely}
                </span>
            </div>
        </div>
    );
};

export default OnTimeProgressBar;
