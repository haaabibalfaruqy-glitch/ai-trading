"use client";

import dynamic from "next/dynamic";

// Lazy load the TradeDashboard component to reduce initial page load
const DynamicTradeDashboard = dynamic(
  () => import("./components/TradeDashboard"),
  {
    loading: () => (
      <div className="w-full min-h-screen bg-gradient-to-b from-[#0A0F1C] via-[#0B1220] to-[#070B14] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#22ff88] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#22ff88] font-semibold">Loading Trading Dashboard...</p>
        </div>
      </div>
    ),
  }
);

export default function TradePage() {
  return <DynamicTradeDashboard />;
}
