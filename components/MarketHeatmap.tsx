'use client';

import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';

interface HeatmapCell {
  id: string;
  symbol: string;
  sector: string;
  performance: number; // -100 to 100
  price: number;
  volume: number;
}

const HEATMAP_DATA: HeatmapCell[] = [
  // Technology
  { id: '1', symbol: 'AAPL', sector: 'Technology', performance: 23, price: 195.5, volume: 52000000 },
  { id: '2', symbol: 'MSFT', sector: 'Technology', performance: -12, price: 432.1, volume: 28000000 },
  { id: '3', symbol: 'GOOGL', sector: 'Technology', performance: 45, price: 142.8, volume: 22000000 },
  { id: '4', symbol: 'TSLA', sector: 'Technology', performance: 67, price: 248.6, volume: 112000000 },
  { id: '5', symbol: 'NVDA', sector: 'Technology', performance: 89, price: 875.2, volume: 35000000 },

  // Finance
  { id: '6', symbol: 'JPM', sector: 'Finance', performance: -8, price: 187.3, volume: 8000000 },
  { id: '7', symbol: 'BAC', sector: 'Finance', performance: -15, price: 38.9, volume: 98000000 },
  { id: '8', symbol: 'GS', sector: 'Finance', performance: 5, price: 412.1, volume: 2000000 },
  { id: '9', symbol: 'MS', sector: 'Finance', performance: -22, price: 95.4, volume: 6000000 },

  // Healthcare
  { id: '10', symbol: 'JNJ', sector: 'Healthcare', performance: 12, price: 163.2, volume: 6000000 },
  { id: '11', symbol: 'UNH', sector: 'Healthcare', performance: -5, price: 492.8, volume: 3000000 },
  { id: '12', symbol: 'PFE', sector: 'Healthcare', performance: 34, price: 28.5, volume: 45000000 },
  { id: '13', symbol: 'LLY', sector: 'Healthcare', performance: 78, price: 812.1, volume: 2000000 },

  // Energy
  { id: '14', symbol: 'XOM', sector: 'Energy', performance: 56, price: 117.9, volume: 15000000 },
  { id: '15', symbol: 'CVX', sector: 'Energy', performance: 42, price: 163.2, volume: 8000000 },
  { id: '16', symbol: 'COP', sector: 'Energy', performance: 28, price: 112.5, volume: 42000000 },

  // Retail
  { id: '17', symbol: 'AMZN', sector: 'Retail', performance: -8, price: 193.2, volume: 52000000 },
  { id: '18', symbol: 'WMT', sector: 'Retail', performance: 18, price: 92.4, volume: 8000000 },
  { id: '19', symbol: 'TGT', sector: 'Retail', performance: -35, price: 61.2, volume: 18000000 },
];

