import { useState, useEffect } from 'react';
import { fetchExchangeInfo, type BinanceSymbol } from '../services/binanceApi';

export function useBinanceSymbols() {
  const [symbols, setSymbols] = useState<BinanceSymbol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchExchangeInfo()
      .then((data) => {
        if (!cancelled) {
          setSymbols(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { symbols, loading, error };
}
