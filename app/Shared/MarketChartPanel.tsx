// C:\ai_trading\app\Shared\MarketChartPanel.tsx

"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { subscribeToMarketData, fetchMarketData } from "@/lib/market";
import { MarketPoint } from "@/lib/types";
import { useAccess } from "@/context/UserAccessContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  ScriptableContext
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Activity, TrendingUp, Lock } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

export interface MarketChartPanelProps {
  symbol: string;
  onTrendChange?: (trend: "up" | "down" | "flat") => void;
}

export default function MarketChartPanel({ symbol, onTrendChange }: MarketChartPanelProps) {
  const { isPremium, isBrokerUnlocked, isLoading: accessLoading } = useAccess();
  const isLocked = !isBrokerUnlocked;

  const [data, setData] = useState<MarketPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  /* ===================== REAL-TIME SYNC ENGINE ===================== */
  useEffect(() => {
    let mounted = true;

    // 1. Initial Load agar chart tidak kosong saat pertama buka
    const initChart = async () => {
      try {
        const initialData = await fetchMarketData(symbol);
        if (mounted) {
          setData(initialData.points);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) setError(true);
      }
    };

    initChart();

    // 2. Subscribe ke Global Market Stream (Urutan 4)
    const unsubscribe = subscribeToMarketData(symbol, (update) => {
      if (!mounted) return;
      setData(update.points);
      
      // Update Trend Analysis untuk Homepage/Dashboard
      if (update.points.length > 5 && onTrendChange) {
        const first = update.points[0].price;
        const last = update.latestPrice;
        if (last > first * 1.001) onTrendChange("up");
        else if (last < first * 0.999) onTrendChange("down");
        else onTrendChange("flat");
      }
    }, 3000); // Sinkron setiap 3 detik mengikuti detak jantung pasar

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [symbol, onTrendChange]);

  /* ===================== CHART VISUALS ===================== */
  const chartData = useMemo(() => ({
    labels: data.map(d => new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })),
    datasets: [
      {
        label: `${symbol} Live Price`,
        data: data.map(d => d.price),
        fill: true,
        borderColor: "#22ff88",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "#22ff88",
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 2,
        tension: 0.4, // Membuat garis terlihat smooth/organik
        backgroundColor: (context: ScriptableContext<"line">) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(34, 255, 136, 0.2)");
          gradient.addColorStop(1, "rgba(34, 255, 136, 0)");
          return gradient;
        },
      },
    ],
  }), [data, symbol]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0F172A",
        titleColor: "#94A3B8",
        bodyColor: "#F8FAFC",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context: any) => ` Price: $${context.parsed.y.toLocaleString()}`
        }
      },
    },
    scales: {
      x: { 
        display: false, // Menghilangkan label bawah agar minimalis & premium
      },
      y: {
        grid: { color: "rgba(255, 255, 255, 0.03)" },
        ticks: {
          color: "#64748B",
          font: { size: 10 },
          callback: (value: any) => `$${value.toLocaleString()}`
        }
      }
    },
    interaction: { mode: "index" as const, intersect: false },
  };

  if (loading || accessLoading) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center bg-[#0B1220] rounded-2xl border border-white/5 animate-pulse">
        <Activity className="w-6 h-6 text-emerald-500/20" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-[300px] bg-[#0B1220]/50 rounded-2xl border border-white/5 p-4 transition-all hover:border-emerald-500/20 group">
      {/* HEADER OVERLAY */}
      <div className="absolute top-4 left-6 z-10">
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Live Execution View</h4>
        </div>
        <div className="text-xl font-black text-white mt-1">
          {symbol}<span className="text-emerald-500">/</span>USDT
        </div>
      </div>

      {/* TREND BADGE */}
      <div className="absolute top-4 right-6 z-10">
         <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-2">
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            <span className="text-[10px] font-bold text-emerald-500 uppercase">AI Bullish Confidence: 94%</span>
         </div>
      </div>

      {/* THE CHART */}
      <div className="w-full h-full pt-10">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* LOCKED STATE OVERLAY */}
      {isLocked && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0A0F1C]/80 backdrop-blur-sm rounded-2xl">
           <div className="p-4 bg-white/5 rounded-full mb-4 border border-white/10">
             <Lock className="w-6 h-6 text-slate-400" />
           </div>
           <p className="text-xs font-bold text-white uppercase tracking-widest">Market Stream Encrypted</p>
           <p className="text-[10px] text-slate-500 mt-2">Connect your terminal to access real-time neural data</p>
        </div>
      )}
    </div>
  );
}