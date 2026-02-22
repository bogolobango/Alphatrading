"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PortfolioChart } from "@/components/charts/portfolio-chart";
import { AllocationChart } from "@/components/charts/allocation-chart";
import { SparklineChart } from "@/components/charts/sparkline-chart";
import {
  formatCurrency,
  formatPercent,
  formatCompactNumber,
  getChangeColor,
} from "@/lib/utils";
import {
  mockPortfolioHoldings,
  portfolioHistoryData,
  allocationData,
} from "@/data/mock-data";
import { useMarketData } from "@/lib/hooks";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  BarChart3,
  Activity,
  Wallet,
} from "lucide-react";

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

const stats = [
  {
    label: "Portfolio Value",
    value: formatCurrency(totalValue),
    change: totalPnLPercent,
    icon: Wallet,
  },
  {
    label: "24h P&L",
    value: formatCurrency(totalPnL * 0.02),
    change: 2.34,
    icon: DollarSign,
  },
  {
    label: "Total P&L",
    value: formatCurrency(totalPnL),
    change: totalPnLPercent,
    icon: BarChart3,
  },
  {
    label: "24h Volume",
    value: formatCompactNumber(28500000000),
    change: 5.12,
    icon: Activity,
  },
];

export default function DashboardPage() {
  const { data: marketData } = useMarketData();
  const cryptoAssets = marketData ?? [];

  const topMovers = [...cryptoAssets]
    .sort(
      (a, b) =>
        Math.abs(b.price_change_percentage_24h) -
        Math.abs(a.price_change_percentage_24h)
    )
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-zinc-500">
          Welcome back. Here&apos;s your portfolio overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800">
                  <stat.icon className="h-5 w-5 text-zinc-400" />
                </div>
                <Badge
                  variant={stat.change >= 0 ? "success" : "danger"}
                  className="gap-1"
                >
                  {stat.change >= 0 ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {formatPercent(stat.change)}
                </Badge>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-zinc-500">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Portfolio Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <PortfolioChart data={portfolioHistoryData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <AllocationChart data={allocationData} />
          </CardContent>
        </Card>
      </div>

      {/* Holdings + Top Movers */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Holdings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Holdings</CardTitle>
              <span className="text-xs text-zinc-500">
                {mockPortfolioHoldings.length} assets
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockPortfolioHoldings.map((holding) => {
                const value = holding.amount * holding.currentPrice;
                const pnl =
                  (holding.currentPrice - holding.avgBuyPrice) *
                  holding.amount;
                const pnlPercent =
                  ((holding.currentPrice - holding.avgBuyPrice) /
                    holding.avgBuyPrice) *
                  100;

                return (
                  <div
                    key={holding.id}
                    className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-zinc-800/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800 text-xs font-bold text-zinc-300">
                        {holding.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-200">
                          {holding.name}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {holding.amount} {holding.symbol}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-zinc-200">
                        {formatCurrency(value)}
                      </p>
                      <p className={`text-xs ${getChangeColor(pnl)}`}>
                        {formatPercent(pnlPercent)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Movers */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Top Movers (24h)</CardTitle>
              <div className="flex items-center gap-1 text-xs text-zinc-500">
                <Activity className="h-3 w-3" /> Live
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topMovers.map((asset) => (
                <div
                  key={asset.id}
                  className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-zinc-800/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800 text-xs font-bold text-zinc-300">
                      {asset.symbol.toUpperCase().slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-200">
                        {asset.name}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {asset.symbol.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-20">
                      {asset.sparkline_in_7d && (
                        <SparklineChart
                          data={asset.sparkline_in_7d.price.slice(-24)}
                          color="auto"
                          height={32}
                        />
                      )}
                    </div>
                    <div className="w-24 text-right">
                      <p className="text-sm font-medium text-zinc-200">
                        {formatCurrency(asset.current_price)}
                      </p>
                      <div
                        className={`flex items-center justify-end gap-1 text-xs ${getChangeColor(
                          asset.price_change_percentage_24h
                        )}`}
                      >
                        {asset.price_change_percentage_24h >= 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {formatPercent(asset.price_change_percentage_24h)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
