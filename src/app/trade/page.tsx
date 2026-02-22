"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CandlestickChart } from "@/components/charts/candlestick-chart";
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
  mockTrades,
} from "@/data/mock-data";
import type { TimeFrame } from "@/types";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { format } from "date-fns";

const timeframes: TimeFrame[] = ["1m", "5m", "15m", "1h", "4h", "1D", "1W"];
const btc = mockCryptoAssets[0];
const chartData = generateCandlestickData(btc.current_price);
const orderBook = generateOrderBook(btc.current_price);

export default function TradePage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeFrame>("1D");
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState(btc.current_price.toString());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">BTC/USDT</h1>
            <Badge
              variant={
                btc.price_change_percentage_24h >= 0 ? "success" : "danger"
              }
            >
              {formatPercent(btc.price_change_percentage_24h)}
            </Badge>
          </div>
          <p className="text-sm text-zinc-500">Bitcoin / Tether USD</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-white">
            {formatCurrency(btc.current_price)}
          </p>
          <p
            className={`text-sm ${getChangeColor(
              btc.price_change_percentage_24h
            )}`}
          >
            {btc.price_change_percentage_24h >= 0 ? "+" : ""}$
            {(
              (btc.current_price * btc.price_change_percentage_24h) /
              100
            ).toFixed(2)}{" "}
            today
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
                {/* Buy/Sell Toggle */}
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

                {/* Order Type */}
                <Tabs
                  value={orderType}
                  onValueChange={(v) =>
                    setOrderType(v as "market" | "limit")
                  }
                >
                  <TabsList className="w-full">
                    <TabsTrigger value="market" className="flex-1">
                      Market
                    </TabsTrigger>
                    <TabsTrigger value="limit" className="flex-1">
                      Limit
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                {/* Price (for limit orders) */}
                {orderType === "limit" && (
                  <div>
                    <label className="mb-1.5 block text-xs text-zinc-400">
                      Price (USDT)
                    </label>
                    <Input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                )}

                {/* Amount */}
                <div>
                  <label className="mb-1.5 block text-xs text-zinc-400">
                    Amount (BTC)
                  </label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  {[25, 50, 75, 100].map((pct) => (
                    <Button
                      key={pct}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => setAmount((pct / 100).toString())}
                    >
                      {pct}%
                    </Button>
                  ))}
                </div>

                {/* Total */}
                <div className="rounded-lg bg-zinc-800/50 p-3">
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>Total</span>
                    <span>
                      {formatCurrency(
                        (parseFloat(amount) || 0) *
                          (orderType === "limit"
                            ? parseFloat(price) || 0
                            : btc.current_price)
                      )}
                    </span>
                  </div>
                </div>

                <Button
                  variant={side === "buy" ? "success" : "danger"}
                  className="w-full"
                >
                  {side === "buy" ? "Buy" : "Sell"} BTC
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Order Book + Trade History */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Order Book */}
        <Card>
          <CardHeader>
            <CardTitle>Order Book</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="grid grid-cols-3 text-xs text-zinc-500 pb-2">
                <span>Price (USDT)</span>
                <span className="text-center">Amount (BTC)</span>
                <span className="text-right">Total</span>
              </div>
              {/* Asks (reversed) */}
              {orderBook.asks
                .slice(0, 8)
                .reverse()
                .map((entry, i) => (
                  <div
                    key={`ask-${i}`}
                    className="relative grid grid-cols-3 py-0.5 text-xs"
                  >
                    <div
                      className="absolute right-0 top-0 h-full bg-red-400/5"
                      style={{
                        width: `${Math.min(
                          (entry.total / orderBook.asks[7].total) * 100,
                          100
                        )}%`,
                      }}
                    />
                    <span className="relative text-red-400">
                      {formatNumber(entry.price)}
                    </span>
                    <span className="relative text-center text-zinc-300">
                      {entry.amount.toFixed(4)}
                    </span>
                    <span className="relative text-right text-zinc-500">
                      {entry.total.toFixed(4)}
                    </span>
                  </div>
                ))}

              {/* Spread */}
              <div className="border-y border-zinc-800 py-2 text-center">
                <span className="text-lg font-bold text-white">
                  {formatCurrency(btc.current_price)}
                </span>
              </div>

              {/* Bids */}
              {orderBook.bids.slice(0, 8).map((entry, i) => (
                <div
                  key={`bid-${i}`}
                  className="relative grid grid-cols-3 py-0.5 text-xs"
                >
                  <div
                    className="absolute right-0 top-0 h-full bg-emerald-400/5"
                    style={{
                      width: `${Math.min(
                        (entry.total / orderBook.bids[7].total) * 100,
                        100
                      )}%`,
                    }}
                  />
                  <span className="relative text-emerald-400">
                    {formatNumber(entry.price)}
                  </span>
                  <span className="relative text-center text-zinc-300">
                    {entry.amount.toFixed(4)}
                  </span>
                  <span className="relative text-right text-zinc-500">
                    {entry.total.toFixed(4)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Trades */}
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
              {mockTrades.map((trade) => (
                <div
                  key={trade.id}
                  className="grid grid-cols-4 items-center py-2 text-xs"
                >
                  <div className="flex items-center gap-1">
                    {trade.type === "buy" ? (
                      <ArrowUpRight className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-400" />
                    )}
                    <span
                      className={
                        trade.type === "buy"
                          ? "text-emerald-400"
                          : "text-red-400"
                      }
                    >
                      {trade.type.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-zinc-300">
                    {trade.symbol}/USDT
                  </span>
                  <span className="text-right text-zinc-300">
                    {formatCurrency(trade.total)}
                  </span>
                  <span className="text-right text-zinc-500">
                    {format(trade.timestamp, "MMM d, HH:mm")}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
