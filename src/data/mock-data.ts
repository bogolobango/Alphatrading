import type {
  MarketAsset,
  PortfolioHolding,
  Trade,
  OrderBookEntry,
  NewsItem,
  ChartDataPoint,
} from "@/types";

export const mockMarketAssets: MarketAsset[] = [
  {
    id: "aapl",
    symbol: "AAPL",
    name: "Apple Inc.",
    assetType: "stock",
    current_price: 189.84,
    market_cap: 2950000000000,
    market_cap_rank: 1,
    total_volume: 54200000,
    price_change_percentage_24h: 1.23,
    price_change_percentage_7d: 3.45,
    exchange: "NASDAQ",
    sector: "Technology",
    pe_ratio: 29.5,
    dividend_yield: 0.55,
    eps: 6.43,
    sparkline_in_7d: {
      price: Array.from({ length: 168 }, (_, i) => 184 + Math.sin(i / 10) * 3 + i * 0.035),
    },
  },
  {
    id: "msft",
    symbol: "MSFT",
    name: "Microsoft Corp.",
    assetType: "stock",
    current_price: 415.60,
    market_cap: 3090000000000,
    market_cap_rank: 2,
    total_volume: 22100000,
    price_change_percentage_24h: 0.87,
    price_change_percentage_7d: 2.15,
    exchange: "NASDAQ",
    sector: "Technology",
    pe_ratio: 36.2,
    dividend_yield: 0.72,
    eps: 11.48,
    sparkline_in_7d: {
      price: Array.from({ length: 168 }, (_, i) => 408 + Math.sin(i / 12) * 4 + i * 0.045),
    },
  },
  {
    id: "nvda",
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    assetType: "stock",
    current_price: 875.30,
    market_cap: 2160000000000,
    market_cap_rank: 3,
    total_volume: 41500000,
    price_change_percentage_24h: 3.45,
    price_change_percentage_7d: 8.92,
    exchange: "NASDAQ",
    sector: "Technology",
    pe_ratio: 65.8,
    dividend_yield: 0.02,
    eps: 13.30,
    sparkline_in_7d: {
      price: Array.from({ length: 168 }, (_, i) => 810 + Math.sin(i / 8) * 25 + i * 0.38),
    },
  },
  {
    id: "tsla",
    symbol: "TSLA",
    name: "Tesla Inc.",
    assetType: "stock",
    current_price: 248.42,
    market_cap: 790000000000,
    market_cap_rank: 4,
    total_volume: 98200000,
    price_change_percentage_24h: -2.15,
    price_change_percentage_7d: -0.56,
    exchange: "NASDAQ",
    sector: "Consumer Cyclical",
    pe_ratio: 42.1,
    dividend_yield: 0,
    eps: 5.90,
    sparkline_in_7d: {
      price: Array.from({ length: 168 }, (_, i) => 255 + Math.sin(i / 7) * 8 - i * 0.04),
    },
  },
  {
    id: "amzn",
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    assetType: "stock",
    current_price: 186.51,
    market_cap: 1950000000000,
    market_cap_rank: 5,
    total_volume: 32600000,
    price_change_percentage_24h: 1.56,
    price_change_percentage_7d: 4.23,
    exchange: "NASDAQ",
    sector: "Consumer Cyclical",
    pe_ratio: 51.3,
    dividend_yield: 0,
    eps: 3.64,
    sparkline_in_7d: {
      price: Array.from({ length: 168 }, (_, i) => 180 + Math.sin(i / 9) * 3.5 + i * 0.038),
    },
  },
  {
    id: "googl",
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    assetType: "stock",
    current_price: 155.72,
    market_cap: 1920000000000,
    market_cap_rank: 6,
    total_volume: 24800000,
    price_change_percentage_24h: 0.45,
    price_change_percentage_7d: 1.78,
    exchange: "NASDAQ",
    sector: "Communication Services",
    pe_ratio: 25.8,
    dividend_yield: 0.49,
    eps: 6.03,
    sparkline_in_7d: {
      price: Array.from({ length: 168 }, (_, i) => 153 + Math.sin(i / 10) * 1.5 + i * 0.015),
    },
  },
  {
    id: "meta",
    symbol: "META",
    name: "Meta Platforms Inc.",
    assetType: "stock",
    current_price: 512.30,
    market_cap: 1310000000000,
    market_cap_rank: 7,
    total_volume: 18400000,
    price_change_percentage_24h: 2.34,
    price_change_percentage_7d: 5.67,
    exchange: "NASDAQ",
    sector: "Communication Services",
    pe_ratio: 27.1,
    dividend_yield: 0.38,
    eps: 18.90,
    sparkline_in_7d: {
      price: Array.from({ length: 168 }, (_, i) => 490 + Math.sin(i / 11) * 10 + i * 0.13),
    },
  },
  // ETFs
  {
    id: "spy",
    symbol: "SPY",
    name: "SPDR S&P 500 ETF",
    assetType: "etf",
    current_price: 502.45,
    market_cap: 530000000000,
    market_cap_rank: 8,
    total_volume: 72000000,
    price_change_percentage_24h: 0.65,
    price_change_percentage_7d: 1.92,
    exchange: "NYSE",
    sector: "Index Fund",
    dividend_yield: 1.32,
    sparkline_in_7d: {
      price: Array.from({ length: 168 }, (_, i) => 497 + Math.sin(i / 14) * 2.5 + i * 0.03),
    },
  },
  {
    id: "qqq",
    symbol: "QQQ",
    name: "Invesco QQQ Trust",
    assetType: "etf",
    current_price: 438.12,
    market_cap: 250000000000,
    market_cap_rank: 9,
    total_volume: 45000000,
    price_change_percentage_24h: 1.12,
    price_change_percentage_7d: 3.25,
    exchange: "NASDAQ",
    sector: "Index Fund",
    dividend_yield: 0.55,
    sparkline_in_7d: {
      price: Array.from({ length: 168 }, (_, i) => 428 + Math.sin(i / 10) * 5 + i * 0.06),
    },
  },
  {
    id: "voo",
    symbol: "VOO",
    name: "Vanguard S&P 500 ETF",
    assetType: "etf",
    current_price: 462.78,
    market_cap: 430000000000,
    market_cap_rank: 10,
    total_volume: 4200000,
    price_change_percentage_24h: 0.62,
    price_change_percentage_7d: 1.88,
    exchange: "NYSE",
    sector: "Index Fund",
    dividend_yield: 1.35,
    sparkline_in_7d: {
      price: Array.from({ length: 168 }, (_, i) => 458 + Math.sin(i / 14) * 2.2 + i * 0.028),
    },
  },
];

