"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchMarketSeries } from "@/lib/market";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import AISessionContext from "@/components/AISessionContext";
import ExecutionGate from "@/components/ExecutionGate";
import AITimeline from "@/components/AITimeline";
import { BROKERS, BrokerKey } from "@/lib/brokers";
import SessionDepthBar from "@/components/SessionDepthBar";
import { trackEvent } from "@/lib/events";
import {
  getFunnelState,
  subscribeFunnel,
} from "@/lib/events";

import { 
  SystemMode, 
  CapitalMode, 
  MarketSnapshot, 
  Trend,
  ObservedCoin 
} from "@/lib/types";

import { scheduler } from "@/lib/scheduler";
import { generateMarketInsight } from "@/lib/insight";
import { buildShareText } from "@/lib/share";
import {
  hasPremiumAccess,
  unlockPremium,
  getPremiumExpire,
} from "@/lib/premium";
import { MEMBERSHIP } from "@/lib/membership";

// ================= DRAG-AND-DROP HELPERS =================
const saveCoinOrder = (order: string[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("coinOrder", JSON.stringify(order));
  }
};

const loadCoinOrder = (): string[] | null => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("coinOrder");
    return saved ? JSON.parse(saved) : null;
  }
  return null;
};

const isBrowser = typeof window !== "undefined";


const mapTrendToSignal = (
  trend: "bullish" | "bearish" | "neutral"
): "up" | "down" | "flat" => {
  if (trend === "bullish") return "up";
  if (trend === "bearish") return "down";
  return "flat";
};
const DEFAULT_BROKER: BrokerKey = "binance";
const EXECUTION_LIMIT = false;

function redirectToBroker(broker: BrokerKey) {
  if (typeof window === "undefined") return;

  const last = sessionStorage.getItem("lastAffiliateRedirect");
  const now = Date.now();

  const unlocked = sessionStorage.getItem("executionUnlocked") === "true";
  if (!unlocked) return;

  if (last && now - Number(last) < 1000 * 60 * 60 * 6) return;

  sessionStorage.setItem("lastAffiliateRedirect", String(now));
  window.location.href = BROKERS[broker].affiliateUrl;
}

// ================= PERFORMANCE GUARD (STEP 19 — ELITE) =================
const intervalRegistry = new Set<number>();

const safeInterval = (fn: () => void, delay: number) => {
  const id = window.setInterval(fn, delay);
  intervalRegistry.add(id);
  return id;
};

const clearAllIntervals = () => {
  intervalRegistry.forEach(clearInterval);
  intervalRegistry.clear();
};

const readSession = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeSession = (key: string, value: any) => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(key, JSON.stringify(value));
};

// ================= META-LOGIC TYPES =================
// ❌ DELETE THESE - They're already imported above
// type MarketSnapshot = {
//   volatility: number;     // 0 - 100
//   trendStrength: number;  // 0 - 100
//   drawdown: number;       // %
// };

// type CapitalMode =
//   | "Preservation"
//   | "Adaptive Growth"
//   | "Aggressive Expansion";

// type SystemMode =
//   | "idle"
//   | "active"
//   | "error";

