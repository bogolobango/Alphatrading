import type {
  CryptoAsset,
  PortfolioHolding,
  Trade,
  OrderBookEntry,
  NewsItem,
  ChartDataPoint,
} from "@/types";

export const mockCryptoAssets: CryptoAsset[] = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    current_price: 97542.31,
    market_cap: 1932000000000,
    market_cap_rank: 1,
    total_volume: 28500000000,
    price_change_percentage_24h: 2.34,
    price_change_percentage_7d: 5.67,
    circulating_supply: 19800000,
    total_supply: 21000000,
    sparkline_in_7d: {
      price: Array.from({ length: 168 }, (_, i) => 93000 + Math.sin(i / 10) * 2000 + i * 25),
    },
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    current_price: 3456.78,
    market_cap: 415000000000,
    market_cap_rank: 2,
    total_volume: 15200000000,
    price_change_percentage_24h: -1.23,
    price_change_percentage_7d: 3.45,
    circulating_supply: 120000000,
    total_supply: null,
    sparkline_in_7d: {
      price: Array.from({ length: 168 }, (_, i) => 3200 + Math.sin(i / 8) * 150 + i * 1.5),
    },
  },
  {
    id: "solana",
    symbol: "sol",
    name: "Solana",
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    current_price: 198.45,
    market_cap: 92000000000,
    market_cap_rank: 3,
    total_volume: 4800000000,
    price_change_percentage_24h: 5.67,
    price_change_percentage_7d: 12.34,
    circulating_supply: 463000000,
    total_supply: 577000000,
    sparkline_in_7d: {
      price: Array.from({ length: 168 }, (_, i) => 170 + Math.sin(i / 12) * 15 + i * 0.15),
    },
  },
  {
    id: "binancecoin",
    symbol: "bnb",
    name: "BNB",
    image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    current_price: 642.15,
    market_cap: 96000000000,
    market_cap_rank: 4,
    total_volume: 1800000000,
    price_change_percentage_24h: 0.89,
    price_change_percentage_7d: 2.15,
    circulating_supply: 149000000,
    total_supply: 149000000,
    sparkline_in_7d: {
      price: Array.from({ length: 168 }, (_, i) => 620 + Math.sin(i / 15) * 12 + i * 0.12),
    },
  },
  {
    id: "ripple",
    symbol: "xrp",
    name: "XRP",
    image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
    current_price: 2.34,
    market_cap: 135000000000,
    market_cap_rank: 5,
    total_volume: 5600000000,
    price_change_percentage_24h: -0.45,
    price_change_percentage_7d: 1.78,
    circulating_supply: 57700000000,
    total_supply: 100000000000,
    sparkline_in_7d: {
      price: Array.from({ length: 168 }, (_, i) => 2.1 + Math.sin(i / 10) * 0.12 + i * 0.001),
    },
  },
  {
    id: "cardano",
    symbol: "ada",
    name: "Cardano",
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    current_price: 1.12,
    market_cap: 40000000000,
    market_cap_rank: 6,
    total_volume: 1200000000,
    price_change_percentage_24h: 3.21,
    price_change_percentage_7d: 8.45,
    circulating_supply: 35700000000,
    total_supply: 45000000000,
    sparkline_in_7d: {
      price: Array.from({ length: 168 }, (_, i) => 0.95 + Math.sin(i / 9) * 0.08 + i * 0.001),
    },
  },
  {
    id: "dogecoin",
    symbol: "doge",
    name: "Dogecoin",
    image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
    current_price: 0.412,
    market_cap: 60000000000,
    market_cap_rank: 7,
    total_volume: 3200000000,
    price_change_percentage_24h: -2.15,
    price_change_percentage_7d: -0.56,
    circulating_supply: 146000000000,
    total_supply: null,
    sparkline_in_7d: {
      price: Array.from({ length: 168 }, (_, i) => 0.38 + Math.sin(i / 7) * 0.02 + i * 0.0002),
    },
  },
  {
    id: "avalanche",
    symbol: "avax",
    name: "Avalanche",
    image: "https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png",
    current_price: 42.67,
    market_cap: 17000000000,
    market_cap_rank: 8,
    total_volume: 890000000,
    price_change_percentage_24h: 4.56,
    price_change_percentage_7d: 9.12,
    circulating_supply: 398000000,
    total_supply: 720000000,
    sparkline_in_7d: {
      price: Array.from({ length: 168 }, (_, i) => 36 + Math.sin(i / 11) * 3 + i * 0.035),
    },
  },
  {
    id: "polkadot",
    symbol: "dot",
    name: "Polkadot",
    image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
    current_price: 8.92,
    market_cap: 12500000000,
    market_cap_rank: 9,
    total_volume: 520000000,
    price_change_percentage_24h: 1.45,
    price_change_percentage_7d: 4.32,
    circulating_supply: 1400000000,
    total_supply: null,
    sparkline_in_7d: {
      price: Array.from({ length: 168 }, (_, i) => 8 + Math.sin(i / 10) * 0.5 + i * 0.005),
    },
  },
  {
    id: "chainlink",
    symbol: "link",
    name: "Chainlink",
    image: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png",
    current_price: 18.56,
    market_cap: 11500000000,
    market_cap_rank: 10,
    total_volume: 780000000,
    price_change_percentage_24h: -0.78,
    price_change_percentage_7d: 6.23,
    circulating_supply: 620000000,
    total_supply: 1000000000,
    sparkline_in_7d: {
      price: Array.from({ length: 168 }, (_, i) => 16.5 + Math.sin(i / 8) * 1.2 + i * 0.012),
    },
  },
];

