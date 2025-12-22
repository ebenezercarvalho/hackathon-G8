import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';

interface Option {
  nome: string;
  codigoIata: string;
  codigoIcao: string;
}

interface AutocompleteProps {
  options: Option[];
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
}

const Autocomplete: React.FC<AutocompleteProps> = ({ options, placeholder, value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find(opt => opt.codigoIata === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt =>
    opt.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opt.codigoIata.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option: Option) => {
    onChange(option.codigoIata);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setIsOpen(false);
    if (e.key === 'Enter' && !isOpen) setIsOpen(true);
  };

  return (
    <div className="space-y-2 relative" ref={wrapperRef}>
      <label className="text-xs text-slate-400 font-mono uppercase tracking-widest block">
        {label}
      </label>
      
      <div 
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls="autocomplete-listbox"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full bg-slate-950 border rounded p-3 text-sm flex items-center justify-between cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500
          ${isOpen ? 'border-cyan-500 ring-1 ring-cyan-500/20' : 'border-slate-700 hover:border-slate-500'}
        `}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {selectedOption ? (
            <span className="text-white truncate">
              <strong className="text-cyan-400 font-mono mr-2">{selectedOption.codigoIata}</strong>
              {selectedOption.nome}
            </span>
          ) : (
            <span className="text-slate-500">{placeholder}</span>
          )}
        </div>
        <ChevronDown size={16} className={`text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div 
          id="autocomplete-listbox"
          role="listbox"
          className="absolute z-[100] w-full mt-1 bg-slate-900 border border-slate-700 rounded shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="p-2 border-b border-slate-800 bg-slate-950/50">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 text-slate-500" size={14} aria-hidden="true" />
              <input
                ref={inputRef}
                autoFocus
                type="text"
                aria-label="Filter results"
                placeholder="Type to filter..."
                className="w-full bg-slate-800 border-none rounded p-2 pl-8 text-xs text-white focus:ring-0 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.codigoIata}
                  role="option"
                  aria-selected={value === option.codigoIata}
                  onClick={() => handleSelect(option)}
                  className={`
                    px-4 py-3 cursor-pointer hover:bg-cyan-500/10 transition-colors border-l-2
                    ${value === option.codigoIata ? 'bg-cyan-500/20 border-cyan-500' : 'border-transparent'}
                  `}
                >
                  <div className="flex flex-col">
                    <span className="text-sm text-white font-medium">{option.nome}</span>
                    <span className="text-[10px] text-slate-500 uppercase">{option.codigoIata}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-slate-500 italic">No results</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Autocomplete;