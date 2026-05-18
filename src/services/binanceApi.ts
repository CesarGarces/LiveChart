const BASE_URL = 'https://api.binance.com/api/v3';

export interface BinanceSymbol {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
}

export interface BinanceTicker {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
}

export async function fetchExchangeInfo(): Promise<BinanceSymbol[]> {
  const response = await fetch(`${BASE_URL}/exchangeInfo`);
  if (!response.ok) throw new Error(`Failed to fetch exchange info: ${response.statusText}`);

  const data = await response.json();
  return data.symbols
    .filter((s: any) => s.quoteAsset === 'USDT' && s.status === 'TRADING')
    .map((s: any) => ({
      symbol: s.symbol,
      baseAsset: s.baseAsset,
      quoteAsset: s.quoteAsset,
    }));
}

export async function fetchAllTickers(): Promise<BinanceTicker[]> {
  const response = await fetch(`${BASE_URL}/ticker/24hr`);
  if (!response.ok) throw new Error(`Failed to fetch tickers: ${response.statusText}`);
  return response.json();
}
