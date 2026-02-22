"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMarketData } from "@/lib/api";
import { mockCryptoAssets } from "@/data/mock-data";

export function useMarketData() {
  return useQuery({
    queryKey: ["market-data"],
    queryFn: fetchMarketData,
    placeholderData: mockCryptoAssets,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}
