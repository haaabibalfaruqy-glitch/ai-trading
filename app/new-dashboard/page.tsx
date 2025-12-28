"use client";

import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";

type HeroProps = {
  initialProfit?: number;
};

export default function AIBasicHero({ initialProfit = 0 }: HeroProps) {
  const [heroProfit, setHeroProfit] = useState(initialProfit);
  const [heartbeat, setHeartbeat] = useState(1);
  const [showCTA, setShowCTA] = useState(false);

  // Simulasi live profit naik turun kecil
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroProfit((prev) => prev + Math.floor(Math.random() * 3));
      setHeartbeat((prev) => (prev >= 10 ? 1 : prev + 1));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-[#0B1220] py-16 px-6 md:px-12 rounded-3xl shadow-[0_0_60px_rgba(34,255,136,0.15)]">
      {/* HERO TITLE */}
      <h1 className="text-3xl md:text-5xl font-bold text-[#22ff88] mb-4">
        AI Trading Assistant — GRATIS
      </h1>
      <p className="text-gray-400 max-w-xl mb-6">
        Coba sistem trading otomatis dengan risiko kecil. Satu pair, lot kecil, 1 posisi maksimal. Cocok untuk testing & belajar disiplin trading.
      </p>

      {/* LIVE PROFIT */}
      <div className="text-4xl md:text-5xl font-mono tabular-nums drop-shadow-[0_0_36px_rgba(34,255,136,0.55)] animate-pulse mb-4">
        ${heroProfit.toLocaleString()}
      </div>

      {/* CAPITAL MOVEMENT */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-[11px] uppercase tracking-[0.2em] text-gray-500">
          Capital movement today
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#22ff8820] text-[#22ff88] text-[11px] font-medium">
          ▲ +8.4% vs yesterday
        </span>
      </div>

      {/* SYSTEM HEARTBEAT */}
      <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-8">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute h-full w-full rounded-full bg-[#22ff88] opacity-75" />
          <span className="relative h-2 w-2 rounded-full bg-[#22ff88]" />
        </span>
        <span>System heartbeat synced {heartbeat}s ago</span>
      </div>

      {/* CTA BUTTON */}
      <div className="w-full md:w-fit">
        <button
          onClick={() => setShowCTA(true)}
          className="w-full md:w-auto py-3 px-6 rounded-xl bg-gradient-to-r from-[#22ff88] to-[#3cffaa] text-black font-bold shadow-[0_10px_30px_rgba(34,255,136,0.45)] active:scale-95 transition"
        >
          Mulai Gratis
          <ChevronRight className="inline ml-2" size={20} />
        </button>
        {showCTA && (
          <p className="mt-2 text-[12px] text-gray-400">
            Untuk aktifkan sistem, hubungkan akun broker Anda.
          </p>
        )}
      </div>

      {/* FOOTER NARRATIVE */}
      <p className="text-gray-400 text-[15px] max-w-2xl mt-8 leading-relaxed">
        Sistem AI BASIC dibatasi: 1 pair, lot kecil, max 1 posisi. Cocok untuk testing dan belajar disiplin trading tanpa overtrade manual.
      </p>
    </section>
  );
}

// ================= SYSTEM STATUS + UPGRADE TEASE =================
interface SystemStatusProps {
  systemMode?: "idle" | "active" | "maintenance";
}

export function AIBasicStatus({ systemMode = "idle" }: SystemStatusProps) {
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [heartbeat, setHeartbeat] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeartbeat((prev) => (prev >= 10 ? 1 : prev + 1));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const statusLabel =
    systemMode === "active"
      ? "Live execution"
      : systemMode === "maintenance"
      ? "System maintenance"
      : "Idle";

  const statusColor =
    systemMode === "active"
      ? "text-[#22ff88]"
      : systemMode === "maintenance"
      ? "text-[#facc15]"
      : "text-gray-400";

  return (
    <section className="mt-12 bg-[#0B1220] border border-[#1F2937] rounded-2xl p-6 shadow-[0_0_40px_rgba(34,255,136,0.12)]">
      {/* SYSTEM STATUS */}
      <div className="mb-4">
        <div className={`font-semibold ${statusColor} text-lg`}>{statusLabel}</div>
        <p className="text-gray-400 text-sm mt-1">
          Status mencerminkan aktivitas sistem, bukan frekuensi trading.
        </p>
      </div>

      {/* HEARTBEAT */}
      <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-4">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute h-full w-full rounded-full bg-[#22ff88] opacity-50" />
          <span className="relative h-2 w-2 rounded-full bg-[#22ff88]" />
        </span>
        <span>Heartbeat: {heartbeat}s ago</span>
      </div>

      {/* UPGRADE TEASE */}
      <div className="mt-6 bg-[#0B0F18] border border-[#22ff88]/20 rounded-xl p-4 text-gray-400">
        <div className="text-[#22ff88] font-semibold mb-1">Upgrade ke AI PRO & VPS</div>
        <ul className="list-disc list-inside text-[12px] space-y-1">
          <li>Multi pair, dynamic lot, smart news filter</li>
          <li>24/7 VPS, tinggal pakai, stabil & aman</li>
          <li>Support premium untuk guidance & setup cepat</li>
        </ul>
        <button
          onClick={() => setShowUpgrade(true)}
          className="mt-3 px-4 py-2 rounded-lg bg-[#22ff88] text-black font-semibold hover:bg-[#3cffaa] transition"
        >
          Coba Premium Trial →
        </button>
        {showUpgrade && (
          <p className="mt-2 text-[11px] text-gray-400">
            Upgrade aman & mudah tanpa ganggu akun realmu.
          </p>
        )}
      </div>

      {/* MINI NOTIFICATIONS */}
      <div className="mt-6 space-y-2">
        <div className="flex items-center gap-2 text-[11px] text-gray-400">
          <span className="w-2 h-2 rounded-full bg-[#22ff88] animate-pulse" />
          Sistem siap untuk trading pertama Anda.
        </div>
        <div className="flex items-center gap-2 text-[11px] text-gray-400">
          <span className="w-2 h-2 rounded-full bg-[#22ff88] animate-pulse" />
          Risiko terbatas: 1 pair, lot kecil, max 1 posisi.
        </div>
        <div className="flex items-center gap-2 text-[11px] text-gray-400">
          <span className="w-2 h-2 rounded-full bg-[#22ff88] animate-pulse" />
          Upgrade untuk fitur penuh dan multi pair.
        </div>
      </div>
    </section>
  );
}

// ================= LIVE PROFIT TABLE + TRADING VISUAL =================
interface LiveProfitTableProps {
  enabled?: boolean;
}

interface TradeEntry {
  time: string;
  pair: string;
  lot: number;
  result: number;
}

export function LiveProfitTable({ enabled = true }: LiveProfitTableProps) {
  const [trades, setTrades] = useState<TradeEntry[]>([]);
  const [profit, setProfit] = useState(0);

  // Simulasi live trading untuk AI BASIC
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      const newTrade: TradeEntry = {
        time: new Date().toLocaleTimeString(),
        pair: "XAUUSD",
        lot: 0.01,
        result: parseFloat((Math.random() * 2 - 1).toFixed(2)), // -1 s.d +1$
      };
      setTrades((prev) => [newTrade, ...prev.slice(0, 9)]);
      setProfit((prev) => parseFloat((prev + newTrade.result).toFixed(2)));
    }, 4000);

    return () => clearInterval(interval);
  }, [enabled]);

  return (
    <div className="bg-[#0B1220] border border-[#22ff88] rounded-2xl p-5 shadow-[0_0_40px_rgba(34,255,136,0.15)] mt-6">
      <div className="flex justify-between items-center mb-3">
        <div className="text-[11px] text-gray-400 uppercase tracking-widest">
          Live Profit (AI BASIC)
        </div>
        <div className="text-[#22ff88] font-bold text-lg tabular-nums">
          ${profit.toLocaleString()}
        </div>
      </div>

      <table className="w-full text-[12px] text-gray-400 border-collapse">
        <thead>
          <tr>
            <th className="text-left pb-2">Time</th>
            <th className="text-left pb-2">Pair</th>
            <th className="text-left pb-2">Lot</th>
            <th className="text-right pb-2">Result</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade, i) => (
            <tr key={i} className="hover:bg-[#22ff8820] transition">
              <td>{trade.time}</td>
              <td>{trade.pair}</td>
              <td>{trade.lot}</td>
              <td
                className={`text-right ${
                  trade.result >= 0 ? "text-[#22ff88]" : "text-[#ff5577]"
                }`}
              >
                {trade.result >= 0 ? `+${trade.result}` : trade.result}$
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* SIMPLE SPARKLINE */}
      <div className="mt-4 h-24 w-full relative bg-[#1E293B] rounded-lg overflow-hidden">
        <svg className="w-full h-full">
          {trades.map((trade, i) => {
            const x = (i / 9) * 100;
            const y = 100 - ((trade.result + 1) / 2) * 100; // normalize -1..+1
            return <circle key={i} cx={`${x}%`} cy={`${y}%`} r="2" fill="#22ff88" />;
          })}
          {trades.length > 1 && (
            <polyline
              fill="none"
              stroke="#22ff88"
              strokeWidth={1.5}
              points={trades
                .map((trade, i) => {
                  const x = (i / 9) * 100;
                  const y = 100 - ((trade.result + 1) / 2) * 100;
                  return `${x}%,${y}%`;
                })
                .join(" ")}
            />
          )}
        </svg>
      </div>
    </div>
  );
}

