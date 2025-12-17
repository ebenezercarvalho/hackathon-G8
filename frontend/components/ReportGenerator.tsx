import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FileText, Download, Loader2 } from 'lucide-react';
import { FlightFormData, PredictionResult } from '../types';

interface ReportProps {
  flightData: FlightFormData;
  prediction: PredictionResult;
}

const ReportGenerator: React.FC<ReportProps> = ({ flightData, prediction }) => {
  const [generating, setGenerating] = useState(false);

  const generatePDF = () => {
    setGenerating(true);
    
    // Simulate processing time
    setTimeout(() => {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Header
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setTextColor(34, 211, 238); // cyan-400
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text("FlightOps Control", 14, 20);
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text("PREDICTION ANALYSIS REPORT", 14, 30);
      doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 14, 30, { align: 'right' });

      // Section 1: Flight Details
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text("1. Flight Information", 14, 50);

      autoTable(doc, {
        startY: 55,
        head: [['Origin', 'Destination', 'Date', 'Dep. Time', 'Period']],
        body: [
          [flightData.origin, flightData.destination, flightData.date, flightData.time, flightData.period]
        ],
        theme: 'grid',
        headStyles: { fillColor: [6, 182, 212] }, // cyan-500
      });

      // Section 2: Prediction Result
      const finalY = (doc as any).lastAutoTable.finalY + 15;
      doc.text("2. Prediction Analysis", 14, finalY);

      doc.setFontSize(12);
      if (prediction.isDelayed) {
        doc.setTextColor(220, 38, 38); // Red
        doc.text(`STATUS: HIGH PROBABILITY OF DELAY`, 14, finalY + 10);
      } else {
        doc.setTextColor(22, 163, 74); // Green
        doc.text(`STATUS: ON TIME DEPARTURE LIKELY`, 14, finalY + 10);
      }
      
      doc.setTextColor(0,0,0);
      doc.setFontSize(10);
      doc.text(`Confidence Score: ${prediction.confidence}%`, 14, finalY + 18);
      if (prediction.isDelayed) {
        doc.text(`Estimated Delay: ~${prediction.delayMinutes} minutes`, 14, finalY + 24);
        doc.text(`Primary Factor: ${prediction.reason}`, 14, finalY + 30);
      }

      // Section 3: Weather Data
      const weatherY = finalY + 40;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text("3. Meteorological Conditions", 14, weatherY);

      autoTable(doc, {
        startY: weatherY + 5,
        head: [['Condition', 'Temp', 'Wind', 'Humidity', 'Pressure']],
        body: [
          [
            prediction.weather.condition,
            `${prediction.weather.temp}°C`,
            `${prediction.weather.windSpeed.toFixed(1)} km/h`,
            `${prediction.weather.humidity}%`,
            `${prediction.weather.pressure} hPa`
          ]
        ],
        theme: 'striped',
        headStyles: { fillColor: [30, 41, 59] }, // slate-800
      });

      // Section 4: Recommendations
      const recY = (doc as any).lastAutoTable.finalY + 15;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text("4. Strategic Recommendations", 14, recY);

      const recommendations = [
        ['Best Time to Fly', prediction.bestDepartureTime],
        ['Historical Delay Rate', `${prediction.historicalDelayRate}% for this route/time`],
        ['Alternative Airports', prediction.alternativeAirports.map(a => a.code).join(', ')]
      ];

      autoTable(doc, {
        startY: recY + 5,
        body: recommendations,
        theme: 'plain',
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60 } }
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
        className="group relative inline-flex items-center gap-3 px-8 py-3 bg-slate-800 text-cyan-400 border border-cyan-900 rounded hover:bg-cyan-950 hover:border-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {generating ? <Loader2 className="animate-spin" size={20} /> : <FileText size={20} />}
        <span className="font-mono font-bold tracking-wider">
          {generating ? 'GENERATING REPORT...' : 'DOWNLOAD FULL REPORT PDF'}
        </span>
        <div className="absolute inset-0 rounded ring-1 ring-inset ring-cyan-500/20 group-hover:ring-cyan-400/50" />
      </button>
    </div>
  );
};

export default ReportGenerator;