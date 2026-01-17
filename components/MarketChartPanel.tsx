"use client";

import { useEffect, useState, useRef } from "react";
import { fetchMarketSeries } from "@/lib/market";
import { MarketPoint } from "@/lib/types";
import { useMemo } from "react";
import { trackEvent } from "@/lib/events";
import { MarketChartPanelProps } from "@/lib/componentTypes";
import { useIsAuthenticated, useIsPremium } from "@/context/UserAccessContext";

// Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
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
  Legend,
  Filler
);

export default function MarketChartPanel({
  symbol,
  onTrendChange,
}: MarketChartPanelProps) {
  // Access control
  const isAuthenticated = useIsAuthenticated();
  const hasPremium = useIsPremium();
  const isLocked = !isAuthenticated && !hasPremium;

  const [data, setData] = useState<MarketPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [showOverlays, setShowOverlays] = useState(hasPremium);
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

      // Calculate trend from price movement
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

  // Refresh every 60 seconds
  intervalRef.current = setInterval(loadData, 60000);

  return () => {
    mounted = false;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
}, [symbol, onTrendChange]);

// ================= AI OVERLAYS =================
// Calculate trend line (simple linear regression)
const trendLine = useMemo(() => {
  if (data.length < 2) return [];
  
  const prices = data.map(d => d.price);
  const n = prices.length;
  
  const xMean = (n - 1) / 2;
  const yMean = prices.reduce((a, b) => a + b, 0) / n;
  
  let numerator = 0;
  let denominator = 0;
  
  for (let i = 0; i < n; i++) {
    const xDiff = i - xMean;
    const yDiff = prices[i] - yMean;
    numerator += xDiff * yDiff;
    denominator += xDiff * xDiff;
  }
  
  const slope = denominator === 0 ? 0 : numerator / denominator;
  const intercept = yMean - slope * xMean;
  
  return data.map((_, i) => slope * i + intercept);
}, [data]);

// Calculate volatility
const volatility = useMemo(() => {
  if (data.length < 2) return 0;
  
  const prices = data.map(d => d.price);
  const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
  const variance = prices.reduce((a, p) => a + Math.pow(p - mean, 2), 0) / prices.length;
  return Math.sqrt(variance) / mean * 100; // As percentage
}, [data]);

// Calculate risk zones (high volatility areas)
const riskZones = useMemo(() => {
  if (data.length < 5) return [];
  
  const prices = data.map(d => d.price);
  const volatilityThreshold = volatility * 1.5;
  
  return prices.map((price, i) => {
    if (i < 2 || i >= prices.length - 2) return null;
    
    const window = prices.slice(i - 2, i + 3);
    const windowVolatility = Math.sqrt(
      window.reduce((a, p) => a + Math.pow(p - (window.reduce((x, y) => x + y, 0) / window.length), 2), 0) / window.length
    ) / (window.reduce((x, y) => x + y, 0) / window.length) * 100;
    
    return windowVolatility > volatilityThreshold ? price : null;
  });
}, [data, volatility]);

// Predict next price point (simple momentum)
const pricePrediction = useMemo(() => {
  if (data.length < 3) return null;
  
  const last3 = data.slice(-3).map(d => d.price);
  const momentum = (last3[2] - last3[0]) / 2;
  return last3[2] + momentum;
}, [data]);

  // Chart data with AI overlays
  const chartData = useMemo(() => {
    const baseDataset = {
      label: `${symbol.toUpperCase()} Price (USD)`,
      data: data.map(point => point.price),
      borderColor: "#22ff88",
      backgroundColor: "rgba(34,255,136,0.15)",
      tension: 0.4,
      borderWidth: 2.5,
      fill: true,
      pointRadius: hovering ? 5 : 3,
      pointBackgroundColor: "#22ff88",
      pointBorderColor: "#ffffff",
      pointBorderWidth: 2,
    };

    const datasets: any[] = [baseDataset];

    // Add trend line if premium
    if (showOverlays && trendLine.length > 0) {
      datasets.push({
        label: "Trend Line",
        data: trendLine,
        borderColor: "#6366f1",
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0,
        tension: 0,
      });
    }

    // Add risk zones if premium
    if (showOverlays && riskZones.length > 0) {
      datasets.push({
        label: "Risk Zone",
        data: riskZones,
        borderColor: "#ff5577",
        backgroundColor: "rgba(255, 85, 119, 0.1)",
        borderWidth: 0,
        pointRadius: 6,
        pointBackgroundColor: "#ff5577",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        showLine: false,
      });
    }

    return {
      labels: data.map(point =>
        new Date(point.timestamp).toLocaleTimeString()
      ),
      datasets,
    };
  }, [data, symbol, showOverlays, trendLine, riskZones, hovering]);

