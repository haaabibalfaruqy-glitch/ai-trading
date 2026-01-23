// /app/Shared/Footer.tsx

"use client";

import React from "react";
import { useAccess } from "@/context/UserAccessContext";
import { Cpu, ShieldCheck, Zap } from "lucide-react";

/**
 * Footer — Global Footer dengan Sinkronisasi Status Akses Real-time
 * @component
 */
export default function Footer() {
  // Mengambil data akses langsung dari context global (Urutan 2)
  const { access, isAuthenticated, isLoading } = useAccess();
  const currentYear = new Date().getFullYear();

  // Memastikan status premium terbaca dengan akurat
  const isPremium = access === "premium";

  return (
    <footer className="relative w-full py-12 px-6 border-t border-white/5 bg-[#080E1A] overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
        
        {/* Brand Logo Section */}
        <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
          <div className="bg-emerald-500 p-1.5 rounded-lg">
            <Cpu className="w-4 h-4 text-black" />
          </div>
          <span className="text-lg font-black tracking-tighter text-white uppercase">
            OMEGA<span className="text-emerald-500">AI</span>
          </span>
        </div>

        {/* Status Indicator (SINKRON!) */}
        <div className="flex flex-col items-center gap-2">
          {!isLoading && isPremium ? (
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400" />
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest animate-pulse">
                Premium Neural Link Active
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/5">
              <ShieldCheck className="w-3 h-3 text-slate-500" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                System Secured & Encrypted
              </span>
            </div>
          )}
        </div>

        {/* Copyright & Links */}
        <div className="flex flex-col md:flex-row items-center gap-4 text-[11px] text-slate-500 font-medium">
          <p>© {currentYear} OMEGA AI EXECUTION ENGINE.</p>
          <span className="hidden md:inline text-slate-800">|</span>
          <div className="flex gap-4 uppercase tracking-widest">
            <a href="#" className="hover:text-emerald-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Network</a>
          </div>
        </div>

      </div>
    </footer>
  );
}