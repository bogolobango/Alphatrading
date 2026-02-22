export type AssetType = "stock" | "etf" | "option" | "crypto";

export interface MarketAsset {
  id: string;
  symbol: string;
  name: string;
  assetType: AssetType;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d?: number;
  sparkline_in_7d?: { price: number[] };
  // Stock/ETF specific
  exchange?: string;
  sector?: string;
  pe_ratio?: number;
  dividend_yield?: number;
  eps?: number;
  // Crypto specific
  circulating_supply?: number;
  total_supply?: number | null;
}

// Backward compat alias
export type CryptoAsset = MarketAsset;

export interface PortfolioHolding {
  id: string;
  symbol: string;
  name: string;
  assetType: AssetType;
  amount: number;
  avgBuyPrice: number;
  currentPrice: number;
  image?: string;
}

export interface Trade {
  id: string;
  symbol: string;
  name: string;
  type: "buy" | "sell";
  orderType: "market" | "limit" | "stop-loss" | "take-profit";
  amount: number;
  price: number;
  total: number;
  timestamp: number;
  status: "completed" | "pending" | "cancelled";
}

export interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  sentiment: "positive" | "negative" | "neutral";
  tickers: string[];
  summary: string;
}

export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: "above" | "below";
  active: boolean;
}

export interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  addedAt: number;
}

export interface ChartDataPoint {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type TimeFrame = "1m" | "5m" | "15m" | "1h" | "4h" | "1D" | "1W";
