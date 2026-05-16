import { useEffect, useRef, useMemo, memo, useCallback } from 'react';
import { createChart, CandlestickSeries, LineSeries, HistogramSeries } from 'lightweight-charts';
import type { IChartApi, ISeriesApi, CandlestickData, LineData, HistogramData, Time } from 'lightweight-charts';
import { calculateEMA, calculateHeikinAshi } from '../utils/ohlcGenerator';
import type { CandleData } from '../services/coincapApi';

type ChartType = 'candlestick' | 'line' | 'heikin-ashi';

interface ChartContainerProps {
  candles: CandleData[];
  chartType: ChartType;
  ema20Enabled: boolean;
  ema50Enabled: boolean;
  livePrice: number | null;
}

export const ChartContainer = memo(function ChartContainer({
  candles,
  chartType,
  ema20Enabled,
  ema50Enabled,
  livePrice,
}: ChartContainerProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const lineSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const ema20SeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const ema50SeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const mountedRef = useRef(true);

  const chartData = useMemo(() => {
    if (chartType === 'heikin-ashi') {
      return calculateHeikinAshi(candles);
    }
    return candles;
  }, [candles, chartType]);

  const ema20Data = useMemo((): LineData[] => {
    const closes = chartData.map(c => c.close);
    const ema = calculateEMA(closes, 20);
    return ema.map((value, i) => value !== null ? { time: chartData[i].time as Time, value } : null).filter(Boolean) as LineData[];
  }, [chartData]);

  const ema50Data = useMemo((): LineData[] => {
    const closes = chartData.map(c => c.close);
    const ema = calculateEMA(closes, 50);
    return ema.map((value, i) => value !== null ? { time: chartData[i].time as Time, value } : null).filter(Boolean) as LineData[];
  }, [chartData]);

  const volumeData = useMemo((): HistogramData[] => {
    return candles.map(c => ({
      time: c.time as Time,
      value: Math.abs(c.close - c.open) * 1000000,
      color: c.close >= c.open ? '#22c55e' : '#ef4444',
    }));
  }, [candles]);

  useEffect(() => {
    mountedRef.current = true;
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#111827' },
        textColor: '#9ca3af',
      },
      grid: {
        vertLines: { color: '#1f2937' },
        horzLines: { color: '#1f2937' },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: '#374151',
      },
      timeScale: {
        borderColor: '#374151',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderUpColor: '#22c55e',
      borderDownColor: '#ef4444',
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    const lineSeries = chart.addSeries(LineSeries, {
      color: '#f97316',
      lineWidth: 2,
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' },
      priceScaleId: '',
    });
    volumeSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    const ema20Series = chart.addSeries(LineSeries, {
      color: '#3b82f6',
      lineWidth: 1,
    });

    const ema50Series = chart.addSeries(LineSeries, {
      color: '#a855f7',
      lineWidth: 1,
    });

    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;
    lineSeriesRef.current = lineSeries;
    volumeSeriesRef.current = volumeSeries;
    ema20SeriesRef.current = ema20Series;
    ema50SeriesRef.current = ema50Series;

    const handleResize = () => {
      if (chartContainerRef.current && mountedRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      mountedRef.current = false;
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (!candlestickSeriesRef.current || !lineSeriesRef.current || !volumeSeriesRef.current) return;

    const candleData: CandlestickData[] = chartData.map(c => ({
      time: c.time as Time,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));

    const lineData: LineData[] = chartData.map(c => ({
      time: c.time as Time,
      value: c.close,
    }));

    if (chartType === 'candlestick') {
      candlestickSeriesRef.current.applyOptions({ visible: true });
      lineSeriesRef.current.applyOptions({ visible: false });
      candlestickSeriesRef.current.setData(candleData);
    } else if (chartType === 'line') {
      candlestickSeriesRef.current.applyOptions({ visible: false });
      lineSeriesRef.current.applyOptions({ visible: true });
      lineSeriesRef.current.setData(lineData);
    } else {
      candlestickSeriesRef.current.applyOptions({ visible: true });
      lineSeriesRef.current.applyOptions({ visible: false });
      candlestickSeriesRef.current.setData(candleData);
    }

    volumeSeriesRef.current.setData(volumeData);
  }, [chartData, chartType, volumeData]);

  useEffect(() => {
    if (!ema20SeriesRef.current) return;
    ema20SeriesRef.current.setData(ema20Data);
    ema20SeriesRef.current.applyOptions({ visible: ema20Enabled });
  }, [ema20Data, ema20Enabled]);

  useEffect(() => {
    if (!ema50SeriesRef.current) return;
    ema50SeriesRef.current.setData(ema50Data);
    ema50SeriesRef.current.applyOptions({ visible: ema50Enabled });
  }, [ema50Data, ema50Enabled]);

  const updateChart = useCallback((price: number) => {
    if (!candlestickSeriesRef.current || candles.length === 0 || !mountedRef.current) return;

    const lastCandle = candles[candles.length - 1];
    const currentTime = Math.floor(Date.now() / 1000);
    const lastTime = lastCandle.time;

    if (currentTime > lastTime + 60) {
      const newCandle = {
        time: currentTime as Time,
        open: price,
        high: price,
        low: price,
        close: price,
      };
      candlestickSeriesRef.current.update(newCandle);
      if (lineSeriesRef.current) {
        lineSeriesRef.current.update({ time: currentTime as Time, value: price });
      }
    } else {
      const updated = {
        time: lastTime as Time,
        open: lastCandle.open,
        high: Math.max(lastCandle.high, price),
        low: Math.min(lastCandle.low, price),
        close: price,
      };
      candlestickSeriesRef.current.update(updated);
      if (lineSeriesRef.current) {
        lineSeriesRef.current.update({ time: lastTime as Time, value: price });
      }
    }
  }, [candles]);

  useEffect(() => {
    if (livePrice && mountedRef.current) {
      updateChart(livePrice);
    }
  }, [livePrice, updateChart]);

  return (
    <div ref={chartContainerRef} className="w-full h-[400px] rounded-lg overflow-hidden" />
  );
});