import type { Metadata } from "next";
import "./globals.css";
import { AppLayout } from "@/components/layout/app-layout";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "AlphaTrading - Professional Crypto Trading Platform",
  description:
    "Professional-grade cryptocurrency trading platform with real-time market data, advanced charting, and portfolio management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased font-sans">
        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
      </body>
    </html>
  );
}
