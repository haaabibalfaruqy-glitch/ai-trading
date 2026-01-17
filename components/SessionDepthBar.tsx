"use client";

import { useEffect, useState } from "react";

export default function SessionDepthBar({
  onReady,
}: {
  onReady?: () => void;
}) {
  const [depth, setDepth] = useState(18);

  useEffect(() => {
    const id = setInterval(() => {
      setDepth((d) => {
        if (d >= 100) return 100;
        const next = d + Math.random() * 6;
        if (next >= 72) onReady?.(); // 🔑 threshold
        return next;
      });
    }, 1800);

    return () => clearInterval(id);
  }, [onReady]);

  return (
    <div className="bg-[#0B0F18] border border-[#1F2937] rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] text-gray-400">
          AI Session Context Depth
        </span>
        <span className="text-[11px] text-[#22ff88]">
          {Math.floor(depth)}%
        </span>
      </div>

      <div className="w-full h-2 rounded-full bg-[#1C2A3D] overflow-hidden">
        <div
          className="h-full bg-[#22ff88] transition-all duration-700"
          style={{ width: `${depth}%` }}
        />
      </div>

      <p className="mt-2 text-[10px] text-gray-500">
        Context readiness increases with live analysis
      </p>
    </div>
  );
}
