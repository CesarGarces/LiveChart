import { useCallback } from 'react';
import { CRYPTO_MAP } from '../services/coincapApi';
import { useCryptoPrices } from '../hooks/useCryptoPrices';

interface FavoritesListProps {
  favorites: string[];
  selectedSymbol: string;
  onSelect: (symbol: string) => void;
  onToggleFavorite: (symbol: string) => void;
}

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

export function FavoritesList({ favorites, selectedSymbol, onSelect, onToggleFavorite }: FavoritesListProps) {
  const validFavorites = favorites.filter((s) => CRYPTO_MAP[s]);
  const prices = useCryptoPrices(validFavorites);

  const handleToggle = useCallback(
    (symbol: string) => {
      onToggleFavorite(symbol);
    },
    [onToggleFavorite]
  );

  if (validFavorites.length === 0) {
    return (
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
        <h3 className="text-gray-400 text-sm font-medium mb-3">Favoritos</h3>
        <div className="text-gray-600 text-center py-8 text-sm">
          Agrega cryptos a favoritos con el corazón ❤️
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      <h3 className="text-gray-400 text-sm font-medium px-4 py-3 border-b border-gray-800">
        Favoritos
      </h3>
      <div className="max-h-96 overflow-y-auto">
        {validFavorites.map((symbol) => {
          const priceData = prices[symbol];
          const isSelected = selectedSymbol === symbol;

          return (
            <div
              key={symbol}
              onClick={() => onSelect(symbol)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                isSelected ? 'bg-gray-800' : 'hover:bg-gray-800/50'
              }`}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggle(symbol);
                }}
                className="flex-shrink-0 focus:outline-none"
              >
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </button>

              <div className="flex-1 min-w-0">
                <div className="text-white font-medium text-sm">{symbol}</div>
              </div>

              <div className="text-right flex-shrink-0">
                <div className="text-white font-medium text-sm">
                  {priceData ? formatPrice(priceData.price) : '...'}
                </div>
                {priceData && (
                  <div
                    className={`text-xs ${
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
