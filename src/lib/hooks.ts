"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMarketData, fetchCandleData, fetchNews } from "@/lib/api";
import {
  mockMarketAssets,
  mockNews as mockNewsData,
  generateCandlestickData,
} from "@/data/mock-data";
import type { TimeFrame } from "@/types";

const TIMEFRAME_DAYS: Record<TimeFrame, number> = {
  "1m": 1,
  "5m": 3,
  "15m": 7,
  "1h": 14,
  "4h": 30,
  "1D": 90,
  "1W": 365,
};

/** Live market data for tracked tickers — falls back to mock data */
export function useMarketData() {
  return useQuery({
    queryKey: ["market-data"],
    queryFn: fetchMarketData,
    placeholderData: mockMarketAssets,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}

/** Live OHLCV candle data for a specific ticker + timeframe */
export function useCandleData(ticker: string, timeframe: TimeFrame) {
  const mockPrice =
    mockMarketAssets.find((a) => a.symbol === ticker)?.current_price ?? 150;

  return useQuery({
    queryKey: ["candle-data", ticker, timeframe],
    queryFn: () => fetchCandleData(ticker, timeframe),
    placeholderData: generateCandlestickData(mockPrice, TIMEFRAME_DAYS[timeframe]),
    staleTime: timeframe === "1m" ? 10_000 : 60_000,
    refetchInterval: timeframe === "1m" ? 30_000 : 120_000,
  });
}

/** Live financial news from Polygon */
export function useNews() {
  return useQuery({
    queryKey: ["news"],
    queryFn: () => fetchNews(20),
    placeholderData: mockNewsData,
    staleTime: 60_000,
    refetchInterval: 300_000,
  });
}
