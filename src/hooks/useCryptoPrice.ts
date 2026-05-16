import { useState, useEffect } from 'react';
import { wsService, type TickerData } from '../services/sseService';

interface UseCryptoPriceResult {
  price: number | null;
  tickerData: TickerData | null;
  isLoading: boolean;
  error: string | null;
}

export function useCryptoPrice(symbol: string | null): UseCryptoPriceResult {
  const [tickerData, setTickerData] = useState<TickerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) {
      setTickerData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    wsService.connect(symbol, (data) => {
      setTickerData(data);
      setIsLoading(false);
    });

    return () => {
      wsService.disconnect();
    };
  }, [symbol]);

  return { 
    price: tickerData?.price ?? null, 
    tickerData,
    isLoading, 
    error 
  };
}