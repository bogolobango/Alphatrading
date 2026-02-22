"use client";

import { useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  getChangeColor,
} from "@/lib/utils";
import {
  mockCryptoAssets,
  generateCandlestickData,
  generateOrderBook,
} from "@/data/mock-data";
import { useTradingStore } from "@/stores/trading-store";
import type { TimeFrame } from "@/types";
import { ArrowUpRight, ArrowDownRight, ChevronDown, Check } from "lucide-react";
import { format } from "date-fns";

const CandlestickChart = dynamic(
  () =>
    import("@/components/charts/candlestick-chart").then(
      (mod) => mod.CandlestickChart
    ),
  { ssr: false, loading: () => <div className="flex h-[400px] items-center justify-center text-zinc-500">Loading chart...</div> }
);

const timeframes: TimeFrame[] = ["1m", "5m", "15m", "1h", "4h", "1D", "1W"];

const tradingPairs = mockCryptoAssets.slice(0, 8).map((a) => ({
  id: a.id,
  symbol: `${a.symbol.toUpperCase()}/USDT`,
  name: a.name,
  price: a.current_price,
  change: a.price_change_percentage_24h,
}));

const timeframeDays: Record<TimeFrame, number> = {
  "1m": 1, "5m": 3, "15m": 7, "1h": 14, "4h": 30, "1D": 90, "1W": 365,
};

