import { memo } from 'react';

const TIMEFRAMES = ['1m', '5m', '15m', '1h', '4h', '1d'];

interface TimeframeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const TimeframeSelector = memo(function TimeframeSelector({ value, onChange }: TimeframeSelectorProps) {
  return (
    <div className="flex gap-1">
      {TIMEFRAMES.map((tf) => (
        <button
          key={tf}
          onClick={() => onChange(tf)}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            value === tf
              ? 'bg-orange-500 text-white'
              : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          {tf}
        </button>
      ))}
    </div>
  );
});