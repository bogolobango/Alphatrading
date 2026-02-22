import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Trade, WatchlistItem, PriceAlert } from "@/types";
import { mockTrades } from "@/data/mock-data";

interface TradingState {
  trades: Trade[];
  watchlist: WatchlistItem[];
  alerts: PriceAlert[];
  selectedPair: string;
  selectedTimeframe: string;
  sidebarCollapsed: boolean;

  // Actions
  addTrade: (trade: Trade) => void;
  addToWatchlist: (item: WatchlistItem) => void;
  removeFromWatchlist: (id: string) => void;
  addAlert: (alert: PriceAlert) => void;
  removeAlert: (id: string) => void;
  toggleAlert: (id: string) => void;
  setSelectedPair: (pair: string) => void;
  setSelectedTimeframe: (tf: string) => void;
  toggleSidebar: () => void;
}

export const useTradingStore = create<TradingState>()(
  persist(
    (set) => ({
      trades: mockTrades,
      watchlist: [
        { id: "bitcoin", symbol: "BTC", name: "Bitcoin", addedAt: Date.now() },
        { id: "ethereum", symbol: "ETH", name: "Ethereum", addedAt: Date.now() },
        { id: "solana", symbol: "SOL", name: "Solana", addedAt: Date.now() },
      ],
      alerts: [],
      selectedPair: "BTC/USDT",
      selectedTimeframe: "1D",
      sidebarCollapsed: false,

      addTrade: (trade) =>
        set((state) => ({ trades: [trade, ...state.trades] })),

      addToWatchlist: (item) =>
        set((state) => ({ watchlist: [...state.watchlist, item] })),

      removeFromWatchlist: (id) =>
        set((state) => ({
          watchlist: state.watchlist.filter((w) => w.id !== id),
        })),

      addAlert: (alert) =>
        set((state) => ({ alerts: [...state.alerts, alert] })),

      removeAlert: (id) =>
        set((state) => ({
          alerts: state.alerts.filter((a) => a.id !== id),
        })),

      toggleAlert: (id) =>
        set((state) => ({
          alerts: state.alerts.map((a) =>
            a.id === id ? { ...a, active: !a.active } : a
          ),
        })),

      setSelectedPair: (pair) => set({ selectedPair: pair }),
      setSelectedTimeframe: (tf) => set({ selectedTimeframe: tf }),
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    }),
    {
      name: "alphatrading-store",
      partialize: (state) => ({
        watchlist: state.watchlist,
        alerts: state.alerts,
        selectedPair: state.selectedPair,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
