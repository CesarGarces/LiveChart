import { useState, useEffect } from 'react';
import { CryptoSelector } from './components/CryptoSelector';
import { PriceHeader } from './components/PriceHeader';
import { ChartTypeTabs } from './components/ChartTypeTabs';
import { TimeframeSelector } from './components/TimeframeSelector';
import { IndicatorToggle } from './components/IndicatorToggle';
import { ChartContainer } from './components/ChartContainer';
import { useCryptoPrice } from './hooks/useCryptoPrice';
import { useHistoricalData } from './hooks/useHistoricalData';
import { fetchAsset } from './services/coincapApi';

type ChartType = 'candlestick' | 'line' | 'heikin-ashi';

function App() {
  const [symbol, setSymbol] = useState<string>('BTC/USDT');
  const [timeframe, setTimeframe] = useState<string>('1h');
  const [chartType, setChartType] = useState<ChartType>('candlestick');
  const [ema20Enabled, setEma20Enabled] = useState(true);
  const [ema50Enabled, setEma50Enabled] = useState(true);
  
  const [assetData, setAssetData] = useState<{
    changePercent24Hr: number;
    high24h: number;
    low24h: number;
    volumeUsd24Hr: number;
  } | null>(null);

  const { price, isLoading: priceLoading } = useCryptoPrice(symbol);
  const { candles, isLoading: candlesLoading, error } = useHistoricalData(symbol, timeframe);

  useEffect(() => {
    async function loadAsset() {
      try {
        const asset = await fetchAsset(symbol);
        setAssetData({
          changePercent24Hr: parseFloat(asset.priceChangePercent),
          high24h: parseFloat(asset.highPrice),
          low24h: parseFloat(asset.lowPrice),
          volumeUsd24Hr: parseFloat(asset.volume),
        });
      } catch (e) {
        console.error('Failed to load asset:', e);
      }
    }
    loadAsset();
  }, [symbol]);

  const isLoading = priceLoading || candlesLoading;

  return (
    <div className="min-h-screen bg-gray-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Crypto Watch</h1>
        
        <CryptoSelector value={symbol} onChange={setSymbol} />

        <PriceHeader
          price={price}
          change24h={assetData?.changePercent24Hr || 0}
          high24h={assetData?.high24h || 0}
          low24h={assetData?.low24h || 0}
          volume24h={assetData?.volumeUsd24Hr || 0}
          isLive={!priceLoading && price !== null}
          symbol={symbol}
          isLoading={priceLoading}
        />

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="bg-gray-900 rounded-xl p-4 mb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <ChartTypeTabs value={chartType} onChange={setChartType} />
            <TimeframeSelector value={timeframe} onChange={setTimeframe} />
          </div>
          
          <div className="mb-4">
            <IndicatorToggle
              ema20Enabled={ema20Enabled}
              ema50Enabled={ema50Enabled}
              onEma20Change={setEma20Enabled}
              onEma50Change={setEma50Enabled}
            />
          </div>

          {isLoading ? (
            <div className="h-[400px] flex items-center justify-center">
              <div className="text-gray-400">Cargando datos...</div>
            </div>
          ) : (
            <ChartContainer
              candles={candles}
              chartType={chartType}
              ema20Enabled={ema20Enabled}
              ema50Enabled={ema50Enabled}
              livePrice={price}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;