import { CRYPTO_MAP } from './coincapApi';

export interface TickerData {
  price: number;
  priceChangePercent: number;
  high24h: number;
  low24h: number;
  volume24h: number;
}

type TickerCallback = (data: TickerData) => void;

class WSService {
  private ws: WebSocket | null = null;
  private currentSymbol: string | null = null;
  private callback: TickerCallback | null = null;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

  connect(symbol: string, onTicker: TickerCallback) {
    this.disconnect();
    this.currentSymbol = symbol;
    this.callback = onTicker;

    const pair = CRYPTO_MAP[symbol];
    if (!pair) return;

    const streamName = `${pair.toLowerCase()}@ticker`;
    const wsUrl = `wss://stream.binance.com:9443/ws/${streamName}`;

    this.ws = new WebSocket(wsUrl);

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.c) {
          this.callback?.({
            price: parseFloat(data.c),
            priceChangePercent: parseFloat(data.P),
            high24h: parseFloat(data.h),
            low24h: parseFloat(data.l),
            volume24h: parseFloat(data.v) * parseFloat(data.c),
          });
        }
      } catch (e) {
        console.error('Error parsing WS message:', e);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = () => {
      this.scheduleReconnect();
    };
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) return;
    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;
      if (this.currentSymbol && this.callback) {
        this.connect(this.currentSymbol, this.callback);
      }
    }, 3000);
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.currentSymbol = null;
    this.callback = null;
  }
}

export const wsService = new WSService();