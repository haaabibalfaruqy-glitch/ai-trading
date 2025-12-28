"use client";

import { useEffect, useState, useRef } from "react";
import { fetchMarketSeries, MarketPoint } from "@/lib/market";
import { useMemo } from "react";
import { trackEvent } from "@/lib/events";

// chart
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function MarketChartPanel({
  symbol,
  onTrendChange,
}: {
  symbol: "bitcoin" | "ethereum";
onTrendChange?: (trend: "up" | "down" | "flat") => void;
}) {



  const [data, setData] = useState<MarketPoint[]>([]);
  const [loading, setLoading] = useState(true);
const [error, setError] = useState(false);
const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

useEffect(() => {
  let mounted = true;

  const loadData = async () => {
    if (!mounted) return;

    setLoading(true);
    setError(false);

    try {
      const marketData = await fetchMarketSeries(symbol);
      if (!mounted) return;

      setData(marketData);

      // ==========================
      // HITUNG TREND
      // ==========================
      if (
  marketData.length > 5 &&
  onTrendChange &&
  !error
) {
  const first = marketData[0].price;
  const last = marketData[marketData.length - 1].price;

  if (last > first * 1.002) onTrendChange("up");
  else if (last < first * 0.998) onTrendChange("down");
  else onTrendChange("flat");
}

    } catch (err) {
      if (mounted) {
        console.error(err);
        setError(true);
      }
    } finally {
      if (mounted) setLoading(false);
    }
  };

  loadData();

  if (intervalRef.current) {
    clearInterval(intervalRef.current);
  }

  intervalRef.current = setInterval(loadData, 60000);

  return () => {
    mounted = false;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
}, [symbol, onTrendChange]);

  // Chart data untuk Line chart
  const chartData = useMemo(() => ({
  labels: data.map(point =>
    new Date(point.time).toLocaleTimeString()
  ),
  datasets: [
    {
      label: `${symbol.toUpperCase()} Price (USD)`,
      data: data.map(point => point.price),
      borderColor: "#22ff88",
      backgroundColor: "rgba(34,255,136,0.2)",
      tension: 0.3,
    },
  ],
}), [data, symbol]);

const chartOptions = useMemo(() => ({
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { mode: "index" as const, intersect: false },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#aaa", maxTicksLimit: 6 },
    },
    y: {
      grid: { color: "rgba(255,255,255,0.05)" },
      ticks: { color: "#aaa" },
    },
  },
}), []);

useEffect(() => {
  if (error || loading || data.length === 0) return;

  const timer = setTimeout(() => {
    trackEvent("module_view", {
      module: "market_chart",
      symbol,
    });
  }, 2500);

  return () => clearTimeout(timer);
}, [symbol, error, loading, data.length]);

  return (
    <div className="card p-3 sm:p-4 w-full h-[260px] sm:h-[300px] flex flex-col items-center justify-center">
      {loading ? (
  <p className="text-gray-400">Loading chart...</p>
) : error ? (
  <div className="text-center text-gray-400 text-sm">
    Market data temporarily unavailable
  </div>
) : (
  <div className="w-full h-full overflow-hidden">
  <Line data={chartData} options={chartOptions} />
</div>
)}
    </div>
  );
}
