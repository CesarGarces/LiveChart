# LiveChart - Visualizador de Criptomonedas en Tiempo Real

Aplicación web para visualizar gráficas de criptomonedas en tiempo real. Solo modo observación.

## Características

- **Tres tipos de gráfica**: Velas japonesas, Línea, Heikin-Ashi
- **Indicadores técnicos**: EMA 20 y EMA 50
- **Volumen**: Barras de volumen con colores verde/rojo
- **Actualización en tiempo real**: WebSocket de Binance
- **Timeframes**: 1m, 5m, 15m, 1h, 4h, 1d
- **criptomonedas**: BTC/USDT, ETH/USDT, SOL/USDT

## Tecnologías

- **Frontend**: React + TypeScript + Vite
- **Gráficas**: Lightweight Charts (TradingView)
- **Datos en tiempo real**: WebSocket (Binance)
- **Estilos**: TailwindCSS

## Ejecutar

```bash
npm install
npm run dev
```

## API

- Datos históricos y 24hr: Binance REST API
- Precio en tiempo real: Binance WebSocket (`wss://stream.binance.com:9443/ws/{symbol}@ticker`)