// =========================================
// SMOOTH NUMBER ANIMATION (NO LIBRARY)
// =========================================
const animateNumber = (
  from: number,
  to: number,
  duration: number,
  onUpdate: (v: number) => void
) => {
  const start = typeof performance !== "undefined"
    ? performance.now()
    : Date.now();

  const tick = (now: number) => {
    const progress = Math.min((now - start) / duration, 1);
    const value = from + (to - from) * progress;
    onUpdate(value);

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};


const StatItem = ({
  value,
  label,
  live,
  dot,
  icon
}: {
  value: string;
  label: string;
  live?: boolean;
  dot?: boolean;
  icon?: string;
}) => (
  <div className="flex items-center gap-2">
    {live && (
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute h-full w-full rounded-full bg-[#22ff88] opacity-75" />
        <span className="relative h-2 w-2 rounded-full bg-[#22ff88]" />
      </span>
    )}

    {dot && <span className="w-2 h-2 rounded-full bg-[#22ff88]/70 animate-pulse" />}
    {icon && <span>{icon}</span>}

    <span className="font-medium text-white/70">{value}</span>
    <span className="text-gray-500">{label}</span>
  </div>
);

// ================= META-LOGIC SENSOR =================
const evaluateMarket = (): MarketSnapshot => {
  return {
    volatility: Math.floor(Math.random() * 100),
    trendStrength: Math.floor(Math.random() * 100),
    drawdown: Math.floor(Math.random() * 20),
  };
};

// ================= META-LOGIC GOVERNANCE =================
const decideCapitalMode = (
  snapshot: MarketSnapshot
): CapitalMode => {
  const { volatility, trendStrength, drawdown } = snapshot;

  if (drawdown > 12 || volatility > 70) {
    return "Preservation";
  }

  if (trendStrength > 65 && volatility < 50) {
    return "Aggressive Expansion";
  }

  return "Adaptive Growth";
};

// =========================================
// HERO VISUAL — DECORATIVE ONLY (STEP 1)
// =========================================
const HeroVisual = () => {
  return (
    <div
      className="
        relative
        w-full h-[420px]
        rounded-3xl
        bg-[#0B1220]
        border border-[#1F2937]
        overflow-hidden
        shadow-[0_40px_120px_rgba(0,0,0,0.45)]
        cursor-default
      "
    >
      {/* SOFT GREEN GLOW */}
      <div
        className="
          absolute -top-24 -right-24
          w-[360px] h-[360px]
          bg-[#22ff88]/12
          blur-[140px]
          rounded-full
        "
      />

      {/* SUBTLE GRID */}
      <div
        className="
          absolute inset-0
          opacity-[0.04]
          bg-[linear-gradient(to_right,#22ff88_1px,transparent_1px),
              linear-gradient(to_bottom,#22ff88_1px,transparent_1px)]
          bg-[size:40px_40px]
        "
      />

      {/* CENTER ORB */}
      <div
        className="
          absolute top-1/2 left-1/2
          -translate-x-1/2 -translate-y-1/2
          w-[180px] h-[180px]
          rounded-full
          bg-[#22ff88]/10
          blur-[90px]
        "
      />
    </div>
  );
};

// =========================================
// SYSTEM STATUS — RIGHT HERO PANEL
// =========================================
const SystemStatus = ({ systemMode }: { systemMode: SystemMode }) => {
  return (
    <div
      className="
    w-full
    bg-[#0B1220]
    border border-[#1F2937]
    rounded-2xl
    px-5 py-4
    shadow-[inset_0_1px_0_#ffffff08]
    transition-all duration-300
    hover:border-[#22ff88]
    hover:shadow-[0_0_40px_rgba(34,255,136,0.15)]
  "
    >

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] uppercase tracking-widest text-gray-500">
          Capital Behavior Status
        </span>

        <span className="flex items-center gap-1 text-[11px] text-[#22ff88]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22ff88] animate-pulse" />
          Live
        </span>
      </div>

      {/* ITEMS */}
      <div className="grid grid-cols-2 gap-4 text-[12px]">
        <div className="flex flex-col">
          <span className="text-gray-400">Execution Engine</span>
          <span className="text-white font-semibold">
            {systemMode === "active" ? "Active" : "Idle"}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-400">Active Behavior Modules</span>
          <span className="text-white font-semibold">284</span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-400">Execution Responsiveness</span>
          <span className="text-white font-semibold">&lt; 20ms</span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-400">Capital Oversight</span>
          <span className="text-white font-semibold">24/7</span>
        </div>
      </div>
    </div>
  );
};


// =========================================
// SPARKLINE OMEGA–INFINITY (NO TABLE BG)
// =========================================
const renderSparkline = (
  values: number[],
  trend?: "bullish" | "bearish" | "neutral"
) => {
  const width = 320;
  const height = 110;

  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const volatility =
    values.reduce((a, v, i, arr) =>
      i ? a + Math.abs(v - arr[i - 1]) : 0,
      0) / values.length;

  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#22ff8850" />
          <stop offset="100%" stopColor="#22ff88" />
        </linearGradient>
      </defs>

      {volatility > 12 && (
        <polyline
          points={points}
          stroke="#22ff8830"
          strokeWidth={6}
          fill="none"
          className="blur-[6px]"
        />
      )}

      <polyline
        points={points}
        stroke={
          trend === "bullish"
            ? "#22ff88"
            : trend === "bearish"
              ? "#ff5577"
              : "#94a3b8"
        }
        strokeWidth={2.6}
        fill="none"
        strokeLinecap="round"
      />

      {/* END POINT */}
      <circle
        cx={width}
        cy={
          height -
          ((values[values.length - 1] - min) / range) * height
        }
        r="3"
        fill={
          trend === "bullish"
            ? "#22ff88"
            : trend === "bearish"
              ? "#ff5577"
              : "#94a3b8"
        }
        className="animate-pulse"
      />
    </svg>
  );
};

// =========================================
// CARD SKELETON LOADING
// =========================================
const OmegaCardSkeleton = () => {
  return (
    <div
      className="
        w-full aspect-[16/10]
        bg-[#0B0F18]
        border border-[#162032]
        rounded-2xl p-6
        animate-pulse
      "
    >
      {/* TOP */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl bg-[#1a2436]" />
        <div className="flex flex-col gap-2">
          <div className="w-24 h-3 bg-[#1a2436] rounded" />
          <div className="w-14 h-2 bg-[#1a2436] rounded" />
        </div>
      </div>

      {/* TAGS */}
      <div className="flex gap-2 mb-3">
        <div className="w-16 h-5 bg-[#1a2436] rounded-full" />
        <div className="w-20 h-5 bg-[#1a2436] rounded-full" />
      </div>

      {/* SPARKLINE */}
      <div className="w-full h-[115px] flex items-center mb-4">
        <div className="w-full h-[2px] bg-[#1a2436]" />
      </div>

      {/* ROI */}
      <div className="mb-4 text-center">
        <div className="w-20 h-3 bg-[#1a2436] rounded mx-auto mb-2" />
        <div className="w-28 h-6 bg-[#1a2436] rounded mx-auto" />
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#1c2b3d]">
        <div className="h-8 bg-[#1a2436] rounded" />
        <div className="h-8 bg-[#1a2436] rounded" />
        <div className="h-8 bg-[#1a2436] rounded" />
      </div>
    </div>
  );
};

const highlightText = (text: string, query: string) => {
  if (!query) return text;

  let qi = 0;

  return text.split("").map((char, i) => {
    const match =
      qi < query.length &&
      char.toLowerCase() === query[qi].toLowerCase();

    if (match) qi++;

    return (
      <span
        key={i}
        className={
          match
            ? "text-[#22ff88] drop-shadow-[0_0_6px_rgba(34,255,136,0.6)] transition"
            : ""
        }
      >
        {char}
      </span>
    );
  });
};

// =========================================
// CARD OMEGA–INFINITY – FINAL GODMODE
// =========================================
const OmegaCard = ({ coin, values, search, onView, systemMode }: any) => {
  const roi = (Math.random() * 40 + 1).toFixed(2);
  const [profit, setProfit] = useState(
    Math.floor(Math.random() * 5000 + 2000)
  );

  const isBullish = Math.random() > 0.5;

  const cardTrend =
    values[values.length - 1] > values[0]
      ? "bullish"
      : values[values.length - 1] < values[0]
        ? "bearish"
        : "neutral";
  
    useEffect(() => {
  if (systemMode !== "active") return;

  const id = scheduler.register(() => {
    setProfit(p => p + Math.floor(Math.random() * 120));
  }, 1200 + Math.random() * 800);

  return () => scheduler.clear(id);
}, [systemMode]);

  useEffect(() => {
    if (systemMode !== "active") return;

    const id = scheduler.register(() => {
      setProfit((prev) => {
        const next = prev + Math.floor(Math.random() * 500);

        animateNumber(prev, next, 900, (v) => {
          setProfit(Math.floor(v));
        });

        return next;
      });
    }, 2000);

    return () => scheduler.clear(id);
  }, [systemMode]);


  return (
    <div
      className="
    relative w-full aspect-[16/10]
    bg-[#0C1322]
    border border-[#1A2636]
    rounded-2xl p-6
    shadow-[inset_0_1px_0_#ffffff08]
    transition-all duration-300 ease-out
    hover:-translate-y-[4px]
    hover:scale-[1.015]
    group overflow-hidden
    will-change-transform
  "
    >

      {/* SOFT CORNER LIGHT */}
      <div
        className="
    pointer-events-none
    absolute -top-24 -left-24
    w-[220px] h-[220px]
    bg-slate-200/10
    blur-[90px]
    rounded-full
    opacity-0
    group-hover:opacity-100
    transition-opacity duration-300
  "
      />

      {/* ROI TOP RIGHT */}
      <div className="absolute top-4 right-4 text-right z-10">
        <div
          className="
    text-[#22ff88] text-[34px] font-extrabold
    transition-all duration-300
    group-hover:-translate-y-1
   drop-shadow-[0_0_20px_rgba(34,255,136,0.15)]
  "
        >
          +{roi}%
        </div>
        <div className="text-[11px] text-[#7B8A9D] mt-1">
          Return (1h-59m)
        </div>
      </div>

      {/* VIEW BUTTON */}
      <button
        onClick={onView}
        className="
    absolute bottom-4 right-4
    px-4 py-2 rounded-lg
    text-[12px] font-semibold
    text-[#22ff88]
    border border-[#22ff88]/40
    hover:bg-[#22ff8820]
    transition
  "
      >
        View Behavior
      </button>

      {/* TOP */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="
            w-9 h-9 rounded-xl
            bg-[#121926]
            border border-[#1F2C45]
            flex items-center justify-center
            text-[#22ff88]
            font-semibold text-[15px]
          "
        >
          {coin.short}
        </div>

        <div className="flex flex-col leading-tight">
          <span className="text-white font-semibold text-[15px]">
            {highlightText(coin.name, search)}
          </span>
          <span className="text-[#6F88A8] text-[11px]">
            {highlightText(coin.short, search)}
          </span>

        </div>
      </div>

      {coin.aiPick && (
        <span className="
    inline-flex items-center gap-1
    mb-2
    px-2 py-0.5 rounded-full
    bg-[#22ff8820]
    text-[#22ff88]
    text-[11px] font-semibold
  ">
          System Preferred
        </span>
      )}

      {/* TAGS */}
      <div className="flex gap-2 mb-2">
        <span
          className="
            px-2.5 py-0.5 text-[11px]
            rounded-full
            bg-[#132034]
            text-[#8FBFFF]
            border border-[#1D3350]
          "
        >
          Longer
        </span>

        <span
          className="
            px-2.5 py-0.5 text-[11px]
            rounded-full
            bg-[#232A3C]
            text-[#B4C2FF]
            border border-[#303C58]
          "
        >
          Aggressive
        </span>
      </div>

      {/* SPARKLINE */}
      <div className="w-full h-[115px] flex justify-center mb-3 overflow-hidden">
        <div
          className="
      transition-transform duration-300 ease-out
      group-hover:scale-[1.06]
    "
        >
          {renderSparkline(values, cardTrend)}
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 pt-4 border-t border-[#1c2b3d] text-center">
        <div className="flex flex-col items-center">
          <span className="text-[#7B8A9D] text-[11px] mb-1">
            Capital Change
          </span>
          <span className="text-white text-[16px] font-semibold tabular-nums transition-all duration-300">
            +{profit}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[#7B8A9D] text-[11px] mb-1 tabular-nums transition-all duration-300">
            Volume
          </span>
          <span className="text-white text-[16px] font-semibold">
            --
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[#7B8A9D] text-[11px] mb-1">
            Market Bias
          </span>

          <span
            className={`text-[15px] font-semibold tracking-wide ${isBullish ? "text-[#22ff88]" : "text-[#ff5577]"
              }`}
          >
            {isBullish ? "Bullish" : "Bearish"}
          </span>
        </div>
      </div>
    </div>
  );
};

// =========================================
// MAIN PAGE
// =========================================
const LiveProfitTable = ({ enabled }: { enabled: boolean }) => {
  const listRef = useRef<HTMLDivElement | null>(null);

  const randomUser = useCallback(
    () => `user${Math.floor(Math.random() * 5000) + 1}`,
    []
  );

  const generateRows = useCallback(() => (
    Array.from({ length: 8 }).map(() => ({
      id: crypto.randomUUID(),
      user: randomUser(),
      roi: (Math.random() * 30 + 5).toFixed(2),
      profit: (Math.random() * 3000 + 500).toFixed(0),
      status: Math.random() > 0.5 ? "WIN" : "LOSS",
    }))
  ), [randomUser]);

  const [rows, setRows] = useState(() => generateRows());
  const [updatedAt, setUpdatedAt] = useState("just now");

  useEffect(() => {
    if (!enabled) return;

    const id = scheduler.register(() => {
      setRows(generateRows());
      setUpdatedAt("just now");
    }, 2500);

    return () => scheduler.clear(id);
  }, [enabled, generateRows]);

  return (
    <div className="
      bg-[#0B0F18]
      border border-[#1F2937]
      rounded-2xl
      p-4
      max-h-[260px]
      overflow-hidden
    ">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#22ff88]/70 rounded-full animate-pulse" />
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-[#22ff88]">
              Real-time capital behavior events
            </h3>
            <p className="text-[11px] text-gray-400">
  Simulated execution flow
</p>
          </div>
        </div>
        <span className="text-[11px] text-gray-400">
          {updatedAt}
        </span>
      </div>

      {/* ROWS */}
      <div
  ref={listRef}
  className="space-y-2 overflow-y-auto max-h-[200px] pr-1"
>
{rows.map((r) => (
  <div
    key={r.id}
    className="
      group
      grid grid-cols-4 items-center
      text-[12px]
      px-2 py-1.5
      rounded-md
      bg-[#0F172A]
      border border-[#1C2A3D]
      transition-all duration-300
      hover:bg-[#162032]
      hover:scale-[1.01]
    "
  >
            {/* USER */}
            <span className="text-white font-medium">
              {r.user}
            </span>

            {/* ROI */}
            <span className="text-[#22ff88]">
              +{r.roi}%
            </span>

{/* PROFIT */}
<span
  className="
    text-gray-300
    tabular-nums
    transition-all duration-300
    group-hover:text-[#22ff88]
  "
>
  +${r.profit}
</span>      

            {/* STATUS */}
            <span className="flex items-center justify-end gap-1">
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-semibold
                  ${r.status === "WIN"
                    ? "bg-[#22ff8820] text-[#22ff88]"
                    : "bg-[#ff557720] text-[#ff5577]"
                  }
                `}
              >
                {r.status}
              </span>
              <span
                className={
                  r.status === "WIN"
                    ? "text-[#22ff88]"
                    : "text-[#ff5577]"
                }
              >
                {r.status === "WIN" ? "▲" : "▼"}
              </span>
            </span>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <p className="text-[11px] text-gray-400 mt-2">
        Last update: just now
      </p>
      <p className="text-[10px] text-gray-500 mt-1">
        Execution log — not performance claims.
      </p>

    </div>
  );
};

const RISK_ORDER = {
  low: 1,
  medium: 2,
  high: 3,
} as const;

function smoothSeries(
  data: number[],
  alpha: number = 0.2
): number[] {
  if (data.length === 0) return [];

  const result: number[] = [data[0]];

  for (let i = 1; i < data.length; i++) {
    result.push(
      alpha * data[i] + (1 - alpha) * result[i - 1]
    );
  }

  return result;
}


export default function TradePage() {
useEffect(() => {
  return () => {
    scheduler.clearAll();
    console.log("[CLEANUP] All intervals cleared");
  };
}, []);

  const router = useRouter();

  const [accessGranted, setAccessGranted] = useState(false);
  const [ready, setReady] = useState(false);

  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const isUnlocked =
      localStorage.getItem("tradeUnlocked") === "true";

    if (!isUnlocked) {
      localStorage.setItem("tradeUnlocked", "true");
      localStorage.setItem(
        "tradeUnlockedAt",
        String(Date.now())
      );
    }

    // Load saved card order
    const saved = loadCoinOrder();
    if (saved) {
      setCardOrder(saved);
    }

    setUnlocked(true);
  }, []);

const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const check = () => setIsMobile(window.innerWidth < 768);
  check();
  window.addEventListener("resize", check);
  return () => window.removeEventListener("resize", check);
}, []);

  const coinList = useMemo(() => {
    return Array.from({ length: 200 }).map((_, i) => {
      return {
        name: `COIN-${i + 1}`,
        short: `C${i + 1}`,
        risk: (
          i % 3 === 0
            ? "low"
            : i % 3 === 1
              ? "medium"
              : "high"
        ) as "low" | "medium" | "high",
        timeframe: i % 2 === 0 ? "scalp" : "long",
      };
    });
  }, []);

  const initialData = useMemo(() => {
    return Array.from({ length: 200 }).map(() =>
      Array.from({ length: 20 }).map(
        () => Math.floor(Math.random() * 100) + 20
      )
    );
  }, []);
  const [liveData, setLiveData] = useState(initialData);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [risk, setRisk] = useState<"all" | "low" | "medium" | "high">("all");
  const [timeframe, setTimeframe] = useState<"all" | "scalp" | "long">("all");
  const [heartbeat, setHeartbeat] = useState(0);
  const [resurrectedUser, setResurrectedUser] = useState(false);
  const [heroProfit, setHeroProfit] = useState<number>(1284392);
  const [bigWin, setBigWin] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [realSeries, setRealSeries] = useState<number[] | null>(null);
  const [shareText, setShareText] = useState<string | null>(null);
  const [loadingRealData, setLoadingRealData] = useState(false);
  const [showExecutionGate, setShowExecutionGate] = useState(false);
  const [viralInsight, setViralInsight] = useState<string | null>(null);
  const [showExitGuard, setShowExitGuard] = useState(false);
  const exitFiredRef = useRef(false);
  const trustCountRef = useRef(0);
  const [trustPulse, setTrustPulse] = useState<string | null>(null);
  const [systemMode, setSystemMode] = useState<SystemMode>("idle");
  
  // ================= META-LAYER (SIMULATION) =================
  const [capitalMode, setCapitalMode] = useState<
    "Preservation" | "Adaptive Growth" | "Aggressive Expansion"
  >("Adaptive Growth");
  const [observedCoin, setObservedCoin] = useState<{
    coin: any;
    values: number[];
  } | null>(null);
  const analysisRef = useRef<HTMLDivElement | null>(null);
  const [analysisVisible, setAnalysisVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(999999);
  const [isReturningPremium, setIsReturningPremium] = useState(false);
  const [highlightAnalysis, setHighlightAnalysis] = useState(false);
  const [cinemaMode, setCinemaMode] = useState(false);
  const [trend, setTrend] = useState<
    "bullish" | "bearish" | "neutral"
  >("neutral");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [cardOrder, setCardOrder] = useState<string[]>([]);
  const isRunning = systemMode === "active";
  const showEmptyState = systemMode === "idle";
  const percentChange =
    realSeries && realSeries.length > 1
      ? (
        ((realSeries[realSeries.length - 1] -
          realSeries[0]) /
          realSeries[0]) *
        100
      ).toFixed(2)
      : null;

  const [funnel, setFunnel] = useState(null);

  useEffect(() => {
    setFunnel(getFunnelState());
  }, []);

  useEffect(() => {
    const id = scheduler.register(() => {
      const user = `user${Math.floor(Math.random() * 5000)}`;
      const profit = Math.floor(Math.random() * 8000 + 2000);
      setBigWin(`${user} +$${profit} WIN`);
      setTimeout(() => setBigWin(null), 2000);
    }, 9000);

    return () => scheduler.clear(id);
  }, []);

  useEffect(() => {
    return subscribeFunnel(() => {
      setFunnel(getFunnelState());
    });
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      trackEvent("premium_trial_expired", {
        action: "redirect_to_broker",
      });

      sessionStorage.setItem("premiumExpired", "true");

      //window.location.href = BROKERS.binance.affiliateUrl;
    }
  }, [timeLeft]);


  useEffect(() => {
    const expire = getPremiumExpire();
    if (!expire) return;


    const interval = setInterval(() => {
      const diff = expire - Date.now();
      setTimeLeft(diff > 0 ? diff : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  //useEffect(() => {
  //if (hasPremiumAccess()) {
  // setIsReturningPremium(true);

  // trackEvent("premium_returning_user", {
  // source: "trade_page",
  // });
  //}
  //}, []);

  useEffect(() => {
    if (!viralInsight || !observedCoin) return;

    trackEvent("insight_viewed", {
      symbol: observedCoin.coin.short,
    });
  }, [viralInsight]);

  useEffect(() => {
    const unlockedAt = sessionStorage.getItem("tradeUnlockedAt");
    sessionStorage.removeItem("premiumExpired");

    if (unlockedAt) {
      trackEvent("return_from_broker", {
        delta: Date.now() - Number(unlockedAt),
      });
    }
  }, []);

  useEffect(() => {
    const expired = sessionStorage.getItem("premiumExpired") === "true";

    if (expired && hasPremiumAccess()) {
      setResurrectedUser(true);

      trackEvent("user_resurrected", {
        source: "trade_page",
      });
    }
  }, []);

  useEffect(() => {
    const id = scheduler.register(() => {
      if (trustCountRef.current >= 3) return;

      trustCountRef.current += 1;

      const messages = [
        "Execution latency under 20ms",
        "Risk governance active",
        "Capital exposure normalized",
      ];

      setTrustPulse(messages[trustCountRef.current - 1]);
      setTimeout(() => setTrustPulse(null), 2500);
    }, 12000);

    return () => scheduler.clear(id);
  }, []);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (exitFiredRef.current) return;
      if (capitalMode === "Preservation") return;

      if (e.clientY <= 0) {
        exitFiredRef.current = true;
        setShowExitGuard(true);
      }
    };

    const handleVisibility = () => {
      if (exitFiredRef.current) return;
      if (document.visibilityState === "hidden") {
        exitFiredRef.current = true;
        setShowExitGuard(true);
      }
    };

    window.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [capitalMode]);

  useEffect(() => {
    if (!observedCoin) return;

    setLoadingRealData(true);

    fetchMarketSeries("bitcoin")
      .then(points => {
        const prices = points.map(p => p.price);

        setRealSeries(smoothSeries(prices));

        // ✅ HITUNG TREND DI SINI
        if (prices.length > 2) {
          const delta = prices[prices.length - 1] - prices[0];

          const computedTrend =
            delta > 0 ? "bullish" : delta < 0 ? "bearish" : "neutral";

          setTrend(computedTrend);

          const insight = generateMarketInsight(
            mapTrendToSignal(computedTrend)
          );

          setViralInsight(insight);

          setShareText(
            `🤖 AI just detected a potential market move.\n\n` +
            `I can see the signal, but full reasoning is locked.\n\n` +
            `Unlock it here → ${window.location.origin}/trade`
          );

          trackEvent("insight_generated", {
            trend: mapTrendToSignal(computedTrend),
            rawTrend: computedTrend,
          });

        }
      })
      .catch(err => {
        console.error("Market fetch error:", err);
      })
      .finally(() => {
        setLoadingRealData(false);
      });
  }, [observedCoin]);

  useEffect(() => {
    if (!observedCoin) return;

    setAnalysisVisible(false);
    setHighlightAnalysis(false);
    setCinemaMode(false);

    analysisRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setTimeout(() => {
      setAnalysisVisible(true);
      setHighlightAnalysis(true);
      setCinemaMode(true);

      setTimeout(() => {
        setHighlightAnalysis(false);
      }, 700);
    }, 220);
  }, [observedCoin]);

  useEffect(() => {
    const id = scheduler.register(() => {
      setHeartbeat(v => v + 1);
    }, 2000);

    return () => scheduler.clear(id);
  }, []);

  // ================= GLOBAL CPU THROTTLE =================
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        scheduler.clearAll();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  const [slotsLeft, setSlotsLeft] = useState(3);

  useEffect(() => {
    const saved = localStorage.getItem("premium_slots_left");
    if (saved) setSlotsLeft(Number(saved));
  }, []);

  // ================= DRAG-AND-DROP HANDLERS =================
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
    if (draggedIndex === null || draggedIndex === idx) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newOrder = [...sortedCoins];
    const [draggedCoin] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(idx, 0, draggedCoin);

    const orderNames = newOrder.map(c => c.name);
    setCardOrder(orderNames);
    saveCoinOrder(orderNames);

    setDraggedIndex(null);
    setDragOverIndex(null);

    trackEvent("card_reordered", {
      from: draggedIndex,
      to: idx,
    });
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // ================= MODE COPY =================
  const MODE_COPY = {
    Preservation: {
      title: "Capital Preservation Mode",
      description:
        "Focuses on minimizing drawdowns and maintaining capital stability. Exposure is reduced and signals are highly selective.",
    },
    "Adaptive Growth": {
      title: "Adaptive Growth Mode",
      description:
        "Balances growth and risk dynamically based on market behavior. Position sizing adapts to volatility.",
    },
    "Aggressive Expansion": {
      title: "Aggressive Expansion Mode",
      description:
        "Maximizes capital deployment to capture high-momentum opportunities. Elevated volatility and drawdown risk apply.",
    },
  } as const;

  const activeModeCopy = MODE_COPY[capitalMode];

  const CTA_COPY = {
    Preservation: {
      primary: "Activate Risk-Controlled Execution",
      secondary: "View Defensive Modules",
      sub: "Low exposure • Drawdown focused",
    },
    "Adaptive Growth": {
      primary: "Start Adaptive Auto Trading",
      secondary: "View Growth Modules",
      sub: "Balanced risk • Dynamic scaling",
    },
    "Aggressive Expansion": {
      primary: "Deploy Capital Aggressively",
      secondary: "View High-Momentum Modules",
      sub: "High exposure • Momentum driven",
    },
  } as const;

  const activeCTACopy = CTA_COPY[capitalMode];

  // ================= SYSTEM STATUS COPY =================
  const SYSTEM_STATUS = isRunning
    ? {
      label: "Execution Infrastructure Online",
      message: "System is actively monitoring market conditions and adapting exposure.",
      color: "text-[#22ff88]",
    }
    : {
      label: "System Idle",
      message: "System is idle. Activate auto trading to begin market monitoring.",
      color: "text-gray-400",
    };

  // ================= MODE BEHAVIOR PARAM =================
  const MODE_BEHAVIOR = {
    Preservation: {
      cardLimitMultiplier: 0.5,
      animationIntensity: 0.4,
    },
    "Adaptive Growth": {
      cardLimitMultiplier: 1,
      animationIntensity: 1,
    },
    "Aggressive Expansion": {
      cardLimitMultiplier: 1.6,
      animationIntensity: 1.4,
    },
  } as const;

  const activeModeBehavior = MODE_BEHAVIOR[capitalMode];

  const BASE_PER_PAGE = 21;

  const PER_PAGE = Math.floor(
    BASE_PER_PAGE * activeModeBehavior.cardLimitMultiplier
  );

  const [riskAppetite, setRiskAppetite] = useState<
    "Low" | "Medium" | "High"
  >("Medium");

  const [governanceEvents, setGovernanceEvents] = useState<string[]>([
    "System initialized",
    "Governance layer online"
  ]);

  // ================= B5 — RISK SCORE TABLE =================
  const RISK_SCORE = {
    low: 1,
    medium: 2,
    high: 3,
  } as const;

  const MODE_RISK_BIAS = {
    Preservation: {
      low: 1.5,
      medium: 0.7,
      high: 0.2,
    },
    "Adaptive Growth": {
      low: 1,
      medium: 1,
      high: 1,
    },
    "Aggressive Expansion": {
      low: 0.8,
      medium: 1.2,
      high: 1.6,
    },
  } as const;

  // ================= B5 — APPLY SCORE =================
  const scoredCoins = coinList.map((coin) => {
    const baseRisk = RISK_SCORE[coin.risk];
    const modeBias = MODE_RISK_BIAS[capitalMode][coin.risk];

    return {
      ...coin,
      score: baseRisk * modeBias,
    };
  });

  const filteredCoins = scoredCoins.filter((coin) => {
    if (risk !== "all" && coin.risk !== risk) return false;
    if (timeframe !== "all" && coin.timeframe !== timeframe) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      if (
        !coin.name.toLowerCase().includes(q) &&
        !coin.short.toLowerCase().includes(q)
      ) {
        return false;
      }
    }

    return true;
  });

  // ================= B5 — SORT BY SCORE =================
  const sortedCoins = useMemo(() => {
    let sorted = [...filteredCoins].sort((a, b) => a.score - b.score);
    
    // Apply custom order if saved
    if (cardOrder.length > 0) {
      const orderMap = new Map(cardOrder.map((name, idx) => [name, idx]));
      sorted = sorted.sort((a, b) => {
        const orderA = orderMap.get(a.name) ?? Infinity;
        const orderB = orderMap.get(b.name) ?? Infinity;
        return orderA - orderB;
      });
    }
    
    return sorted;
  }, [filteredCoins, cardOrder]);
  const TOTAL_PAGE = Math.max(
    1,
    Math.ceil(filteredCoins.length / PER_PAGE)
  );
  const start = (page - 1) * PER_PAGE;
  const end = start + PER_PAGE;

  // ================= GOVERNANCE RULES =================
  const GOVERNANCE_RULES = {
    Preservation: {
      maxRiskPerTrade: 0.5,
      tradeFrequency: 0.3,
      volatilityTolerance: 0.4,
    },

    "Adaptive Growth": {
      maxRiskPerTrade: 1,
      tradeFrequency: 0.6,
      volatilityTolerance: 0.6,
    },

    "Aggressive Expansion": {
      maxRiskPerTrade: 2,
      tradeFrequency: 1,
      volatilityTolerance: 0.9,
    },
  } as const;

  // ================= ACTIVE GOVERNANCE =================
  const activeRules = GOVERNANCE_RULES[capitalMode];


  // ================= RISK APPETITE PARAM =================
  const RISK_PROFILE = {
    Low: {
      maxAllowedRisk: "low",
      color: "emerald",
      signalBias: 0.3,
    },
    Medium: {
      maxAllowedRisk: "medium",
      color: "yellow",
      signalBias: 0.6,
    },
    High: {
      maxAllowedRisk: "high",
      color: "red",
      signalBias: 0.9,
    },
  } as const;

  const activeRiskProfile = RISK_PROFILE[riskAppetite];

  // ================= META-LOGIC LOOP =================
  useEffect(() => {
    if (systemMode !== "active") return;

    const id = scheduler.register(() => {
      const snapshot = evaluateMarket();
      const nextMode = decideCapitalMode(snapshot);
      setCapitalMode(nextMode);
    }, 6000);

    return () => scheduler.clear(id);
  }, [systemMode]);

  useEffect(() => {
    const id = scheduler.register(() => {
      setLiveData((prev) =>
        prev.map((arr) => {
          const intensity =
            activeRules.tradeFrequency *
            activeModeBehavior.animationIntensity *
            (Math.random() * 4 - 2);

          const next = arr[arr.length - 1] + intensity;
          return [...arr.slice(1), Math.max(10, Math.min(150, next))];
        })
      );
    }, 1100);

    return () => scheduler.clear(id);
  }, [activeRules, activeModeBehavior]);

  // skeleton loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  function formatTime(timeLeft: number): string {
    if (timeLeft <= 0) return "Expired";
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }

  return (
    <div
      className="
    w-full min-h-screen
    bg-gradient-to-b
    from-[#0A0F1C]
    via-[#0B1220]
    to-[#070B14]
    text-white
    pb-20
    scroll-smooth
  "
    >

      {/* ================= MOBILE HERO ================= */}
      <div className="lg:hidden relative z-10">
        {/* MOBILE HEADLINE */}
        <h1 className="text-[36px] font-extrabold leading-[1.1] tracking-tight mb-6">
          <span className="block text-gray-100">
            AI Trading
          </span>
          <span className="block text-[#22ff88] drop-shadow-[0_0_18px_rgba(34,255,136,0.4)]">
            That Trades For You
          </span>
        </h1>

        {/* MOBILE MICRO-COPY */}
        <p className="text-[13px] text-gray-400 mb-4">
          Trading hanyalah salah satu implementasi.
        </p>

        {/* MOBILE PROFIT */}
        <div className="mb-6">
          <div className="text-[#22ff88] text-[44px] font-extrabold tracking-tight tabular-nums">
            $1,284,392
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] uppercase tracking-widest text-gray-500">
              Today Profit
            </span>
            <span className="text-[#22ff88] text-[11px]">
              ▲ +8.4%
            </span>
          </div>
        </div>

        {/* MOBILE CTA */}
        <div className="
    flex flex-col gap-3
    bg-[#0B1220]
    border border-[#1F2937]
    rounded-2xl
    p-4
    mb-8
  ">
          <button
            className="
        w-full
        py-4 rounded-xl
        bg-gradient-to-r from-[#22ff88] to-[#3cffaa]
        text-black font-bold text-[15px]
        shadow-[0_10px_30px_rgba(34,255,136,0.45)]
        active:scale-95
      "
          >
            Access Execution Infrastructure
          </button>

          <div className="text-center text-[11px] text-gray-400">
            No credit card • Cancel anytime • Risk controlled
          </div>

          <div className="text-[10px] text-gray-500 mt-1 tracking-wide">
            Trusted by 12,000+ traders worldwide
          </div>

          <button
            className="
        w-full py-2 rounded-lg
        text-[13px]
        text-[#22ff88]
        border border-[#22ff88]/40
        hover:bg-[#22ff8820]
      "
          >
            View Behavior Modules
          </button>
        </div>
      </div>
      {/* ================= END MOBILE HERO ================= */}


      {/* ================= HERO SECTION ================= */}
      <section
        className="
    relative
    pt-32 pb-24
    container mx-auto
    bg-gradient-to-br
    from-[#05080f]
    via-[#0a1220]
    to-[#05080f]
    rounded-b-[48px]
    overflow-hidden
  "
      >

        {/* BACKGROUND GLOW */}
        <div
          className="
      pointer-events-none
      absolute top-24 left-1/2 -translate-x-1/2
      w-[700px] h-[320px]
      bg-[#22ff88]/10
      blur-[140px]
      rounded-full
    "
        />

        {/* RIGHT SIDE SOFT GRADIENT */}
        <div
          className="
      pointer-events-none
      absolute top-0 right-0
      w-[420px] h-full
      bg-gradient-to-l
      from-[#22ff8812]
      to-transparent
    "
        />

        {/* GRID LOCK */}
        <div
          className="
      relative z-10
      grid-cols-1 lg:grid-cols-12
      gap-16
      items-start
      hidden lg:grid
    "
        >
          {/* ================= LEFT HERO ================= */}

          <div className="lg:col-span-7 flex flex-col gap-10">
            {/* STATS */}
            <div className="flex flex-wrap gap-x-8 gap-y-2 mb-12 text-[12px] text-gray-400 tracking-wide">
              <StatItem label="active traders" value="12,482" live />
              <StatItem label="strategies running" value="284" icon="⚙️" />
              <StatItem label="uptime" value="97%" dot />
              <StatItem label="system verified" value="ISO-grade" icon="🛡️" />
            </div>

            {/* HEADLINE */}
            <h1 className="
  text-white
  text-[48px] md:text-[56px]
  font-extrabold
  tracking-tight
  leading-[1.05]
">
              <span className="block text-gray-100">
                How automated capital
              </span>
              <span className="text-[#22ff88] drop-shadow-[0_0_18px_rgba(34,255,136,0.4)]">
                should behave.
              </span>
            </h1>

            <p className="text-[13px] text-gray-400 mb-4">
              Trading hanyalah salah satu implementasi.
            </p>

            {/* PROFIT */}
<div className="
  mb-12
  inline-block
  rounded-2xl
  bg-[#0B1220]/60
  backdrop-blur-md
  border border-[#22ff88]/30
  px-6 py-4
  shadow-[0_0_60px_rgba(34,255,136,0.18)]
">

              <div className="
  text-[#22ff88]
  text-[56px] md:text-[64px]
  font-extrabold
  tracking-[-0.02em]
  tabular-nums
  drop-shadow-[0_0_36px_rgba(34,255,136,0.55)]
  animate-pulse
">
                ${heroProfit.toLocaleString()}
              </div>

              <div className="flex items-center gap-3 mt-2">
                <span className="text-[11px] uppercase tracking-[0.2em] text-gray-500">
                  Capital movement today
                </span>

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#22ff8820] text-[#22ff88] text-[11px] font-medium">
                  ▲ +8.4% vs yesterday
                </span>
              </div>
            </div>

            <p className="
  text-gray-400
  text-[15px]
  max-w-[520px]
  mb-10
  leading-relaxed
">
              Deploy an automated capital behavior framework
              with real-time execution, risk-first logic,
              and transparent system state.
            </p>

            {/* SYSTEM HEARTBEAT */}
            <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-12">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute h-full w-full rounded-full bg-[#22ff88] opacity-75" />
                <span className="relative h-2 w-2 rounded-full bg-[#22ff88]" />
              </span>

              <span>
                System heartbeat synced {heartbeat * 2}s ago
              </span>
            </div>

            {/* CTA BLOCK */}
            <div
              className="
          inline-flex flex-col gap-3
          rounded-2xl
          bg-[#0B1220]
          border border-[#1F2937]
          px-6 py-5
          shadow-[inset_0_1px_0_#ffffff10]
          w-fit
        "

            >

              {/* PRIMARY CTA */}
              <button
                onClick={() => {
                  if (!accessGranted) return;

                  if (EXECUTION_LIMIT) {
                    setShowExecutionGate(true);
                    return;
                  }

                  setShowExecutionGate(true);
                  setLastAction("SYSTEM_ACTIVATED");
                }}
                className="
    w-full
    py-3 rounded-xl
    bg-gradient-to-r from-[#22ff88] to-[#3cffaa]
    text-black font-bold
    shadow-[0_10px_30px_rgba(34,255,136,0.45)]
    active:scale-95
  "
              >
                {activeCTACopy.primary}
              </button>

              <div className="text-[11px] text-gray-400">
                {activeCTACopy.sub}
              </div>

<div className="
  inline-flex items-center gap-2
  mb-2
  px-3 py-1
  rounded-full
  text-[11px]
  font-semibold
  bg-[#22ff8820]
  text-[#22ff88]
">
  <span className="w-2 h-2 rounded-full bg-[#22ff88] animate-pulse" />
  REAL-TIME MONITORING
</div>

              {/* ================= SYSTEM STATUS ================= */}
              <div className="mt-4 text-sm">
                <div className={`font-semibold ${SYSTEM_STATUS.color}`}>
                  {SYSTEM_STATUS.label}
                </div>
                <p className="mt-1 text-gray-400 leading-relaxed">
                  {SYSTEM_STATUS.message}
                </p>
              </div>

              {/* TRUST LINE */}
              <div className="flex items-center gap-3 text-[11px] text-gray-400">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22ff88]" />
                  No credit card
                </span>
                <span>•</span>
                <span>Cancel anytime</span>
                <span>•</span>
                <span>Risk controlled</span>
              </div>

              {/* TRUSTED BY */}
              <div className="text-[10px] text-gray-500 mt-1">
                Trusted by 12,000+ traders worldwide
              </div>

              {/* SECONDARY CTA */}
              <button
                className="
            px-6 py-2 rounded-lg
            text-[13px] tracking-wide
            text-[#22ff88]
            border border-[#22ff88]/40
            hover:border-[#22ff88]
            hover:text-[#22ff88]
            hover:bg-[#22ff8820]
            transition
          "
              >
                View Behavior Modules
              </button>
            </div>
          </div>

          {/* ================= RIGHT HERO ================= */}
          {!isMobile && (
            <div className="lg:col-span-5 sticky top-28 flex flex-col gap-6">
              {/* ================= GOVERNANCE PANEL ================= */}
              <div className="
  bg-[#0B1220]
  border border-[#22ff88]
  rounded-2xl
  p-5
  shadow-[0_0_40px_rgba(34,255,136,0.15)]
">
                <div className="text-[11px] uppercase tracking-widest text-gray-400 mb-2">
                  Capital Governance State
                </div>

                <div className="text-lg font-bold text-[#22ff88] mb-1">
                  {capitalMode}
                </div>

                <div className="text-[12px] text-gray-400 mb-3">
                  Risk Appetite:{" "}
                  <span className="text-white font-medium">
                    {riskAppetite}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <span className="w-2 h-2 rounded-full bg-[#22ff88] animate-pulse" />
                  Meta-layer actively governing behavior modules
                </div>
              </div>


              {hasPremiumAccess() && (
                <div
                  className={`
      bg-[#0B1220]
      border
      rounded-2xl
      p-4
      ${activeRiskProfile.color === "emerald"
                      ? "border-[#22ff88]"
                      : activeRiskProfile.color === "yellow"
                        ? "border-[#facc15]"
                        : "border-[#ef4444]"
                    }
    `}
                >
                  <div className="text-[11px] text-gray-400 mb-3">
                    Override Capital Mode (Simulation)
                  </div>

                  <div className="flex gap-2">
                    {[
                      "Preservation",
                      "Adaptive Growth",
                      "Aggressive Expansion"
                    ].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => {
                          setCapitalMode(mode as CapitalMode);
                          setRiskAppetite(
                            mode === "Preservation"
                              ? "Low"
                              : mode === "Aggressive Expansion"
                                ? "High"
                                : "Medium"
                          );
                        }}
                        className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= MODE DESCRIPTION ================= */}

              <div className="mt-4 max-w-xl text-sm">
                <div className="text-white font-semibold mb-1">
                  {activeModeCopy.title}
                </div>
                <p className="text-gray-400 leading-relaxed">
                  {activeModeCopy.description}
                </p>
              </div>

              {/* CLEAN V1: governance event log hidden */}
              {false && (
                <div className="
  bg-[#0B0F18]
  border border-[#1F2937]
  rounded-2xl
  p-4
  max-h-[180px]
  overflow-y-auto
">
                  <div className="text-[11px] text-gray-400 mb-2">
                    Governance Events
                  </div>

                  <div className="space-y-1 text-[11px] text-gray-300">
                    {governanceEvents.map((event, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="text-[#22ff88]">›</span>
                        <span>{event}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= SYSTEM STATUS ================= */}
              <section className="card p-5">
                <div className="text-sm text-gray-400 mb-1">
                  Execution State
                </div>

                <div className="text-lg font-bold text-[#22ff88]">
                  Live execution
                </div>

                <div className="text-[11px] text-gray-500 mt-1">
                  Status reflects execution behavior, not trade frequency.
                </div>
              </section>

              {/* CLEAN V1: hide system diagnostics */}
              {false && <SystemStatus systemMode={systemMode} />}
              {/* HERO VISUAL */}
              {/* CLEAN V1: visual overload disabled */}
              {/* <HeroVisual /> */}
</div>
)}
</div>
</section>

{/* ================= END HERO ================= */}

/* ================= AI ACTIVITY PROOF ================= */
<div className="mt-10 grid md:grid-cols-2 gap-6 container mx-auto">
  <AITimeline />
  <LiveProfitTable enabled={systemMode === "active"} />
</div>

<AISessionContext
  level={hasPremiumAccess() ? "full" : "partial"}
/>

      {/* ================= ABSTRACTION LAYER ================= */}
      <section className="container mx-auto mb-16 p-6 bg-[#0B1220] border border-[#1F2937] rounded-2xl text-white">
        <h2 className="text-[20px] font-bold mb-3 text-[#22ff88]">Abstraction Layer</h2>
        <ul className="list-disc list-inside text-gray-300 mb-3">
          <li>Separates human decisions from capital execution</li>
          <li>Converts market conditions into behavior</li>
          <li>Executes without emotion</li>
        </ul>
        <p className="text-[12px] text-gray-400">
          Everything below is the result of this layer.
        </p>
      </section>

      {isReturningPremium && hasPremiumAccess() && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-40
    bg-[#0B0F18] border border-[#22ff88]
    px-4 py-2 rounded-lg text-[12px]
    text-[#22ff88] shadow-lg
  ">
          Welcome back. Premium system still active.
        </div>
      )}

      {trustPulse && (
        <div className="fixed top-6 right-6 z-40
    bg-[#0B0F18] border border-[#22ff88]
    px-4 py-2 rounded-lg text-[12px]
    text-[#22ff88] shadow-lg
  ">
          {trustPulse}
        </div>
      )}

      {resurrectedUser && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40
      bg-[#0B0F18] border border-[#22ff88]
      px-5 py-3 rounded-xl text-sm text-white
      shadow-[0_0_40px_rgba(34,255,136,0.25)]
    "
        >
          <div className="text-[#22ff88] font-semibold mb-1">
            Your premium trial has ended
          </div>

          <div className="text-gray-400 text-[12px] mb-2">
            Execution-ready strategies are still calibrated for you.
          </div>

          <button
            onClick={() => {
              trackEvent("premium_cta_click", {
                source: "ai_insight",
              });

              setSlotsLeft(prev => {
                const next = Math.max(prev - 1, 0);
                localStorage.setItem("premium_slots_left", String(next));
                return next;
              });

              setShowExecutionGate(true);
            }}

            className="text-[#22ff88] text-xs font-semibold
    border border-[#22ff88]/40 px-3 py-1.5 rounded-lg
    hover:bg-[#22ff8820] transition
  "
          >
            Resume execution →
          </button>
        </div>
      )}

      {/* ================= TRUST BAR ================= */}
      <section className="container mx-auto -mt-16 mb-20 relative z-20 animate-fadeInUp">
        <div className="relative">
          {/* Soft Glow Belakang TrustBar */}
          <div className="absolute inset-0 rounded-2xl bg-[#22ff88]/10 blur-[60px] pointer-events-none"></div>

          <div
            className="
        w-full
        bg-[#0B1220]
        border border-[#1F2937]
        rounded-2xl
        px-6 py-5
        shadow-[inset_0_1px_0_#ffffff08]
        transition-all duration-300
        hover:border-[#22ff88]
        hover:shadow-[0_0_60px_rgba(34,255,136,0.12)]
      "
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                "Risk-first execution",
                "Non-emotional scaling",
                "Transparent system state",
                "No manual intervention"
              ].map((label) => (
                <div
                  key={label}
                  className="p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(34,255,136,0.25)] cursor-default"
                >
                  <div className="text-[#22ff88] text-sm font-semibold mb-1">
                    {label}
                  </div>
                  <div className="text-[11px] text-gray-400"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      <div className="h-20" />

      {/* ================= SYSTEM DISCLAIMER ================= */}
      <section className="container mx-auto mb-16">
        <div
          className="
      bg-[#0B0F18]
      border border-[#1F2937]
      rounded-2xl
      px-6 py-5
      text-[12px]
      text-gray-400
      leading-relaxed
    "
        >
          <p className="mb-2">
            This interface represents a <span className="text-white font-medium">
              capital behavior simulation
            </span>, not a trading guarantee.
          </p>

          <p className="mb-2">
            All displayed metrics, signals, and performance indicators
            reflect system behavior — not financial advice or promised returns.
          </p>

          <p className="text-gray-500">
            Automated execution always carries risk.
            Capital exposure should be aligned with personal risk tolerance.
          </p>

          <div className="mt-3 text-[10px] uppercase tracking-widest text-gray-600">
  Simulation environment • Not investment advice
</div>

        </div>
      </section>

      {/* SEARCH BAR — GOD MODE */}
      <section className="container mx-auto mb-10">
        <div className="
    relative w-full
    rounded-2xl
    bg-[#0B1220]
    border border-[#1F2937]
    overflow-hidden
    focus-within:border-[#22ff88]
    focus-within:ring-2 focus-within:ring-[#22ff8820]
    transition
    shadow-[inset_0_1px_0_#ffffff08]
  ">
          <div className="flex items-center px-5 h-14 gap-4">

            {/* ICON */}
            <span className="text-gray-500 text-lg">🔍</span>

            {/* INPUT */}
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search behavior module, asset, or condition…"
              className="
          flex-1 bg-transparent
          text-[15px] text-white
          placeholder:text-gray-500
          outline-none
        "
            />

            {/* CLEAR */}
            {search && (
              <button
                onClick={() => setSearch("")}
                className="
            text-gray-500 hover:text-white
            transition text-lg
          "
              >
                ×
              </button>
            )}
          </div>

          {/* FOOTER INFO */}
          <div className="
      px-5 py-2
      bg-[#0A0F1C]
      border-t border-[#1F2937]
      flex items-center justify-between
      text-[11px]
      text-gray-400
    ">
            <span>
              {filteredCoins.length} behavior modules found
            </span>
            <span className="text-[#22ff88]">
              Live AI Search
            </span>
          </div>
        </div>
      </section>

      {/* FILTER BAR */}
      <section className="container mx-auto mb-12">
        <div className="
    flex gap-3 overflow-x-auto scrollbar-hide
    py-2
  ">

          {[
            "All",
            "Low Risk",
            "Medium Risk",
            "High Risk",
            "Scalping",
            "Long Term"
          ].map((label) => {
            const active = activeFilter === label;

            return (
              <button
                key={label}
                onClick={() => {
                  setActiveFilter(label);

                  if (label === "Low Risk") setRisk("low");
                  else if (label === "Medium Risk") setRisk("medium");
                  else if (label === "High Risk") setRisk("high");
                  else setRisk("all");

                  if (label === "Scalping") setTimeframe("scalp");
                  else if (label === "Long Term") setTimeframe("long");
                  else setTimeframe("all");
                }}

                className={`
  relative px-5 py-2 rounded-full text-[13px] font-semibold
  whitespace-nowrap transition-all duration-300
  ${active
                    ? "text-[#22ff88] border-[#22ff88] bg-[#22ff8820] shadow-[0_0_20px_rgba(34,255,136,0.25)]"
                    : "text-gray-400 hover:text-white border-[#1F2937] bg-[#0B1220] hover:bg-[#22ff8820] hover:shadow-[0_0_10px_rgba(34,255,136,0.12)]"
                  }
`}
              >
                {active && (
                  <span className="
    absolute -bottom-1 left-1/2-translate-x-1/2
    w-6 h-[2px] bg-[#22ff88] rounded-full
    blur-sm
    shadow-[0_0_8px_rgba(34,255,136,0.45)]
  " />
                )}

                {/* Button Surface */}
                <span
                  className={`
              relative z-10 px-5 py-2 rounded-full
              border
              ${active
                      ? "border-[#22ff88]"
                      : "border-[#1F2937]"
                    }
              bg-[#0B1220]
            `}
                >
                  {label}
                </span>

                {/* Underline */}
                {active && (
                  <span
                    className="
                absolute -bottom-1 left-1/2 -translate-x-1/2
                w-6 h-[2px]
                bg-[#22ff88]
                rounded-full
              "
                  />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {observedCoin && (
        <section
          ref={analysisRef}
          className={`
      container mx-auto mb-16
      bg-[#0B1220]
      border
      rounded-3xl
      p-8
      transition-all duration-500
      ${highlightAnalysis
              ? "border-[#22ff88] shadow-[0_0_90px_rgba(34,255,136,0.45)]"
              : "border-[#1F2937]"
            }
    `}
        >
          <h2 className="text-xl font-bold text-[#22ff88] mb-2">
            Behavior Analysis — {observedCoin.coin.name}
          </h2>

          {viralInsight && (
            <div className="mt-3 mb-4 px-4 py-3 rounded-xl border text-sm">

              {/* === AI INSIGHT === */}
              {hasPremiumAccess() ? (
                <div className="text-[#22ff88]">
                  🤖 AI Insight: {viralInsight}

                  {shareText && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(shareText);
                        trackEvent("insight_shared", {
                          source: "viral_engine",
                        });
                      }}
                      className="mt-3 inline-block text-xs
          text-[#22ff88] border border-[#22ff88]/40
          px-3 py-1.5 rounded-lg
          hover:bg-[#22ff8820] transition"
                    >
                      🔗 Share AI Insight
                    </button>
                  )}
                </div>
              ) : (

                <div className="text-gray-400">
                  🔒 Premium Insight Locked

                  <div className="text-xs mt-1 text-gray-500">
                    Advanced AI reasoning is reserved for premium members.
                  </div>

                  {slotsLeft <= 2 && (
                    <div className="text-xs mt-2 text-orange-400">
                      ⏳ Only {slotsLeft} premium trial slots left today
                    </div>
                  )}

                  <div className="text-xs mt-2 text-gray-500">
                    Most profitable users unlock premium within 24 hours.
                  </div>

                  <button
                    disabled={slotsLeft === 0}
                    onClick={() => {
                      if (slotsLeft === 0) {
                        trackEvent("premium_slots_exhausted");
                        return;
                      }

                      trackEvent("premium_cta_click", {
                        source: "ai_insight",
                      });

                      setShowExecutionGate(true);
                    }}
                    className={`mt-3 inline-block px-4 py-2 rounded-lg
    border text-xs font-semibold transition
    ${slotsLeft === 0
                        ? "border-gray-700 text-gray-600 cursor-not-allowed"
                        : "border-[#22ff88]/40 text-[#22ff88] hover:bg-[#22ff8820]"
                      }
  `}
                  >
                    {slotsLeft === 0 ? "Premium slots full" : "Unlock Premium Insight →"}
                  </button>
                </div>
              )}

              {/* === PREMIUM ACTIVE NEXT STEP === */}
              {hasPremiumAccess() && (
                <div className="mt-6 rounded-xl border border-[#22ff88]/40 bg-[#22ff8815] p-4">
                  <div className="text-[#22ff88] font-semibold text-sm">
                    ✅ Premium Access Active
                  </div>

                  <div className="text-gray-400 text-sm mt-1">
                    <div className="text-xs text-gray-500 mt-2">
                      🔥 47 traders upgraded in the last 24 hours
                    </div>

                    Trial premium expires in{" "}
                    <span className="text-[#22ff88] font-semibold">
                      {timeLeft !== null ? formatTime(timeLeft) : "--"}
                    </span>
                  </div>


                  <a
                    href={MEMBERSHIP.joinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 px-4 py-2 rounded-lg
            bg-[#22ff88] text-black font-semibold text-sm"
                  >
                    Join {MEMBERSHIP.platform} Channel →
                  </a>
                </div>
              )}

            </div>
          )}

          <button
            onClick={() => {
              const text = buildShareText({
                insight: viralInsight!,
                symbol: observedCoin.coin.short,
              });

              if (typeof navigator !== "undefined" && navigator.share) {
                navigator.share({ text });
              } else {
                navigator.clipboard.writeText(text);
              }

              trackEvent("insight_shared", {
                symbol: observedCoin.coin.short,
              });
            }}
            className="text-[11px] text-gray-400 hover:text-[#22ff88] transition"
          >
            Share AI Insight
          </button>

          <div className="flex items-center gap-4 mb-4 text-sm">
            <span
              className={
                trend === "bullish"
                  ? "text-[#22ff88]"
                  : trend === "bearish"
                    ? "text-[#ff5577]"
                    : "text-gray-400"
              }
            >
              {trend === "bullish"
                ? "▲ Bullish"
                : trend === "bearish"
                  ? "▼ Bearish"
                  : "● Neutral"}
            </span>

            {percentChange && (
              <span className="text-gray-400">
                Δ {percentChange}%
              </span>
            )}

            <span className="text-gray-500">
              Source: CoinGecko
            </span>
          </div>

          <p className="text-sm text-gray-400 mb-6">
            System is visualizing selected behavior module.
          </p>

          <div className="h-[320px] flex items-center justify-center">
            {loadingRealData && (
              <div className="text-sm text-gray-400">
                Loading real market data…
              </div>
            )}

            {realSeries && renderSparkline(realSeries, trend)}
          </div>
        </section>
      )}

      {/* GRID */}
      <section
        className="
    container mx-auto
    grid
    grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
    gap-8
    pb-24
  "
      >
        {isLoading && (
          Array.from({ length: PER_PAGE }).map((_, i) => (
            <OmegaCardSkeleton key={i} />
          ))
        )}

        {!isLoading && showEmptyState && (
          <div className="w-full py-24 text-center text-gray-400 col-span-full">
            <div className="text-lg font-semibold text-gray-300">
              System is idle
            </div>
            <p className="mt-2 text-sm">
              Activate auto trading to begin strategy execution and real-time monitoring.
            </p>
          </div>
        )}

        {!isLoading && !showEmptyState && (
          sortedCoins.slice(start, end).map((coin, i) => {
            const allowed =
              RISK_ORDER[coin.risk] <=
              RISK_ORDER[activeRiskProfile.maxAllowedRisk];

            if (!allowed) return null;

            const idx = start + i;
            const values = liveData[idx];
            const isDragging = draggedIndex === idx;
            const isDragOver = dragOverIndex === idx;

return (
  <div
    key={coin.name}
    draggable
    onDragStart={(e) => handleDragStart(e, coin.name, idx)}
    onDragOver={(e) => handleDragOver(e, idx)}
    onDrop={(e) => handleDrop(e, idx)}
    onDragLeave={handleDragLeave}
    onDragEnd={handleDragEnd}
    className={`
      transition-all duration-200
      ${isDragging ? "opacity-50 scale-95" : "opacity-100 scale-100"}
      ${isDragOver ? "ring-2 ring-[#22ff88] ring-offset-2 ring-offset-[#0A0F1C]" : ""}
      cursor-grab active:cursor-grabbing
    `}
  >
    <OmegaCard
      coin={coin}
      values={values}
      search={search}
      systemMode={systemMode}
      onView={() => {
        setCinemaMode(false);
        setObservedCoin({ coin, values });
        setLastAction(`VIEW_BEHAVIOR:${coin.short}`);
      }}
    />
  </div>
);
          })
        )}
      </section>


      {/* PAGINATION & CARD ORDER RESET */}
      <div className="flex justify-center items-center gap-2 mt-12">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1E293B] hover:bg-[#22ff8820] transition"
        >
          <ChevronLeft size={18} />
        </button>

        {Array.from({ length: TOTAL_PAGE }).map((_, i) => {
          const num = i + 1;
          const active = num === page;

          return (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`
  w-9 h-9 flex items-center justify-center rounded-full text-[14px]
  transition
  shadow-[inset_0_1px_0_#ffffff12]
  ${active
                  ? "bg-[#22ff88] text-black font-semibold"
                  : "bg-[#1E293B] text-gray-300 hover:bg-[#22ff8820]"
                }
`}
            >
              {num}
            </button>
          );
        })}

        <button
          onClick={() => setPage((p) => Math.min(TOTAL_PAGE, p + 1))}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1E293B] hover:bg-[#22ff8820] transition"
        >
          <ChevronRight size={18} />
        </button>

        {cardOrder.length > 0 && (
          <button
            onClick={() => {
              setCardOrder([]);
              saveCoinOrder([]);
              trackEvent("card_order_reset", {});
            }}
            className="ml-4 px-3 py-1.5 text-xs rounded-lg
              bg-[#1E293B] hover:bg-[#22ff8820]
              text-gray-400 hover:text-[#22ff88]
              transition border border-[#1E293B] hover:border-[#22ff88]/40"
            title="Reset card order to default"
          >
            Reset Layout
          </button>
        )}


        {bigWin && (
          <div className="
    fixed bottom-6 right-6
    bg-[#0B0F18]
    border border-[#22ff88]
    px-4 py-2 rounded-lg
    text-sm text-[#22ff88]
    animate-fade-in
    z-50
    backdrop-blur-md
    shadow-[0_0_40px_rgba(34,255,136,0.25)]
  ">

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#22ff88] animate-pulse" />
              <span>{bigWin}</span>
            </div>
          </div>
        )}

        {showExitGuard && (
          <div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50
      bg-[#0B0F18] border border-[#22ff88]
      px-5 py-3 rounded-xl text-sm text-white
      shadow-[0_0_40px_rgba(34,255,136,0.25)]
    "
          >
            <div className="text-[#22ff88] font-semibold mb-1">
              Before you leave
            </div>

            <div className="text-gray-400 text-[12px] mb-3">
              Execution layer is still calibrated for your session.
            </div>

            <button
              onClick={() => setShowExitGuard(false)}
              className="text-[#22ff88] text-xs font-semibold
        border border-[#22ff88]/40 px-3 py-1.5 rounded-lg
        hover:bg-[#22ff8820] transition
      "
            >
              Continue →
            </button>
          </div>
        )}

<SessionDepthBar
  onReady={() => {
    sessionStorage.setItem("executionUnlocked", "true");
  }}
/>

        {showExecutionGate && (
  <ExecutionGate>
    {/* optional: konten setelah unlock */}
  </ExecutionGate>
)}
      </div>

      {isMobile && (
  <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur border-t border-white/10 p-3">
    <button
      onClick={() => setUnlocked(true)}
      className="w-full py-3 rounded-xl bg-emerald-500 text-black font-semibold"
    >
      Activate AI Trading
    </button>
    <p className="text-[10px] text-center text-gray-400 mt-1">
      AI akan mengelola behavior eksekusi sesuai parameter risiko
    </p>
  </div>
)}
    </div>
  );
};