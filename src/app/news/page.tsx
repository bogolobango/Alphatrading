"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNews } from "@/lib/hooks";
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

  const { data: newsData } = useNews();
  const news = newsData ?? [];

  const filteredNews = useMemo(
    () =>
      filter === "all" ? news : news.filter((n) => n.sentiment === filter),
    [news, filter]
  );

  const sentimentCounts = useMemo(
    () => ({
      positive: news.filter((n) => n.sentiment === "positive").length,
      negative: news.filter((n) => n.sentiment === "negative").length,
      neutral: news.filter((n) => n.sentiment === "neutral").length,
    }),
    [news]
  );

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
        {filteredNews.map((item) => {
          const SentimentIcon = sentimentIcon[item.sentiment];

          return (
            <Card key={item.id} className="transition-colors hover:border-zinc-700">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={sentimentVariant[item.sentiment]} className="gap-1">
                        <SentimentIcon className="h-3 w-3" />
                        {item.sentiment}
                      </Badge>
                      <span className="text-xs text-zinc-500">
                        {item.source}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-zinc-600">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(item.publishedAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-zinc-100">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-zinc-400">
                      {item.summary}
                    </p>
                    {item.tickers.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        {item.tickers.map((c) => (
                          <Badge key={c} variant="info">
                            {c}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  {item.url && item.url !== "#" && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 hidden sm:inline-flex"
                    >
                      <Button variant="ghost" size="icon">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filteredNews.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-sm text-zinc-500">
              No articles match the selected filter.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