// Backward compat alias
export const mockCryptoAssets = mockMarketAssets;

export const mockPortfolioHoldings: PortfolioHolding[] = [
  { id: "aapl", symbol: "AAPL", name: "Apple Inc.", assetType: "stock", amount: 50, avgBuyPrice: 172.50, currentPrice: 189.84 },
  { id: "msft", symbol: "MSFT", name: "Microsoft Corp.", assetType: "stock", amount: 25, avgBuyPrice: 380.00, currentPrice: 415.60 },
  { id: "nvda", symbol: "NVDA", name: "NVIDIA Corp.", assetType: "stock", amount: 15, avgBuyPrice: 720.00, currentPrice: 875.30 },
  { id: "spy", symbol: "SPY", name: "SPDR S&P 500 ETF", assetType: "etf", amount: 30, avgBuyPrice: 475.00, currentPrice: 502.45 },
  { id: "qqq", symbol: "QQQ", name: "Invesco QQQ Trust", assetType: "etf", amount: 20, avgBuyPrice: 410.00, currentPrice: 438.12 },
];

export const mockTrades: Trade[] = [
  { id: "t1", symbol: "AAPL", name: "Apple Inc.", type: "buy", orderType: "market", amount: 25, price: 185.50, total: 4637.50, timestamp: Date.now() - 86400000 * 2, status: "completed" },
  { id: "t2", symbol: "NVDA", name: "NVIDIA Corp.", type: "buy", orderType: "limit", amount: 10, price: 820.00, total: 8200.00, timestamp: Date.now() - 86400000 * 3, status: "completed" },
  { id: "t3", symbol: "TSLA", name: "Tesla Inc.", type: "sell", orderType: "market", amount: 20, price: 255.30, total: 5106.00, timestamp: Date.now() - 86400000, status: "completed" },
  { id: "t4", symbol: "SPY", name: "SPDR S&P 500 ETF", type: "buy", orderType: "limit", amount: 10, price: 498.00, total: 4980.00, timestamp: Date.now() - 3600000 * 8, status: "pending" },
  { id: "t5", symbol: "MSFT", name: "Microsoft Corp.", type: "buy", orderType: "market", amount: 15, price: 408.25, total: 6123.75, timestamp: Date.now() - 86400000 * 5, status: "completed" },
  { id: "t6", symbol: "META", name: "Meta Platforms Inc.", type: "sell", orderType: "stop-loss", amount: 8, price: 495.00, total: 3960.00, timestamp: Date.now() - 86400000 * 4, status: "completed" },
  { id: "t7", symbol: "AMZN", name: "Amazon.com Inc.", type: "buy", orderType: "market", amount: 20, price: 182.40, total: 3648.00, timestamp: Date.now() - 86400000, status: "completed" },
  { id: "t8", symbol: "QQQ", name: "Invesco QQQ Trust", type: "buy", orderType: "market", amount: 10, price: 432.15, total: 4321.50, timestamp: Date.now() - 3600000 * 4, status: "completed" },
];

