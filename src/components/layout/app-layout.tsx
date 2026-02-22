"use client";

import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { useTradingStore } from "@/stores/trading-store";
import { cn } from "@/lib/utils";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed, _hydrated } = useTradingStore();

  // Default to expanded sidebar on server / before hydration
  const collapsed = _hydrated ? sidebarCollapsed : false;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Sidebar />
      <div
        className={cn(
          "transition-all duration-300",
          collapsed ? "ml-16" : "ml-60"
        )}
      >
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
