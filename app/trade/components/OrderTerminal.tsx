// app/trade/components/OrderTerminal.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Zap, ShieldAlert, ArrowRight, Wallet, Info } from "lucide-react";

interface OrderTerminalProps {
  selectedCoin: any;
  executionUnlocked: boolean;
  onUnlock: () => void;
  capitalMode: string;
}

export default function OrderTerminal({
  selectedCoin,
  executionUnlocked,
  onUnlock,
  capitalMode,
}) {
  const [amount, setAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Simulasi perhitungan biaya
  const estimatedFee = amount ? parseFloat(amount) * 0.001 : 0;
  const totalCost = amount ? parseFloat(amount) + estimatedFee : 0;

  const handleExecute = (type: "BUY" | "SELL") => {
    setIsProcessing(true);
    // Simulasi eksekusi ke blockchain/broker
    setTimeout(() => {
      setIsProcessing(false);
      alert(`${type} Order Executed for ${selectedCoin?.symbol || 'Asset'}`);
    }, 1500);
  };

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-[#0C1322] border border-white/[0.05] p-6 shadow-2xl">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
        <Zap size={120} />
      </div>

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-neon-green/10 text-neon-green">
            <Zap size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Order Execution</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Neural Direct Link</p>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 text-[11px] font-mono text-gray-400">
            <Wallet size={12} className="text-neon-green" />
            <span>BAL: $42,080.45</span>
          </div>
        </div>
      </div>

      {/* ASSET SELECTOR DISPLAY */}
      <div className="mb-6 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter">Target Instrument</span>
          <span className="text-[10px] font-mono text-neon-green bg-neon-green/10 px-2 py-0.5 rounded">AUTO_LIQUIDITY_ON</span>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-800" />
          <span className="text-xl font-black text-white">{selectedCoin?.symbol || "SELECT ASSET"}</span>
        </div>
      </div>

      {/* INPUT FIELD */}
      <div className="space-y-4 mb-8">
        <div className="relative">
          <label className="absolute -top-2 left-4 px-2 bg-[#0C1322] text-[10px] font-bold text-gray-500 uppercase tracking-widest z-10">
            Order Quantity (USD)
          </label>
          <input 
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-black/40 border border-white/[0.05] rounded-2xl px-6 py-5 text-2xl font-mono font-bold text-white focus:outline-none focus:border-neon-green/50 transition-all placeholder:opacity-20"
          />
        </div>

        {/* FEE ESTIMATE */}
        <div className="flex justify-between px-2 text-[11px] font-medium">
          <span className="text-gray-500">Network Fee (0.1%)</span>
          <span className="text-gray-300">${estimatedFee.toFixed(2)}</span>
        </div>
      </div>

      {/* LOCK/UNLOCK LOGIC */}
      {!executionUnlocked ? (
        <button 
          onClick={onUnlock}
          className="w-full py-6 rounded-2xl bg-white/[0.03] border border-dashed border-white/20 flex flex-col items-center gap-2 group hover:bg-white/[0.05] hover:border-neon-green/50 transition-all"
        >
          <div className="p-3 rounded-full bg-white/5 text-gray-400 group-hover:text-neon-green transition-colors">
            <ShieldAlert size={24} />
          </div>
          <span className="text-xs font-bold text-gray-400 group-hover:text-white uppercase tracking-widest">Click to Unlock Terminal</span>
        </button>
      ) : (
        <div className="flex gap-4 animate-in fade-in zoom-in-95 duration-300">
          <button 
            disabled={!amount || isProcessing}
            onClick={() => handleExecute("BUY")}
            className="flex-1 bg-neon-green text-black font-black py-5 rounded-2xl shadow-[0_10px_20px_rgba(34,255,136,0.2)] hover:shadow-[0_15px_30px_rgba(34,255,136,0.3)] hover:-translate-y-1 transition-all disabled:opacity-30 disabled:translate-y-0"
          >
            {isProcessing ? "PROCESSING..." : "PLACE BUY"}
          </button>
          
          <button 
            disabled={!amount || isProcessing}
            onClick={() => handleExecute("SELL")}
            className="flex-1 bg-neon-pink text-white font-black py-5 rounded-2xl shadow-[0_10px_20px_rgba(255,0,128,0.2)] hover:shadow-[0_15px_30px_rgba(255,0,128,0.3)] hover:-translate-y-1 transition-all disabled:opacity-30 disabled:translate-y-0"
          >
            {isProcessing ? "PROCESSING..." : "PLACE SELL"}
          </button>
        </div>
      )}

      {/* FOOTER ADVISORY */}
      <div className="mt-8 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex gap-3">
        <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
        <p className="text-[10px] text-gray-500 leading-relaxed italic">
          <b>AI Advisory:</b> Current <span className="text-white">"{capitalMode}"</span> mode limits max exposure to 5% of total liquidity per trade.
        </p>
      </div>
    </div>
  );
}