export const mockPortfolioHoldings: PortfolioHolding[] = [
  {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    amount: 1.5,
    avgBuyPrice: 85000,
    currentPrice: 97542.31,
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
  },
  {
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
    amount: 15,
    avgBuyPrice: 3100,
    currentPrice: 3456.78,
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
  },
  {
    id: "solana",
    symbol: "SOL",
    name: "Solana",
    amount: 120,
    avgBuyPrice: 145,
    currentPrice: 198.45,
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
  },
  {
    id: "cardano",
    symbol: "ADA",
    name: "Cardano",
    amount: 5000,
    avgBuyPrice: 0.85,
    currentPrice: 1.12,
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
  },
  {
    id: "chainlink",
    symbol: "LINK",
    name: "Chainlink",
    amount: 250,
    avgBuyPrice: 14.5,
    currentPrice: 18.56,
    image: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png",
  },
];

export const mockTrades: Trade[] = [
  {
    id: "t1",
    symbol: "BTC",
    name: "Bitcoin",
    type: "buy",
    orderType: "market",
    amount: 0.5,
    price: 95000,
    total: 47500,
    timestamp: Date.now() - 86400000 * 2,
    status: "completed",
  },
  {
    id: "t2",
    symbol: "ETH",
    name: "Ethereum",
    type: "buy",
    orderType: "limit",
    amount: 5,
    price: 3200,
    total: 16000,
    timestamp: Date.now() - 86400000 * 3,
    status: "completed",
  },
  {
    id: "t3",
    symbol: "SOL",
    name: "Solana",
    type: "sell",
    orderType: "market",
    amount: 20,
    price: 195,
    total: 3900,
    timestamp: Date.now() - 86400000,
    status: "completed",
  },
  {
    id: "t4",
    symbol: "BTC",
    name: "Bitcoin",
    type: "buy",
    orderType: "limit",
    amount: 0.25,
    price: 94000,
    total: 23500,
    timestamp: Date.now() - 3600000 * 8,
    status: "pending",
  },
  {
    id: "t5",
    symbol: "ADA",
    name: "Cardano",
    type: "buy",
    orderType: "market",
    amount: 2000,
    price: 1.05,
    total: 2100,
    timestamp: Date.now() - 86400000 * 5,
    status: "completed",
  },
  {
    id: "t6",
    symbol: "LINK",
    name: "Chainlink",
    type: "sell",
    orderType: "stop-loss",
    amount: 50,
    price: 17.8,
    total: 890,
    timestamp: Date.now() - 86400000 * 4,
    status: "completed",
  },
  {
    id: "t7",
    symbol: "ETH",
    name: "Ethereum",
    type: "sell",
    orderType: "take-profit",
    amount: 3,
    price: 3500,
    total: 10500,
    timestamp: Date.now() - 86400000 * 1,
    status: "completed",
  },
  {
    id: "t8",
    symbol: "SOL",
    name: "Solana",
    type: "buy",
    orderType: "market",
    amount: 30,
    price: 188,
    total: 5640,
    timestamp: Date.now() - 3600000 * 4,
    status: "completed",
  },
];

