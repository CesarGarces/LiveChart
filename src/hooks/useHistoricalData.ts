import { useState, useEffect, useCallback } from 'react';
import { fetchHistory, type CandleData } from '../services/coincapApi';

interface UseHistoricalDataResult {
  candles: CandleData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useHistoricalData(
  symbol: string | null,
  timeframe: string
): UseHistoricalDataResult {
  const [candles, setCandles] = useState<CandleData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!symbol) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchHistory(symbol, timeframe);
      setCandles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, [symbol, timeframe]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { candles, isLoading, error, refetch: loadData };
}