// app/portfolio/components/SecurityPanel.tsx

"use client";

import React from "react";
import { ShieldCheck, Lock, Fingerprint, Key, Server, AlertTriangle } from "lucide-react";

export default function SecurityPanel() {
  return (
    <div className="w-full bg-[#0C1322] border border-white/[0.05] rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]" />

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left Side: Security Score */}
        <div className="flex-1 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-white tracking-tight">Security Protocol</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Asset Protection Layer</p>
            </div>
          </div>

          <div className="p-6 rounded-[2rem] bg-black/40 border border-white/[0.05] relative overflow-hidden">
             <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Safety Score</p>
                  <p className="text-4xl font-black text-neon-green font-mono">98%</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-neon-green font-bold uppercase tracking-widest animate-pulse">● Shield_Active</p>
                </div>
             </div>
             {/* Progress Bar */}
             <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-neon-green w-[98%] shadow-[0_0_10px_rgba(34,255,136,0.3)]" />
             </div>
          </div>

          <div className="space-y-3">
            {[
              { label: "2FA Authentication", status: "Enabled", icon: <Fingerprint size={14} /> },
              { label: "Withdrawal Whitelist", status: "Active", icon: <Lock size={14} /> },
              { label: "API Encryption", status: "AES-256", icon: <Key size={14} /> },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="text-blue-400">{item.icon}</span>
                  {item.label}
                </div>
                <span className="text-[10px] font-mono font-bold text-neon-green uppercase">{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Storage Visualization */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-6">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <Server size={14} /> Storage Distribution
            </h4>
            
            <div className="space-y-6">
              {/* Cold Storage */}
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-white">Cold Storage (Vault)</span>
                  <span className="text-gray-400">85%</span>
                </div>
                <div className="h-3 w-full bg-white/5 rounded-lg p-0.5 border border-white/5">
                  <div className="h-full bg-blue-500 rounded-md w-[85%]" />
                </div>
                <p className="text-[9px] text-gray-600 italic">Highly secure, offline environment for long-term holdings.</p>
              </div>

              {/* Hot Wallet */}
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-white">Hot Wallet (Trade Ready)</span>
                  <span className="text-gray-400">15%</span>
                </div>
                <div className="h-3 w-full bg-white/5 rounded-lg p-0.5 border border-white/5">
                  <div className="h-full bg-neon-pink/50 rounded-md w-[15%]" />
                </div>
                <p className="text-[9px] text-gray-600 italic">Liquid assets currently assigned to active AI trading routes.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 rounded-2xl bg-amber-400/5 border border-amber-400/10 flex items-start gap-3">
            <AlertTriangle size={16} className="text-amber-400 shrink-0" />
            <p className="text-[10px] text-gray-500 leading-relaxed">
              Last security audit performed on <span className="text-white font-bold text-[9px]">2026-01-20</span>. No vulnerabilities detected in neural bridge.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}