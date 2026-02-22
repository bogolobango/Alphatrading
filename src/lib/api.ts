import type { MarketAsset, ChartDataPoint, NewsItem, TimeFrame } from "@/types";

const POLYGON_BASE = "https://api.polygon.io";
const POLYGON_KEY = process.env.NEXT_PUBLIC_POLYGON_API_KEY || "";

/* ------------------------------------------------------------------ */
/*  Ticker metadata — enriches bare Polygon responses with names/type */
/* ------------------------------------------------------------------ */
const TICKER_META: Record<
  string,
  { name: string; assetType: "stock" | "etf"; sector: string; exchange: string }
> = {
  AAPL: { name: "Apple Inc.", assetType: "stock", sector: "Technology", exchange: "NASDAQ" },
  MSFT: { name: "Microsoft Corp.", assetType: "stock", sector: "Technology", exchange: "NASDAQ" },
  NVDA: { name: "NVIDIA Corp.", assetType: "stock", sector: "Technology", exchange: "NASDAQ" },
  TSLA: { name: "Tesla Inc.", assetType: "stock", sector: "Consumer Cyclical", exchange: "NASDAQ" },
  AMZN: { name: "Amazon.com Inc.", assetType: "stock", sector: "Consumer Cyclical", exchange: "NASDAQ" },
  GOOGL: { name: "Alphabet Inc.", assetType: "stock", sector: "Communication Services", exchange: "NASDAQ" },
  META: { name: "Meta Platforms Inc.", assetType: "stock", sector: "Communication Services", exchange: "NASDAQ" },
  SPY: { name: "SPDR S&P 500 ETF", assetType: "etf", sector: "Index Fund", exchange: "NYSE" },
  QQQ: { name: "Invesco QQQ Trust", assetType: "etf", sector: "Index Fund", exchange: "NASDAQ" },
  VOO: { name: "Vanguard S&P 500 ETF", assetType: "etf", sector: "Index Fund", exchange: "NYSE" },
  JPM: { name: "JPMorgan Chase & Co.", assetType: "stock", sector: "Financial Services", exchange: "NYSE" },
  V: { name: "Visa Inc.", assetType: "stock", sector: "Financial Services", exchange: "NYSE" },
  JNJ: { name: "Johnson & Johnson", assetType: "stock", sector: "Healthcare", exchange: "NYSE" },
  WMT: { name: "Walmart Inc.", assetType: "stock", sector: "Consumer Defensive", exchange: "NYSE" },
  UNH: { name: "UnitedHealth Group", assetType: "stock", sector: "Healthcare", exchange: "NYSE" },
  MA: { name: "Mastercard Inc.", assetType: "stock", sector: "Financial Services", exchange: "NYSE" },
  DIS: { name: "Walt Disney Co.", assetType: "stock", sector: "Communication Services", exchange: "NYSE" },
  NFLX: { name: "Netflix Inc.", assetType: "stock", sector: "Communication Services", exchange: "NASDAQ" },
  AMD: { name: "Advanced Micro Devices", assetType: "stock", sector: "Technology", exchange: "NASDAQ" },
  INTC: { name: "Intel Corp.", assetType: "stock", sector: "Technology", exchange: "NASDAQ" },
};

const WATCHED_TICKERS = [
  "AAPL", "MSFT", "NVDA", "TSLA", "AMZN", "GOOGL", "META",
  "SPY", "QQQ", "VOO",
];

/* ------------------------------------------------------------------ */
/*  Market Data — snapshot with prev-close fallback                   */
/* ------------------------------------------------------------------ */