// ================= CTA & UPGRADE FLOW =================
interface UpgradeProps {
  hasPremiumAccess: boolean;
  slotsLeft: number;
  onUpgradeClick: () => void;
}

export function UpgradeFlow({
  hasPremiumAccess,
  slotsLeft,
  onUpgradeClick,
}: UpgradeProps) {
  const [showPremiumNotif, setShowPremiumNotif] = useState(false);

  // muncul notifikasi trial setelah user pakai BASIC beberapa detik
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasPremiumAccess) setShowPremiumNotif(true);
    }, 8000); // 8 detik delay

    return () => clearTimeout(timer);
  }, [hasPremiumAccess]);

  return (
    <>
      {/* PRIMARY CTA */}
      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={onUpgradeClick}
          className="w-full py-3 rounded-xl
            bg-gradient-to-r from-[#22ff88] to-[#3cffaa]
            text-black font-bold
            shadow-[0_10px_30px_rgba(34,255,136,0.45)]
            active:scale-95
            transition"
        >
          Upgrade ke AI PRO
        </button>
        <div className="text-[12px] text-gray-400 text-center">
          Multi pair, dynamic lot & smart news filter
        </div>
      </div>

      {/* PREMIUM TRIAL NOTIFICATION */}
      {showPremiumNotif && !hasPremiumAccess && slotsLeft > 0 && (
        <div
          className="fixed top-6 right-6 z-50
            bg-[#0B0F18] border border-[#22ff88]
            px-4 py-3 rounded-xl text-sm text-[#22ff88]
            shadow-[0_0_40px_rgba(34,255,136,0.25)]
            animate-fadeInUp"
        >
          <div className="font-semibold">🔥 Trial Premium Available!</div>
          <div className="text-gray-400 text-xs mt-1">
            Coba AI PRO gratis sebentar & rasakan fitur lengkap.
          </div>
          <button
            onClick={() => {
              onUpgradeClick();
              setShowPremiumNotif(false);
            }}
            className="mt-2 w-full py-2 rounded-lg
              bg-[#22ff88] text-black text-sm font-semibold
              hover:bg-[#3cffaa] transition"
          >
            Activate Trial
          </button>
        </div>
      )}

      {/* PREMIUM SLOTS HAMPIR HABIS */}
      {slotsLeft <= 2 && slotsLeft > 0 && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50
            bg-[#0B0F18] border border-orange-400
            px-5 py-3 rounded-xl text-sm text-orange-400
            shadow-[0_0_30px_rgba(255,165,0,0.25)]
            animate-fadeInUp"
        >
          ⏳ Hanya {slotsLeft} slot premium trial tersisa hari ini!
        </div>
      )}

      {/* PREMIUM FULL */}
      {slotsLeft === 0 && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50
            bg-[#0B0F18] border border-gray-600
            px-5 py-3 rounded-xl text-sm text-gray-400
            shadow-[0_0_30px_rgba(255,255,255,0.1)]
            animate-fadeInUp"
        >
          ❌ Slot premium trial sudah penuh hari ini
        </div>
      )}
    </>
  );
}

// ================= VPS & SUPPORT FLOW =================
interface VPSProps {
  hasVPS: boolean;
  hasSupport: boolean;
  onVPSClick: () => void;
  onSupportClick: () => void;
}

export function VPSSupportFlow({
  hasVPS,
  hasSupport,
  onVPSClick,
  onSupportClick,
}: VPSProps) {
  return (
    <div className="mt-8 flex flex-col gap-6">

      {/* VPS FLOW */}
      <div
        className={`p-5 rounded-2xl
          bg-[#0B1220] border
          ${hasVPS ? "border-[#22ff88]" : "border-[#1F2937]"}
          shadow-[0_0_40px_rgba(34,255,136,0.15)]
          transition`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold text-[#22ff88]">
            VPS & Setup
          </div>
          <div className="text-[11px] text-gray-400">
            Rp150k – 200k / bulan
          </div>
        </div>
        <p className="text-gray-400 text-[12px] mb-3">
          VPS 24/7, AI berjalan walau HP mati & sinyal jelek. Install & setup semua siap pakai.
        </p>
        <button
          onClick={onVPSClick}
          className={`w-full py-2 rounded-lg font-semibold
            ${hasVPS
              ? "bg-[#22ff88] text-black"
              : "bg-[#1E293B] text-gray-300 hover:bg-[#22ff8820] hover:text-black"}
            transition`}
        >
          {hasVPS ? "VPS Aktif" : "Aktifkan VPS"}
        </button>
      </div>

      {/* SUPPORT PREMIUM FLOW */}
      <div
        className={`p-5 rounded-2xl
          bg-[#0B1220] border
          ${hasSupport ? "border-[#22ff88]" : "border-[#1F2937]"}
          shadow-[0_0_40px_rgba(34,255,136,0.15)]
          transition`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold text-[#22ff88]">
            Support Premium
          </div>
          <div className="text-[11px] text-gray-400">
            Rp100k – 300k / bulan
          </div>
        </div>
        <p className="text-gray-400 text-[12px] mb-3">
          Fast response (WA/Telegram), help setup, risk guidance. Tidak ada janji profit, hanya kontrol & ketenangan.
        </p>
        <button
          onClick={onSupportClick}
          className={`w-full py-2 rounded-lg font-semibold
            ${hasSupport
              ? "bg-[#22ff88] text-black"
              : "bg-[#1E293B] text-gray-300 hover:bg-[#22ff8820] hover:text-black"}
            transition`}
        >
          {hasSupport ? "Support Aktif" : "Aktifkan Support"}
        </button>
      </div>

    </div>
  );
}

// ================= LIVE PROFIT & TRADE SIMULATION =================


interface LiveProfitProps {
  pair?: string;
  maxLot?: number;
}

export function LiveProfitSimulation({
  pair = "XAUUSD",
  maxLot = 0.02,
}: LiveProfitProps) {
  const [profit, setProfit] = useState(0);
  const [position, setPosition] = useState<"long" | "short" | null>(null);
  const [lot, setLot] = useState<number>(maxLot);

  // Simulasi profit & posisi otomatis
  useEffect(() => {
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.5) * lot * 10; // fluktuasi kecil
      setProfit((prev) => +(prev + delta).toFixed(2));
      const newPos = Math.random() > 0.5 ? "long" : "short";
      setPosition(newPos);
    }, 3000);

    return () => clearInterval(interval);
  }, [lot]);

  return (
    <div className="mt-6 p-6 rounded-2xl bg-[#0B1220] border border-[#1F2937] shadow-[0_0_30px_rgba(34,255,136,0.15)]">
      
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-400">Pair</div>
        <div className="text-white font-semibold">{pair}</div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-400">Position</div>
        <div className={`font-bold ${position === "long" ? "text-[#22ff88]" : "text-[#ff5577]"}`}>
          {position ? position.toUpperCase() : "-"}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-400">Lot</div>
        <div className="text-white font-semibold">{lot.toFixed(2)}</div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-400">Live Profit</div>
        <div className={`font-bold ${profit >= 0 ? "text-[#22ff88]" : "text-[#ff5577]"}`}>
          ${profit}
        </div>
      </div>

      {/* Simple progress bar untuk sensasi visual */}
      <div className="w-full h-3 rounded-full bg-[#1E293B] overflow-hidden">
        <div
          className={`h-full rounded-full bg-[#22ff88] transition-all`}
          style={{
            width: `${Math.min(Math.abs(profit) * 5, 100)}%`,
          }}
        />
      </div>

      <p className="mt-2 text-[11px] text-gray-500">
        Simulasi trade otomatis, lot kecil, aman untuk testing sistem.
      </p>
    </div>
  );
}

// ================= CTA & UPGRADE PROMPT =================

interface UpgradePromptProps {
  active: boolean;
  onUpgradeClick: (type: "PRO" | "VPS" | "Support") => void;
}

export function UpgradePrompt({ active, onUpgradeClick }: UpgradePromptProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (active) {
      const timer = setTimeout(() => setVisible(true), 5000); // tampil 5 detik setelah aktif
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [active]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-8 right-8 w-80 p-5 rounded-2xl bg-[#0B1220] border border-[#22ff88] shadow-[0_0_50px_rgba(34,255,136,0.25)] z-50 animate-fade-in">
      
      <div className="text-[#22ff88] font-bold text-lg mb-2">
        Tingkatkan Sistem Anda
      </div>

      <p className="text-gray-400 text-sm mb-4">
        Untuk fitur penuh, stabilitas & kontrol lebih baik, coba upgrade ke:
      </p>

      <div className="flex flex-col gap-2">
        <button
          onClick={() => onUpgradeClick("PRO")}
          className="w-full py-2 rounded-lg bg-gradient-to-r from-[#22ff88] to-[#3cffaa] text-black font-semibold hover:scale-105 transition"
        >
          AI PRO — Rp299k / bln
        </button>

        <button
          onClick={() => onUpgradeClick("VPS")}
          className="w-full py-2 rounded-lg border border-[#22ff88] text-[#22ff88] hover:bg-[#22ff8820] font-semibold transition"
        >
          VPS + Setup — Rp150–200k / bln
        </button>

        <button
          onClick={() => onUpgradeClick("Support")}
          className="w-full py-2 rounded-lg border border-[#22ff88] text-[#22ff88] hover:bg-[#22ff8820] font-semibold transition"
        >
          Support Premium — Rp100–300k / bln
        </button>
      </div>

      <p className="mt-3 text-[11px] text-gray-500">
        Semua upgrade via sistem website, aman & nyaman. Profit bukan janji, tapi kontrol & ketenangan.
      </p>

      <button
        onClick={() => setVisible(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-white transition text-sm"
      >
        ×
      </button>
    </div>
  );
}
