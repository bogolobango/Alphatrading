"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PortfolioChart } from "@/components/charts/portfolio-chart";
import {
  formatCurrency,
  formatPercent,
  getChangeColor,
} from "@/lib/utils";
import {
  mockPortfolioHoldings,
  portfolioHistoryData,
} from "@/data/mock-data";
import { useTradingStore } from "@/stores/trading-store";
import {
  ArrowUpRight,
  ArrowDownRight,
  Download,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { format } from "date-fns";

const totalValue = mockPortfolioHoldings.reduce(
  (sum, h) => sum + h.amount * h.currentPrice,
  0
);
const totalCost = mockPortfolioHoldings.reduce(
  (sum, h) => sum + h.amount * h.avgBuyPrice,
  0
);
const totalPnL = totalValue - totalCost;
const totalPnLPercent = (totalPnL / totalCost) * 100;

export default function PortfolioPage() {
  const [filterType, setFilterType] = useState<"all" | "buy" | "sell">("all");
  const { trades } = useTradingStore();

  const filteredTrades =
    filterType === "all"
      ? trades
      : trades.filter((t) => t.type === filterType);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Portfolio</h1>
          <p className="text-sm text-zinc-500">
            Track your holdings and performance
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-zinc-500">Total Value</p>
            <p className="mt-1 text-2xl font-bold text-white">
              {formatCurrency(totalValue)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-zinc-500">Total Cost Basis</p>
            <p className="mt-1 text-2xl font-bold text-white">
              {formatCurrency(totalCost)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-zinc-500">Total P&L</p>
            <div className="mt-1 flex items-center gap-2">
              <p className={`text-2xl font-bold ${getChangeColor(totalPnL)}`}>
                {formatCurrency(totalPnL)}
              </p>
              <Badge variant={totalPnL >= 0 ? "success" : "danger"}>
                {formatPercent(totalPnLPercent)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Value Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <PortfolioChart data={portfolioHistoryData} />
        </CardContent>
      </Card>

      <Tabs defaultValue="holdings">
        <TabsList>
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
        </TabsList>

        <TabsContent value="holdings">
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-zinc-800 text-left text-xs text-zinc-500">
                    <th className="px-3 sm:px-5 py-3 font-medium">Asset</th>
                    <th className="px-3 sm:px-5 py-3 font-medium">Holdings</th>
                    <th className="hidden sm:table-cell px-3 sm:px-5 py-3 font-medium">Avg. Buy Price</th>
                    <th className="hidden sm:table-cell px-3 sm:px-5 py-3 font-medium">Current Price</th>
                    <th className="px-3 sm:px-5 py-3 font-medium">Value</th>
                    <th className="px-3 sm:px-5 py-3 font-medium text-right">P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPortfolioHoldings.map((holding) => {
                    const value = holding.amount * holding.currentPrice;
                    const cost = holding.amount * holding.avgBuyPrice;
                    const pnl = value - cost;
                    const pnlPercent = ((value - cost) / cost) * 100;

                    return (
                      <tr
                        key={holding.id}
                        className="border-b border-zinc-800/50 transition-colors hover:bg-zinc-800/30"
                      >
                        <td className="px-3 sm:px-5 py-4">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs font-bold text-zinc-300">
                              {holding.symbol.slice(0, 2)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-zinc-200 truncate">
                                {holding.name}
                              </p>
                              <p className="text-xs text-zinc-500">
                                {holding.symbol}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-5 py-4 text-sm text-zinc-300">
                          {holding.amount} {holding.symbol}
                        </td>
                        <td className="hidden sm:table-cell px-3 sm:px-5 py-4 text-sm text-zinc-300">
                          {formatCurrency(holding.avgBuyPrice)}
                        </td>
                        <td className="hidden sm:table-cell px-3 sm:px-5 py-4 text-sm text-zinc-300">
                          {formatCurrency(holding.currentPrice)}
                        </td>
                        <td className="px-3 sm:px-5 py-4 text-sm font-medium text-zinc-200">
                          {formatCurrency(value)}
                        </td>
                        <td className="px-3 sm:px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <span
                              className={`text-sm font-medium ${getChangeColor(
                                pnl
                              )}`}
                            >
                              {formatCurrency(pnl)}
                            </span>
                            <Badge
                              variant={pnl >= 0 ? "success" : "danger"}
                              className="gap-0.5"
                            >
                              {pnl >= 0 ? (
                                <TrendingUp className="h-3 w-3" />
                              ) : (
                                <TrendingDown className="h-3 w-3" />
                              )}
                              {formatPercent(pnlPercent)}
                            </Badge>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Transactions</CardTitle>
                <div className="flex gap-2">
                  {(["all", "buy", "sell"] as const).map((type) => (
                    <Button
                      key={type}
                      variant={filterType === type ? "primary" : "ghost"}
                      size="sm"
                      onClick={() => setFilterType(type)}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-zinc-800 text-left text-xs text-zinc-500">
                    <th className="px-3 sm:px-5 py-3 font-medium">Type</th>
                    <th className="px-3 sm:px-5 py-3 font-medium">Asset</th>
                    <th className="hidden md:table-cell px-3 sm:px-5 py-3 font-medium">Order Type</th>
                    <th className="px-3 sm:px-5 py-3 font-medium">Amount</th>
                    <th className="hidden sm:table-cell px-3 sm:px-5 py-3 font-medium">Price</th>
                    <th className="px-3 sm:px-5 py-3 font-medium">Total</th>
                    <th className="px-3 sm:px-5 py-3 font-medium">Status</th>
                    <th className="hidden sm:table-cell px-3 sm:px-5 py-3 font-medium text-right">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrades.map((trade) => (
                    <tr
                      key={trade.id}
                      className="border-b border-zinc-800/50 transition-colors hover:bg-zinc-800/30"
                    >
                      <td className="px-3 sm:px-5 py-4">
                        <div className="flex items-center gap-1">
                          {trade.type === "buy" ? (
                            <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-red-400" />
                          )}
                          <span
                            className={`text-sm font-medium ${
                              trade.type === "buy"
                                ? "text-emerald-400"
                                : "text-red-400"
                            }`}
                          >
                            {trade.type.toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-5 py-4 text-sm text-zinc-300">
                        {trade.name} ({trade.symbol})
                      </td>
                      <td className="hidden md:table-cell px-3 sm:px-5 py-4">
                        <Badge>{trade.orderType}</Badge>
                      </td>
                      <td className="px-3 sm:px-5 py-4 text-sm text-zinc-300">
                        {trade.amount} {trade.symbol}
                      </td>
                      <td className="hidden sm:table-cell px-3 sm:px-5 py-4 text-sm text-zinc-300">
                        {formatCurrency(trade.price)}
                      </td>
                      <td className="px-3 sm:px-5 py-4 text-sm font-medium text-zinc-200">
                        {formatCurrency(trade.total)}
                      </td>
                      <td className="px-3 sm:px-5 py-4">
                        <Badge
                          variant={
                            trade.status === "completed"
                              ? "success"
                              : trade.status === "pending"
                              ? "warning"
                              : "danger"
                          }
                        >
                          {trade.status}
                        </Badge>
                      </td>
                      <td className="hidden sm:table-cell px-3 sm:px-5 py-4 text-right text-sm text-zinc-500">
                        {format(trade.timestamp, "MMM d, yyyy HH:mm")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
