// /app/Shared/MarketChartPanel.dynamic.tsx

"use client";

import dynamic from "next/dynamic";

/**
 * FIXED: Menangani Type Error 2339 dengan casting 'any' 
 * Menggunakan pendekatan yang sama dengan OmegaCard.dynamic
 */
const MarketChartPanelDynamic = dynamic(
  () => 
    import("./MarketChartPanel").then((mod: any) => {
      // Logika fallback: Cek named export dulu, jika tidak ada pakai default
      return mod.MarketChartPanel || mod.default;
    }),
  {
    ssr: false, 
    loading: () => (
      <div
        className="
          w-full
          h-[260px] sm:h-[300px] lg:h-[380px]
          rounded-[2rem]
          bg-[#0C1322]
          border border-[#1A2636]
          relative
          overflow-hidden
          flex flex-col items-center justify-center
          gap-4
        "
      >
        {/* Shimmer Effect */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/[0.02] to-transparent" />

        {/* Neural Spinner */}
        <div className="relative">
          <div className="absolute inset-0 blur-xl bg-neon-green/20 animate-pulse" />
          <div className="relative w-10 h-10 rounded-full border-2 border-white/5 border-t-neon-green animate-spin" />
        </div>

        <div className="flex flex-col items-center gap-1.5 z-10 text-center px-4">
          <span className="text-neon-green/90 text-[10px] font-bold tracking-[0.2em] uppercase">
            Initializing Engine
          </span>
          <span className="text-gray-500 text-[10px] font-medium">
            Syncing market visualization...
          </span>
        </div>

        <style jsx>{`
          @keyframes shimmer {
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    ),
  }
);

MarketChartPanelDynamic.displayName = "MarketChartPanelDynamic";

export default MarketChartPanelDynamic;