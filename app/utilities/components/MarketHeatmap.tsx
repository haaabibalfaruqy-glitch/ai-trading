'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Zap } from 'lucide-react';
import { useIsAuthenticated, useIsPremium } from '@/context/UserAccessContext';
import { trackEvent } from '@/lib/events';

interface HeatmapCell {
  id: string;
  symbol: string;
  sector: string;
  performance: number;
  price: number;
  volume: number;
}

/* ================= MOCK DATA (AMAN DIGANTI API) ================= */
const HEATMAP_DATA: HeatmapCell[] = [ /* ← data kamu TETAP */ 
  { id: '1', symbol: 'AAPL', sector: 'Technology', performance: 23, price: 195.5, volume: 52000000 },
  { id: '2', symbol: 'MSFT', sector: 'Technology', performance: -12, price: 432.1, volume: 28000000 },
  { id: '3', symbol: 'GOOGL', sector: 'Technology', performance: 45, price: 142.8, volume: 22000000 },
  { id: '4', symbol: 'TSLA', sector: 'Technology', performance: 67, price: 248.6, volume: 112000000 },
  { id: '5', symbol: 'NVDA', sector: 'Technology', performance: 89, price: 875.2, volume: 35000000 },
];

/* ================= COLOR ENGINE ================= */
const getHeatColor = (v: number) => {
  if (v >= 60) return 'rgba(34,255,136,0.95)';
  if (v >= 30) return 'rgba(102,221,153,0.9)';
  if (v > 0) return 'rgba(153,238,153,0.85)';
  if (v > -30) return 'rgba(255,153,102,0.85)';
  return 'rgba(255,85,85,0.9)';
};

export default function MarketHeatmap() {
  const isAuth = useIsAuthenticated();
  const isPremium = useIsPremium();
  const isLocked = !isAuth && !isPremium;

  const [selected, setSelected] = useState<string | null>(null);
  const [sector, setSector] = useState('Technology');
  const [live, setLive] = useState<Record<string, number>>({});

  /* ================= REALTIME SIM ================= */
  useEffect(() => {
    const id = setInterval(() => {
      const u: Record<string, number> = {};
      HEATMAP_DATA.forEach(c => {
        u[c.id] = c.performance + (Math.random() - 0.5) * 8;
      });
      setLive(u);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  /* ================= GROUPING ================= */
  const bySector = useMemo(() => {
    return HEATMAP_DATA.reduce((a, c) => {
      (a[c.sector] ||= []).push(c);
      return a;
    }, {} as Record<string, HeatmapCell[]>);
  }, []);

  const sectors = Object.keys(bySector);

  /* ================= TRACK VIEW ================= */
  useEffect(() => {
    trackEvent('module_view', { module: 'market_heatmap' });
  }, []);

  /* ================= LOCK VIEW ================= */
  if (isLocked) {
    return (
      <div className="rounded-2xl bg-[#0B1220] border border-[#1F2937] p-10 text-center">
        <Zap className="mx-auto mb-3 text-[#22ff88]" size={36} />
        <p className="text-sm text-gray-400 mb-3">
          Market Heatmap is locked
        </p>
        <button
          onClick={() => trackEvent('execution_gate_click', { module: 'heatmap' })}
          className="px-4 py-2 text-xs rounded-lg bg-[#22ff88] text-black font-semibold"
        >
          Unlock Advanced Market View →
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-[#0B1220] border border-[#22ff88]/10 p-6">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <Zap className="text-[#22ff88]" />
        <h3 className="text-xl font-bold text-white">Market Heatmap</h3>
      </div>

      {/* SECTOR TABS */}
      <div className="flex gap-2 mb-5 overflow-x-auto">
        {sectors.map(s => (
          <button
            key={s}
            onClick={() => setSector(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              sector === s
                ? 'bg-[#22ff88] text-black'
                : 'bg-[#161c2e] text-gray-400 hover:text-white'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {bySector[sector].map(c => {
          const perf = live[c.id] ?? c.performance;
          const active = selected === c.id;

          return (
            <div
              key={c.id}
              onClick={() => setSelected(active ? null : c.id)}
              className="cursor-pointer rounded-xl p-3 transition-all hover:scale-[1.05]"
              style={{ background: getHeatColor(perf) }}
            >
              <p className="font-bold text-sm">{c.symbol}</p>
              <p className="text-xs opacity-80">
                {perf > 0 ? '+' : ''}{perf.toFixed(1)}%
              </p>

              {active && (
                <div className="mt-2 pt-2 border-t border-black/20 text-xs">
                  <p>${c.price.toFixed(2)}</p>
                  <p>{(c.volume / 1e6).toFixed(0)}M vol</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
