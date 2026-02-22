"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

function ToggleSwitch({ defaultChecked = false }: { defaultChecked?: boolean }) {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        className="peer sr-only"
        defaultChecked={defaultChecked}
      />
      <div className="h-6 w-11 rounded-full bg-zinc-700 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-zinc-600 after:bg-zinc-400 after:transition-all peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:after:bg-white" />
    </label>
  );
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-zinc-500">
          Manage your account and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Profile */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-zinc-400" />
                <CardTitle>Profile</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs text-zinc-400">
                    Display Name
                  </label>
                  <Input defaultValue="Trader" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs text-zinc-400">
                    Email
                  </label>
                  <Input defaultValue="trader@alphatrading.com" />
                </div>
              </div>
              <Button variant="primary" size="sm">
                Save Changes
              </Button>
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
                <ToggleSwitch defaultChecked />
              </SettingRow>
              <SettingRow
                label="Trade Confirmations"
                description="Receive confirmations for executed trades"
              >
                <ToggleSwitch defaultChecked />
              </SettingRow>
              <SettingRow
                label="Market News"
                description="Get breaking crypto news notifications"
              >
                <ToggleSwitch />
              </SettingRow>
              <SettingRow
                label="Portfolio Updates"
                description="Daily portfolio performance summary"
              >
                <ToggleSwitch defaultChecked />
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
                <div className="flex gap-2">
                  <Button variant="primary" size="sm">
                    Dark
                  </Button>
                  <Button variant="ghost" size="sm">
                    Light
                  </Button>
                  <Button variant="ghost" size="sm">
                    System
                  </Button>
                </div>
              </SettingRow>
              <SettingRow
                label="Compact Mode"
                description="Use a more compact layout for tables and lists"
              >
                <ToggleSwitch />
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
                <div className="flex gap-2">
                  <Button variant="primary" size="sm">
                    Market
                  </Button>
                  <Button variant="ghost" size="sm">
                    Limit
                  </Button>
                </div>
              </SettingRow>
              <SettingRow
                label="Confirm Orders"
                description="Show confirmation dialog before placing orders"
              >
                <ToggleSwitch defaultChecked />
              </SettingRow>
              <SettingRow
                label="Sound Effects"
                description="Play sounds for trade executions"
              >
                <ToggleSwitch />
              </SettingRow>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
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
                <Input defaultValue="USD" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-zinc-400">
                  Timezone
                </label>
                <Input defaultValue="UTC" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-zinc-400">
                  Language
                </label>
                <Input defaultValue="English" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-900/50">
            <CardHeader>
              <CardTitle className="text-red-400">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start text-red-400 border-red-900/50 hover:bg-red-900/20">
                Delete All Trade History
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-400 border-red-900/50 hover:bg-red-900/20">
                Reset All Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
