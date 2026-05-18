type PriceCallback = (prices: Record<string, BinancePriceInfo>) => void;

export interface BinancePriceInfo {
  symbol: string;
  price: number;
  priceChangePercent: number;
}

class PriceService {
  private ws: WebSocket | null = null;
  private subscribers: Map<string, { callback: PriceCallback; symbols: string[] }> = new Map();
  private prices: Record<string, BinancePriceInfo> = {};
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

  subscribe(id: string, symbols: string[], callback: PriceCallback): void {
    this.subscribers.set(id, { callback, symbols });
    callback(this.prices);
    this.updateWatchedSymbols();
  }

  unsubscribe(id: string): void {
    this.subscribers.delete(id);
    this.updateWatchedSymbols();
  }

  private updateWatchedSymbols(): void {
    const allSymbols = new Set<string>();
    this.subscribers.forEach(({ symbols }) => {
      symbols.forEach((s) => allSymbols.add(s));
    });

    const currentWatched = new Set(
      this.ws ? [...this.subscribers.values()].flatMap(({ symbols }) => symbols) : []
    );

    const symbolsChanged =
      allSymbols.size !== currentWatched.size ||
      ![...allSymbols].every((s) => currentWatched.has(s));

    if (symbolsChanged || !this.ws) {
      this.reconnect([...allSymbols]);
    }
  }

  private reconnect(symbols: string[]): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    const validSymbols = symbols.filter((s) => s.endsWith('USDT'));

    if (validSymbols.length === 0) {
      this.notifySubscribers();
      return;
    }

    const streamNames = validSymbols
      .map((s) => `${s.toLowerCase()}@miniTicker`)
      .join('/');

    const wsUrl = `wss://stream.binance.com:9443/stream?streams=${streamNames}`;
    this.ws = new WebSocket(wsUrl);

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.data) {
          const data = msg.data;
          const symbol = data.s;
          const price = parseFloat(data.c);
          const open = parseFloat(data.o);
          const changePercent = open > 0 ? ((price - open) / open) * 100 : 0;

          this.prices[symbol] = {
            symbol,
            price,
            priceChangePercent: changePercent,
          };
          this.notifySubscribers();
        }
      } catch (e) {
        console.error('Error parsing WS message:', e);
      }
    };

    this.ws.onerror = () => {
      this.scheduleReconnect();
    };

    this.ws.onclose = () => {
      this.scheduleReconnect();
    };
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimeout) return;
    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;
      const allSymbols = new Set<string>();
      this.subscribers.forEach(({ symbols }) => {
        symbols.forEach((s) => allSymbols.add(s));
      });
      this.reconnect([...allSymbols]);
    }, 3000);
  }

  private notifySubscribers(): void {
    const snapshot = { ...this.prices };
    this.subscribers.forEach(({ callback }) => callback(snapshot));
  }

  destroy(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.subscribers.clear();
    this.prices = {};
  }
}

export const priceService = new PriceService();