export function generateOrderBook(basePrice: number): {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
} {
  const bids: OrderBookEntry[] = [];
  const asks: OrderBookEntry[] = [];
  let bidTotal = 0;
  let askTotal = 0;
  const step = basePrice > 100 ? 0.05 : 0.01;

  for (let i = 0; i < 15; i++) {
    const bidPrice = basePrice - (i + 1) * step;
    const bidAmount = Math.floor(Math.random() * 500 + 50);
    bidTotal += bidAmount;
    bids.push({ price: bidPrice, amount: bidAmount, total: bidTotal });

    const askPrice = basePrice + (i + 1) * step;
    const askAmount = Math.floor(Math.random() * 500 + 50);
    askTotal += askAmount;
    asks.push({ price: askPrice, amount: askAmount, total: askTotal });
  }

  return { bids, asks };
}

export function generateCandlestickData(
  basePrice: number,
  days: number = 90
): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  let price = basePrice * 0.85;
  const now = Date.now();

  for (let i = days; i >= 0; i--) {
    const time = now - i * 86400000;
    const change = (Math.random() - 0.48) * basePrice * 0.02;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * basePrice * 0.008;
    const low = Math.min(open, close) - Math.random() * basePrice * 0.008;
    const volume = Math.floor(Math.random() * 50000000 + 10000000);

    data.push({ time: Math.floor(time / 1000), open, high, low, close, volume });
    price = close;
  }

  return data;
}

export const mockNews: NewsItem[] = [
  {
    id: "n1",
    title: "NVIDIA Surpasses $2T Market Cap as AI Chip Demand Accelerates",
    source: "Bloomberg",
    url: "#",
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    sentiment: "positive",
    tickers: ["NVDA"],
    summary: "NVIDIA has surpassed a $2 trillion market capitalization as demand for its AI training chips continues to surge, driven by enterprise adoption of large language models.",
  },
  {
    id: "n2",
    title: "Federal Reserve Signals Potential Rate Cuts in Coming Months",
    source: "CNBC",
    url: "#",
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    sentiment: "positive",
    tickers: ["SPY", "QQQ"],
    summary: "The Federal Reserve has signaled openness to rate cuts as inflation shows sustained progress toward the 2% target, boosting market optimism across equities.",
  },
  {
    id: "n3",
    title: "SEC Proposes New Rules for Options Trading Transparency",
    source: "Reuters",
    url: "#",
    publishedAt: new Date(Date.now() - 14400000).toISOString(),
    sentiment: "neutral",
    tickers: ["SPY"],
    summary: "The Securities and Exchange Commission is reviewing new rules aimed at increasing transparency in options markets, potentially affecting retail trader access.",
  },
  {
    id: "n4",
    title: "Apple Announces Record Services Revenue in Q1 Earnings Beat",
    source: "Wall Street Journal",
    url: "#",
    publishedAt: new Date(Date.now() - 28800000).toISOString(),
    sentiment: "positive",
    tickers: ["AAPL"],
    summary: "Apple reported record services revenue in its latest quarterly earnings, beating analyst expectations and highlighting the company's shift toward recurring revenue.",
  },
  {
    id: "n5",
    title: "Tesla Faces Margin Pressure as Price War Intensifies in China",
    source: "Financial Times",
    url: "#",
    publishedAt: new Date(Date.now() - 43200000).toISOString(),
    sentiment: "negative",
    tickers: ["TSLA"],
    summary: "Tesla's automotive margins are under pressure as competitors in China continue aggressive price cuts, raising concerns about the company's profitability outlook.",
  },
  {
    id: "n6",
    title: "Microsoft Azure Cloud Revenue Grows 29% Year-Over-Year",
    source: "TechCrunch",
    url: "#",
    publishedAt: new Date(Date.now() - 57600000).toISOString(),
    sentiment: "positive",
    tickers: ["MSFT"],
    summary: "Microsoft's Azure cloud division posted strong 29% revenue growth driven by AI workload demand, cementing its position as the second-largest cloud provider.",
  },
  {
    id: "n7",
    title: "S&P 500 Hits All-Time High as Tech Earnings Drive Rally",
    source: "MarketWatch",
    url: "#",
    publishedAt: new Date(Date.now() - 72000000).toISOString(),
    sentiment: "positive",
    tickers: ["SPY", "QQQ", "VOO"],
    summary: "The S&P 500 reached a new all-time high, propelled by better-than-expected earnings from major tech companies and improving economic indicators.",
  },
  {
    id: "n8",
    title: "Amazon Expands Same-Day Delivery to 50 New Metro Areas",
    source: "CNBC",
    url: "#",
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    sentiment: "positive",
    tickers: ["AMZN"],
    summary: "Amazon is expanding its same-day delivery service to 50 additional metropolitan areas, investing heavily in its logistics network to fend off competition.",
  },
];

export const portfolioHistoryData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  value: 42000 + Math.sin(i / 3) * 2500 + i * 350 + Math.random() * 1000,
}));

export const allocationData = [
  { name: "AAPL", value: 9492, color: "#555555" },
  { name: "MSFT", value: 10390, color: "#00a2ed" },
  { name: "NVDA", value: 13130, color: "#76b900" },
  { name: "SPY", value: 15074, color: "#e3242b" },
  { name: "QQQ", value: 8762, color: "#6b47dc" },
];
