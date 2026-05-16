const BASE_URL = 'https://api.binance.com/api/v3';

export interface Asset {
  symbol: string;
  price: string;
  priceChangePercent: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
}

export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export const CRYPTO_MAP: Record<string, string> = {
  'BTC/USDT': 'BTCUSDT',
  'ETH/USDT': 'ETHUSDT',
  'SOL/USDT': 'SOLUSDT',
};

export async function fetchAsset(symbol: string): Promise<Asset> {
  const pair = CRYPTO_MAP[symbol];
  if (!pair) throw new Error(`Unknown symbol: ${symbol}`);

  const response = await fetch(`${BASE_URL}/ticker/24hr?symbol=${pair}`);
  if (!response.ok) throw new Error(`Failed to fetch asset: ${response.statusText}`);
  
  return response.json();
}

export async function fetchHistory(
  symbol: string,
  timeframe: string
): Promise<CandleData[]> {
  const pair = CRYPTO_MAP[symbol];
  if (!pair) throw new Error(`Unknown symbol: ${symbol}`);

  const interval = mapTimeframe(timeframe);
  const limit = 100;

  const response = await fetch(
    `${BASE_URL}/klines?symbol=${pair}&interval=${interval}&limit=${limit}`
  );
  
  if (!response.ok) throw new Error(`Failed to fetch history: ${response.statusText}`);
  
  const data = await response.json();
  return data.map((k: (string | number)[]) => ({
    time: Math.floor((k[0] as number) / 1000),
    open: parseFloat(k[1] as string),
    high: parseFloat(k[2] as string),
    low: parseFloat(k[3] as string),
    close: parseFloat(k[4] as string),
  }));
}

function mapTimeframe(tf: string): string {
  const map: Record<string, string> = {
    '1m': '1m',
    '5m': '5m',
    '15m': '15m',
    '1h': '1h',
    '4h': '4h',
    '1d': '1d',
  };
  return map[tf] || '1h';
}