export async function fetchMarketData(): Promise<MarketAsset[]> {
  if (!POLYGON_KEY) throw new Error("No Polygon API key configured");

  // Try snapshot endpoint first (requires Starter+ plan)
  try {
    const tickerParam = WATCHED_TICKERS.join(",");
    const res = await fetch(
      `${POLYGON_BASE}/v2/snapshot/locale/us/markets/stocks/tickers?tickers=${tickerParam}&apiKey=${POLYGON_KEY}`
    );

    if (res.ok) {
      const json = await res.json();
      const tickers = json.tickers ?? [];

      if (tickers.length > 0) {
        return tickers.map(
          (t: Record<string, unknown>, i: number): MarketAsset => {
            const ticker = t.ticker as string;
            const meta = TICKER_META[ticker];
            const day = t.day as Record<string, number> | undefined;
            const prevDay = t.prevDay as Record<string, number> | undefined;
            const lastPrice = day?.c ?? prevDay?.c ?? 0;
            const prevClose = prevDay?.c ?? lastPrice;
            const change24h = prevClose
              ? ((lastPrice - prevClose) / prevClose) * 100
              : 0;

            return {
              id: ticker.toLowerCase(),
              symbol: ticker,
              name: meta?.name ?? ticker,
              assetType: meta?.assetType ?? "stock",
              current_price: lastPrice,
              market_cap: 0,
              market_cap_rank: i + 1,
              total_volume: day?.v ?? 0,
              price_change_percentage_24h:
                (t.todaysChangePerc as number) ?? change24h,
              exchange: meta?.exchange,
              sector: meta?.sector,
            };
          }
        );
      }
    }
  } catch {
    /* fall through to prev-close fallback */
  }

  // Fallback: fetch previous close for each ticker (works on free tier)
  const results = await Promise.allSettled(
    WATCHED_TICKERS.map(async (ticker) => {
      const res = await fetch(
        `${POLYGON_BASE}/v2/aggs/ticker/${ticker}/prev?apiKey=${POLYGON_KEY}`
      );
      if (!res.ok) throw new Error(`Failed: ${ticker}`);
      const json = await res.json();
      return { ticker, bar: json.results?.[0] };
    })
  );

  return results
    .filter(
      (r): r is PromiseFulfilledResult<{
        ticker: string;
        bar: Record<string, number>;
      }> => r.status === "fulfilled" && !!r.value.bar
    )
    .map(({ value: { ticker, bar } }, i): MarketAsset => {
      const meta = TICKER_META[ticker];
      const change =
        bar.c && bar.o ? ((bar.c - bar.o) / bar.o) * 100 : 0;

      return {
        id: ticker.toLowerCase(),
        symbol: ticker,
        name: meta?.name ?? ticker,
        assetType: meta?.assetType ?? "stock",
        current_price: bar.c ?? 0,
        market_cap: 0,
        market_cap_rank: i + 1,
        total_volume: bar.v ?? 0,
        price_change_percentage_24h: change,
        exchange: meta?.exchange,
        sector: meta?.sector,
      };
    });
}

/* ------------------------------------------------------------------ */
/*  Candlestick / OHLCV data                                         */
/* ------------------------------------------------------------------ */

const TIMEFRAME_CONFIG: Record<
  TimeFrame,
  { multiplier: number; timespan: string; days: number }
> = {
  "1m": { multiplier: 1, timespan: "minute", days: 1 },
  "5m": { multiplier: 5, timespan: "minute", days: 3 },
  "15m": { multiplier: 15, timespan: "minute", days: 7 },
  "1h": { multiplier: 1, timespan: "hour", days: 14 },
  "4h": { multiplier: 4, timespan: "hour", days: 30 },
  "1D": { multiplier: 1, timespan: "day", days: 90 },
  "1W": { multiplier: 1, timespan: "week", days: 365 },
};

export async function fetchCandleData(
  ticker: string,
  timeframe: TimeFrame
): Promise<ChartDataPoint[]> {
  if (!POLYGON_KEY) throw new Error("No Polygon API key configured");

  const config = TIMEFRAME_CONFIG[timeframe];
  const to = new Date();
  const from = new Date(to.getTime() - config.days * 86400000);
  const fromStr = from.toISOString().split("T")[0];
  const toStr = to.toISOString().split("T")[0];

  const res = await fetch(
    `${POLYGON_BASE}/v2/aggs/ticker/${ticker}/range/${config.multiplier}/${config.timespan}/${fromStr}/${toStr}?adjusted=true&sort=asc&limit=5000&apiKey=${POLYGON_KEY}`
  );

  if (!res.ok) throw new Error(`Polygon API error: ${res.status}`);

  const json = await res.json();
  const bars: Record<string, number>[] = json.results ?? [];

  return bars.map((bar) => ({
    time: Math.floor(bar.t / 1000),
    open: bar.o,
    high: bar.h,
    low: bar.l,
    close: bar.c,
    volume: bar.v,
  }));
}

