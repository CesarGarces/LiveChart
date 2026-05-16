import { useState, useEffect } from 'react';
import { wsService } from '../services/sseService';

interface UseCryptoPriceResult {
  price: number | null;
  isLoading: boolean;
  error: string | null;
}

export function useCryptoPrice(symbol: string | null): UseCryptoPriceResult {
  const [price, setPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) {
      setPrice(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    wsService.connect(symbol, (newPrice) => {
      setPrice(newPrice);
      setIsLoading(false);
    });

    return () => {
      wsService.disconnect();
    };
  }, [symbol]);

  return { price, isLoading, error };
}