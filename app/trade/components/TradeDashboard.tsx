"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";

import HeroSection from "./HeroSection";
import SystemStatusPanel from "./SystemStatusPanel";
import LiveProfitTableWrapper from "./LiveProfitTableWrapper";
import OmegaCardWrapper from "./OmegaCardWrapper";
import Sparkline from "./Sparkline";
import { renderTrend } from "./TrendCalculator";

import { scheduler } from "@/lib/scheduler";
import { fetchMarketSeries, smoothSeries, generateMarketInsightFromSeries, mapTrendToDirection, loadCoinOrder, saveCoinOrder, trackEvent } from "@/lib";
import { BROKERS, SystemMode, CapitalMode } from "@/lib/brokers";

export default function TradeDashboard() {
  const router = useRouter();

  // ===================== ACCESS & UI STATE =====================
  const [unlocked, setUnlocked] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [risk, setRisk] = useState<"all" | "low" | "medium" | "high">("all");
  const [timeframe, setTimeframe] = useState<"all" | "scalp" | "long">("all");
  const [page, setPage] = useState(1);

  const [coinOrder, setCardOrder] = useState<string[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const [observedCoin, setObservedCoin] = useState<{ coin: any; values: number[] } | null>(null);
  const [realSeries, setRealSeries] = useState<number[] | null>(null);
  const [trend, setTrend] = useState<"bullish" | "bearish" | "neutral">("neutral");
  const [viralInsight, setViralInsight] = useState<string | null>(null);
  const [shareText, setShareText] = useState<string | null>(null);
  const [loadingRealData, setLoadingRealData] = useState(false);
  const [cinemaMode, setCinemaMode] = useState(false);
  const [analysisVisible, setAnalysisVisible] = useState(false);
  const analysisRef = useRef<HTMLDivElement | null>(null);

  const [systemMode, setSystemMode] = useState<SystemMode>("idle");
  const [capitalMode, setCapitalMode] = useState<CapitalMode>("Adaptive Growth");
  const [bigWin, setBigWin] = useState<string | null>(null);
  const [heartbeat, setHeartbeat] = useState(0);

  const exitFiredRef = useRef(false);
  const trustCountRef = useRef(0);
  const [trustPulse, setTrustPulse] = useState<string | null>(null);

  // ===================== INITIALIZATION =====================
  useEffect(() => {
    const isUnlocked = localStorage.getItem("tradeUnlocked") === "true";
    if (!isUnlocked) {
      localStorage.setItem("tradeUnlocked", "true");
      localStorage.setItem("tradeUnlockedAt", String(Date.now()));
    }

    const savedOrder = loadCoinOrder();
    if (savedOrder) setCardOrder(savedOrder);
    setUnlocked(true);
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ===================== DRAG & DROP =====================
  const handleDragStart = (e: React.DragEvent, coinName: string, idx: number) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", coinName);
    setDraggedIndex(idx);
  };
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(idx);
  };
  const handleDrop = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === idx) return setDraggedIndex(null);

    const newOrder = [...coinOrder];
    const [dragged] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(idx, 0, dragged);

    setCardOrder(newOrder);
    saveCoinOrder(newOrder);
    setDraggedIndex(null);
    setDragOverIndex(null);

    trackEvent("card_reordered", { from: draggedIndex, to: idx });
  };
  const handleDragLeave = () => setDragOverIndex(null);

  // ===================== MARKET SERIES FETCH =====================
  useEffect(() => {
    if (!observedCoin) return;
    setLoadingRealData(true);

    fetchMarketSeries("bitcoin")
      .then(points => {
        const prices = points.map(p => p.price);
        setRealSeries(smoothSeries(prices));

        if (prices.length > 2) {
          const delta = prices[prices.length - 1] - prices[0];
          const computedTrend = delta > 0 ? "bullish" : delta < 0 ? "bearish" : "neutral";
          setTrend(computedTrend);

          const insight = generateMarketInsightFromSeries(prices);
          setViralInsight(insight);

          setShareText(`🤖 AI detected a market move. Unlock full reasoning → ${window.location.origin}/trade`);
          trackEvent("insight_generated", { trend: mapTrendToDirection(computedTrend), rawTrend: computedTrend });
        }
      })
      .catch(console.error)
      .finally(() => setLoadingRealData(false));
  }, [observedCoin]);

  // ===================== ANALYSIS SCROLL & HIGHLIGHT =====================
  useEffect(() => {
    if (!observedCoin) return;

    setAnalysisVisible(false);
    setCinemaMode(false);
    analysisRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    setTimeout(() => {
      setAnalysisVisible(true);
      setCinemaMode(true);
    }, 220);
  }, [observedCoin]);

  // ===================== HEARTBEAT =====================
  useEffect(() => {
    const id = scheduler.register(() => setHeartbeat(v => v + 1), 2000);
    return () => scheduler.clear(id);
  }, []);

  // ===================== BIG WIN SIMULATION =====================
  useEffect(() => {
    const id = scheduler.register(() => {
      const user = `user${Math.floor(Math.random() * 5000)}`;
      const profit = Math.floor(Math.random() * 8000 + 2000);
      setBigWin(`${user} +$${profit} WIN`);
      setTimeout(() => setBigWin(null), 2000);
    }, 9000);
    return () => scheduler.clear(id);
  }, []);

  // ===================== EXIT GUARD =====================
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (exitFiredRef.current || capitalMode === "Preservation") return;
      if (e.clientY <= 0) {
        exitFiredRef.current = true;
        // Show exit modal
      }
    };
    const handleVisibility = () => {
      if (exitFiredRef.current) return;
      if (document.visibilityState === "hidden") exitFiredRef.current = true;
    };
    window.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [capitalMode]);

  // ===================== RENDER =====================
  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      <HeroSection heroProfit={1284392} bigWin={bigWin} />

      <SystemStatusPanel systemMode={systemMode} />

      <LiveProfitTableWrapper enabled={systemMode === "active"} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <OmegaCardWrapper
          coinList={coinOrder}
          observedCoin={observedCoin}
          setObservedCoin={setObservedCoin}
          cinemaMode={cinemaMode}
          handleDragStart={handleDragStart}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          handleDragLeave={handleDragLeave}
        />
      </div>

      {observedCoin && realSeries && (
        <div ref={analysisRef}>
          <Sparkline values={realSeries} trend={trend} />
        </div>
      )}
    </div>
  );
}
