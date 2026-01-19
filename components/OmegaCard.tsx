"use client";
import { useMemo, useEffect, useState, useCallback } from "react";
import { Coin, SystemMode } from "@/lib/types";
import { scheduler } from "@/lib/scheduler";
import { useAccess } from "@/context/UserAccessContext";
import { animateNumber } from "@/lib";

// Generate realistic AI predictions based on market data
const generateAIPredictions = (coin: Coin, baseValues: number[]) => {
  const lastPrice = baseValues[baseValues.length - 1];
  const avgPrice = baseValues.reduce((a, b) => a + b, 0) / baseValues.length;
  const volatility = Math.sqrt(
    baseValues.reduce((a, p) => a + Math.pow(p - avgPrice, 2), 0) / baseValues.length
  ) / avgPrice * 100;

  const trendDirection = baseValues[baseValues.length - 1] > baseValues[0] ? "bullish" : "bearish";
  const priceChange = ((lastPrice - baseValues[0]) / baseValues[0]) * 100;

  return {
    trend: trendDirection,
    trendConfidence: Math.min(Math.abs(priceChange) / 10 + 0.5, 0.95),
    signal: priceChange > 2 ? "BUY" : priceChange < -2 ? "SELL" : "HOLD",
    signalStrength: Math.min(Math.abs(priceChange) / 15 + 0.4, 0.98),
    riskLevel: volatility > 5 ? "HIGH" : volatility > 3 ? "MEDIUM" : "LOW",
    riskScore: Math.min(volatility / 10, 0.99),
    profitPrediction: lastPrice * (1 + priceChange / 100 + (Math.random() - 0.5) * 0.05),
    profitMargin: Math.min(Math.abs(priceChange) + (Math.random() * 8), 25),
    sessionInsight: coin.risk === "high" ? "Volatile momentum detected" : "Steady accumulation phase",
    volatility: volatility.toFixed(1),
    newsSentiment: Math.random() > 0.4 ? "Bullish" : "Mixed",
  };
};

