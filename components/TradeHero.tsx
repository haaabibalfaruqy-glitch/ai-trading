"use client";
import { useEffect, useState } from "react";
import { CapitalMode, SystemMode } from "@/lib/types";

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

  useEffect(() => {
    const id = setInterval(() => {
      setProfit((prev) => prev + Math.floor(Math.random() * 1000));
    }, 2000);

    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative w-full h-[420px] rounded-3xl bg-[#0B1220] border border-[#1F2937] overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
      <div className="absolute -top-24 -right-24 w-[360px] h-[360px] bg-[#22ff88]/12 blur-[140px] rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] rounded-full bg-[#22ff88]/10 blur-[90px]" />
      <div className="absolute bottom-6 left-6 text-white text-xl font-semibold">
        Hero Profit: ${profit}
      </div>

      {/* CTA Button */}
      <button
        onClick={() => setShowExecutionGate(true)}
        className="absolute top-4 right-4 px-4 py-2 border border-[#22ff88] rounded-lg text-[#22ff88] hover:bg-[#22ff8820] transition"
      >
        {activeCTACopy.primary}
      </button>
    </div>
  );
}
