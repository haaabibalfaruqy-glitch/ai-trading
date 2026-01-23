// app/Shared/HeroVisual.tsx

"use client";

import React from "react";
import { Sparkles, Terminal } from "lucide-react";

interface HeroVisualProps {
  title?: string;
  subtitle?: string;
  description?: string;
}

/**
 * HERO VISUAL (Neural Interface)
 * Menampilkan pesan utama sistem dengan estetika monitor futuristik.
 */
const HeroVisual: React.FC<HeroVisualProps> = React.memo(
  ({
    title = "Autonomous Market Intelligence",
    subtitle = "Without Removing User Control",
    description = "This system continuously analyzes market structure, volatility regimes, and behavioral patterns to provide contextual trading insights — not execution commands.",
  }) => {
    return (
      <section
        className="
          relative
          w-full
          min-h-[300px]
          rounded-[2rem]
          overflow-hidden
          border border-white/[0.05]
          bg-[#0A0F1C]
          shadow-2xl
          mb-8
          group
        "
        role="region"
        aria-label="Hero Visual Section"
      >
        {/* === BACKGROUND GLOW (Dynamic) === */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-neon-green/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-100px] right-[-50px] w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px]" />
        </div>

        {/* === NEURAL GRID OVERLAY === */}
        <div
          className="
            absolute inset-0
            opacity-[0.15]
            bg-[linear-gradient(to_right,#1F2937_1px,transparent_1px),linear-gradient(to_bottom,#1F2937_1px,transparent_1px)]
            bg-[size:40px_40px]
            [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]
          "
        />

        {/* === SCAN LINE EFFECT === */}
        <div className="absolute inset-0 w-full h-[2px] bg-white/[0.02] top-0 animate-scan-line pointer-events-none" />

        {/* === CONTENT === */}
        <div className="relative z-10 h-full flex flex-col justify-center px-8 sm:px-12 py-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-neon-green animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.3em] text-white/40 uppercase">
                Neural Copilot Interface
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.1] mb-5 tracking-tight">
              {title}
              <br />
              <span className="bg-gradient-to-r from-neon-green to-emerald-400 bg-clip-text text-transparent">
                {subtitle}
              </span>
            </h1>

            <div className="flex flex-col sm:flex-row items-start gap-6">
              <p className="text-[13px] sm:text-sm text-gray-400 leading-relaxed max-w-xl font-medium">
                {description}
              </p>
              
              <div className="hidden sm:flex flex-col gap-2 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] min-w-[180px]">
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-neon-green" />
                  <span className="text-[10px] font-mono text-gray-500">SYSTEM_LOG</span>
                </div>
                <div className="text-[9px] font-mono text-neon-green/60 animate-pulse">
                  {">"} INITIALIZING_CONTEXT...<br />
                  {">"} ANALYZING_VOLATILITY...<br />
                  {">"} SYNC_COMPLETED.
                </div>
              </div>
            </div>

            {/* === STATUS ROW === */}
            <div className="flex flex-wrap items-center gap-6 mt-8 pt-6 border-t border-white/[0.05]">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green/60 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green shadow-[0_0_8px_#22ff88]" />
                </span>
                <span className="text-[11px] font-bold text-white uppercase tracking-wider">AI Engine Active</span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium">
                <div className="w-1 h-1 rounded-full bg-gray-700" />
                <span>Context-Driven Execution</span>
                <div className="w-1 h-1 rounded-full bg-gray-700" />
                <span>Zero-Latency Synthesis</span>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes scan-line {
            0% { top: 0%; }
            100% { top: 100%; }
          }
          .animate-scan-line {
            animation: scan-line 8s linear infinite;
          }
        `}</style>
      </section>
    );
  }
);

HeroVisual.displayName = "HeroVisual";

export default HeroVisual;