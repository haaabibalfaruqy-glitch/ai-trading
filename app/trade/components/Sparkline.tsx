// C:\ai_trading\app\trade\components\Sparkline.tsx

"use client";

import React, { useMemo, useId } from "react";

export interface SparklineProps {
  values: number[];
  width?: number;
  height?: number;
  color?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({
  values,
  width = 320,
  height = 110,
  color,
}) => {
  const uniqueId = useId().replace(/:/g, ""); // Mencegah konflik ID SVG
  if (!values || values.length < 2) return <div style={{ height }} />;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  // Analisis Volatilitas untuk efek visual dinamis
  const volatility = useMemo(() => {
    let vol = 0;
    for (let i = 1; i < values.length; i++) {
      vol += Math.abs(values[i] - values[i - 1]);
    }
    return vol / values.length;
  }, [values]);

  const energy = volatility > 18 ? "high" : volatility > 10 ? "medium" : "low";

  // Kalkulasi koordinat titik
  const pointsData = values.map((v, i) => ({
    x: (i / (values.length - 1)) * width,
    y: height - ((v - min) / range) * height,
  }));

  const pathData = pointsData.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`).join(" ");
  const areaData = `${pathData} L ${width},${height} L 0,${height} Z`;

  const lastPoint = pointsData[pointsData.length - 1];
  const strokeColor = color ?? "#22ff88";

  return (
    <svg 
      viewBox={`0 0 ${width} ${height}`} 
      className="w-full h-auto overflow-visible transition-all duration-1000"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={`grad-${uniqueId}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
        </linearGradient>
        
        <filter id={`glow-${uniqueId}`}>
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Area Fill (Glass Effect) */}
      <path
        d={areaData}
        fill={`url(#grad-${uniqueId})`}
        className="transition-all duration-700 ease-in-out"
      />

      {/* Shadow Blur Behind Line */}
      {energy !== "low" && (
        <path
          d={pathData}
          stroke={strokeColor}
          strokeWidth={energy === "high" ? 6 : 3}
          fill="none"
          strokeLinecap="round"
          className="opacity-20 blur-[4px]"
        />
      )}

      {/* Main Sparkline Path */}
      <path
        d={pathData}
        stroke={strokeColor}
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={energy === "high" ? `url(#glow-${uniqueId})` : undefined}
        className="transition-all duration-500 ease-in-out"
      />

      {/* End Point Indicator */}
      <circle
        cx={lastPoint.x}
        cy={lastPoint.y}
        r={energy === "high" ? 4 : 3}
        fill={strokeColor}
        className={energy === "high" ? "animate-pulse" : ""}
      >
        {energy === "high" && (
          <animate
            attributeName="r"
            values={`${lastPoint.y};${lastPoint.y + 2};${lastPoint.y}`}
            dur="1s"
            repeatCount="indefinite"
          />
        )}
      </circle>
    </svg>
  );
};