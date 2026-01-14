import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { FileText, Loader2 } from 'lucide-react';
import { FlightFormData, PredictionResult, Language } from '../types';
import { translations } from '../translations';

import logoImg from '../assets/logo.png';
import totalVoosImg from '../assets/Total_voos_realizados.png';
import atrasosMesImg from '../assets/atrasos_por_mes.png';
import atrasosHoraImg from '../assets/atrasos_por_hora.png';
import atrasosDiaImg from '../assets/atrasos_por_dia_semana.png';
import mediaAtrasoImg from '../assets/media_atraso_por_hora.png';

interface ReportProps {
  flightData: FlightFormData;
  prediction: PredictionResult;
  lang: Language;
}

// Helper to load image as base64
// Helper to load image as base64 with compression
const loadImageAsBase64 = (src: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        // Use JPEG with 0.7 quality to significantly reduce PDF size
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      } else {
        reject(new Error('Could not get canvas context'));
      }
    };
    img.onerror = reject;
    img.src = src;
  });
};

const ReportGenerator: React.FC<ReportProps> = ({ flightData, prediction, lang }) => {
  const [generating, setGenerating] = useState(false);
  const [images, setImages] = useState<Record<string, string>>({});
  const t = translations[lang];

  // Preload images on mount
  useEffect(() => {
    const loadImages = async () => {
      try {
        const imageFiles = [
          { key: 'logo', src: logoImg },
          { key: 'totalVoos', src: totalVoosImg },
          { key: 'atrasosMes', src: atrasosMesImg },
          { key: 'atrasosHora', src: atrasosHoraImg },
          { key: 'atrasosDia', src: atrasosDiaImg },
          { key: 'mediaAtraso', src: mediaAtrasoImg }
        ];

        const loaded: Record<string, string> = {};
        for (const { key, src } of imageFiles) {
          try {
            loaded[key] = await loadImageAsBase64(src);
          } catch (e) {
            console.warn(`Could not load image: ${src}`);
          }
        }
        setImages(loaded);
      } catch (e) {
        console.error('Error loading images:', e);
      }
    };
    loadImages();
  }, []);

  const getDelayLabel = (prob: number): string => {
    if (prob <= 20) return t.delayLevel["Muito baixa"];
    if (prob <= 40) return t.delayLevel["Baixa"];
    if (prob <= 60) return t.delayLevel["Média"];
    if (prob <= 80) return t.delayLevel["Alta"];
    return t.delayLevel["Muito alta"];
  };

  const translateCondition = (condition: string): string => {
    const mapping: Record<string, string> = {
      'Clear': t.clear || 'Céu Limpo',
      'Clouds': t.clouds || 'Nublado',
      'Rain': t.rain || 'Chuva',
      'Thunderstorm': t.thunderstorm || 'Tempestade',
      'Snow': t.snow || 'Neve',
      'Unknown': t.unknown || 'Desconhecido'
    };
    return mapping[condition] || condition;
  };

  const generatePDF = async () => {
    setGenerating(true);

    try {
      // A4 dimensions: 210mm x 297mm
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 12;
      const contentWidth = pageWidth - (margin * 2);

      // Colors
      const bgColor: [number, number, number] = [11, 20, 36]; // #0b1424
      const slateColor: [number, number, number] = [30, 41, 59]; // #1e293b
      const cyanColor: [number, number, number] = [6, 182, 212]; // #06b6d4
      const whiteColor: [number, number, number] = [255, 255, 255];
      const slate400: [number, number, number] = [148, 163, 184];
      const slate500: [number, number, number] = [100, 116, 139];

      // Full page background
      doc.setFillColor(...bgColor);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');

      let yPos = margin;

      // ========== HEADER ==========
      const headerHeight = 18;

      // Logo (Official)
      if (images.logo) {
        try {
          doc.addImage(images.logo, 'PNG', margin, yPos, 16, 16);
        } catch (e) {
          // Fallback to placeholder box if logo fails
          doc.setFillColor(...slateColor);
          doc.roundedRect(margin, yPos, 16, 16, 2, 2, 'F');
        }
      } else {
        doc.setFillColor(...slateColor);
        doc.roundedRect(margin, yPos, 16, 16, 2, 2, 'F');
      }

      // Title
      doc.setTextColor(...whiteColor);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(t.title + ' Report', margin + 22, yPos + 8);

      doc.setTextColor(...cyanColor);
      doc.setFontSize(7);
      doc.text(t.labelPredictionSystem.toUpperCase(), margin + 22, yPos + 13);

      // Date of emission
      doc.setTextColor(...slate500);
      doc.setFontSize(6);
      doc.text(t.emissionDate, pageWidth - margin, yPos + 4, { align: 'right' });
      doc.setTextColor(...slate400);
      doc.setFontSize(8);
      const locales = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' };
      doc.text(new Date().toLocaleDateString(locales[lang]), pageWidth - margin, yPos + 9, { align: 'right' });

      yPos += headerHeight + 4;

      // Divider line
      doc.setDrawColor(...slateColor);
      doc.setLineWidth(0.3);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 6;

      // ========== ROW 1: VOO | PROBABILIDADE | CLIMA ==========
      const row1Height = 50;
      const col1Width = contentWidth * 0.42;
      const col2Width = contentWidth * 0.33;
      const col3Width = contentWidth * 0.25;

      // Box 1: VOO
      doc.setFillColor(15, 23, 42);
      doc.roundedRect(margin, yPos, col1Width - 2, row1Height, 2, 2, 'F');
      doc.setDrawColor(...slateColor);
      doc.roundedRect(margin, yPos, col1Width - 2, row1Height, 2, 2, 'S');

      doc.setTextColor(...cyanColor);
      doc.setFontSize(6);
      doc.setFont('helvetica', 'bold');
      doc.text(t.flightDetails.toUpperCase(), margin + 4, yPos + 6);

      doc.setTextColor(...slate500);
      doc.setFontSize(5);
      doc.text(t.labelOrigin, margin + 4, yPos + 14);
      doc.setTextColor(...whiteColor);
      doc.setFontSize(8);
      const originText = flightData.origin?.nome || 'N/A';
      doc.text(originText.substring(0, 35), margin + 4, yPos + 19);

      doc.setTextColor(...slate500);
      doc.setFontSize(5);
      doc.text(t.labelDestination, margin + 4, yPos + 27);
      doc.setTextColor(...whiteColor);
      doc.setFontSize(8);
      const destText = flightData.destination?.nome || 'N/A';
      doc.text(destText.substring(0, 35), margin + 4, yPos + 32);

      // Divider
      doc.setDrawColor(30, 41, 59);
      doc.line(margin + 4, yPos + 37, margin + col1Width - 6, yPos + 37);

      doc.setTextColor(...slate500);
      doc.setFontSize(5);
      doc.text(t.labelAirline, margin + 4, yPos + 42);
      doc.setTextColor(...cyanColor);
      doc.setFontSize(7);
      doc.text(flightData.airline?.nome?.substring(0, 20) || 'N/A', margin + 4, yPos + 47);

      doc.setTextColor(...slate500);
      doc.setFontSize(5);
      doc.text(t.labelDate, margin + col1Width - 35, yPos + 42);
      doc.setTextColor(...slate400);
      doc.setFontSize(7);
      // Format date to DD/MM/YYYY
      const formattedDate = flightData.date ? flightData.date.split('-').reverse().join('/') : 'N/A';
      doc.text(formattedDate, margin + col1Width - 35, yPos + 47);

      // Box 2: PROBABILIDADE DE ATRASO
      const box2X = margin + col1Width;
      doc.setFillColor(15, 23, 42);
      doc.roundedRect(box2X, yPos, col2Width - 2, row1Height, 2, 2, 'F');
      doc.setDrawColor(...slateColor);
      doc.roundedRect(box2X, yPos, col2Width - 2, row1Height, 2, 2, 'S');

      doc.setTextColor(...cyanColor);
      doc.setFontSize(6);
      doc.text(t.labelDelayProb.toUpperCase(), box2X + 4, yPos + 6);

      const delayProb = 100 - prediction.confidence;

      // Determine risk color based on percentage (matching frontend)
      let riskColor: [number, number, number] = [255, 255, 255];
      if (delayProb <= 40) riskColor = [34, 197, 94]; // Green
      else if (delayProb <= 60) riskColor = [234, 179, 8]; // Yellow
      else riskColor = [239, 68, 68]; // Red

      doc.setTextColor(...whiteColor);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(`${delayProb}%`, box2X + 4, yPos + 20);

      // Progress bar
      doc.setFillColor(...slateColor);
      doc.roundedRect(box2X + 4, yPos + 24, col2Width - 12, 3, 1, 1, 'F');
      doc.setFillColor(...riskColor);
      const barWidth = (delayProb / 100) * (col2Width - 12);
      doc.roundedRect(box2X + 4, yPos + 24, barWidth, 3, 1, 1, 'F');

      doc.setTextColor(...riskColor);
      doc.setFontSize(8);
      doc.text(getDelayLabel(delayProb).toUpperCase(), box2X + 4, yPos + 33);

      // Model info
      doc.setDrawColor(30, 41, 59);
      doc.line(box2X + 4, yPos + 38, box2X + col2Width - 6, yPos + 38);
      doc.setTextColor(...slate400);
      doc.setFontSize(5);
      const modelText = t.analysisDesc2;
      const modelLines = doc.splitTextToSize(modelText, col2Width - 12);
      doc.text(modelLines, box2X + 4, yPos + 43);

      // Box 3: CLIMA
      const box3X = margin + col1Width + col2Width;
      doc.setFillColor(15, 23, 42);
      doc.roundedRect(box3X, yPos, col3Width, row1Height, 2, 2, 'F');
      doc.setDrawColor(...slateColor);
      doc.roundedRect(box3X, yPos, col3Width, row1Height, 2, 2, 'S');

      doc.setTextColor(...cyanColor);
      doc.setFontSize(6);
      doc.text(t.labelWeather.toUpperCase(), box3X + 4, yPos + 6);

      if (prediction.weather) {
        doc.setTextColor(...cyanColor);
        doc.setFontSize(7);
        doc.text(translateCondition(prediction.weather.condition).toUpperCase(), box3X + 4, yPos + 12);

        const weatherY = yPos + 17;

        // Temp
        doc.setTextColor(...slate500);
        doc.setFontSize(4);
        doc.text(`🌡 ${t.labelTemp.toUpperCase()}`, box3X + 4, weatherY);
        doc.setTextColor(...whiteColor);
        doc.setFontSize(6);
        doc.text(`${Math.round(prediction.weather.minTemp)}° / ${Math.round(prediction.weather.maxTemp)}°C`, box3X + 4, weatherY + 3);

        // Wind
        doc.setTextColor(...slate500);
        doc.setFontSize(4);
        doc.text(`🌬 ${t.labelWind.toUpperCase()}`, box3X + 4, weatherY + 8);
        doc.setTextColor(...whiteColor);
        doc.setFontSize(6);
        doc.text(`${prediction.weather.windSpeed.toFixed(1)} km/h`, box3X + 4, weatherY + 11);

        // Humidity & Rain
        doc.setTextColor(...slate500);
        doc.setFontSize(4);
        doc.text(`💧 ${t.labelHumidity.toUpperCase()}`, box3X + 4, weatherY + 16);
        doc.setTextColor(...whiteColor);
        doc.setFontSize(6);
        doc.text(`${prediction.weather.humidity}%`, box3X + 4, weatherY + 19);

        doc.setTextColor(...slate500);
        doc.setFontSize(4);
        doc.text(`🌧/🌩 ${t.rainProb.toUpperCase()}`, box3X + 4, weatherY + 24);
        doc.setTextColor(...whiteColor);
        doc.setFontSize(6);
        doc.text(`${prediction.weather.rainProbability}%`, box3X + 4, weatherY + 27);

        // Weather Attribution Link
        doc.setTextColor(...cyanColor);
        doc.setFontSize(3.5);
        const attributionText = "Dados meteorológicos por Open-Meteo.com";
        doc.text(attributionText, box3X + 4, yPos + 48, { url: 'https://open-meteo.com' });
      } else {
        doc.setTextColor(...slate400);
        doc.setFontSize(6);
        doc.text(t.labelUnknown, box3X + 4, yPos + 20);
      }

      yPos += row1Height + 6;

      // ========== ANÁLISE GERAL ==========
      doc.setDrawColor(...slateColor);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 6;

      doc.setTextColor(...whiteColor);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(t.analyticsHeader, margin, yPos);
      yPos += 6;

      doc.setTextColor(...slate400);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      const analysisText1 = t.analysisDesc1;
      const analysisLines1 = doc.splitTextToSize(analysisText1, contentWidth);
      doc.text(analysisLines1, margin, yPos);
      yPos += analysisLines1.length * 3 + 2;

      const analysisText2 = t.analysisDesc2;
      const analysisLines2 = doc.splitTextToSize(analysisText2, contentWidth);
      doc.text(analysisLines2, margin, yPos);
      yPos += analysisLines2.length * 3 + 6;

      // ========== ROW 2: CHARTS REORGANIZED ==========
      // Total available height for charts is about 160-170mm
      const chartHeight = 35; // Reduced to fit everything
      const chartSpacing = 3;

      // 1) Total de voos realizados (Pie chart - maybe use smaller width if it's too squashed)
      doc.setFillColor(15, 23, 42);
      doc.roundedRect(margin, yPos, contentWidth, chartHeight, 2, 2, 'F');
      doc.setDrawColor(...slateColor);
      doc.roundedRect(margin, yPos, contentWidth, chartHeight, 2, 2, 'S');

      if (images.totalVoos) {
        try {
          // Pie charts are usually square-ish, so we center it or let it stretch if the user preferred "proportional"
          // If we want proportional, we should ideally know the aspect ratio. 
          // Assuming most charts are ~2:1 or wider.
          doc.addImage(images.totalVoos, 'JPEG', margin + 30, yPos + 3, contentWidth - 60, chartHeight - 6, undefined, 'FAST');
        } catch (e) {
          doc.setTextColor(...slate400);
          doc.setFontSize(6);
          doc.text('Gráfico indisponível', margin + (contentWidth / 2), yPos + (chartHeight / 2), { align: 'center' });
        }
      }
      yPos += chartHeight + chartSpacing;

      // 2) Atrasos por dias da semana
      doc.setFillColor(15, 23, 42);
      doc.roundedRect(margin, yPos, contentWidth, chartHeight, 2, 2, 'F');
      doc.setDrawColor(...slateColor);
      doc.roundedRect(margin, yPos, contentWidth, chartHeight, 2, 2, 'S');

      if (images.atrasosDia) {
        try {
          doc.addImage(images.atrasosDia, 'JPEG', margin + 4, yPos + 2, contentWidth - 8, chartHeight - 4, undefined, 'FAST');
        } catch (e) {
          doc.setTextColor(...slate400);
          doc.setFontSize(6);
          doc.text('Gráfico indisponível', margin + (contentWidth / 2), yPos + (chartHeight / 2), { align: 'center' });
        }
      }
      yPos += chartHeight + chartSpacing;

      // 3) Atraso por hora
      doc.setFillColor(15, 23, 42);
      doc.roundedRect(margin, yPos, contentWidth, chartHeight, 2, 2, 'F');
      doc.setDrawColor(...slateColor);
      doc.roundedRect(margin, yPos, contentWidth, chartHeight, 2, 2, 'S');

      if (images.atrasosHora) {
        try {
          doc.addImage(images.atrasosHora, 'JPEG', margin + 4, yPos + 2, contentWidth - 8, chartHeight - 4, undefined, 'FAST');
        } catch (e) {
          doc.setTextColor(...slate400);
          doc.setFontSize(6);
          doc.text('Gráfico indisponível', margin + (contentWidth / 2), yPos + (chartHeight / 2), { align: 'center' });
        }
      }
      yPos += chartHeight + chartSpacing;

      // 5) Duplicar a linha do terceiro gráfico (Atraso por hora)
      doc.setFillColor(15, 23, 42);
      doc.roundedRect(margin, yPos, contentWidth, chartHeight, 2, 2, 'F');
      doc.setDrawColor(...slateColor);
      doc.roundedRect(margin, yPos, contentWidth, chartHeight, 2, 2, 'S');

      if (images.atrasosHora) {
        try {
          doc.addImage(images.atrasosHora, 'JPEG', margin + 4, yPos + 2, contentWidth - 8, chartHeight - 4, undefined, 'FAST');
        } catch (e) {
          doc.setTextColor(...slate400);
          doc.setFontSize(6);
          doc.text('Gráfico indisponível', margin + (contentWidth / 2), yPos + (chartHeight / 2), { align: 'center' });
        }
      }
      yPos += chartHeight + chartSpacing;

      // 6) Inserir o gráfico media atraso
      doc.setFillColor(15, 23, 42);
      doc.roundedRect(margin, yPos, contentWidth, chartHeight, 2, 2, 'F');
      doc.setDrawColor(...slateColor);
      doc.roundedRect(margin, yPos, contentWidth, chartHeight, 2, 2, 'S');

      if (images.mediaAtraso) {
        try {
          doc.addImage(images.mediaAtraso, 'JPEG', margin + 4, yPos + 2, contentWidth - 8, chartHeight - 4, undefined, 'FAST');
        } catch (e) {
          doc.setTextColor(...slate400);
          doc.setFontSize(6);
          doc.text('Gráfico indisponível', margin + (contentWidth / 2), yPos + (chartHeight / 2), { align: 'center' });
        }
      }
      yPos += chartHeight + 4;

      // ========== FOOTER ==========
      doc.setDrawColor(...slateColor);
      doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

      doc.setTextColor(...slate500);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.text(t.footerPDF, pageWidth / 2, pageHeight - 10, { align: 'center' });

      // Save PDF
      const originName = flightData.origin?.nome?.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 15) || 'origem';
      const destName = flightData.destination?.nome?.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 15) || 'destino';
      doc.save(`flight_report_${originName}_${destName}.pdf`);

    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="mt-6 flex justify-center">
      <button
        onClick={generatePDF}
        disabled={generating}
        className="group relative inline-flex items-center gap-3 px-10 py-4 bg-slate-800 text-cyan-400 border border-cyan-900 rounded-xl hover:bg-cyan-950 hover:border-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {generating ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          <FileText size={20} />
        )}
        <span className="font-mono font-bold tracking-wider uppercase text-xs">
          {generating ? t.generatingReport : t.downloadReport}
        </span>
        <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-cyan-500/20 group-hover:ring-cyan-400/50" />
      </button>
    </div>
  );
};

export default ReportGenerator;
