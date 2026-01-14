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

// Helper to load image as base64 with compression and background fill for transparency
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
        // Fill background with the same color as the chart containers (#0f172a)
        // because JPEG doesn't support transparency and defaults to black
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

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

const removeEmojis = (str: string): string => {
  if (!str) return str;
  // This regex matches most emoji and non-standard characters, keeping Latin, numbers, punctuation and basic symbols
  // Filtering out everything outside BMP except common latin supplements, or specifically targeting emoji ranges
  // A simpler robust approach for jsPDF safely:
  return str.replace(/[^\x00-\xFF\u0100-\u017F\u0180-\u024F\u1E00-\u1EFF\u2000-\u206F]/g, '');
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
      yPos += 2; // Reduced from 6mm to 2mm

      const boxSpacing = 3;

      // ========== ROW 1: VOO | PROBABILIDADE | CLIMA ==========
      const row1Height = 58;
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
      doc.text(t.labelOrigin, margin + 4, yPos + 12);
      doc.setTextColor(...whiteColor);
      doc.setFontSize(7);
      const originText = removeEmojis(flightData.origin?.nome || 'N/A');
      const originLines = doc.splitTextToSize(originText, col1Width - 10);
      doc.text(originLines, margin + 4, yPos + 16);

      doc.setTextColor(...slate500);
      doc.setFontSize(5);
      doc.text(t.labelDestination, margin + 4, yPos + 24);
      doc.setTextColor(...whiteColor);
      doc.setFontSize(7);
      const destText = removeEmojis(flightData.destination?.nome || 'N/A');
      const destLines = doc.splitTextToSize(destText, col1Width - 10);
      doc.text(destLines, margin + 4, yPos + 28);

      // Divider
      doc.setDrawColor(30, 41, 59);
      doc.line(margin + 4, yPos + 37, margin + col1Width - 6, yPos + 37);

      doc.setTextColor(...slate500);
      doc.setFontSize(5);
      doc.text(t.labelAirline, margin + 4, yPos + 42);
      doc.setTextColor(...cyanColor);
      doc.setFontSize(6.5);
      const airlineName = removeEmojis(flightData.airline?.nome || 'N/A');
      const airlineLines = doc.splitTextToSize(airlineName, col1Width - 40); // Leave space for Date
      doc.text(airlineLines, margin + 4, yPos + 46);

      doc.setTextColor(...slate500);
      doc.setFontSize(5);
      const rightAlignX = margin + col1Width - 4;
      doc.text(t.labelDate, rightAlignX, yPos + 42, { align: 'right' });
      doc.setTextColor(...slate400);
      doc.setFontSize(7);
      const formattedDate = flightData.date ? flightData.date.split('-').reverse().join('/') : 'N/A';
      doc.text(formattedDate, rightAlignX, yPos + 46, { align: 'right' });

      doc.setTextColor(...slate500);
      doc.setFontSize(5);
      doc.text(t.exactTime.toUpperCase(), rightAlignX, yPos + 50, { align: 'right' });
      doc.setTextColor(...whiteColor);
      doc.setFontSize(7);
      doc.text(flightData.time || 'N/A', rightAlignX, yPos + 54, { align: 'right' });

      // Box 2: PROBABILIDADE DE ATRASO
      const box2X = margin + col1Width;
      doc.setFillColor(15, 23, 42);
      doc.roundedRect(box2X, yPos, col2Width - 2, row1Height, 2, 2, 'F');
      doc.setDrawColor(...slateColor);
      doc.roundedRect(box2X, yPos, col2Width - 2, row1Height, 2, 2, 'S');

      doc.setTextColor(...cyanColor);
      doc.setFontSize(6);
      doc.text(t.labelDelayProb.toUpperCase(), box2X + 4, yPos + 6);

      const delayProb = prediction.confidence;

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
        doc.text(t.labelTemp.toUpperCase(), box3X + 4, weatherY);
        doc.setTextColor(...whiteColor);
        doc.setFontSize(6);
        doc.text(`${Math.round(prediction.weather.minTemp)}° / ${Math.round(prediction.weather.maxTemp)}°C`, box3X + 4, weatherY + 3);

        // Wind
        doc.setTextColor(...slate500);
        doc.setFontSize(4);
        doc.text(t.labelWind.toUpperCase(), box3X + 4, weatherY + 8);
        doc.setTextColor(...whiteColor);
        doc.setFontSize(6);
        doc.text(`${prediction.weather.windSpeed.toFixed(1)} km/h`, box3X + 4, weatherY + 11);

        // Humidity & Rain
        doc.setTextColor(...slate500);
        doc.setFontSize(4);
        doc.text(t.labelHumidity.toUpperCase(), box3X + 4, weatherY + 16);
        doc.setTextColor(...whiteColor);
        doc.setFontSize(6);
        doc.text(`${prediction.weather.humidity}%`, box3X + 4, weatherY + 19);

        doc.setTextColor(...slate500);
        doc.setFontSize(4);
        doc.text(t.rainProb.toUpperCase(), box3X + 4, weatherY + 24);
        doc.setTextColor(...whiteColor);
        doc.setFontSize(6);
        doc.text(`${prediction.weather.rainProbability}%`, box3X + 4, weatherY + 27);

        // Weather Attribution Link
        doc.setTextColor(...cyanColor);
        doc.setFontSize(5);
        const prefix = t.weatherAttribution + " ";
        const brand = "Open-Meteo.com";
        const prefixWidth = doc.getTextWidth(prefix);
        const brandWidth = doc.getTextWidth(brand);

        doc.text(prefix, box3X + 4, yPos + 48);
        doc.text(brand, box3X + 4 + prefixWidth, yPos + 48);
        doc.link(box3X + 4 + prefixWidth, yPos + 45, brandWidth, 4, { url: 'https://open-meteo.com' });
      } else {
        doc.setTextColor(...slate400);
        doc.setFontSize(6);
        doc.text(t.labelUnknown, box3X + 4, yPos + 20);
      }

      yPos += row1Height + boxSpacing;

      // ========== ROW 2: ANÁLISE GERAL & TOTAL VOOS ==========
      const row2Height = 60;

      // 1) Análise Geral (Left side)
      // Width: 125mm (~67% of page width)
      const analysisWidth = 125;

      // Calculate text height to center it
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      const titleHeight = 5; // approx header height

      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      const analysisText1 = t.analysisDesc1;
      const analysisLines1 = doc.splitTextToSize(analysisText1, analysisWidth);
      const text1Height = analysisLines1.length * 3; // 3mm per line

      const analysisText2 = t.analysisDesc2;
      const analysisLines2 = doc.splitTextToSize(analysisText2, analysisWidth);
      const text2Height = analysisLines2.length * 3;

      // title + padding + text1 + padding + text2
      const totalTextHeight = titleHeight + 4 + text1Height + 2 + text2Height;

      // Center Start Y
      let textCurrentY = yPos + (row2Height - totalTextHeight) / 2 + titleHeight;

      doc.setTextColor(...whiteColor);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(t.analyticsHeader, margin, textCurrentY - titleHeight - 1); // Adjust for baseline

      doc.setTextColor(...slate400);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');

      doc.text(analysisLines1, margin, textCurrentY);
      textCurrentY += text1Height + 2;

      doc.text(analysisLines2, margin, textCurrentY);

      // 2) Total de Voos Chart (Right side)
      // Size: 58.1mm square (matching Rows 3 & 4 height)
      const chartSize = 58.1;
      const colChartX = margin + analysisWidth + 4; // Spacing of 4mm

      // Align vertically with the center of the row
      const chartY = yPos + (row2Height - chartSize) / 2;

      doc.setFillColor(15, 23, 42);
      doc.roundedRect(colChartX, chartY, chartSize, chartSize, 2, 2, 'F');
      doc.setDrawColor(...slateColor);
      doc.roundedRect(colChartX, chartY, chartSize, chartSize, 2, 2, 'S');

      if (images.totalVoos) {
        try {
          doc.addImage(images.totalVoos, 'JPEG', colChartX + 2, chartY + 2, chartSize - 4, chartSize - 4, undefined, 'FAST');
        } catch (e) {
          doc.setTextColor(...slate400);
          doc.setFontSize(6);
          doc.text(t.chartUnavailableShort, colChartX + chartSize / 2, chartY + chartSize / 2, { align: 'center' });
        }
      }

      // Advance Y position
      yPos += row2Height + boxSpacing;

      const chartSpacing = boxSpacing;

      // ========== ROW 3: Atraso por hora (Full Width) ==========
      const chart3Height = 58.1; // Increased to Ideal Height
      doc.setFillColor(15, 23, 42);
      doc.roundedRect(margin, yPos, contentWidth, chart3Height, 2, 2, 'F');
      doc.setDrawColor(...slateColor);
      doc.roundedRect(margin, yPos, contentWidth, chart3Height, 2, 2, 'S');

      if (images.atrasosHora) {
        try {
          doc.addImage(images.atrasosHora, 'JPEG', margin + 4, yPos + 2, contentWidth - 8, chart3Height - 4, undefined, 'FAST');
        } catch (e) {
          doc.setTextColor(...slate400);
          doc.setFontSize(6);
          doc.text(t.chartUnavailable, margin + (contentWidth / 2), yPos + (chart3Height / 2), { align: 'center' });
        }
      }
      yPos += chart3Height + chartSpacing;


      // ========== ROW 4: Média Atraso (Full Width) ==========
      const chart4Height = 58.1; // Increased to Ideal Height
      doc.setFillColor(15, 23, 42);
      doc.roundedRect(margin, yPos, 186, chart4Height, 2, 2, 'F');
      doc.setDrawColor(...slateColor);
      doc.roundedRect(margin, yPos, 186, chart4Height, 2, 2, 'S');

      if (images.mediaAtraso) {
        try {
          doc.addImage(images.mediaAtraso, 'JPEG', margin + 4, yPos + 2, 186 - 8, chart4Height - 4, undefined, 'FAST');
        } catch (e) {
          doc.setTextColor(...slate400);
          doc.setFontSize(6);
          doc.text(t.chartUnavailable, margin + (186 / 2), yPos + (chart4Height / 2), { align: 'center' });
        }
      }
      yPos += chart4Height + 4;


      // ========== FOOTER ==========
      doc.setDrawColor(...slateColor);
      doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

      doc.setTextColor(...slate500);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.text(t.footerPDF, pageWidth / 2, pageHeight - 10, { align: 'center' });

      // Save PDF
      const originName = removeEmojis(flightData.origin?.nome || 'origem').replace(/[^a-zA-Z0-9]/g, '_').substring(0, 15);
      const destName = removeEmojis(flightData.destination?.nome || 'destino').replace(/[^a-zA-Z0-9]/g, '_').substring(0, 15);
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
