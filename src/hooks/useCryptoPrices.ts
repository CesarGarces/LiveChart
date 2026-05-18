import { useState, useEffect, useRef } from 'react';
import { priceService, type BinancePriceInfo } from '../services/priceService';

export function useCryptoPrices(symbols: string[]): Record<string, BinancePriceInfo> {
  const [prices, setPrices] = useState<Record<string, BinancePriceInfo>>({});
  const idRef = useRef<string>(`prices-${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    const callback = (newPrices: Record<string, BinancePriceInfo>) => {
      setPrices(newPrices);
    };

    priceService.subscribe(idRef.current, symbols, callback);

    return () => {
      priceService.unsubscribe(idRef.current);
    };
  }, [symbols]);

  return prices;
}
