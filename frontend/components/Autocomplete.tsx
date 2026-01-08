import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Loader2 } from 'lucide-react';
import { translations, Language } from '../translations';

interface Option {
  nome: string;
  codigoIata: string;
  codigoIcao: string;
  latitude?: number;
  longitude?: number;
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
    const minChars = endpoint === 'companhia-aerea' ? 2 : 3;
    if (term.length < minChars) {
      setOptions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/autocomplete/${endpoint}?termo=${encodeURIComponent(term)}`);
      if (response.ok) {
        const data = await response.json();
        // Map 'none' to 'nome' if the backend has the typo seen in Swagger
        const mappedData = data.map((item: any) => ({
          ...item,
          nome: item.none !== undefined ? item.none : item.nome
        }));
        setOptions(mappedData);
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

  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    setActiveIndex(-1);
  }, [options]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        setActiveIndex(prev => (prev < options.length - 1 ? prev + 1 : prev));
        e.preventDefault();
        break;
      case 'ArrowUp':
        setActiveIndex(prev => (prev > 0 ? prev - 1 : 0));
        e.preventDefault();
        break;
      case 'Enter':
        if (activeIndex >= 0 && activeIndex < options.length) {
          handleSelect(options[activeIndex]);
        }
        e.preventDefault();
        break;
      case 'Escape':
        setIsOpen(false);
        e.preventDefault();
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  const handleSelect = (option: Option) => {
    onChange(option);
    setSearchTerm('');
    setIsOpen(false);
    setActiveIndex(-1);
  };

  return (
    <div className="space-y-2 relative" ref={wrapperRef} onKeyDown={handleKeyDown}>
      <label className="text-xs text-slate-400 font-mono uppercase tracking-widest block">
        {label}
      </label>

      <div
        role="combobox"
        aria-expanded={isOpen}
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
                onKeyDown={(e) => {
                  // Prevent input keys from bubbling up to wrapper for basic chars, 
                  // but let Arrow keys and Enter bubble up.
                  if (e.key === 'Escape' || e.key === 'Tab') {
                    handleKeyDown(e as any);
                  }
                }}
              />
              {loading && <Loader2 className="absolute right-2 top-2.5 text-cyan-500 animate-spin" size={14} />}
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto" role="listbox" aria-label={`${label} suggestions`}>
            {options.length > 0 ? (
              options.map((option, index) => (
                <div
                  key={option.codigoIcao}
                  role="option"
                  aria-selected={value?.codigoIcao === option.codigoIcao || activeIndex === index}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`
                    px-4 py-3 cursor-pointer transition-colors border-l-2
                    ${(value?.codigoIcao === option.codigoIcao || activeIndex === index) ? 'bg-cyan-500/20 border-cyan-500' : 'hover:bg-cyan-500/10 border-transparent'}
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
                {searchTerm.length < (endpoint === 'companhia-aerea' ? 2 : 3)
                  ? (endpoint === 'companhia-aerea' ? t.typeMinChars2 : t.typeMinChars3)
                  : t.noResults}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Autocomplete;