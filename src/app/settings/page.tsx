"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTradingStore } from "@/stores/trading-store";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Monitor,
} from "lucide-react";

interface SettingRowProps {
  label: string;
  description: string;
  children: React.ReactNode;
}

function SettingRow({ label, description, children }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-zinc-800/50 last:border-0">
      <div>
        <p className="text-sm font-medium text-zinc-200">{label}</p>
        <p className="text-xs text-zinc-500">{description}</p>
      </div>
      {children}
    </div>
  );
}

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
        checked ? "bg-blue-600" : "bg-zinc-700"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full border shadow-sm transition-transform ${
          checked
            ? "translate-x-[22px] border-white bg-white"
            : "translate-x-[2px] border-zinc-600 bg-zinc-400"
        } mt-[2px]`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const { settings, updateSettings, clearTradeHistory, resetSettings } =
    useTradingStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-zinc-500">
          Manage your account and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4 sm:space-y-6">
          {/* Profile */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-zinc-400" />
                <CardTitle>Profile</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs text-zinc-400">
                    Display Name
                  </label>
                  <Input
                    value={settings.displayName}
                    onChange={(e) =>
                      updateSettings({ displayName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs text-zinc-400">
                    Email
                  </label>
                  <Input
                    value={settings.email}
                    onChange={(e) =>
                      updateSettings({ email: e.target.value })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-zinc-400" />
                <CardTitle>Notifications</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <SettingRow
                label="Price Alerts"
                description="Get notified when prices hit your targets"
              >
                <ToggleSwitch
                  checked={settings.priceAlerts}
                  onChange={(val) => updateSettings({ priceAlerts: val })}
                />
              </SettingRow>
              <SettingRow
                label="Trade Confirmations"
                description="Receive confirmations for executed trades"
              >
                <ToggleSwitch
                  checked={settings.tradeConfirmations}
                  onChange={(val) => updateSettings({ tradeConfirmations: val })}
                />
              </SettingRow>
              <SettingRow
                label="Market News"
                description="Get breaking crypto news notifications"
              >
                <ToggleSwitch
                  checked={settings.marketNews}
                  onChange={(val) => updateSettings({ marketNews: val })}
                />
              </SettingRow>
              <SettingRow
                label="Portfolio Updates"
                description="Daily portfolio performance summary"
              >
                <ToggleSwitch
                  checked={settings.portfolioUpdates}
                  onChange={(val) => updateSettings({ portfolioUpdates: val })}
                />
              </SettingRow>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-zinc-400" />
                <CardTitle>Appearance</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <SettingRow
                label="Theme"
                description="Choose your preferred theme"
              >
                <div className="flex flex-wrap gap-2">
                  {(["dark", "light", "system"] as const).map((t) => (
                    <Button
                      key={t}
                      variant={settings.theme === t ? "primary" : "ghost"}
                      size="sm"
                      onClick={() => updateSettings({ theme: t })}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </Button>
                  ))}
                </div>
              </SettingRow>
              <SettingRow
                label="Compact Mode"
                description="Use a more compact layout for tables and lists"
              >
                <ToggleSwitch
                  checked={settings.compactMode}
                  onChange={(val) => updateSettings({ compactMode: val })}
                />
              </SettingRow>
            </CardContent>
          </Card>

          {/* Trading Preferences */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4 text-zinc-400" />
                <CardTitle>Trading Preferences</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <SettingRow
                label="Default Order Type"
                description="Default order type for new trades"
              >
                <div className="flex flex-wrap gap-2">
                  {(["market", "limit"] as const).map((t) => (
                    <Button
                      key={t}
                      variant={
                        settings.defaultOrderType === t ? "primary" : "ghost"
                      }
                      size="sm"
                      onClick={() => updateSettings({ defaultOrderType: t })}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </Button>
                  ))}
                </div>
              </SettingRow>
              <SettingRow
                label="Confirm Orders"
                description="Show confirmation dialog before placing orders"
              >
                <ToggleSwitch
                  checked={settings.confirmOrders}
                  onChange={(val) => updateSettings({ confirmOrders: val })}
                />
              </SettingRow>
              <SettingRow
                label="Sound Effects"
                description="Play sounds for trade executions"
              >
                <ToggleSwitch
                  checked={settings.soundEffects}
                  onChange={(val) => updateSettings({ soundEffects: val })}
                />
              </SettingRow>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-zinc-400" />
                <CardTitle>Security</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2">
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                Enable 2FA
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                Active Sessions
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-zinc-400" />
                <CardTitle>Preferences</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs text-zinc-400">
                  Currency
                </label>
                <Input
                  value={settings.currency}
                  onChange={(e) =>
                    updateSettings({ currency: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-zinc-400">
                  Timezone
                </label>
                <Input
                  value={settings.timezone}
                  onChange={(e) =>
                    updateSettings({ timezone: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-zinc-400">
                  Language
                </label>
                <Input
                  value={settings.language}
                  onChange={(e) =>
                    updateSettings({ language: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-900/50">
            <CardHeader>
              <CardTitle className="text-red-400">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start text-red-400 border-red-900/50 hover:bg-red-900/20"
                onClick={() => {
                  if (confirm("Are you sure you want to delete all trade history?")) {
                    clearTradeHistory();
                  }
                }}
              >
                Delete All Trade History
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-red-400 border-red-900/50 hover:bg-red-900/20"
                onClick={() => {
                  if (confirm("Are you sure you want to reset all settings?")) {
                    resetSettings();
                  }
                }}
              >
                Reset All Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
