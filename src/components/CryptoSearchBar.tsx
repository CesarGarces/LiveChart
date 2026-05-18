import { useState, useEffect, useRef } from 'react';
import { CRYPTO_MAP, CRYPTO_INFO } from '../services/coincapApi';
import { useCryptoPrices } from '../hooks/useCryptoPrices';

interface CryptoSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onToggleFavorite: (symbol: string) => void;
  favorites: string[];
}

const ALL_SYMBOLS = Object.keys(CRYPTO_MAP);

function formatPrice(price: number): string {
  if (price >= 1000) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  if (price >= 1) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  }
  if (price >= 0.01) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 });
  }
  return price.toLocaleString('en-US', { minimumSignificantDigits: 2, maximumSignificantDigits: 4 });
}

export function CryptoSearchBar({ value, onChange, onToggleFavorite, favorites }: CryptoSearchBarProps) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const prices = useCryptoPrices(ALL_SYMBOLS.slice(0, 20));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSymbols = ALL_SYMBOLS.filter((symbol) => {
    const info = CRYPTO_INFO[symbol];
    const searchLower = search.toLowerCase();
    return (
      symbol.toLowerCase().includes(searchLower) ||
      info?.name.toLowerCase().includes(searchLower)
    );
  });

  const displayList = search ? filteredSymbols : ALL_SYMBOLS.slice(0, 20);

  const handleSelect = (symbol: string) => {
    onChange(symbol);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Buscar crypto..."
          className="w-full bg-gray-800 text-white px-4 py-2.5 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none placeholder-gray-500 pr-10"
        />
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-xl max-h-96 overflow-y-auto">
          {displayList.length === 0 ? (
            <div className="px-4 py-3 text-gray-500 text-center">No se encontraron resultados</div>
          ) : (
            displayList.map((symbol) => {
              const info = CRYPTO_INFO[symbol];
              const priceData = prices[symbol];
              const isFav = favorites.includes(symbol);
              const isSelected = value === symbol;

              return (
                <button
                  key={symbol}
                  onClick={() => handleSelect(symbol)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors ${
                    isSelected ? 'bg-gray-800' : ''
                  }`}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(symbol);
                    }}
                    className="flex-shrink-0 focus:outline-none"
                  >
                    {isFav ? (
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-600 hover:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    )}
                  </button>

                  <div className="flex-1 text-left">
                    <div className="text-white font-medium">{symbol}</div>
                    {info?.name && (
                      <div className="text-gray-500 text-sm">{info.name}</div>
                    )}
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-white font-medium">
                      {priceData ? formatPrice(priceData.price) : '...'}
                    </div>
                    {priceData && (
                      <div
                        className={`text-sm ${
                          priceData.priceChangePercent >= 0
                            ? 'text-green-400'
                            : 'text-red-400'
                        }`}
                      >
                        {priceData.priceChangePercent >= 0 ? '+' : ''}
                        {priceData.priceChangePercent.toFixed(2)}%
                      </div>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
