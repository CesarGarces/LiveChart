import { memo } from 'react';

type ChartType = 'candlestick' | 'line' | 'heikin-ashi';

interface ChartTypeTabsProps {
  value: ChartType;
  onChange: (value: ChartType) => void;
}

export const ChartTypeTabs = memo(function ChartTypeTabs({ value, onChange }: ChartTypeTabsProps) {
  const tabs: { value: ChartType; label: string }[] = [
    { value: 'candlestick', label: 'Velas' },
    { value: 'line', label: 'Línea' },
    { value: 'heikin-ashi', label: 'Heikin-Ashi' },
  ];

  return (
    <div className="flex gap-1 bg-gray-800 p-1 rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            value === tab.value
              ? 'bg-gray-700 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
});