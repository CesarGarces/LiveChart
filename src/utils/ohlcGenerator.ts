import type { CandleData } from '../services/coincapApi';

export interface HeikinAshiCandle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export function calculateHeikinAshi(candles: CandleData[]): HeikinAshiCandle[] {
  const haCandles: HeikinAshiCandle[] = [];
  
  for (let i = 0; i < candles.length; i++) {
    const c = candles[i];
    let haOpen: number, haClose: number, haHigh: number, haLow: number;
    
    haClose = (c.open + c.high + c.low + c.close) / 4;
    
    if (i === 0) {
      haOpen = (c.open + c.close) / 2;
    } else {
      haOpen = (haCandles[i - 1].open + haCandles[i - 1].close) / 2;
    }
    
    haHigh = Math.max(c.high, haOpen, haClose);
    haLow = Math.min(c.low, haOpen, haClose);
    
    haCandles.push({
      time: c.time,
      open: haOpen,
      high: haHigh,
      low: haLow,
      close: haClose,
    });
  }
  
  return haCandles;
}

export function calculateEMA(data: number[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  const k = 2 / (period + 1);
  
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else if (i === period - 1) {
      const sum = data.slice(0, period).reduce((a, b) => a + b, 0);
      result.push(sum / period);
    } else {
      const prevEma = result[i - 1]!;
      const ema = (data[i] - prevEma) * k + prevEma;
      result.push(ema);
    }
  }
  
  return result;
}