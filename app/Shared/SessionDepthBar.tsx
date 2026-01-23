// C:\ai_trading\app\Shared\SessionDepthBar.tsx

"use client";

import { useEffect, useRef, useState } from "react";

interface SessionDepthBarProps {
  onReady?: () => void;
}

export default function SessionDepthBar({ onReady }: SessionDepthBarProps) {
  const [depth, setDepth] = useState(18);
  const [status, setStatus] = useState<"boot" | "analyzing" | "ready">("boot");
  const readyTriggered = useRef(false);

  useEffect(() => {
    const id = setInterval(() => {
      setDepth((current) => {
        if (current >= 100) return 100;

        // Neural resistance: simulasi beban data yang makin kompleks
        const resistance = Math.max(0.2, 1 - current / 105);
        const increment = (Math.random() * 5 + 1) * resistance;
        const next = Math.min(100, current + increment);

        // Status Evolution
        if (next >= 35 && status === "boot") setStatus("analyzing");
        if (next >= 85 && !readyTriggered.current) {
          readyTriggered.current = true;
          setStatus("ready");
          onReady?.(); 
        }

        return next;
      });
    }, 1800);

    return () => clearInterval(id);
  }, [onReady, status]);

  return (
    <div
      className="
        relative bg-[#0C1322] border border-white/[0.05]
        rounded-[1.5rem] p-5 overflow-hidden
        shadow-[0_10px_30px_-15px_rgba(0,0,0,0.5)]
      "
    >
      {/* Background Neural Grid Decal */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      {/* Header Info */}
      <div className="relative z-10 flex items-end justify-between mb-3">
        <div className="space-y-1">
          <h4 className="text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase">
            Neural Context Depth
          </h4>
          <p className="text-[11px] text-white/80 font-medium">
            {status === "boot" && "Initializing Neural Link..."}
            {status === "analyzing" && "Synthesizing Market Data..."}
            {status === "ready" && "Session fully Synchronized"}
          </p>
        </div>

        <div className="text-right">
          <span className={`text-xs font-mono font-bold transition-colors duration-500 ${
            status === "ready" ? "text-neon-green" : "text-gray-400"
          }`}>
            {Math.floor(depth)}%
          </span>
        </div>
      </div>

      {/* Futuristic Progress Track */}
      <div className="relative w-full h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
        {/* Animated Fill */}
        <div
          className={`
            h-full rounded-full transition-all duration-1000 ease-out relative
            ${status === "ready" ? "bg-neon-green shadow-[0_0_15px_#22ff88]" : "bg-neon-pink shadow-[0_0_10px_#ff0080]"}
          `}
          style={{ width: `${depth}%` }}
        >
          {/* Scanning Light Effect */}
          <div className="absolute inset-0 w-20 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
        </div>
      </div>

      {/* Bottom Metrics */}
      <div className="relative z-10 mt-4 flex items-center justify-between border-t border-white/[0.03] pt-3">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className={`w-1 h-1 rounded-full ${status !== "boot" ? "bg-neon-green" : "bg-gray-700"}`} />
            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">Data Sync</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className={`w-1 h-1 rounded-full ${status === "ready" ? "bg-neon-green" : "bg-gray-700"}`} />
            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">Logic Ready</span>
          </div>
        </div>
        
        <span className="text-[9px] font-mono text-gray-600">
          LATENCY: 14ms
        </span>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(500%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }
      `}</style>
    </div>
  );
}