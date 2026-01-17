import "./globals.css";
import { AccessProvider } from "@/context/UserAccessContext";
import Footer from "@/components/Footer";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Crypto AI Trading System",
  description: "Autonomous AI trading system for data-driven market intelligence",
  keywords: "AI trading, crypto, bitcoin, ethereum, automated trading",
  authors: [{ name: "CryptoAI" }],
  openGraph: {
    title: "Crypto AI Trading System",
    description: "Data-driven market intelligence without removing user control",
    url: "https://ai-trading.vercel.app",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0A0F1C",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="theme-color" content="#0A0F1C" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="CryptoAI" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-[#0A0F1C] text-white">
        <AccessProvider>
          <main className="w-full">
            {children}
          </main>
          <Footer />
        </AccessProvider>
      </body>
    </html>
  );
}