export const OmegaCard = ({ coin, values, search, onView, systemMode }: any) => {
  const { access, unlockBroker } = useAccess();
  const isLocked = access === "guest";
  const roi = (Math.random() * 40 + 1).toFixed(2);
  const [profit, setProfit] = useState(Math.floor(Math.random() * 5000 + 2000));
  const [hovering, setHovering] = useState(false);
  const [showBrokerModal, setShowBrokerModal] = useState(false);

  // Memoize AI predictions
  const aiPredictions = useMemo(() => {
    return generateAIPredictions(coin, values || []);
  }, [coin, values]);

  useEffect(() => {
    if (systemMode !== "active") return;
    const id = scheduler.register(() => {
      setProfit(p => p + Math.floor(Math.random() * 120));
    }, 1200 + Math.random() * 800);
    return () => {
      scheduler.clear(id);
    };
  }, [systemMode]);

  const handleCardClick = (e: React.MouseEvent) => {
    if (isLocked) {
      e.preventDefault();
      setShowBrokerModal(true);
    }
  };

  const handleUnlockClick = () => {
    unlockBroker();
    setShowBrokerModal(false);
  };

  // Locked Card UI
  const LockedCardOverlay = () => (
    <div className="absolute inset-0 bg-gradient-to-b from-[#0C1322]/70 to-[#0C1322]/90 backdrop-blur-sm flex flex-col items-center justify-center z-20">
      <div className="text-center">
        <div className="text-4xl mb-3">🔒</div>
        <h3 className="text-lg font-bold text-white mb-2">Advanced AI Locked</h3>
        <p className="text-sm text-gray-400 mb-6 max-w-xs">
          Connect a broker to unlock AI predictions, market signals & insights
        </p>
        <button
          onClick={() => setShowBrokerModal(true)}
          className="px-6 py-2 rounded-lg bg-[#22ff88] text-[#0C1322] font-bold text-sm hover:bg-[#22ff88]/90 transition-all"
        >
          Unlock Now →
        </button>
      </div>
    </div>
  );

  // Broker Registration Modal
  const BrokerModal = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#0C1322] border border-[#22ff88]/30 rounded-3xl p-8 max-w-md">
        <h2 className="text-2xl font-bold text-white mb-4">Connect Your Broker</h2>
        <p className="text-gray-400 text-sm mb-6">
          To unlock AI-powered predictions and trade signals, please authenticate with your broker account.
        </p>
        
        <div className="space-y-3 mb-6">
          <button className="w-full px-4 py-3 rounded-lg bg-[#1a2636] border border-[#1F2937] hover:bg-[#1F2937] text-white text-sm font-medium transition">
            📱 Connect Interactive Brokers
          </button>
          <button className="w-full px-4 py-3 rounded-lg bg-[#1a2636] border border-[#1F2937] hover:bg-[#1F2937] text-white text-sm font-medium transition">
            🔗 Connect Alpaca
          </button>
          <button className="w-full px-4 py-3 rounded-lg bg-[#1a2636] border border-[#1F2937] hover:bg-[#1F2937] text-white text-sm font-medium transition">
            📈 Connect Other Broker
          </button>
        </div>

        <button
          onClick={handleUnlockClick}
          className="w-full px-4 py-2 rounded-lg bg-[#22ff88] text-[#0C1322] font-bold text-sm hover:bg-[#22ff88]/90 transition-all mb-3"
        >
          Continue Without Broker (Demo)
        </button>

        <button
          onClick={() => setShowBrokerModal(false)}
          className="w-full px-4 py-2 rounded-lg bg-transparent border border-gray-600 text-gray-300 font-medium text-sm hover:bg-gray-600/20 transition"
        >
          Close
        </button>
      </div>
    </div>
  );

  // Mini Sparkline Chart
  const MiniSparkline = () => {
    if (!values || values.length === 0) return null;
    
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const width = 200;
    const height = 40;
    
    const points = values.map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    }).join(" ");

    const isPositive = values[values.length - 1] >= values[0];

    return (
      <svg width={width} height={height} className="mt-2">
        <polyline
          points={points}
          fill="none"
          stroke={isPositive ? "#22ff88" : "#ff5577"}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        <polyline
          points={points}
          fill={isPositive ? "rgba(34,255,136,0.1)" : "rgba(255,85,119,0.1)"}
          stroke="none"
          opacity="0.3"
        />
      </svg>
    );
  };

  return (
    <div
      className={`relative w-full aspect-[16/10] bg-[#0C1322] border rounded-2xl p-6 shadow-[inset_0_1px_0_#ffffff08] transition-all duration-300 ease-out group overflow-hidden will-change-transform ${
        isLocked
          ? "border-[#1A2636]"
          : "border-[#1A2636] hover:border-[#22ff88]/50 hover:-translate-y-[4px] hover:scale-[1.015] hover:shadow-[0_0_30px_rgba(34,255,136,0.15)]"
      }`}
      onClick={handleCardClick}
      onMouseEnter={() => !isLocked && setHovering(true)}
      onMouseLeave={() => !isLocked && setHovering(false)}
    >
      {isLocked && <LockedCardOverlay />}
      {showBrokerModal && <BrokerModal />}

      {/* ROI Badge */}
      <div className={`absolute top-4 right-4 text-right z-10 transition-opacity ${isLocked ? "opacity-40" : ""}`}>
        <div className="text-[#22ff88] text-[34px] font-extrabold drop-shadow-[0_0_20px_rgba(34,255,136,0.15)]">
          +{roi}%
        </div>
      </div>

      {/* View Behavior Button */}
      <button
        onClick={onView}
        disabled={isLocked}
        className={`absolute bottom-4 right-4 px-4 py-2 rounded-lg text-[12px] font-semibold transition ${
          isLocked
            ? "text-gray-600 border border-gray-700 cursor-not-allowed"
            : "text-[#22ff88] border border-[#22ff88]/40 hover:bg-[#22ff8820]"
        }`}
      >
        View Details
      </button>

      {/* Coin Info */}
      <div className={`flex items-center gap-3 mb-3 transition-opacity ${isLocked ? "opacity-60" : ""}`}>
        <div className="w-9 h-9 rounded-xl bg-[#121926] border border-[#1F2C45] flex items-center justify-center text-[#22ff88] font-semibold text-[15px]">
          {coin.short}
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-white font-semibold text-[15px]">{coin.name}</span>
          <span className="text-[#6F88A8] text-[11px]">{coin.short}</span>
        </div>
      </div>

      {/* AI Predictions Grid */}
      {!isLocked && (
        <div className="grid grid-cols-2 gap-2 mb-3 text-[11px]">
          {/* Market Trend Prediction */}
          <div className="bg-[#1a2a3a]/40 border border-[#22ff88]/20 rounded-lg p-2">
            <div className="text-[#9ca3af] text-[10px] uppercase">Trend</div>
            <div className={`font-bold ${aiPredictions.trend === "bullish" ? "text-[#22ff88]" : "text-[#ff5577]"}`}>
              {aiPredictions.trend.toUpperCase()}
            </div>
            <div className="text-[#6f88a8] text-[9px]">
              {(aiPredictions.trendConfidence * 100).toFixed(0)}% confidence
            </div>
          </div>

          {/* Trade Signal */}
          <div className="bg-[#1a2a3a]/40 border border-[#22ff88]/20 rounded-lg p-2">
            <div className="text-[#9ca3af] text-[10px] uppercase">Signal</div>
            <div className={`font-bold ${
              aiPredictions.signal === "BUY" ? "text-[#22ff88]" : 
              aiPredictions.signal === "SELL" ? "text-[#ff5577]" : 
              "text-[#fbbf24]"
            }`}>
              {aiPredictions.signal}
            </div>
            <div className="text-[#6f88a8] text-[9px]">
              {(aiPredictions.signalStrength * 100).toFixed(0)}% strength
            </div>
          </div>

          {/* Risk Prediction */}
          <div className="bg-[#1a2a3a]/40 border border-[#22ff88]/20 rounded-lg p-2">
            <div className="text-[#9ca3af] text-[10px] uppercase">Risk</div>
            <div className={`font-bold ${
              aiPredictions.riskLevel === "HIGH" ? "text-[#ff5577]" : 
              aiPredictions.riskLevel === "MEDIUM" ? "text-[#fbbf24]" : 
              "text-[#22ff88]"
            }`}>
              {aiPredictions.riskLevel}
            </div>
            <div className="text-[#6f88a8] text-[9px]">
              Vol: {aiPredictions.volatility}%
            </div>
          </div>

          {/* Profit Prediction */}
          <div className="bg-[#1a2a3a]/40 border border-[#22ff88]/20 rounded-lg p-2">
            <div className="text-[#9ca3af] text-[10px] uppercase">Profit</div>
            <div className="text-[#22ff88] font-bold">
              +{aiPredictions.profitMargin.toFixed(1)}%
            </div>
            <div className="text-[#6f88a8] text-[9px]">
              Est. margin
            </div>
          </div>
        </div>
      )}

      {/* Session Insights & Sentiment */}
      {!isLocked && (
        <div className="grid grid-cols-2 gap-2 mb-3 text-[11px]">
          <div className="bg-[#0a1620]/60 border border-[#1F2C45] rounded-lg p-2">
            <div className="text-[#6f88a8] text-[10px] mb-1">📊 Session Insight</div>
            <div className="text-white text-[10px] leading-tight">
              {aiPredictions.sessionInsight}
            </div>
          </div>

          <div className="bg-[#0a1620]/60 border border-[#1F2C45] rounded-lg p-2">
            <div className="text-[#6f88a8] text-[10px] mb-1">📰 News Sentiment</div>
            <div className={`text-[10px] leading-tight font-semibold ${
              aiPredictions.newsSentiment === "Bullish" ? "text-[#22ff88]" : "text-[#fbbf24]"
            }`}>
              {aiPredictions.newsSentiment}
            </div>
          </div>
        </div>
      )}

      {/* Interactive Sparkline */}
      {!isLocked && <MiniSparkline />}

      {/* Stats Footer */}
      <div className={`grid grid-cols-3 pt-4 border-t border-[#1c2b3d] text-center transition-opacity ${isLocked ? "opacity-50" : ""}`}>
        <div className="flex flex-col items-center">
          <span className="text-[#7B8A9D] text-[11px] mb-1">Capital</span>
          <span className="text-white text-[16px] font-semibold">+{profit}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[#7B8A9D] text-[11px] mb-1">Volatility</span>
          <span className="text-[#22ff88] text-[16px] font-semibold">
            {isLocked ? "—" : aiPredictions.volatility}%
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[#7B8A9D] text-[11px] mb-1">Status</span>
          <span className={`text-[16px] font-semibold ${
            isLocked ? "text-gray-600" : "text-[#22ff88]"
          }`}>
            {isLocked ? "Locked" : "Active"}
          </span>
        </div>
      </div>
    </div>
  );
};
