import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Loader2 } from 'lucide-react';
import { translations, Language } from '../translations';

interface Option {
  nome: string;
  codigoIata: string;
  codigoIcao: string;
}

interface AutocompleteProps {
  endpoint: string; // e.g., 'aeroportos' or 'companhia-aerea'
  placeholder: string;
  value: Option | null;
  onChange: (value: Option) => void;
  label: string;
  lang: Language;
}

const API_BASE_URL = 'http://localhost:8080';

const Autocomplete: React.FC<AutocompleteProps> = ({ endpoint, placeholder, value, onChange, label, lang }) => {
  const t = translations[lang];
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<number | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchOptions = async (term: string) => {
    if (term.length < 3) {
      setOptions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/autocomplete/${endpoint}?termo=${encodeURIComponent(term)}`);
      if (response.ok) {
        const data = await response.json();
        setOptions(data);
      }
    } catch (error) {
      console.error('Error fetching autocomplete options:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (debounceTimer.current) window.clearTimeout(debounceTimer.current);

    debounceTimer.current = window.setTimeout(() => {
      fetchOptions(term);
    }, 300);
  };

  const handleSelect = (option: Option) => {
    onChange(option);
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <div className="space-y-2 relative" ref={wrapperRef}>
      <label className="text-xs text-slate-400 font-mono uppercase tracking-widest block">
        {label}
      </label>

      <div
        role="combobox"
        aria-expanded={isOpen ? "true" : "false"}
        aria-label={label}
        aria-haspopup="listbox"
        aria-controls={`autocomplete-${endpoint}`}
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full bg-slate-950 border rounded p-3 text-sm flex items-center justify-between cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500
          ${isOpen ? 'border-cyan-500 ring-1 ring-cyan-500/20' : 'border-slate-700 hover:border-slate-500'}
        `}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {value ? (
            <span className="text-white truncate">
              <strong className="text-cyan-400 font-mono mr-2">{value.codigoIata}</strong>
              {value.nome}
            </span>
          ) : (
            <span className="text-slate-500">{placeholder}</span>
          )}
        </div>
        <ChevronDown size={16} className={`text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div
          id={`autocomplete-${endpoint}`}
          className="absolute z-[100] w-full mt-1 bg-slate-900 border border-slate-700 rounded shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="p-2 border-b border-slate-800 bg-slate-950/50">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 text-slate-500" size={14} aria-hidden="true" />
              <input
                autoFocus
                type="text"
                placeholder={t.searchPlaceholder}
                aria-label={t.searchPlaceholder}
                className="w-full bg-slate-800 border-none rounded p-2 pl-8 text-xs text-white focus:ring-0 outline-none"
                value={searchTerm}
                onChange={handleSearchChange}
                onClick={(e) => e.stopPropagation()}
              />
              {loading && <Loader2 className="absolute right-2 top-2.5 text-cyan-500 animate-spin" size={14} />}
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto" role="listbox">
            {options.length > 0 ? (
              options.map((option) => (
                <div
                  key={option.codigoIcao}
                  role="option"
                  aria-selected={value?.codigoIcao === option.codigoIcao ? "true" : "false"}
                  onClick={() => handleSelect(option)}
                  className={`
                    px-4 py-3 cursor-pointer hover:bg-cyan-500/10 transition-colors border-l-2
                    ${value?.codigoIcao === option.codigoIcao ? 'bg-cyan-500/20 border-cyan-500' : 'border-transparent'}
                  `}
                >
                  <div className="flex flex-col">
                    <span className="text-sm text-white font-medium">{option.nome}</span>
                    <div className="flex gap-2">
                      <span className="text-[10px] text-slate-500 uppercase">IATA: {option.codigoIata}</span>
                      <span className="text-[10px] text-cyan-600 uppercase">ICAO: {option.codigoIcao}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-slate-500 italic">
                {searchTerm.length < 3 ? t.typeMinChars : t.noResults}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Autocomplete;