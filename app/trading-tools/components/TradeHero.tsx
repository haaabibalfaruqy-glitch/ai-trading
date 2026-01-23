// C:\ai_trading\app\trading-tools\components\TradeHero.tsx


"use client";

import { useEffect, useState, useMemo } from "react";
import { CapitalMode } from "@/lib/types";
import { ArrowUpRight, Lock } from "lucide-react";

interface TradeHeroProps {
  heroProfit: number;
  heartbeat: number;
  capitalMode: CapitalMode;
  setCapitalMode: React.Dispatch<React.SetStateAction<CapitalMode>>;
  riskAppetite: string;
  accessGranted: boolean;
  setShowExecutionGate: (v: boolean) => void;
  activeCTACopy: { primary: string; sub: string };
  isMobile: boolean;
}

export default function TradeHero({
  heroProfit,
  heartbeat,
  capitalMode,
  setCapitalMode,
  riskAppetite,
  accessGranted,
  setShowExecutionGate,
  activeCTACopy,
  isMobile,
}: TradeHeroProps) {
  const [profit, setProfit] = useState(heroProfit);

  /* ===============================
     SMOOTH PROFIT DRIFT
  =============================== */
  useEffect(() => {
    const id = setInterval(() => {
      setProfit((p) => p + Math.floor(Math.random() * 420 + 120));
    }, 1800);

    return () => clearInterval(id);
  }, []);

  const formattedProfit = useMemo(
    () => profit.toLocaleString("en-US"),
    [profit]
  );

  /* ===============================
     CTA HANDLER
  =============================== */
  const handleCTA = () => {
    if (!accessGranted) {
      setShowExecutionGate(true);
      return;
    }

    setCapitalMode("safe" as CapitalMode); 
  };

  return (
    <div
      className="
        relative w-full h-[420px]
        rounded-3xl
        bg-[#0B1220]
        border border-[#1F2937]
        overflow-hidden
        shadow-[0_40px_120px_rgba(0,0,0,0.45)]
      "
    >
      {/* Ambient glow */}
      <div className="absolute -top-32 -right-32 w-[420px] h-[420px] bg-[#22ff88]/15 blur-[160px] rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] bg-[#22ff88]/10 blur-[120px] rounded-full" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-8">
        {/* Top */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-gray-400 mb-1">
              AI Trading Performance
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              ${formattedProfit}
            </h1>
            <div className="flex items-center gap-2 mt-2 text-xs">
              <span className="text-[#22ff88] font-semibold">
                +{heartbeat}% today
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#22ff88] animate-pulse" />
              <span className="text-gray-500">
                Risk: {riskAppetite}
              </span>
            </div>
          </div>

          {/* Mode badge */}
          <div
            className={`
              px-3 py-1 rounded-full text-[10px] font-semibold border
              ${
                capitalMode === "growth"
                  ? "text-[#22ff88] border-[#22ff88]/40 bg-[#22ff88]/10"
                  : "text-yellow-400 border-yellow-400/40 bg-yellow-400/10"
              }
            `}
          >
            {capitalMode.toUpperCase()} MODE
          </div>
        </div>

        {/* Bottom */}
        <div className="flex items-end justify-between">
          <div className="text-[11px] text-gray-500 max-w-xs leading-relaxed">
            Autonomous AI engine actively reallocating capital based on
            volatility, momentum, and liquidity depth.
          </div>

          {/* CTA */}
          <button
            onClick={handleCTA}
            className={`
              group flex items-center gap-2
              px-6 py-3 rounded-xl text-sm font-semibold
              transition-all
              ${
                accessGranted
                  ? "bg-[#22ff88] text-[#0B1220] hover:bg-[#22ff88]/90"
                  : "border border-[#22ff88]/40 text-[#22ff88] hover:bg-[#22ff88]/10"
              }
            `}
          >
            {!accessGranted && <Lock size={14} />}
            {activeCTACopy.primary}
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </button>
        </div>
      </div>

      {/* Scanline */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(255,255,255,0.02)_50%,transparent_100%)] opacity-20 animate-pulse" />
    </div>
  );
}
