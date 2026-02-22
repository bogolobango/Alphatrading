"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, Search, User, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTradingStore } from "@/stores/trading-store";
import { mockCryptoAssets } from "@/data/mock-data";
import { formatCurrency } from "@/lib/utils";

export function Header() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { settings } = useTradingStore();

  const results = search.length > 0
    ? mockCryptoAssets.filter(
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
    <header className="flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-950/80 px-6 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="relative" ref={ref}>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            placeholder="Search markets, coins..."
            className="w-80 pl-9"
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
                  <div className="flex-1">
                    <p className="text-sm font-medium text-zinc-200">{coin.name}</p>
                    <p className="text-xs text-zinc-500">{coin.symbol.toUpperCase()}</p>
                  </div>
                  <span className="text-sm text-zinc-300">{formatCurrency(coin.current_price)}</span>
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
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-blue-500" />
        </Button>
        <div className="flex items-center gap-3 rounded-lg border border-zinc-800 px-3 py-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-700">
            <User className="h-4 w-4 text-zinc-300" />
          </div>
          <div className="text-sm">
            <p className="font-medium text-zinc-200">{settings.displayName}</p>
            <p className="text-xs text-zinc-500">Pro Account</p>
          </div>
        </div>
      </div>
    </header>
  );
}
