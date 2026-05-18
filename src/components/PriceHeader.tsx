import { memo } from 'react';
import { formatSymbol } from '../utils/formatSymbol';

interface PriceHeaderProps {
  price: number | null;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  isLive: boolean;
  symbol: string;
  isLoading: boolean;
}

export const PriceHeader = memo(function PriceHeader({
  price,
  change24h,
  high24h,
  low24h,
  volume24h,
  isLive,
  symbol,
  isLoading,
}: PriceHeaderProps) {
  const formatPrice = (p: number) => {
    return p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatVolume = (v: number) => {
    if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
    if (v >= 1e6) return `$${(v / 1e6).toFixed(2)}M`;
    return `$${v.toLocaleString()}`;
  };

  return (
    <div className="bg-gray-900 rounded-xl p-4 mb-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-white">{formatSymbol(symbol)}</span>
          {isLive && (
            <span className="flex items-center gap-1.5 text-green-400 text-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Live
            </span>
          )}
        </div>

        <div className="text-right">
          {isLoading ? (
            <div className="h-10 bg-gray-800 animate-pulse rounded" />
          ) : (
            <span className="text-4xl font-bold text-white">
              ${price ? formatPrice(price) : '—'}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-800">
        <div>
          <div className="text-gray-500 text-xs">Cambio 24h</div>
          <div className={change24h >= 0 ? 'text-green-400' : 'text-red-400'}>
            {change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}%
          </div>
        </div>
        <div>
          <div className="text-gray-500 text-xs">Máximo 24h</div>
          <div className="text-white">${formatPrice(high24h)}</div>
        </div>
        <div>
          <div className="text-gray-500 text-xs">Mínimo 24h</div>
          <div className="text-white">${formatPrice(low24h)}</div>
        </div>
        <div>
          <div className="text-gray-500 text-xs">Volumen 24h</div>
          <div className="text-white">{formatVolume(volume24h)}</div>
        </div>
      </div>
    </div>
  );
});