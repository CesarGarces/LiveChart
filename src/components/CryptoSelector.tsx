import { memo } from 'react';

const CRYPTOS = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT'];

interface CryptoSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const CryptoSelector = memo(function CryptoSelector({ value, onChange }: CryptoSelectorProps) {
  return (
    <div className="flex gap-2">
      {CRYPTOS.map((crypto) => (
        <button
          key={crypto}
          onClick={() => onChange(crypto)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            value === crypto
              ? 'bg-orange-500 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          {crypto}
        </button>
      ))}
    </div>
  );
});