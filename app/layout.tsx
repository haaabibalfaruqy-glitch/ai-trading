// C:\ai_trading\app\layout.tsx

import "./globals.css";
import { AccessProvider } from "@/context/UserAccessContext";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

// Optimasi Font untuk tampilan dashboard yang clean
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Crypto AI Trading System",
    template: "%s | CryptoAI"
  },
  description: "Autonomous AI trading system for data-driven market intelligence",
  keywords: ["AI trading", "crypto", "bitcoin", "automated trading", "trading bot"],
  authors: [{ name: "CryptoAI Team" }],
  openGraph: {
    title: "Crypto AI Trading System",
    description: "Data-driven market intelligence without removing user control",
    url: "https://ai-trading.vercel.app",
    siteName: "CryptoAI",
    images: [
      {
        url: "/images/og-image.jpg", // Pastikan ada image di folder public
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crypto AI Trading System",
    description: "Autonomous AI trading system",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0A0F1C", // Dark Slate Blue
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable}`}>
      <head>
        <meta charSet="UTF-8" />
        {/* Support untuk PWA & Mobile Feel */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-[#0A0F1C] text-slate-200 antialiased selection:bg-blue-500/30">
        <AccessProvider>
          {/* Efek Background Glow - Biar Homepage & Dashboard terlihat canggih */}
          <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0A0F1C] to-[#0A0F1C]" />
          
          <main className="relative flex min-h-screen flex-col">
            {children}
          </main>
        </AccessProvider>
      </body>
    </html>
  );
}