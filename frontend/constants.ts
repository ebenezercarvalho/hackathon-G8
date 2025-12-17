import { Airport, PeriodOfDay } from './types';

export const BRAZILIAN_AIRPORTS: Airport[] = [
  { code: 'GRU', name: 'São Paulo/Guarulhos Intl', city: 'São Paulo' },
  { code: 'CGH', name: 'São Paulo/Congonhas', city: 'São Paulo' },
  { code: 'GIG', name: 'Rio de Janeiro/Galeão Intl', city: 'Rio de Janeiro' },
  { code: 'SDU', name: 'Rio de Janeiro/Santos Dumont', city: 'Rio de Janeiro' },
  { code: 'BSB', name: 'Brasília Intl', city: 'Brasília' },
  { code: 'CNF', name: 'Belo Horizonte/Confins Intl', city: 'Belo Horizonte' },
  { code: 'VCP', name: 'Viracopos Intl', city: 'Campinas' },
  { code: 'REC', name: 'Recife/Guararapes Intl', city: 'Recife' },
  { code: 'POA', name: 'Salgado Filho Intl', city: 'Porto Alegre' },
  { code: 'SSA', name: 'Salvador Intl', city: 'Salvador' },
  { code: 'CWB', name: 'Afonso Pena Intl', city: 'Curitiba' },
  { code: 'FOR', name: 'Pinto Martins Intl', city: 'Fortaleza' },
];

export const PERIODS = Object.values(PeriodOfDay);

// Mock data for initial charts
export const MOCK_DELAY_STATS = [
  { name: 'Morning', value: 15 },
  { name: 'Afternoon', value: 35 },
  { name: 'Evening', value: 40 },
  { name: 'Night', value: 10 },
];