const chartOptions = useMemo(() => ({
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: { 
      display: hasPremium && showOverlays,
      labels: {
        color: "#aaa",
        font: { size: 11 },
        usePointStyle: true,
      },
    },
    tooltip: { 
      mode: "index" as const, 
      intersect: false,
      backgroundColor: "rgba(15, 23, 42, 0.9)",
      titleColor: "#22ff88",
      bodyColor: "#e2e8f0",
      borderColor: "#22ff88",
      borderWidth: 1,
      padding: 12,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { 
        color: "#aaa",
        maxTicksLimit: 6,
        font: { size: 10 },
      },
    },
    y: {
      grid: { 
        color: "rgba(34,255,136,0.08)",
        drawBorder: false,
      },
      ticks: { 
        color: "#aaa",
        font: { size: 10 },
      },
    },
  },
  animation: {
    duration: hovering ? 200 : 0,
  },
}), [hasPremium, showOverlays, hovering]);

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

// Skeleton loader component
const ChartSkeleton = () => (
  <div className="w-full h-full space-y-4 p-4">
    <div className="flex gap-2 mb-4">
      <div className="h-4 bg-[#1a2436] rounded-full w-24 animate-pulse" />
      <div className="h-4 bg-[#1a2436] rounded-full w-32 animate-pulse" />
    </div>
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-12 bg-[#1a2436] rounded animate-pulse"
          style={{ opacity: 1 - i * 0.15 }}
        />
      ))}
    </div>
    <div className="pt-4">
      <div className="h-20 bg-[#1a2436] rounded-lg animate-pulse" />
    </div>
  </div>
);

// Locked state component
const ChartLocked = () => (
  <div className="w-full h-full flex flex-col items-center justify-center text-center bg-[#0C1322]/50 backdrop-blur-sm rounded-lg">
    <div className="mb-3">
      <svg
        className="w-12 h-12 mx-auto text-gray-500 mb-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm6-10V7a3 3 0 00-3-3H9a3 3 0 00-3 3v4m6-4v4"
        />
      </svg>
    </div>
    <p className="text-sm text-gray-400 font-medium mb-1">
      Advanced Charts Locked
    </p>
    <p className="text-xs text-gray-500 mb-3 max-w-xs">
      Register with a broker to unlock detailed market analysis
    </p>
    <button
      onClick={() => trackEvent("execution_gate_click", {})}
      className="px-3 py-1.5 text-xs rounded-lg
        bg-[#22ff88] text-black font-semibold
        hover:shadow-[0_0_20px_rgba(34,255,136,0.3)]
        transition-all duration-200"
    >
      Unlock Now →
    </button>
  </div>
);

return (
  <div
    className="w-full h-[260px] sm:h-[300px] lg:h-[380px] rounded-2xl
      bg-[#0B1220] border border-[#1F2937]
      overflow-hidden shadow-[inset_0_1px_0_#ffffff08]
      transition-all duration-300 ease-out group
      hover:border-[#22ff88]/50 hover:shadow-[0_0_30px_rgba(34,255,136,0.15)]"
    onMouseEnter={() => !isLocked && setHovering(true)}
    onMouseLeave={() => setHovering(false)}
  >
    {isLocked ? (
      <ChartLocked />
    ) : loading ? (
      <ChartSkeleton />
    ) : error ? (
      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
        <div className="text-center">
          <p className="font-medium mb-1">Data Unavailable</p>
          <p className="text-xs text-gray-500">Check back in a moment</p>
        </div>
      </div>
    ) : (
      <div className="w-full h-full p-3 sm:p-4 flex flex-col">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            {symbol.toUpperCase()} Market
          </h3>
          {hasPremium && (
            <button
              onClick={() => setShowOverlays(!showOverlays)}
              className="text-[10px] px-2 py-1 rounded
                bg-[#1a2636] text-[#22ff88]/70 hover:text-[#22ff88]
                border border-[#22ff88]/20 hover:border-[#22ff88]/40
                transition-all duration-200"
              title="Toggle AI overlays"
            >
              {showOverlays ? "Hide AI" : "Show AI"}
            </button>
          )}
        </div>

        <div className={`flex-1 transition-transform duration-300 ${
          hovering ? "scale-[1.02]" : "scale-100"
        }`}>
          <Line data={chartData} options={chartOptions} />
        </div>

        {hasPremium && showOverlays && data.length > 0 && (
          <div className="mt-2 px-2 pt-2 border-t border-[#1a2636] flex gap-4 text-[10px] text-gray-500">
            <div>
              <span className="text-gray-600">Vol:</span>{" "}
              <span className="text-[#22ff88]">{volatility.toFixed(1)}%</span>
            </div>
            {pricePrediction && (
              <div>
                <span className="text-gray-600">Pred:</span>{" "}
                <span className="text-[#6366f1]">
                  ${pricePrediction.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    )}
  </div>
);}