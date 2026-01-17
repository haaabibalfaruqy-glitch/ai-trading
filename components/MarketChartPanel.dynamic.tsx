// Dynamic import wrapper for MarketChartPanel
import dynamic from "next/dynamic";
import { Suspense } from "react";

const MarketChartPanelDynamic = dynamic(
  () => import("./MarketChartPanel"),
  {
    loading: () => (
      <div className="w-full h-[260px] sm:h-[300px] lg:h-[380px] 
        rounded-2xl bg-[#0B1220] border border-[#1F2937]
        animate-pulse flex items-center justify-center">
        <span className="text-gray-400 text-sm">Loading chart...</span>
      </div>
    ),
    ssr: false, // Client-side only (Chart.js requires DOM)
  }
);

export default MarketChartPanelDynamic;