export default function MarketHeatmap() {
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [expandedSector, setExpandedSector] = useState<string | null>('Technology');
  const [realTimeData, setRealTimeData] = useState<Record<string, number>>({});

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      const updates: Record<string, number> = {};
      HEATMAP_DATA.forEach((cell) => {
        updates[cell.id] = cell.performance + (Math.random() - 0.5) * 10;
      });
      setRealTimeData(updates);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Get color based on performance
  const getColor = (performance: number) => {
    if (performance > 50) return '#22ff88'; // Strong bullish - bright green
    if (performance > 20) return '#66dd99'; // Bullish - light green
    if (performance > 0) return '#99ee99'; // Slightly bullish - pale green
    if (performance > -20) return '#ff9966'; // Slightly bearish - pale red
    if (performance > -50) return '#ff6666'; // Bearish - light red
    return '#ff5555'; // Strong bearish - bright red
  };

  // Group data by sector
  const bySector = HEATMAP_DATA.reduce(
    (acc, cell) => {
      if (!acc[cell.sector]) acc[cell.sector] = [];
      acc[cell.sector].push(cell);
      return acc;
    },
    {} as Record<string, HeatmapCell[]>
  );

  const sectors = Object.keys(bySector).sort();

  return (
    <div className="w-full bg-gradient-to-br from-[#0B1220] to-[#070B14] rounded-2xl border border-[#22ff88]/10 p-6 mb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Zap className="text-[#22ff88]" size={28} />
        <div>
          <h3 className="text-2xl font-bold text-white">Market Heatmap</h3>
          <p className="text-sm text-[#9aa0c8]">Real-time sector & stock performance • Performance-based colors</p>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-[#161c2e] rounded-lg p-4 mb-6 border border-[#22ff88]/10">
        <p className="text-xs font-semibold text-[#9aa0c8] uppercase tracking-wide mb-3">Performance Scale</p>
        <div className="flex gap-2 overflow-x-auto">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ff5555' }}></div>
            <span className="text-xs text-[#9aa0c8]">-100%</span>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ff9966' }}></div>
            <span className="text-xs text-[#9aa0c8]">-20%</span>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#99ee99' }}></div>
            <span className="text-xs text-[#9aa0c8]">0%</span>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#66dd99' }}></div>
            <span className="text-xs text-[#9aa0c8]">+20%</span>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#22ff88' }}></div>
            <span className="text-xs text-[#9aa0c8]">+100%</span>
          </div>
        </div>
      </div>

      {/* Sector Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b border-[#22ff88]/10">
        {sectors.map((sector) => (
          <button
            key={sector}
            onClick={() => setExpandedSector(expandedSector === sector ? null : sector)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              expandedSector === sector
                ? 'bg-[#22ff88] text-[#0B1220]'
                : 'bg-[#161c2e] text-[#9aa0c8] hover:text-white border border-[#22ff88]/20'
            }`}
          >
            {sector}
            <span className="ml-2 text-xs opacity-75">({bySector[sector].length})</span>
          </button>
        ))}
      </div>

      {/* Heatmap Grid */}
      {expandedSector && (
        <div className="bg-[#161c2e] rounded-lg p-6 border border-[#22ff88]/10 mb-6">
          <h4 className="text-lg font-bold text-white mb-4">{expandedSector}</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {bySector[expandedSector].map((cell) => {
              const performance = realTimeData[cell.id] ?? cell.performance;
              const isSelected = selectedCell === cell.id;

              return (
                <div
                  key={cell.id}
                  onClick={() => setSelectedCell(isSelected ? null : cell.id)}
                  className="cursor-pointer transition-all transform hover:scale-105"
                  style={{
                    backgroundColor: getColor(performance),
                    borderRadius: '12px',
                    padding: '1rem',
                    opacity: performance < -30 ? 0.7 : 0.9,
                  }}
                >
                  <div className="text-center">
                    <p className="font-bold text-sm" style={{ color: performance > 0 ? '#000' : '#fff' }}>
                      {cell.symbol}
                    </p>
                    <p className="text-xs mt-1" style={{ color: performance > 0 ? '#000' : '#fff', opacity: 0.8 }}>
                      {performance > 0 ? '+' : ''}{performance.toFixed(1)}%
                    </p>
                  </div>

                  {/* Drill-down Details */}
                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                      <div className="text-xs space-y-1" style={{ color: performance > 0 ? '#000' : '#fff' }}>
                        <p>💰 ${cell.price.toFixed(2)}</p>
                        <p>📊 {(cell.volume / 1000000).toFixed(0)}M vol</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#161c2e] rounded-lg p-4 border border-[#22ff88]/10 text-center">
          <p className="text-3xl font-bold text-[#22ff88] mb-1">
            {HEATMAP_DATA.filter((c) => c.performance > 0).length}
          </p>
          <p className="text-xs text-[#9aa0c8]">Gainers</p>
        </div>
        <div className="bg-[#161c2e] rounded-lg p-4 border border-[#22ff88]/10 text-center">
          <p className="text-3xl font-bold text-[#5363ff] mb-1">
            {HEATMAP_DATA.filter((c) => Math.abs(c.performance) <= 20).length}
          </p>
          <p className="text-xs text-[#9aa0c8]">Neutral</p>
        </div>
        <div className="bg-[#161c2e] rounded-lg p-4 border border-[#22ff88]/10 text-center">
          <p className="text-3xl font-bold text-[#ff5555] mb-1">
            {HEATMAP_DATA.filter((c) => c.performance < 0).length}
          </p>
          <p className="text-xs text-[#9aa0c8]">Losers</p>
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 bg-[#0B1220]/50 rounded-lg p-4 border border-[#22ff88]/10">
        <p className="text-xs text-[#9aa0c8] leading-relaxed">
          🔥 <span className="font-semibold">Live Heat Mapping:</span> Each cell updates every 3 seconds. Darker colors = stronger sentiment. Click any stock to see detailed metrics.
        </p>
      </div>
    </div>
  );
}
