// app/settings/page.tsx

"use client";

import React, { useState } from "react";
import { 
  Settings, 
  User, 
  Cpu, 
  Bell, 
  Key, 
  Shield, 
  Save, 
  ChevronRight,
  Database
} from "lucide-react";
import HeroVisual from "@/app/Shared/HeroVisual";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("ai");

  const menuItems = [
    { id: "ai", label: "AI Configuration", icon: <Cpu size={18} /> },
    { id: "api", label: "Exchange API", icon: <Key size={18} /> },
    { id: "notifications", label: "Neural Alerts", icon: <Bell size={18} /> },
    { id: "security", label: "Security & 2FA", icon: <Shield size={18} /> },
  ];

  return (
    <div className="relative min-h-screen bg-[#070B14] text-white">
      
      {/* ATMOSPHERE BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[120px]" />
      </div>

      <main className="max-w-[1440px] mx-auto px-6 lg:px-10 py-10">
        
        {/* HEADER */}
        <div className="mb-12">
          <HeroVisual 
            title="System Preferences"
            subtitle="Core Configuration Terminal"
            description="Fine-tune your neural trading parameters, manage secure API connections, and customize system behavior."
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* SIDEBAR NAVIGATION */}
          <aside className="w-full lg:w-72 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 border ${
                  activeTab === item.id 
                    ? "bg-neon-green/10 border-neon-green/30 text-neon-green" 
                    : "bg-white/[0.02] border-white/5 text-gray-500 hover:bg-white/[0.05]"
                }`}
              >
                <div className="flex items-center gap-3 font-bold text-xs uppercase tracking-widest">
                  {item.icon}
                  {item.label}
                </div>
                <ChevronRight size={14} className={activeTab === item.id ? "opacity-100" : "opacity-0"} />
              </button>
            ))}
          </aside>

          {/* MAIN CONFIGURATION AREA */}
          <div className="flex-1 bg-[#0C1322] border border-white/[0.05] rounded-[2.5rem] p-8 lg:p-10 shadow-2xl min-h-[600px] relative overflow-hidden">
            
            {activeTab === "ai" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-4 mb-2">
                   <div className="p-3 rounded-xl bg-neon-green/10 text-neon-green border border-neon-green/20">
                     <Cpu size={24} />
                   </div>
                   <div>
                     <h3 className="text-xl font-bold">Neural Engine Tuning</h3>
                     <p className="text-xs text-gray-500">Adjust the risk-reward ratio for automated execution.</p>
                   </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-black/40 border border-white/5">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Trading Aggressiveness</label>
                    <input type="range" className="w-full accent-neon-green" />
                    <div className="flex justify-between text-[10px] font-mono text-gray-600 mt-2 uppercase">
                      <span>Conservative</span>
                      <span className="text-neon-green font-bold text-xs">Dynamic Growth</span>
                      <span>High Frequency</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 rounded-2xl bg-black/40 border border-white/5">
                      <p className="text-sm font-bold mb-1">Max Daily Drawdown</p>
                      <p className="text-[10px] text-gray-500 mb-4 tracking-tighter uppercase font-mono">STOP_AUTO_EXECUTION_AT_%</p>
                      <input type="number" placeholder="5.0" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-neon-green font-mono focus:outline-none" />
                    </div>
                    <div className="p-6 rounded-2xl bg-black/40 border border-white/5">
                      <p className="text-sm font-bold mb-1">Min. Confidence Score</p>
                      <p className="text-[10px] text-gray-500 mb-4 tracking-tighter uppercase font-mono">EXECUTE_ABOVE_%_MATCH</p>
                      <input type="number" placeholder="85" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-neon-green font-mono focus:outline-none" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "api" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-4">
                   <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                     <Database size={24} />
                   </div>
                   <div>
                     <h3 className="text-xl font-bold">Exchange Connectivity</h3>
                     <p className="text-xs text-gray-500">Manage your read/write API keys for multi-exchange trading.</p>
                   </div>
                </div>
                
                <div className="p-8 rounded-[2rem] border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-center">
                  <Key size={48} className="text-gray-700 mb-4" />
                  <p className="text-sm text-gray-400 mb-6">No API keys connected. Please add a key to start trading.</p>
                  <button className="px-8 py-3 bg-white text-black font-black text-xs uppercase rounded-full hover:bg-neon-green transition-colors">
                    Add New API Key
                  </button>
                </div>
              </div>
            )}

            {/* SAVE BUTTON (Fixed at bottom) */}
            <div className="absolute bottom-10 left-10 right-10 flex justify-end">
              <button className="flex items-center gap-2 px-8 py-4 bg-neon-green text-black font-black text-xs uppercase rounded-2xl shadow-[0_0_30px_rgba(34,255,136,0.3)] hover:scale-105 transition-all active:scale-95">
                <Save size={16} /> Save Changes
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}