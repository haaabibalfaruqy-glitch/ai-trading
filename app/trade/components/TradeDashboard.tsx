"use client";

import { useState, useEffect, useMemo } from "react";
import OmegaCardWrapper from "./OmegaCardWrapper";
import HeroSection from "./HeroSection";
import SystemStatusPanel from "./SystemStatusPanel";
import LiveProfitTableWrapper from "./LiveProfitTableWrapper";
import { calculateTrend, Trend } from "./TrendCalculator";

interface Coin {
  name: string;
  short: string;
  risk: "low" | "medium" | "high";
  timeframe: "scalp" | "long";
}

export default function TradeDashboard() {
  const [realSeries, setRealSeries] = useState<number[] | null>(null);
  const [liveData, setLiveData] = useState<number[][]>([]);
  const [trend, setTrend] = useState<Trend>("neutral");
  const [search, setSearch] = useState("");
  const N = 20;

  const coins: Coin[] = useMemo(() => {
    return Array.from({ length: 200 }).map((_, i) => ({
      name: `COIN-${i + 1}`,
      short: `C${i + 1}`,
      risk: i % 3 === 0 ? "low" : i % 3 === 1 ? "medium" : "high",
      timeframe: i % 2 === 0 ? "scalp" : "long",
    }));
  }, []);

  const handleView = (coin: Coin, values: number[]) => {
    const newTrend = calculateTrend(values);
    setTrend(newTrend);
  };

  return (
    <div>
      <HeroSection heroProfit={123456} bigWin={"BIG WIN"} />
      <SystemStatusPanel systemMode={"active"} trend={trend} />

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coins.map((coin, idx) => (
          <OmegaCardWrapper
            key={coin.short}
            coin={coin}
            idx={idx}
            realSeries={realSeries}
            liveData={liveData}
            N={N}
            search={search}
            systemMode={"active"}
            onView={() => handleView(coin, realSeries?.slice(-N) || liveData[idx])}
          />
        ))}
      </section>

      <LiveProfitTableWrapper />
    </div>
  );
}
