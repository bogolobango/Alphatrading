"use client";

import { Bell, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-950/80 px-6 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            placeholder="Search markets, coins..."
            className="w-80 pl-9"
          />
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
            <p className="font-medium text-zinc-200">Trader</p>
            <p className="text-xs text-zinc-500">Pro Account</p>
          </div>
        </div>
      </div>
    </header>
  );
}
