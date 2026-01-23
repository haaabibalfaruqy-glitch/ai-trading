'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
} from 'lucide-react';

/* ================= TYPES ================= */

interface Position {
  id: string;
  symbol: string;
  shares: number;
  entryPrice: number;
  currentPrice: number;
  timestamp: number;
}

interface Order {
  id: string;
  symbol: string;
  action: 'BUY' | 'SELL';
  shares: number;
  price: number;
  timestamp: number;
  status: 'filled';
}

/* ================= MARKET MOCK ================= */

const MARKET_SYMBOLS = [
  { symbol: 'AAPL', price: 195.5, change: 2.3 },
  { symbol: 'MSFT', price: 432.1, change: -1.2 },
  { symbol: 'GOOGL', price: 142.8, change: 3.1 },
  { symbol: 'TSLA', price: 248.6, change: 4.5 },
  { symbol: 'AMZN', price: 193.2, change: -0.8 },
];

/* ================= COMPONENT ================= */

export default function TradeSimulator() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cashBalance, setCashBalance] = useState(100_000);
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [tradeShares, setTradeShares] = useState('1');
  const [activeTab, setActiveTab] = useState<'trade' | 'positions' | 'orders'>('trade');

  /* ================= HELPERS ================= */

  const getMarketPrice = useCallback((symbol: string) => {
    const base = MARKET_SYMBOLS.find((s) => s.symbol === symbol);
    if (!base) return 0;
    const volatility = (Math.random() - 0.5) * 2;
    return +(base.price + volatility).toFixed(2);
  }, []);

  /* ================= BUY ================= */

  const handleBuy = useCallback(() => {
    const shares = Number(tradeShares);
    if (!shares || shares <= 0) return;

    const price = getMarketPrice(selectedSymbol);
    const cost = shares * price;
    if (cost > cashBalance) return alert('Insufficient funds');

    setCashBalance((c) => c - cost);

    setPositions((prev) => {
      const existing = prev.find((p) => p.symbol === selectedSymbol);
      if (!existing) {
        return [
          ...prev,
          {
            id: `POS-${Date.now()}`,
            symbol: selectedSymbol,
            shares,
            entryPrice: price,
            currentPrice: price,
            timestamp: Date.now(),
          },
        ];
      }

      const avg =
        (existing.shares * existing.entryPrice + shares * price) /
        (existing.shares + shares);

      return prev.map((p) =>
        p.symbol === selectedSymbol
          ? { ...p, shares: p.shares + shares, entryPrice: avg, currentPrice: price }
          : p
      );
    });

    setOrders((o) => [
      {
        id: `ORD-${Date.now()}`,
        symbol: selectedSymbol,
        action: 'BUY',
        shares,
        price,
        timestamp: Date.now(),
        status: 'filled',
      },
      ...o,
    ]);

    setTradeShares('1');
  }, [tradeShares, selectedSymbol, cashBalance, getMarketPrice]);

  /* ================= SELL ================= */

  const handleSell = useCallback(() => {
    const shares = Number(tradeShares);
    if (!shares || shares <= 0) return;

    const pos = positions.find((p) => p.symbol === selectedSymbol);
    if (!pos || pos.shares < shares) return alert('Insufficient shares');

    const price = getMarketPrice(selectedSymbol);
    const proceeds = shares * price;

    setCashBalance((c) => c + proceeds);

    setPositions((prev) =>
      prev
        .map((p) =>
          p.symbol === selectedSymbol
            ? { ...p, shares: p.shares - shares, currentPrice: price }
            : p
        )
        .filter((p) => p.shares > 0)
    );

    setOrders((o) => [
      {
        id: `ORD-${Date.now()}`,
        symbol: selectedSymbol,
        action: 'SELL',
        shares,
        price,
        timestamp: Date.now(),
        status: 'filled',
      },
      ...o,
    ]);

    setTradeShares('1');
  }, [tradeShares, selectedSymbol, positions, getMarketPrice]);

  /* ================= METRICS ================= */

  const portfolioValue = useMemo(
    () =>
      cashBalance +
      positions.reduce((t, p) => t + p.shares * p.currentPrice, 0),
    [cashBalance, positions]
  );

  const pnl = useMemo(
    () =>
      positions.reduce(
        (t, p) => t + (p.currentPrice - p.entryPrice) * p.shares,
        0
      ),
    [positions]
  );

  const pnlPercent = portfolioValue
    ? ((pnl / (portfolioValue - pnl)) * 100).toFixed(2)
    : '0.00';

  /* ================= UI ================= */

  return (
    <div className="w-full rounded-2xl border border-[#22ff88]/10 bg-gradient-to-br from-[#0B1220] to-[#070B14] p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white">Trade Simulator</h3>
          <p className="text-xs text-[#9aa0c8]">Paper trading environment</p>
        </div>
        <ShoppingCart className="text-[#22ff88]" />
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
        <Stat label="Portfolio" value={`$${portfolioValue.toFixed(2)}`} />
        <Stat
          label="P&L"
          value={`${pnl >= 0 ? '+' : ''}${pnl.toFixed(2)} (${pnlPercent}%)`}
          positive={pnl >= 0}
        />
        <Stat label="Cash" value={`$${cashBalance.toFixed(2)}`} />
      </div>

      {/* TABS */}
      <div className="flex gap-4 border-b border-[#22ff88]/10 mb-6">
        {(['trade', 'positions', 'orders'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`pb-2 font-semibold ${
              activeTab === t
                ? 'text-[#22ff88] border-b-2 border-[#22ff88]'
                : 'text-[#9aa0c8]'
            }`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* TRADE TAB */}
      {activeTab === 'trade' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {MARKET_SYMBOLS.map((m) => (
              <button
                key={m.symbol}
                onClick={() => setSelectedSymbol(m.symbol)}
                className={`rounded-lg p-3 text-sm transition ${
                  selectedSymbol === m.symbol
                    ? 'bg-[#22ff88] text-[#0B1220]'
                    : 'bg-[#161c2e] text-white'
                }`}
              >
                <div className="font-bold">{m.symbol}</div>
                <div className="text-xs">${m.price.toFixed(2)}</div>
              </button>
            ))}
          </div>

          <input
            type="number"
            value={tradeShares}
            min={1}
            onChange={(e) => setTradeShares(e.target.value)}
            className="w-full rounded-lg bg-[#161c2e] border border-[#22ff88]/20 px-4 py-2 text-white"
          />

          <div className="flex gap-4">
            <ActionButton onClick={handleBuy} icon={<TrendingUp />} label="BUY" green />
            <ActionButton onClick={handleSell} icon={<TrendingDown />} label="SELL" />
          </div>
        </div>
      )}

      {/* POSITIONS */}
      {activeTab === 'positions' && (
        <EmptyOrList items={positions} empty="No open positions">
          {(p) => (
            <div key={p.id} className="rounded-lg bg-[#161c2e] p-4">
              <div className="flex justify-between">
                <span className="font-bold text-white">{p.symbol}</span>
                <span className="text-sm text-[#22ff88]">
                  {(p.currentPrice - p.entryPrice) * p.shares >= 0 ? '+' : ''}
                  {((p.currentPrice - p.entryPrice) * p.shares).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </EmptyOrList>
      )}

      {/* ORDERS */}
      {activeTab === 'orders' && (
        <EmptyOrList items={orders} empty="No orders yet">
          {(o) => (
            <div key={o.id} className="rounded-lg bg-[#161c2e] p-3 text-xs">
              {o.action} {o.symbol} {o.shares} @ ${o.price}
            </div>
          )}
        </EmptyOrList>
      )}
    </div>
  );
}

/* ================= SUB COMPONENTS ================= */

function Stat({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-[#9aa0c8]">{label}</p>
      <p className={`font-bold ${positive ? 'text-[#22ff88]' : 'text-white'}`}>
        {value}
      </p>
    </div>
  );
}

function ActionButton({
  onClick,
  icon,
  label,
  green,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  green?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-3 font-bold ${
        green
          ? 'bg-[#22ff88] text-[#0B1220]'
          : 'bg-[#ff5555] text-white'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function EmptyOrList<T>({
  items,
  empty,
  children,
}: {
  items: T[];
  empty: string;
  children: (item: T) => React.ReactNode;
}) {
  if (!items.length)
    return <p className="text-center text-[#9aa0c8] py-8">{empty}</p>;
  return <div className="space-y-3">{items.map(children)}</div>;
}
