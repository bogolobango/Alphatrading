"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SparklineChart } from "@/components/charts/sparkline-chart";
import {
  formatCurrency,
  formatPercent,
  formatCompactNumber,
  getChangeColor,
} from "@/lib/utils";
import { useTradingStore } from "@/stores/trading-store";
import { useMarketData } from "@/lib/hooks";
import {
  Search,
  Star,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
} from "lucide-react";

export default function MarketsPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"market_cap" | "price" | "change">(
    "market_cap"
  );
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const { watchlist, addToWatchlist, removeFromWatchlist } = useTradingStore();
  const { data: marketData } = useMarketData();
  const cryptoAssets = marketData ?? [];

  const filteredAssets = cryptoAssets
    .filter(
      (a) =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.symbol.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const multiplier = sortDir === "desc" ? -1 : 1;
      if (sortBy === "market_cap")
        return (a.market_cap - b.market_cap) * multiplier;
      if (sortBy === "price")
        return (a.current_price - b.current_price) * multiplier;
      return (
        (a.price_change_percentage_24h - b.price_change_percentage_24h) *
        multiplier
      );
    });

  const handleSort = (column: "market_cap" | "price" | "change") => {
    if (sortBy === column) {
      setSortDir(sortDir === "desc" ? "asc" : "desc");
    } else {
      setSortBy(column);
      setSortDir("desc");
    }
  };

  const isInWatchlist = (id: string) => watchlist.some((w) => w.id === id);

  const toggleWatchlist = (asset: (typeof cryptoAssets)[0]) => {
    if (isInWatchlist(asset.id)) {
      removeFromWatchlist(asset.id);
    } else {
      addToWatchlist({
        id: asset.id,
        symbol: asset.symbol.toUpperCase(),
        name: asset.name,
        addedAt: Date.now(),
      });
    }
  };

  const gainers = [...cryptoAssets]
    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    .slice(0, 5);

  const losers = [...cryptoAssets]
    .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">Markets</h1>
        <p className="text-sm text-zinc-500">
          Live stock, ETF, and market data
        </p>
      </div>

      {/* Gainers / Losers */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <CardTitle className="text-emerald-400">Top Gainers</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {gainers.map((asset) => (
                <div
                  key={asset.id}
                  className="flex items-center justify-between rounded-lg p-2 hover:bg-zinc-800/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-500">
                      #{asset.market_cap_rank}
                    </span>
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-[10px] font-bold text-zinc-300">
                      {asset.symbol.toUpperCase().slice(0, 2)}
                    </div>
                    <span className="text-sm font-medium text-zinc-200">
                      {asset.name}
                    </span>
                  </div>
                  <Badge variant="success">
                    {formatPercent(asset.price_change_percentage_24h)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-400" />
              <CardTitle className="text-red-400">Top Losers</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {losers.map((asset) => (
                <div
                  key={asset.id}
                  className="flex items-center justify-between rounded-lg p-2 hover:bg-zinc-800/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-500">
                      #{asset.market_cap_rank}
                    </span>
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-[10px] font-bold text-zinc-300">
                      {asset.symbol.toUpperCase().slice(0, 2)}
                    </div>
                    <span className="text-sm font-medium text-zinc-200">
                      {asset.name}
                    </span>
                  </div>
                  <Badge variant="danger">
                    {formatPercent(asset.price_change_percentage_24h)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search + Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All Securities</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder="Search stocks & ETFs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-zinc-800 text-left text-xs text-zinc-500">
                <th className="w-10 px-3 sm:px-5 py-3" />
                <th className="px-3 sm:px-5 py-3 font-medium">#</th>
                <th className="px-3 sm:px-5 py-3 font-medium">Name</th>
                <th
                  className="cursor-pointer px-3 sm:px-5 py-3 font-medium"
                  onClick={() => handleSort("price")}
                >
                  <span className="flex items-center gap-1">
                    Price <ArrowUpDown className="h-3 w-3" />
                  </span>
                </th>
                <th
                  className="cursor-pointer px-3 sm:px-5 py-3 font-medium"
                  onClick={() => handleSort("change")}
                >
                  <span className="flex items-center gap-1">
                    24h % <ArrowUpDown className="h-3 w-3" />
                  </span>
                </th>
                <th className="hidden md:table-cell px-3 sm:px-5 py-3 font-medium">7d Chart</th>
                <th
                  className="cursor-pointer px-3 sm:px-5 py-3 font-medium text-right"
                  onClick={() => handleSort("market_cap")}
                >
                  <span className="flex items-center justify-end gap-1">
                    Market Cap <ArrowUpDown className="h-3 w-3" />
                  </span>
                </th>
                <th className="hidden sm:table-cell px-3 sm:px-5 py-3 font-medium text-right">Volume (24h)</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset) => (
                <tr
                  key={asset.id}
                  className="border-b border-zinc-800/50 transition-colors hover:bg-zinc-800/30"
                >
                  <td className="px-3 sm:px-5 py-4">
                    <button
                      onClick={() => toggleWatchlist(asset)}
                      className="text-zinc-600 transition-colors hover:text-yellow-400"
                    >
                      <Star
                        className={`h-4 w-4 ${
                          isInWatchlist(asset.id)
                            ? "fill-yellow-400 text-yellow-400"
                            : ""
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-3 sm:px-5 py-4 text-sm text-zinc-500">
                    {asset.market_cap_rank}
                  </td>
                  <td className="px-3 sm:px-5 py-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs font-bold text-zinc-300">
                        {asset.symbol.toUpperCase().slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-zinc-200 truncate">
                          {asset.name}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {asset.symbol.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-5 py-4 text-sm font-medium text-zinc-200">
                    {formatCurrency(asset.current_price)}
                  </td>
                  <td className="px-3 sm:px-5 py-4">
                    <span
                      className={`text-sm font-medium ${getChangeColor(
                        asset.price_change_percentage_24h
                      )}`}
                    >
                      {formatPercent(asset.price_change_percentage_24h)}
                    </span>
                  </td>
                  <td className="hidden md:table-cell px-3 sm:px-5 py-4">
                    <div className="w-24">
                      {asset.sparkline_in_7d && (
                        <SparklineChart
                          data={asset.sparkline_in_7d.price}
                          color="auto"
                          height={32}
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-3 sm:px-5 py-4 text-right text-sm text-zinc-300">
                    {formatCompactNumber(asset.market_cap)}
                  </td>
                  <td className="hidden sm:table-cell px-3 sm:px-5 py-4 text-right text-sm text-zinc-500">
                    {formatCompactNumber(asset.total_volume)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
