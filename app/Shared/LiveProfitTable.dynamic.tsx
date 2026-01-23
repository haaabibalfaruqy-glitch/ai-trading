// /app/Shared/LiveProfitTable.dynamic.tsx

"use client";

import dynamic from "next/dynamic";
import ProfitTableSkeleton from "./ProfitTableSkeleton"; // Sinkronisasi Urutan 17

/**
 * LIVE PROFIT TABLE DYNAMIC
 * - Isolasi tabel histori yang berat dari bundle utama.
 * - Proteksi TypeScript untuk Named vs Default Export.
 * - Sinkronisasi visual dengan tema Omega.
 */
const LiveProfitTableComponent = dynamic(
  () => 
    import("./LiveProfitTable").then((mod: any) => {
      // FIX: Menangani potensi Named Export 'LiveProfitTable' atau Default Export
      return mod.LiveProfitTable || mod.default;
    }),
  {
    ssr: true, // SEO Friendly + Fast TTFB
    loading: () => (
      <div className="relative group">
        {/* Overlay Status: Memberikan konteks tambahan di atas skeleton */}
        <div className="absolute top-6 right-6 z-10 flex items-center gap-2 text-[10px] font-bold text-neon-green tracking-widest uppercase">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green/60 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green" />
          </span>
          Initializing Live Stream
        </div>

        {/* Menggunakan Master Skeleton dari Urutan 17 */}
        <ProfitTableSkeleton />

        {/* Decorative Neural Footer (Matching the Dynamic Theme) */}
        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center opacity-40 pointer-events-none">
           <p className="text-[9px] text-gray-500 font-mono italic">
             NEURAL_STREAM_ID: {Math.random().toString(36).substring(7).toUpperCase()}
           </p>
        </div>
      </div>
    ),
  }
);

LiveProfitTableComponent.displayName = "LiveProfitTableComponent";

export default LiveProfitTableComponent;