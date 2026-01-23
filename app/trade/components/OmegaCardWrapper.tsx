// app/trade/components/OmegaCardWrapper.tsx

"use client";

import React, { useEffect, useState, useMemo } from "react";
import classNames from "classnames";

// PERBAIKAN: Import type sekarang sudah aman karena sudah kita 'export' di componentTypes.ts
import { Coin, SystemMode } from "@/lib/componentTypes";

// Components
import { OmegaCard } from "@/app/Shared/OmegaCard";
import { Loader2 } from "lucide-react"; 

export interface OmegaCardWrapperProps {
  coin: Coin;
  idx: number;
  realSeries?: number[];
  liveData?: number[][];
  N: number;
  systemMode: SystemMode;
  search: string;
  onView: () => void;
}

const OmegaCardWrapper: React.FC<OmegaCardWrapperProps> = ({
  coin,
  idx,
  realSeries = [],
  liveData = [],
  N,
  systemMode,
  search,
  onView,
}) => {
  const [displayData, setDisplayData] = useState<number[]>([]);

  // Safely Extract & Slice Data Matrix
  useEffect(() => {
    // Menambahkan pengecekan apakah liveData ada sebelum mengakses index
    const series =
      (liveData && Array.isArray(liveData[idx]) ? liveData[idx] : undefined) ||
      (Array.isArray(realSeries) ? realSeries : []);
    
    if (series && series.length > 0) {
      setDisplayData(series.slice(-N));
    }
  }, [liveData, realSeries, idx, N]);

  // Search Match Detection
  const isMatch = useMemo(() => {
    if (!search || !coin) return false;
    const q = search.toLowerCase();
    return (
      coin.name.toLowerCase().includes(q) ||
      coin.symbol.toLowerCase().includes(q)
    );
  }, [coin, search]);

  return (
    <div
      onClick={onView}
      className={classNames(
        "relative cursor-pointer transition-all duration-500 rounded-[2.5rem]",
        "hover:scale-[1.02] active:scale-[0.98]",
        {
          "ring-2 ring-neon-green shadow-[0_0_30px_rgba(34,255,136,0.2)] z-10": isMatch,
          "opacity-40 grayscale-[0.5]": search && !isMatch, 
          "opacity-100": !search || isMatch,
        }
      )}
    >
      {/* Search Highlight Ornament */}
      {isMatch && (
        <div className="absolute -top-3 -right-3 px-3 py-1 bg-neon-green text-black text-[9px] font-black rounded-full z-20 animate-bounce">
          MATCH_FOUND
        </div>
      )}

      {displayData.length > 0 ? (
        <OmegaCard
          coin={coin}
          values={displayData}
          systemMode={systemMode}
          onView={onView}
        />
      ) : (
        <div className="h-[320px] w-full flex flex-col items-center justify-center bg-white/[0.02] border border-dashed border-white/10 rounded-[2.5rem]">
          <Loader2 className="text-gray-700 animate-spin mb-2" size={24} />
          <p className="text-[10px] text-gray-600 font-mono tracking-tighter uppercase">Syncing_Neural_Feed...</p>
        </div>
      )}
    </div>
  );
};

export default OmegaCardWrapper;