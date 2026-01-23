// app/trade/components/HeroSection.tsx
"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { Sparkline } from "@/app/trade/components/Sparkline";

export interface HeroSectionProps {
  heroProfit: number;
  bigWin: string;
  recentProfits?: number[]; // untuk sparkline
}

export default function HeroSection({
  heroProfit,
  bigWin,
  recentProfits = [],
}: HeroSectionProps) {
  const [displayProfit, setDisplayProfit] = useState(heroProfit);
  const frameRef = useRef<number | null>(null);
  const profitRef = useRef(displayProfit);

  // Animate profit number smoothly using requestAnimationFrame
  useEffect(() => {
    const duration = 800; // ms
    const start = profitRef.current;
    const diff = heroProfit - start;
    if (diff === 0) return;

    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + diff * eased);
      setDisplayProfit(current);
      profitRef.current = current;

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [heroProfit]);

  // Memoize sparkline data for performance
  const sparklineData = useMemo(() => recentProfits || [], [recentProfits]);

  return (
    <div className="relative p-6 bg-gradient-to-r from-[#0b1222] via-[#1a2636] to-[#0c0f1f] text-white rounded-2xl shadow-neon overflow-hidden hover:shadow-neon-xl transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1 text-neon-pink drop-shadow-lg">
            ${displayProfit.toLocaleString()}
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Big Win:{" "}
            <span className="font-semibold text-neon-green drop-shadow-md">{bigWin}</span>
          </p>
        </div>

        {sparklineData.length > 0 && (
          <div className="w-full sm:w-48 mt-2 sm:mt-0">
            <Sparkline
              values={sparklineData}
              color="#22ff88"
              width={180}
              height={50}
            />
          </div>
        )}
      </div>

      {/* Floating neon background glow shapes */}
      <div className="absolute -top-6 -right-6 w-36 h-36 rounded-full bg-neon-green/20 blur-3xl animate-float pointer-events-none"></div>
      <div className="absolute -bottom-6 -left-6 w-36 h-36 rounded-full bg-neon-pink/20 blur-3xl animate-float animation-delay-2000 pointer-events-none"></div>
      <div className="absolute -top-10 left-1/2 w-48 h-48 rounded-full bg-neon-blue/10 blur-2xl animate-float animation-delay-1000 pointer-events-none"></div>
    </div>
  );
}