export default function TradePage() {
  const { selectedPair, setSelectedPair, trades, addTrade } = useTradingStore();
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeFrame>("1D");
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [pairDropdownOpen, setPairDropdownOpen] = useState(false);
  const [orderFeedback, setOrderFeedback] = useState<string | null>(null);

  const currentPair = tradingPairs.find((p) => p.symbol === selectedPair) ?? tradingPairs[0];
  const asset = mockCryptoAssets.find((a) => a.id === currentPair.id) ?? mockCryptoAssets[0];

  const chartData = useMemo(
    () => generateCandlestickData(asset.current_price, timeframeDays[selectedTimeframe]),
    [asset.current_price, selectedTimeframe]
  );

  const orderBook = useMemo(
    () => generateOrderBook(asset.current_price),
    [asset.current_price]
  );

  const handlePlaceOrder = useCallback(() => {
    const qty = parseFloat(amount);
    if (!qty || qty <= 0) return;

    const executionPrice =
      orderType === "limit" ? parseFloat(price) || asset.current_price : asset.current_price;

    addTrade({
      id: `t-${Date.now()}`,
      symbol: asset.symbol.toUpperCase(),
      name: asset.name,
      type: side,
      orderType,
      amount: qty,
      price: executionPrice,
      total: qty * executionPrice,
      timestamp: Date.now(),
      status: orderType === "market" ? "completed" : "pending",
    });

    setOrderFeedback(
      `${side === "buy" ? "Bought" : "Sold"} ${qty} ${asset.symbol.toUpperCase()} @ ${formatCurrency(executionPrice)}`
    );
    setAmount("");
    setTimeout(() => setOrderFeedback(null), 3000);
  }, [amount, price, orderType, side, asset, addTrade]);

  const recentTrades = trades.slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            {/* Pair selector dropdown */}
            <div className="relative">
              <button
                onClick={() => setPairDropdownOpen(!pairDropdownOpen)}
                className="flex items-center gap-2 text-2xl font-bold text-white hover:text-zinc-300 transition-colors"
              >
                {currentPair.symbol}
                <ChevronDown className="h-5 w-5" />
              </button>
              {pairDropdownOpen && (
                <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-lg border border-zinc-800 bg-zinc-900 py-1 shadow-xl">
                  {tradingPairs.map((pair) => (
                    <button
                      key={pair.id}
                      className="flex w-full items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-zinc-800"
                      onClick={() => {
                        setSelectedPair(pair.symbol);
                        setPairDropdownOpen(false);
                        setPrice("");
                      }}
                    >
                      <div>
                        <p className="text-sm font-medium text-zinc-200">{pair.symbol}</p>
                        <p className="text-xs text-zinc-500">{pair.name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-zinc-300">{formatCurrency(pair.price)}</span>
                        {pair.symbol === selectedPair && <Check className="h-4 w-4 text-blue-400" />}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Badge variant={asset.price_change_percentage_24h >= 0 ? "success" : "danger"}>
              {formatPercent(asset.price_change_percentage_24h)}
            </Badge>
          </div>
          <p className="text-sm text-zinc-500">{asset.name} / Tether USD</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-white">
            {formatCurrency(asset.current_price)}
          </p>
          <p className={`text-sm ${getChangeColor(asset.price_change_percentage_24h)}`}>
            {asset.price_change_percentage_24h >= 0 ? "+" : ""}$
            {((asset.current_price * asset.price_change_percentage_24h) / 100).toFixed(2)} today
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        {/* Chart */}
        <Card className="xl:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Price Chart</CardTitle>
              <div className="flex gap-1">
                {timeframes.map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setSelectedTimeframe(tf)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                      selectedTimeframe === tf
                        ? "bg-blue-600 text-white"
                        : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CandlestickChart data={chartData} />
          </CardContent>
        </Card>

        {/* Order Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Place Order</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={side === "buy" ? "success" : "ghost"}
                    onClick={() => setSide("buy")}
                    className="w-full"
                  >
                    Buy
                  </Button>
                  <Button
                    variant={side === "sell" ? "danger" : "ghost"}
                    onClick={() => setSide("sell")}
                    className="w-full"
                  >
                    Sell
                  </Button>
                </div>

                <Tabs value={orderType} onValueChange={(v) => setOrderType(v as "market" | "limit")}>
                  <TabsList className="w-full">
                    <TabsTrigger value="market" className="flex-1">Market</TabsTrigger>
                    <TabsTrigger value="limit" className="flex-1">Limit</TabsTrigger>
                  </TabsList>
                </Tabs>

                {orderType === "limit" && (
                  <div>
                    <label className="mb-1.5 block text-xs text-zinc-400">Price (USDT)</label>
                    <Input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder={asset.current_price.toString()}
                    />
                  </div>
                )}

                <div>
                  <label className="mb-1.5 block text-xs text-zinc-400">
                    Amount ({asset.symbol.toUpperCase()})
                  </label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[25, 50, 75, 100].map((pct) => (
                    <Button
                      key={pct}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => setAmount(((pct / 100) * 1).toFixed(4))}
                    >
                      {pct}%
                    </Button>
                  ))}
                </div>

                <div className="rounded-lg bg-zinc-800/50 p-3">
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>Total</span>
                    <span>
                      {formatCurrency(
                        (parseFloat(amount) || 0) *
                          (orderType === "limit" ? parseFloat(price) || asset.current_price : asset.current_price)
                      )}
                    </span>
                  </div>
                </div>

                {orderFeedback && (
                  <div className="rounded-lg bg-emerald-400/10 px-3 py-2 text-xs text-emerald-400 text-center">
                    {orderFeedback}
                  </div>
                )}

                <Button
                  variant={side === "buy" ? "success" : "danger"}
                  className="w-full"
                  onClick={handlePlaceOrder}
                  disabled={!amount || parseFloat(amount) <= 0}
                >
                  {side === "buy" ? "Buy" : "Sell"} {asset.symbol.toUpperCase()}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Order Book + Trade History */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Book</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="grid grid-cols-3 text-xs text-zinc-500 pb-2">
                <span>Price (USDT)</span>
                <span className="text-center">Amount ({asset.symbol.toUpperCase()})</span>
                <span className="text-right">Total</span>
              </div>
              {orderBook.asks
                .slice(0, 8)
                .reverse()
                .map((entry, i) => (
                  <div key={`ask-${i}`} className="relative grid grid-cols-3 py-0.5 text-xs">
                    <div
                      className="absolute right-0 top-0 h-full bg-red-400/5"
                      style={{ width: `${Math.min((entry.total / orderBook.asks[7].total) * 100, 100)}%` }}
                    />
                    <span className="relative text-red-400">{formatNumber(entry.price)}</span>
                    <span className="relative text-center text-zinc-300">{entry.amount.toFixed(4)}</span>
                    <span className="relative text-right text-zinc-500">{entry.total.toFixed(4)}</span>
                  </div>
                ))}
              <div className="border-y border-zinc-800 py-2 text-center">
                <span className="text-lg font-bold text-white">{formatCurrency(asset.current_price)}</span>
              </div>
              {orderBook.bids.slice(0, 8).map((entry, i) => (
                <div key={`bid-${i}`} className="relative grid grid-cols-3 py-0.5 text-xs">
                  <div
                    className="absolute right-0 top-0 h-full bg-emerald-400/5"
                    style={{ width: `${Math.min((entry.total / orderBook.bids[7].total) * 100, 100)}%` }}
                  />
                  <span className="relative text-emerald-400">{formatNumber(entry.price)}</span>
                  <span className="relative text-center text-zinc-300">{entry.amount.toFixed(4)}</span>
                  <span className="relative text-right text-zinc-500">{entry.total.toFixed(4)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="grid grid-cols-4 text-xs text-zinc-500 pb-2">
                <span>Type</span>
                <span>Pair</span>
                <span className="text-right">Amount</span>
                <span className="text-right">Date</span>
              </div>
              {recentTrades.map((trade) => (
                <div key={trade.id} className="grid grid-cols-4 items-center py-2 text-xs">
                  <div className="flex items-center gap-1">
                    {trade.type === "buy" ? (
                      <ArrowUpRight className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-400" />
                    )}
                    <span className={trade.type === "buy" ? "text-emerald-400" : "text-red-400"}>
                      {trade.type.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-zinc-300">{trade.symbol}/USDT</span>
                  <span className="text-right text-zinc-300">{formatCurrency(trade.total)}</span>
                  <span className="text-right text-zinc-500">{format(trade.timestamp, "MMM d, HH:mm")}</span>
                </div>
              ))}
              {recentTrades.length === 0 && (
                <p className="py-4 text-center text-xs text-zinc-500">No trades yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
