'use client';

import React, { useState, useCallback } from 'react';
import { TrendingUp, TrendingDown, ShoppingCart, X } from 'lucide-react';

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
  status: 'filled' | 'pending';
}

const MARKET_SYMBOLS = [
  { symbol: 'AAPL', price: 195.5, change: 2.3 },
  { symbol: 'MSFT', price: 432.1, change: -1.2 },
  { symbol: 'GOOGL', price: 142.8, change: 3.1 },
  { symbol: 'TSLA', price: 248.6, change: 4.5 },
  { symbol: 'AMZN', price: 193.2, change: -0.8 },
];

export default function TradeSimulator() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cashBalance, setCashBalance] = useState(100000);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('AAPL');
  const [tradeShares, setTradeShares] = useState<string>('1');
  const [activeTab, setActiveTab] = useState<'trade' | 'positions' | 'orders'>('trade');

  // Market data with slight volatility
  const getMarketPrice = (symbol: string) => {
    const base = MARKET_SYMBOLS.find((s) => s.symbol === symbol);
    if (!base) return 0;
    const volatility = (Math.random() - 0.5) * 2;
    return parseFloat((base.price + volatility).toFixed(2));
  };

  // Execute buy order
  const handleBuy = useCallback(() => {
    const shares = parseInt(tradeShares);
    if (isNaN(shares) || shares <= 0) return;

    const price = getMarketPrice(selectedSymbol);
    const cost = shares * price;

    if (cost > cashBalance) {
      alert('Insufficient funds');
      return;
    }

    // Create order
    const orderId = `ORD-${Date.now()}`;
    const newOrder: Order = {
      id: orderId,
      symbol: selectedSymbol,
      action: 'BUY',
      shares,
      price,
      timestamp: Date.now(),
      status: 'filled',
    };

    // Update position or create new one
    const existingPosition = positions.find((p) => p.symbol === selectedSymbol);
    if (existingPosition) {
      const avgPrice = (existingPosition.shares * existingPosition.entryPrice + shares * price) / (existingPosition.shares + shares);
      setPositions(
        positions.map((p) =>
          p.symbol === selectedSymbol
            ? { ...p, shares: p.shares + shares, entryPrice: avgPrice, currentPrice: price }
            : p
        )
      );
    } else {
      const newPosition: Position = {
        id: `POS-${selectedSymbol}-${Date.now()}`,
        symbol: selectedSymbol,
        shares,
        entryPrice: price,
        currentPrice: price,
        timestamp: Date.now(),
      };
      setPositions([...positions, newPosition]);
    }

    setCashBalance(cashBalance - cost);
    setOrders([newOrder, ...orders]);
    setTradeShares('1');
  }, [selectedSymbol, tradeShares, cashBalance, positions, orders]);

  // Execute sell order
  const handleSell = useCallback(() => {
    const shares = parseInt(tradeShares);
    if (isNaN(shares) || shares <= 0) return;

    const position = positions.find((p) => p.symbol === selectedSymbol);
    if (!position || position.shares < shares) {
      alert('Insufficient shares to sell');
      return;
    }

    const price = getMarketPrice(selectedSymbol);
    const proceeds = shares * price;

    // Create order
    const orderId = `ORD-${Date.now()}`;
    const newOrder: Order = {
      id: orderId,
      symbol: selectedSymbol,
      action: 'SELL',
      shares,
      price,
      timestamp: Date.now(),
      status: 'filled',
    };

    // Update position
    setPositions(
      positions
        .map((p) =>
          p.symbol === selectedSymbol
            ? { ...p, shares: p.shares - shares, currentPrice: price }
            : p
        )
        .filter((p) => p.shares > 0)
    );

    setCashBalance(cashBalance + proceeds);
    setOrders([newOrder, ...orders]);
    setTradeShares('1');
  }, [selectedSymbol, tradeShares, cashBalance, positions, orders]);

  // Calculate P&L
  const calculatePnL = () => {
    return positions.reduce((total, pos) => {
      const currentValue = pos.shares * pos.currentPrice;
      const entryValue = pos.shares * pos.entryPrice;
      return total + (currentValue - entryValue);
    }, 0);
  };

  const portfolioValue = cashBalance + positions.reduce((total, pos) => total + pos.shares * pos.currentPrice, 0);
  const pnl = calculatePnL();
  const pnlPercent = ((pnl / (portfolioValue - pnl)) * 100).toFixed(2);

  return (
    <div className="w-full bg-gradient-to-br from-[#0B1220] to-[#070B14] rounded-2xl border border-[#22ff88]/10 p-6 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Trade Simulator</h3>
          <div className="flex gap-6 text-sm">
            <div>
              <p className="text-[#9aa0c8] text-xs uppercase tracking-wide">Portfolio Value</p>
              <p className="text-xl font-bold text-[#22ff88]">${portfolioValue.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[#9aa0c8] text-xs uppercase tracking-wide">P&L</p>
              <p className={`text-xl font-bold ${pnl >= 0 ? 'text-[#22ff88]' : 'text-[#ff5555]'}`}>
                {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)} ({pnlPercent}%)
              </p>
            </div>
            <div>
              <p className="text-[#9aa0c8] text-xs uppercase tracking-wide">Cash</p>
              <p className="text-xl font-bold text-white">${cashBalance.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <ShoppingCart className="text-[#22ff88]" size={32} />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-[#22ff88]/10">
        {(['trade', 'positions', 'orders'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold transition-all ${
              activeTab === tab
                ? 'text-[#22ff88] border-b-2 border-[#22ff88]'
                : 'text-[#9aa0c8] hover:text-white'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Trade Tab */}
      {activeTab === 'trade' && (
        <div className="space-y-6">
          {/* Symbol Selection */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Select Asset</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {MARKET_SYMBOLS.map((item) => (
                <button
                  key={item.symbol}
                  onClick={() => setSelectedSymbol(item.symbol)}
                  className={`p-3 rounded-lg transition-all ${
                    selectedSymbol === item.symbol
                      ? 'bg-[#22ff88] text-[#0B1220]'
                      : 'bg-[#161c2e] text-white hover:bg-[#1a1f2e]'
                  }`}
                >
                  <div className="font-bold text-sm">{item.symbol}</div>
                  <div className="text-xs mt-1">${item.price.toFixed(2)}</div>
                  <div className={`text-xs ${item.change >= 0 ? 'text-[#22ff88]' : 'text-[#ff5555]'}`}>
                    {item.change >= 0 ? '+' : ''}{item.change}%
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Trade Input */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Shares</label>
            <input
              type="number"
              value={tradeShares}
              onChange={(e) => setTradeShares(e.target.value)}
              min="1"
              max="1000"
              className="w-full bg-[#161c2e] border border-[#22ff88]/20 rounded-lg px-4 py-2 text-white placeholder-[#9aa0c8] focus:outline-none focus:border-[#22ff88] focus:ring-2 focus:ring-[#22ff88]/20"
              placeholder="Enter shares"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleBuy}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#22ff88] text-[#0B1220] font-bold hover:scale-105 transition-transform"
            >
              <TrendingUp size={20} /> Buy
            </button>
            <button
              onClick={handleSell}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#ff5555] text-white font-bold hover:scale-105 transition-transform"
            >
              <TrendingDown size={20} /> Sell
            </button>
          </div>

          {/* Order Book Preview */}
          <div className="bg-[#161c2e] rounded-lg p-4 border border-[#22ff88]/10">
            <h4 className="text-sm font-bold text-white mb-3">Simulated Order Book</h4>
            <div className="space-y-2 text-xs text-[#9aa0c8]">
              <div className="flex justify-between">
                <span>Current Price: ${getMarketPrice(selectedSymbol).toFixed(2)}</span>
                <span className="text-[#22ff88]">Market</span>
              </div>
              <div className="flex justify-between">
                <span>Bid: ${(getMarketPrice(selectedSymbol) - 0.5).toFixed(2)}</span>
                <span>Ask: ${(getMarketPrice(selectedSymbol) + 0.5).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Positions Tab */}
      {activeTab === 'positions' && (
        <div>
          {positions.length === 0 ? (
            <p className="text-center text-[#9aa0c8] py-8">No open positions</p>
          ) : (
            <div className="space-y-3">
              {positions.map((pos) => {
                const unrealizedPnl = (pos.currentPrice - pos.entryPrice) * pos.shares;
                const returnPercent = (((pos.currentPrice - pos.entryPrice) / pos.entryPrice) * 100).toFixed(2);
                return (
                  <div key={pos.id} className="bg-[#161c2e] rounded-lg p-4 border border-[#22ff88]/10">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-white">{pos.symbol}</p>
                        <p className="text-xs text-[#9aa0c8]">{pos.shares} shares @ ${pos.entryPrice.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${unrealizedPnl >= 0 ? 'text-[#22ff88]' : 'text-[#ff5555]'}`}>
                          {unrealizedPnl >= 0 ? '+' : ''}{unrealizedPnl.toFixed(2)}
                        </p>
                        <p className={`text-xs ${unrealizedPnl >= 0 ? 'text-[#22ff88]' : 'text-[#ff5555]'}`}>
                          {returnPercent}%
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          {orders.length === 0 ? (
            <p className="text-center text-[#9aa0c8] py-8">No orders yet</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {orders.map((order) => (
                <div key={order.id} className="bg-[#161c2e] rounded-lg p-3 border border-[#22ff88]/10 text-xs">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-white">{order.symbol}</p>
                      <p className="text-[#9aa0c8]">
                        {order.action} {order.shares} @ ${order.price.toFixed(2)}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded ${order.action === 'BUY' ? 'bg-[#22ff88]/20 text-[#22ff88]' : 'bg-[#ff5555]/20 text-[#ff5555]'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
