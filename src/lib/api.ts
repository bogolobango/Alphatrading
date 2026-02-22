import type { MarketAsset } from "@/types";

const POLYGON_BASE = "https://api.polygon.io";
const POLYGON_KEY = process.env.NEXT_PUBLIC_POLYGON_API_KEY || "";

/**
 * Fetch stock/ETF market snapshot from Polygon.io
 * Falls back to mock data when API key is not set or request fails.
 */
export async function fetchMarketData(): Promise<MarketAsset[]> {
  if (!POLYGON_KEY) {
    throw new Error("No Polygon API key configured");
  }

  const res = await fetch(
    `${POLYGON_BASE}/v2/snapshot/locale/us/markets/stocks/tickers?apiKey=${POLYGON_KEY}`,
    { next: { revalidate: 30 } }
  );

  if (!res.ok) {
    throw new Error(`Polygon API error: ${res.status}`);
  }

  const json = await res.json();
  const tickers = json.tickers ?? [];

  return tickers.slice(0, 20).map((t: Record<string, unknown>, i: number) => {
    const day = t.day as Record<string, number> | undefined;
    const prevDay = t.prevDay as Record<string, number> | undefined;
    const ticker = t.ticker as string;
    const lastPrice = day?.c ?? (prevDay?.c ?? 0);
    const prevClose = prevDay?.c ?? lastPrice;
    const change24h = prevClose ? ((lastPrice - prevClose) / prevClose) * 100 : 0;

    return {
      id: ticker.toLowerCase(),
      symbol: ticker,
      name: ticker,
      assetType: "stock" as const,
      current_price: lastPrice,
      market_cap: 0,
      market_cap_rank: i + 1,
      total_volume: day?.v ?? 0,
      price_change_percentage_24h: change24h,
    };
  });
}

/**
 * Fetch a single stock/ETF quote from Polygon.io
 */
export async function fetchQuote(
  ticker: string
): Promise<{ price: number; change: number }> {
  if (!POLYGON_KEY) {
    throw new Error("No Polygon API key configured");
  }

  const res = await fetch(
    `${POLYGON_BASE}/v2/aggs/ticker/${ticker}/prev?apiKey=${POLYGON_KEY}`
  );

  if (!res.ok) throw new Error(`Polygon API error: ${res.status}`);

  const json = await res.json();
  const result = json.results?.[0];

  return {
    price: result?.c ?? 0,
    change: result?.c && result?.o ? ((result.c - result.o) / result.o) * 100 : 0,
  };
}

/**
 * Schwab API (Thinkorswim) - Trading endpoints
 * Requires OAuth 2.0 authentication (Phase 3)
 */
export const schwabApi = {
  authUrl: "https://api.schwabapi.com/v1/oauth/authorize",
  tokenUrl: "https://api.schwabapi.com/v1/oauth/token",

  async getAccounts(accessToken: string) {
    const res = await fetch("https://api.schwabapi.com/trader/v1/accounts", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return res.json();
  },

  async placeOrder(accessToken: string, accountId: string, order: Record<string, unknown>) {
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
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return res.json();
  },

  async getQuote(accessToken: string, symbols: string[]) {
    const res = await fetch(
      `https://api.schwabapi.com/marketdata/v1/quotes?symbols=${symbols.join(",")}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return res.json();
  },
};
