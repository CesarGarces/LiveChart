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
  'BNB/USDT': 'BNBUSDT',
  'XRP/USDT': 'XRPUSDT',
  'TON/USDT': 'TONUSDT',
  'PEPE/USDT': 'PEPEUSDT',
  'INJ/USDT': 'INJUSDT',
  'PYR/USDT': 'PYRUSDT',
  'ADA/USDT': 'ADAUSDT',
  'DOGE/USDT': 'DOGEUSDT',
  'AVAX/USDT': 'AVAXUSDT',
  'DOT/USDT': 'DOTUSDT',
  'LINK/USDT': 'LINKUSDT',
  'MATIC/USDT': 'MATICUSDT',
  'UNI/USDT': 'UNIUSDT',
  'ATOM/USDT': 'ATOMUSDT',
  'LTC/USDT': 'LTCUSDT',
  'NEAR/USDT': 'NEARUSDT',
  'APT/USDT': 'APTUSDT',
};

export const CRYPTO_INFO: Record<string, { name: string; icon: string }> = {
  'BTC/USDT': { name: 'Bitcoin', icon: '₿' },
  'ETH/USDT': { name: 'Ethereum', icon: 'Ξ' },
  'SOL/USDT': { name: 'Solana', icon: '◎' },
  'BNB/USDT': { name: 'BNB', icon: '◆' },
  'XRP/USDT': { name: 'XRP', icon: '✕' },
  'TON/USDT': { name: 'Toncoin', icon: '💎' },
  'PEPE/USDT': { name: 'Pepe', icon: '🐸' },
  'INJ/USDT': { name: 'Injective', icon: '⚡' },
  'PYR/USDT': { name: 'Vulcan Forged', icon: '🔥' },
  'ADA/USDT': { name: 'Cardano', icon: '₳' },
  'DOGE/USDT': { name: 'Dogecoin', icon: 'Ð' },
  'AVAX/USDT': { name: 'Avalanche', icon: '🔺' },
  'DOT/USDT': { name: 'Polkadot', icon: '●' },
  'LINK/USDT': { name: 'Chainlink', icon: '⬡' },
  'MATIC/USDT': { name: 'Polygon', icon: '' },
  'UNI/USDT': { name: 'Uniswap', icon: '🦄' },
  'ATOM/USDT': { name: 'Cosmos', icon: '' },
  'LTC/USDT': { name: 'Litecoin', icon: 'Ł' },
  'NEAR/USDT': { name: 'NEAR Protocol', icon: 'Ⓝ' },
  'APT/USDT': { name: 'Aptos', icon: '🅰' },
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
  const limit = getLimitForDays(30, timeframe);

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

function getLimitForDays(days: number, tf: string): number {
  const candlesPerDay: Record<string, number> = {
    '1m': 1440,
    '5m': 288,
    '15m': 96,
    '1h': 24,
    '4h': 6,
    '1d': 1,
  };
  return Math.min(candlesPerDay[tf] * days, 500);
}