/* ------------------------------------------------------------------ */
/*  News                                                              */
/* ------------------------------------------------------------------ */

export async function fetchNews(limit: number = 20): Promise<NewsItem[]> {
  if (!POLYGON_KEY) throw new Error("No Polygon API key configured");

  const res = await fetch(
    `${POLYGON_BASE}/v3/reference/news?limit=${limit}&order=desc&sort=published_utc&apiKey=${POLYGON_KEY}`
  );

  if (!res.ok) throw new Error(`Polygon API error: ${res.status}`);

  const json = await res.json();
  const articles: Record<string, unknown>[] = json.results ?? [];

  return articles.map((article, idx) => {
    const insights = article.insights as
      | { sentiment?: string }[]
      | undefined;
    const rawSentiment = insights?.[0]?.sentiment ?? "";
    let sentiment: "positive" | "negative" | "neutral" = "neutral";
    if (/positive|bullish/i.test(rawSentiment)) sentiment = "positive";
    else if (/negative|bearish/i.test(rawSentiment)) sentiment = "negative";

    const publisher = article.publisher as { name?: string } | undefined;

    return {
      id: (article.id as string) ?? `news-${idx}`,
      title: (article.title as string) ?? "",
      source: publisher?.name ?? "Unknown",
      url: (article.article_url as string) ?? "#",
      publishedAt: (article.published_utc as string) ?? new Date().toISOString(),
      sentiment,
      tickers: (article.tickers as string[]) ?? [],
      summary: (article.description as string) ?? "",
    };
  });
}

/* ------------------------------------------------------------------ */
/*  Single quote                                                      */
/* ------------------------------------------------------------------ */

export async function fetchQuote(
  ticker: string
): Promise<{ price: number; change: number }> {
  if (!POLYGON_KEY) throw new Error("No Polygon API key configured");

  const res = await fetch(
    `${POLYGON_BASE}/v2/aggs/ticker/${ticker}/prev?apiKey=${POLYGON_KEY}`
  );

  if (!res.ok) throw new Error(`Polygon API error: ${res.status}`);

  const json = await res.json();
  const result = json.results?.[0] as Record<string, number> | undefined;

  return {
    price: result?.c ?? 0,
    change:
      result?.c && result?.o
        ? ((result.c - result.o) / result.o) * 100
        : 0,
  };
}

/* ------------------------------------------------------------------ */
/*  Schwab API (Thinkorswim) — requires OAuth 2.0 (Phase 3)          */
/* ------------------------------------------------------------------ */

export const schwabApi = {
  authUrl: "https://api.schwabapi.com/v1/oauth/authorize",
  tokenUrl: "https://api.schwabapi.com/v1/oauth/token",

  async getAccounts(accessToken: string) {
    const res = await fetch("https://api.schwabapi.com/trader/v1/accounts", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return res.json();
  },

  async placeOrder(
    accessToken: string,
    accountId: string,
    order: Record<string, unknown>
  ) {
    const res = await fetch(
      `https://api.schwabapi.com/trader/v1/accounts/${accountId}/orders`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      }
    );
    return res.json();
  },

  async getOptionsChain(accessToken: string, symbol: string) {
    const res = await fetch(
      `https://api.schwabapi.com/marketdata/v1/chains?symbol=${symbol}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return res.json();
  },

  async getQuote(accessToken: string, symbols: string[]) {
    const res = await fetch(
      `https://api.schwabapi.com/marketdata/v1/quotes?symbols=${symbols.join(",")}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return res.json();
  },
};
