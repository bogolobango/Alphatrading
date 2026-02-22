"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, Search, User, X, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTradingStore } from "@/stores/trading-store";
import { useMarketData } from "@/lib/hooks";
import { mockMarketAssets } from "@/data/mock-data";
import { formatCurrency } from "@/lib/utils";

export function Header() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { settings, setMobileSidebarOpen } = useTradingStore();
  const { data: marketData } = useMarketData();
  const assets = marketData ?? mockMarketAssets;

  const results = search.length > 0
    ? assets.filter(
        (a) =>
          a.name.toLowerCase().includes(search.toLowerCase()) ||
          a.symbol.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 6)
    : [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-950/80 px-3 sm:px-4 md:px-6 gap-2 backdrop-blur-sm">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative min-w-0 flex-1 max-w-xs sm:max-w-sm md:max-w-md" ref={ref}>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            placeholder="Search stocks & ETFs..."
            className="w-full pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpen(true);
            }}
            onFocus={() => search.length > 0 && setOpen(true)}
          />
          {search && (
            <button
              onClick={() => { setSearch(""); setOpen(false); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          {open && results.length > 0 && (
            <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-900 py-1 shadow-xl">
              {results.map((coin) => (
                <button
                  key={coin.id}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-zinc-800"
                  onClick={() => {
                    setSearch("");
                    setOpen(false);
                    router.push("/markets");
                  }}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-[10px] font-bold text-zinc-300">
                    {coin.symbol.toUpperCase().slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-200 truncate">{coin.name}</p>
                    <p className="text-xs text-zinc-500">{coin.symbol.toUpperCase()}</p>
                  </div>
                  <span className="text-sm text-zinc-300 shrink-0">{formatCurrency(coin.current_price)}</span>
                </button>
              ))}
            </div>
          )}
          {open && search.length > 0 && results.length === 0 && (
            <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-6 text-center text-sm text-zinc-500 shadow-xl">
              No results found for &quot;{search}&quot;
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <Button variant="ghost" size="icon" className="relative hidden sm:inline-flex">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-blue-500" />
        </Button>
        <div className="hidden md:flex items-center gap-3 rounded-lg border border-zinc-800 px-3 py-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-700">
            <User className="h-4 w-4 text-zinc-300" />
          </div>
          <div className="text-sm">
            <p className="font-medium text-zinc-200">{settings.displayName}</p>
            <p className="text-xs text-zinc-500">Pro Account</p>
          </div>
        </div>
        <div className="flex md:hidden h-9 w-9 items-center justify-center rounded-full bg-zinc-700">
          <User className="h-4 w-4 text-zinc-300" />
        </div>
      </div>
    </header>
  );
}
