import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FileText, Loader2 } from 'lucide-react';
import { FlightFormData, PredictionResult, Language } from '../types';
import { translations } from '../translations';

interface ReportProps {
  flightData: FlightFormData;
  prediction: PredictionResult;
  lang: Language;
}

const ReportGenerator: React.FC<ReportProps> = ({ flightData, prediction, lang }) => {
  const [generating, setGenerating] = useState(false);
  const t = translations[lang];

  const generatePDF = () => {
    setGenerating(true);
    
    setTimeout(() => {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Header
      doc.setFillColor(15, 23, 42); 
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setTextColor(34, 211, 238); 
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text(t.title, 14, 20);
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(t.reportTitle, 14, 30);
      doc.text(`DATE: ${new Date().toLocaleString()}`, pageWidth - 14, 30, { align: 'right' });

      // Flight Information
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`1. ${t.flightDetails}`, 14, 50);

      autoTable(doc, {
        startY: 55,
        head: [[t.origin, t.destination, t.date, t.exactTime, t.airline]],
        body: [
          [flightData.origin, flightData.destination, flightData.date, flightData.time, flightData.airline]
        ],
        theme: 'grid',
        headStyles: { fillColor: [6, 182, 212] },
      });

      // Prediction Result
      const finalY = (doc as any).lastAutoTable.finalY + 15;
      doc.text(`2. ${t.predictionHeader}`, 14, finalY);

      doc.setFontSize(12);
      if (prediction.isDelayed) {
        doc.setTextColor(220, 38, 38);
        doc.text(`STATUS: ${t.highDelayProb.toUpperCase()}`, 14, finalY + 10);
      } else {
        doc.setTextColor(22, 163, 74);
        doc.text(`STATUS: ${t.onTimeLikely.toUpperCase()}`, 14, finalY + 10);
      }
      
      doc.setTextColor(0,0,0);
      doc.setFontSize(12);
      doc.text(`${t.confidence}: ${prediction.confidence}%`, 14, finalY + 20);

      // Weather Data
      const weatherY = finalY + 35;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`3. ${t.metForecastHeader}`, 14, weatherY);

      autoTable(doc, {
        startY: weatherY + 5,
        head: [[t.skyCondition, t.tempRange, t.windSpeed, t.humidity, t.rainProb]],
        body: [
          [
            prediction.weather.condition,
            `${Math.round(prediction.weather.minTemp)}° / ${Math.round(prediction.weather.maxTemp)}°C`,
            `${prediction.weather.windSpeed.toFixed(1)} km/h`,
            `${prediction.weather.humidity}%`,
            `${prediction.weather.rainProbability}%`
          ]
        ],
        theme: 'striped',
        headStyles: { fillColor: [30, 41, 59] },
      });

      doc.save(`flight_report_${flightData.origin}_${flightData.destination}.pdf`);
      setGenerating(false);
    }, 1000);
  };

  return (
    <div className="mt-6 flex justify-center">
      <button
        onClick={generatePDF}
        disabled={generating}
        className="group relative inline-flex items-center gap-3 px-10 py-4 bg-slate-800 text-cyan-400 border border-cyan-900 rounded-xl hover:bg-cyan-950 hover:border-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {generating ? <Loader2 className="animate-spin" size={20} /> : <FileText size={20} />}
        <span className="font-mono font-bold tracking-wider uppercase text-xs">
          {generating ? t.generatingReport : t.downloadReport}
        </span>
        <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-cyan-500/20 group-hover:ring-cyan-400/50" />
      </button>
    </div>
  );
};

export default ReportGenerator;