export function generateOrderBook(basePrice: number): {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
} {
  const bids: OrderBookEntry[] = [];
  const asks: OrderBookEntry[] = [];

  let bidTotal = 0;
  let askTotal = 0;

  for (let i = 0; i < 15; i++) {
    const bidPrice = basePrice - (i + 1) * basePrice * 0.0005;
    const bidAmount = Math.random() * 2 + 0.1;
    bidTotal += bidAmount;
    bids.push({ price: bidPrice, amount: bidAmount, total: bidTotal });

    const askPrice = basePrice + (i + 1) * basePrice * 0.0005;
    const askAmount = Math.random() * 2 + 0.1;
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
  let price = basePrice * 0.7;
  const now = Date.now();

  for (let i = days; i >= 0; i--) {
    const time = now - i * 86400000;
    const change = (Math.random() - 0.48) * basePrice * 0.03;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * basePrice * 0.01;
    const low = Math.min(open, close) - Math.random() * basePrice * 0.01;
    const volume = Math.random() * 1000000 + 500000;

    data.push({
      time: Math.floor(time / 1000),
      open,
      high,
      low,
      close,
      volume,
    });

    price = close;
  }

  return data;
}

export const mockNews: NewsItem[] = [
  {
    id: "n1",
    title: "Bitcoin Surges Past $97K as Institutional Demand Reaches Record Highs",
    source: "CoinDesk",
    url: "#",
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    sentiment: "positive",
    currencies: ["BTC"],
    summary:
      "Bitcoin has surged past $97,000 as institutional investors continue to pour money into spot Bitcoin ETFs, driving demand to unprecedented levels.",
  },
  {
    id: "n2",
    title: "Ethereum Layer 2 Solutions See 300% Growth in TVL",
    source: "The Block",
    url: "#",
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    sentiment: "positive",
    currencies: ["ETH"],
    summary:
      "Ethereum Layer 2 solutions have experienced a massive 300% increase in total value locked, signaling growing adoption of scalability solutions.",
  },
  {
    id: "n3",
    title: "SEC Reviews New Crypto Regulation Framework",
    source: "Reuters",
    url: "#",
    publishedAt: new Date(Date.now() - 14400000).toISOString(),
    sentiment: "neutral",
    currencies: ["BTC", "ETH"],
    summary:
      "The Securities and Exchange Commission is reviewing a new regulatory framework for digital assets that could reshape the crypto landscape.",
  },
  {
    id: "n4",
    title: "Solana DeFi Ecosystem Hits New All-Time High in Daily Transactions",
    source: "CryptoSlate",
    url: "#",
    publishedAt: new Date(Date.now() - 28800000).toISOString(),
    sentiment: "positive",
    currencies: ["SOL"],
    summary:
      "Solana's DeFi ecosystem has reached a new record in daily transaction count, surpassing Ethereum in throughput metrics.",
  },
  {
    id: "n5",
    title: "Major Exchange Reports Security Breach Affecting User Accounts",
    source: "CoinTelegraph",
    url: "#",
    publishedAt: new Date(Date.now() - 43200000).toISOString(),
    sentiment: "negative",
    currencies: ["BTC", "ETH"],
    summary:
      "A major cryptocurrency exchange has reported a security incident that may have compromised some user accounts, prompting immediate action.",
  },
  {
    id: "n6",
    title: "Cardano's Hydra Protocol Shows Promising Scalability Results",
    source: "Decrypt",
    url: "#",
    publishedAt: new Date(Date.now() - 57600000).toISOString(),
    sentiment: "positive",
    currencies: ["ADA"],
    summary:
      "Cardano's Hydra Layer 2 scaling solution has demonstrated impressive results in latest benchmarks, processing over 1 million TPS.",
  },
  {
    id: "n7",
    title: "Global Crypto Market Cap Approaches $4 Trillion Milestone",
    source: "Bloomberg",
    url: "#",
    publishedAt: new Date(Date.now() - 72000000).toISOString(),
    sentiment: "positive",
    currencies: ["BTC", "ETH", "SOL"],
    summary:
      "The total cryptocurrency market capitalization is approaching the $4 trillion mark for the first time in history.",
  },
  {
    id: "n8",
    title: "XRP Sees Renewed Interest Following Regulatory Clarity",
    source: "CoinDesk",
    url: "#",
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    sentiment: "positive",
    currencies: ["XRP"],
    summary:
      "XRP has seen a significant increase in trading volume as markets react positively to new regulatory developments.",
  },
];

export const portfolioHistoryData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  }),
  value: 215000 + Math.sin(i / 3) * 15000 + i * 1500 + Math.random() * 5000,
}));

export const allocationData = [
  { name: "BTC", value: 146313, color: "#f7931a" },
  { name: "ETH", value: 51852, color: "#627eea" },
  { name: "SOL", value: 23814, color: "#00ffa3" },
  { name: "ADA", value: 5600, color: "#0033ad" },
  { name: "LINK", value: 4640, color: "#2a5ada" },
];
