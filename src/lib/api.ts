import type { CryptoAsset } from "@/types";

const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

export async function fetchMarketData(): Promise<CryptoAsset[]> {
  const res = await fetch(
    `${COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=24h,7d`,
    { next: { revalidate: 30 } }
  );

  if (!res.ok) {
    throw new Error(`CoinGecko API error: ${res.status}`);
  }

  const data = await res.json();
  return data.map((coin: Record<string, unknown>) => ({
    id: coin.id as string,
    symbol: coin.symbol as string,
    name: coin.name as string,
    image: coin.image as string,
    current_price: coin.current_price as number,
    market_cap: coin.market_cap as number,
    market_cap_rank: coin.market_cap_rank as number,
    total_volume: coin.total_volume as number,
    price_change_percentage_24h: (coin.price_change_percentage_24h as number) ?? 0,
    price_change_percentage_7d: (coin.price_change_percentage_7d_in_currency as number) ?? 0,
    circulating_supply: coin.circulating_supply as number,
    total_supply: coin.total_supply as number | null,
    sparkline_in_7d: coin.sparkline_in_7d as { price: number[] } | undefined,
  }));
}

export async function fetchCoinPrice(coinId: string): Promise<Record<string, { usd: number; usd_24h_change: number }>> {
  const res = await fetch(
    `${COINGECKO_BASE}/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`
  );
  if (!res.ok) throw new Error(`CoinGecko API error: ${res.status}`);
  return res.json();
}
