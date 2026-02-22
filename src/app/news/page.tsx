"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockNews } from "@/data/mock-data";
import {
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  Filter,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const sentimentIcon = {
  positive: TrendingUp,
  negative: TrendingDown,
  neutral: Minus,
};

const sentimentVariant = {
  positive: "success" as const,
  negative: "danger" as const,
  neutral: "default" as const,
};

export default function NewsPage() {
  const [filter, setFilter] = useState<
    "all" | "positive" | "negative" | "neutral"
  >("all");

  const filteredNews =
    filter === "all"
      ? mockNews
      : mockNews.filter((n) => n.sentiment === filter);

  const sentimentCounts = {
    positive: mockNews.filter((n) => n.sentiment === "positive").length,
    negative: mockNews.filter((n) => n.sentiment === "negative").length,
    neutral: mockNews.filter((n) => n.sentiment === "neutral").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">News & Research</h1>
        <p className="text-sm text-zinc-500">
          Stay updated with the latest market news and sentiment
        </p>
      </div>

      {/* Sentiment Overview */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/10">
              <TrendingUp className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-400">
                {sentimentCounts.positive}
              </p>
              <p className="text-xs text-zinc-500">Bullish Articles</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-400/10">
              <TrendingDown className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-400">
                {sentimentCounts.negative}
              </p>
              <p className="text-xs text-zinc-500">Bearish Articles</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-400/10">
              <Minus className="h-6 w-6 text-zinc-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-400">
                {sentimentCounts.neutral}
              </p>
              <p className="text-xs text-zinc-500">Neutral Articles</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-zinc-500" />
        {(["all", "positive", "negative", "neutral"] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "primary" : "ghost"}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      {/* News Feed */}
      <div className="space-y-4">
        {filteredNews.map((news) => {
          const SentimentIcon = sentimentIcon[news.sentiment];

          return (
            <Card key={news.id} className="transition-colors hover:border-zinc-700">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={sentimentVariant[news.sentiment]} className="gap-1">
                        <SentimentIcon className="h-3 w-3" />
                        {news.sentiment}
                      </Badge>
                      <span className="text-xs text-zinc-500">
                        {news.source}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-zinc-600">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(news.publishedAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-zinc-100">
                      {news.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-zinc-400">
                      {news.summary}
                    </p>
                    <div className="flex items-center gap-2">
                      {news.tickers.map((c) => (
                        <Badge key={c} variant="info">
                          {c}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0 hidden sm:inline-flex">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
