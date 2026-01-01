import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';

interface ConfidenceGaugeProps {
    confidence: number; // 0-100
    lang: Language;
}

const ConfidenceGauge: React.FC<ConfidenceGaugeProps> = ({ confidence, lang }) => {
    const t = translations[lang];

    // Clamp confidence between 0 and 100
    const value = Math.max(0, Math.min(100, confidence));

    // Calculate needle angle (-90 to 90 degrees)
    const angle = (value / 100) * 180 - 90;

    // Determine color based on confidence level
    const getColor = (conf: number) => {
        if (conf < 40) return '#ef4444'; // red
        if (conf < 70) return '#f59e0b'; // yellow/orange
        return '#10b981'; // green
    };

    const color = getColor(value);

    // Confidence level label
    const getConfidenceLevel = (conf: number) => {
        if (conf < 40) return t.lowConfidence;
        if (conf < 70) return t.mediumConfidence;
        return t.highConfidence;
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-slate-950/50 rounded-xl border border-slate-700">
            <h3 className="text-sm font-mono font-bold text-cyan-400 uppercase tracking-widest mb-4">
                {t.confidenceGauge}
            </h3>

            {/* SVG Gauge */}
            <svg width="200" height="120" viewBox="0 0 200 120" className="mb-4">
                {/* Background Arc */}
                <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="20"
                    strokeLinecap="round"
                />

                {/* Colored Segments */}
                {/* Red segment (0-40%) */}
                <path
                    d="M 20 100 A 80 80 0 0 1 72 36"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="20"
                    strokeLinecap="round"
                    opacity="0.3"
                />

                {/* Yellow segment (40-70%) */}
                <path
                    d="M 72 36 A 80 80 0 0 1 128 36"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="20"
                    strokeLinecap="round"
                    opacity="0.3"
                />

                {/* Green segment (70-100%) */}
                <path
                    d="M 128 36 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="20"
                    strokeLinecap="round"
                    opacity="0.3"
                />

                {/* Active Arc (shows current value) */}
                <path
                    d={`M 20 100 A 80 80 0 ${value > 50 ? '1' : '0'} 1 ${100 + 80 * Math.cos((angle * Math.PI) / 180)} ${100 - 80 * Math.sin((angle * Math.PI) / 180)}`}
                    fill="none"
                    stroke={color}
                    strokeWidth="20"
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                />

                {/* Center Circle */}
                <circle cx="100" cy="100" r="8" fill="#0f172a" />

                {/* Needle */}
                <line
                    x1="100"
                    y1="100"
                    x2={100 + 70 * Math.cos((angle * Math.PI) / 180)}
                    y2={100 - 70 * Math.sin((angle * Math.PI) / 180)}
                    stroke={color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                    style={{ transformOrigin: '100px 100px' }}
                />

                {/* Needle tip circle */}
                <circle
                    cx={100 + 70 * Math.cos((angle * Math.PI) / 180)}
                    cy={100 - 70 * Math.sin((angle * Math.PI) / 180)}
                    r="4"
                    fill={color}
                    className="transition-all duration-1000 ease-out"
                />
            </svg>

            {/* Value Display */}
            <div className="text-center">
                <div className="text-4xl font-bold font-mono mb-1" style={{ color }}>
                    {value}%
                </div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">
                    {getConfidenceLevel(value)}
                </div>
            </div>
        </div>
    );
};

export default ConfidenceGauge;
