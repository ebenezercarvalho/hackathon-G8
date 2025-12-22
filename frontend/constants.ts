import { Airport, Airline, PeriodOfDay } from './types';

export const BRAZILIAN_AIRPORTS: Airport[] = [
  { nome: 'São Paulo/Guarulhos Intl', codigoIata: 'GRU', codigoIcao: 'SBGR' },
  { nome: 'São Paulo/Congonhas', codigoIata: 'CGH', codigoIcao: 'SBSP' },
  { nome: 'Rio de Janeiro/Galeão Intl', codigoIata: 'GIG', codigoIcao: 'SBGL' },
  { nome: 'Rio de Janeiro/Santos Dumont', codigoIata: 'SDU', codigoIcao: 'SBRJ' },
  { nome: 'Brasília Intl', codigoIata: 'BSB', codigoIcao: 'SBBR' },
  { nome: 'Belo Horizonte/Confins Intl', codigoIata: 'CNF', codigoIcao: 'SBCF' },
  { nome: 'Viracopos Intl', codigoIata: 'VCP', codigoIcao: 'SBKP' },
  { nome: 'Recife/Guararapes Intl', codigoIata: 'REC', codigoIcao: 'SBRF' },
  { nome: 'Salgado Filho Intl', codigoIata: 'POA', codigoIcao: 'SBPA' },
  { nome: 'Salvador Intl', codigoIata: 'SSA', codigoIcao: 'SBSV' },
];

export const BRAZILIAN_AIRLINES: Airline[] = [
  { nome: 'LATAM Airlines Brasil', codigoIata: 'LA', codigoIcao: 'TAM' },
  { nome: 'GOL Linhas Aéreas', codigoIata: 'G3', codigoIcao: 'GLO' },
  { nome: 'Azul Linhas Aéreas', codigoIata: 'AD', codigoIcao: 'AZU' },
  { nome: 'Voepass Linhas Aéreas', codigoIata: '2Z', codigoIcao: 'PTB' },
];

export const PERIODS = Object.values(PeriodOfDay);

export const MOCK_DELAY_STATS = [
  { name: 'Morning', value: 15 },
  { name: 'Afternoon', value: 35 },
  { name: 'Evening', value: 40 },
  { name: 'Night', value: 10 },
];
