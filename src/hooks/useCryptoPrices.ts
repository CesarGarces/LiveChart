import { useState, useEffect, useRef } from 'react';
import { priceService, type CryptoPriceInfo } from '../services/priceService';

export function useCryptoPrices(symbols: string[]): Record<string, CryptoPriceInfo> {
  const [prices, setPrices] = useState<Record<string, CryptoPriceInfo>>({});
  const idRef = useRef<string>(`prices-${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    const callback = (newPrices: Record<string, CryptoPriceInfo>) => {
      setPrices(newPrices);
    };

    priceService.subscribe(idRef.current, symbols, callback);

    return () => {
      priceService.unsubscribe(idRef.current);
    };
  }, [symbols]);

  return prices;
}
