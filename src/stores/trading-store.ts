import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Trade, WatchlistItem, PriceAlert } from "@/types";
import { mockTrades } from "@/data/mock-data";

interface TradingState {
  _hydrated: boolean;
  trades: Trade[];
  watchlist: WatchlistItem[];
  alerts: PriceAlert[];
  selectedPair: string;
  selectedTimeframe: string;
  sidebarCollapsed: boolean;

  // Settings
  settings: {
    priceAlerts: boolean;
    tradeConfirmations: boolean;
    marketNews: boolean;
    portfolioUpdates: boolean;
    theme: "dark" | "light" | "system";
    compactMode: boolean;
    defaultOrderType: "market" | "limit";
    confirmOrders: boolean;
    soundEffects: boolean;
    currency: string;
    timezone: string;
    language: string;
    displayName: string;
    email: string;
  };

  // Actions
  setHydrated: () => void;
  addTrade: (trade: Trade) => void;
  addToWatchlist: (item: WatchlistItem) => void;
  removeFromWatchlist: (id: string) => void;
  addAlert: (alert: PriceAlert) => void;
  removeAlert: (id: string) => void;
  toggleAlert: (id: string) => void;
  setSelectedPair: (pair: string) => void;
  setSelectedTimeframe: (tf: string) => void;
  toggleSidebar: () => void;
  updateSettings: (patch: Partial<TradingState["settings"]>) => void;
  clearTradeHistory: () => void;
  resetSettings: () => void;
}

const defaultSettings: TradingState["settings"] = {
  priceAlerts: true,
  tradeConfirmations: true,
  marketNews: false,
  portfolioUpdates: true,
  theme: "dark",
  compactMode: false,
  defaultOrderType: "market",
  confirmOrders: true,
  soundEffects: false,
  currency: "USD",
  timezone: "UTC",
  language: "English",
  displayName: "Trader",
  email: "trader@alphatrading.com",
};

export const useTradingStore = create<TradingState>()(
  persist(
    (set) => ({
      _hydrated: false,
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
      settings: { ...defaultSettings },

      setHydrated: () => set({ _hydrated: true }),

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

      updateSettings: (patch) =>
        set((state) => ({ settings: { ...state.settings, ...patch } })),

      clearTradeHistory: () => set({ trades: [] }),
      resetSettings: () => set({ settings: { ...defaultSettings } }),
    }),
    {
      name: "alphatrading-store",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
      partialize: (state) => ({
        trades: state.trades,
        watchlist: state.watchlist,
        alerts: state.alerts,
        selectedPair: state.selectedPair,
        selectedTimeframe: state.selectedTimeframe,
        sidebarCollapsed: state.sidebarCollapsed,
        settings: state.settings,
      }),
    }
  )
);
