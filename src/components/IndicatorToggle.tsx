import { memo } from 'react';

interface IndicatorToggleProps {
  ema20Enabled: boolean;
  ema50Enabled: boolean;
  onEma20Change: (enabled: boolean) => void;
  onEma50Change: (enabled: boolean) => void;
}

export const IndicatorToggle = memo(function IndicatorToggle({
  ema20Enabled,
  ema50Enabled,
  onEma20Change,
  onEma50Change,
}: IndicatorToggleProps) {
  return (
    <div className="flex gap-4">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={ema20Enabled}
          onChange={(e) => onEma20Change(e.target.checked)}
          className="w-4 h-4 rounded bg-gray-800 border-gray-600 text-orange-500 focus:ring-orange-500"
        />
        <span className="text-sm text-gray-300">EMA 20</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={ema50Enabled}
          onChange={(e) => onEma50Change(e.target.checked)}
          className="w-4 h-4 rounded bg-gray-800 border-gray-600 text-orange-500 focus:ring-orange-500"
        />
        <span className="text-sm text-gray-300">EMA 50</span>
      </label>
    </div>
  );
});