"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/events";
import AISessionContext from "@/components/AISessionContext";

export const dynamic = "force-dynamic";
export default function HomePageUltraCleanProMaxMobile() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ================= PARTICLE EFFECT =================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    const particles: { x: number; y: number; r: number; dx: number; dy: number }[] = [];

    const particleCount = width < 768 ? 60 : 120; // lebih ringan di mobile
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // draw subtle grid
      ctx.strokeStyle = "rgba(34,255,136,0.05)";
      ctx.lineWidth = 1;
      const gridSpacing = width < 768 ? 150 : 100;
      for (let x = 0; x < width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // draw particles
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(34,255,136,0.4)";
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > width) p.dx *= -1;
        if (p.y < 0 || p.y > height) p.dy *= -1;
      });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#0A0F1C] via-[#0B1220] to-[#070B14] text-white overflow-hidden relative pb-32">

      {/* ================= CANVAS PARTICLES & GRID ================= */}
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none" />

      {/* ================= GLOW LAYERS ================= */}
      <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-[#22ff88]/20 via-[#3cffaa]/10 to-[#22ff88]/10 rounded-full blur-[140px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-120px] right-1/3 w-[400px] h-[200px] bg-gradient-to-t from-[#22ff88]/15 to-transparent rounded-full blur-[100px] animate-fadeIn pointer-events-none"></div>

      <section className="pt-20 pb-20 container mx-auto text-center relative z-10 px-4">
        <h1 className="text-[36px] sm:text-[50px] md:text-[68px] font-extrabold leading-[1.1] mb-4 tracking-tight">
          <span className="block text-gray-100">
  Autonomous AI Trading System
</span>
<span className="block text-[#22ff88]">
  Data-Driven Market Intelligence, Built for Control
</span>
        </h1>

        <p className="text-gray-400 mb-10 max-w-[500px] sm:max-w-[600px] mx-auto text-[14px] sm:text-[15px] md:text-[16px] leading-relaxed animate-fadeInUp delay-600">
          Leverage AI to analyze market conditions, evaluate risk,
and support informed execution — without removing user control.
        </p>

        {/* ================= BUTTON NAVIGATE TO TRADE ================= */}
<Link
  href="/trade"
  prefetch={false}
  onClick={() => {
    trackEvent("cta_click", {
      tier: "soft",
      source: "hero",
    });
  }}
  className="
    inline-flex items-center justify-center
    px-8 py-4 rounded-xl
    bg-[#22ff88]
    text-black font-semibold
    hover:scale-105 transition
    relative z-50
  "
>
  Activate AI System →
</Link>

<p className="mt-3 text-xs text-gray-400">
  Configure your AI session preferences before enabling execution support.
</p>

        {/* SUBTLE DIVIDER */}
        <div className="mt-8 w-20 sm:w-28 h-[2px] bg-[#22ff88]/30 mx-auto rounded-full animate-fadeInUp delay-1000"></div>

        {/* MICRO-TRUST STATS */}
<div className="mt-6 flex flex-wrap justify-center gap-4 sm:gap-6 text-[10px] sm:text-[12px] text-gray-400">
  <div className="flex flex-col items-center">
    <span className="text-white font-semibold">12,500+</span>
    <span>Active Traders</span>
  </div>
  <div className="flex flex-col items-center">
    <span className="text-white font-semibold">287</span>
    <span>Strategies Running</span>
  </div>
  <div className="flex flex-col items-center">
    <span className="text-white font-semibold">97.8%</span>
    <span>Uptime</span>
  </div>
</div>

<p className="mt-4 text-[11px] text-gray-500 max-w-md mx-auto">
  Metrics reflect platform activity across live usage, simulations, and strategy testing environments.
</p>
      </section>

{/* ================= AI LIVE STATUS ================= */}
<div className="mt-10 mb-16 px-6">
  <div className="mx-auto max-w-4xl rounded-xl border border-green-500/30 bg-green-500/5 p-4 flex flex-wrap items-center justify-between gap-4 text-sm text-green-300">
    <div className="flex items-center gap-2">
      <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
      AI System Status: <span className="text-green-400">ACTIVE</span>
    </div>

    <div>Market Mode: <span className="text-green-400">Live Analysis</span></div>
    <div>Session Load: <span className="text-green-400">Normal</span></div>
  </div>
</div>

      {/* ================= HOW THE AI WORKS ================= */}
      <section className="container mx-auto px-4 mt-28 relative z-10">
  <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
    How Our AI Supports Smarter Trading Decisions
  </h2>

  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 text-sm text-gray-300">
    <div className="p-6 rounded-xl bg-white/5 backdrop-blur border border-white/10">
      <h3 className="text-[#22ff88] font-semibold mb-2">Market Data Analysis</h3>
      <p>
        Continuously analyzes multi-source market data to identify relevant price behavior and structural conditions.
      </p>
    </div>

    <div className="p-6 rounded-xl bg-white/5 backdrop-blur border border-white/10">
      <h3 className="text-[#22ff88] font-semibold mb-2">Signal Filtering</h3>
      <p>
        Filters raw signals using probabilistic models to reduce noise and avoid overreaction to short-term fluctuations.
      </p>
    </div>

    <div className="p-6 rounded-xl bg-white/5 backdrop-blur border border-white/10">
      <h3 className="text-[#22ff88] font-semibold mb-2">Risk & Volatility Control</h3>
      <p>
        Evaluates recommendations against dynamic risk parameters and adapts to changing volatility regimes.
      </p>
    </div>

    <div className="p-6 rounded-xl bg-white/5 backdrop-blur border border-white/10">
      <h3 className="text-[#22ff88] font-semibold mb-2">Execution Insights</h3>
      <p>
        Provides clear, data-backed execution guidance — execution remains optional and user-controlled.
      </p>
    </div>
  </div>
</section>

<section className="container mx-auto px-4 mt-24 relative z-10 text-center">
  <h2 className="text-2xl sm:text-3xl font-bold mb-6">
    Designed for Traders Who Value Data, Not Hype
  </h2>

  <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-300">
    <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10">
      Active Traders
    </span>
    <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10">
      Data-Driven Decision Makers
    </span>
    <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10">
      Independent Trading Setups
    </span>
    <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10">
      Risk-Conscious Strategies
    </span>
  </div>

  <p className="mt-6 text-gray-400 text-sm max-w-xl mx-auto">
    This platform is built as a decision-support layer — not a shortcut to profits.
  </p>
</section>

<section className="container mx-auto px-4 mt-20 relative z-10">
  <div className="max-w-3xl mx-auto p-6 rounded-xl bg-[#22ff88]/10 border border-[#22ff88]/30 text-center">
    <h3 className="text-lg font-semibold text-[#22ff88] mb-2">
      You Stay in Control — Always
    </h3>
    <p className="text-sm text-gray-200">
      You maintain full control over your capital, execution decisions, and risk exposure at all times.
      The AI does not place trades or move funds.
All execution decisions remain entirely user-controlled.
    </p>
  </div>
</section>

{/* ================= SECONDARY CTA ================= */}
<section className="mt-24 text-center relative z-10">
  <h2 className="text-2xl sm:text-3xl font-bold mb-4">
    Ready to Explore the AI System?
  </h2>

  <p className="text-gray-400 text-sm max-w-md mx-auto mb-8">
    Configure your session, observe insights, and decide when to act.
  </p>

  <Link
    href="/trade"
    onClick={() => {
      trackEvent("cta_click", {
        tier: "soft",
        source: "mid_page",
      });
    }}
    className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-[#22ff88] text-black font-semibold hover:scale-105 transition"
  >
    Activate AI System →
  </Link>
</section>

{/* ================= WHY USERS RETURN ================= */}
<section className="mt-24 container mx-auto px-4 relative z-10">
  <h3 className="text-xl sm:text-2xl font-semibold text-center mb-10">
    Why Traders Keep Returning
  </h3>

  <div className="grid gap-6 sm:grid-cols-3 text-sm text-gray-300">
    <div className="p-5 rounded-xl bg-white/5 border border-white/10">
      <span className="text-[#22ff88] font-semibold block mb-2">
        Market Conditions Change
      </span>
      <p>
        AI insights adapt to evolving volatility and structure throughout the day.
      </p>
    </div>

    <div className="p-5 rounded-xl bg-white/5 border border-white/10">
      <span className="text-[#22ff88] font-semibold block mb-2">
        Strategy Context Updates
      </span>
      <p>
        Signals are re-evaluated as new data enters the system.
      </p>
    </div>

    <div className="p-5 rounded-xl bg-white/5 border border-white/10">
      <span className="text-[#22ff88] font-semibold block mb-2">
        Session-Based Insights
      </span>
      <p>
        Each visit provides updated analytical context — not static results.
      </p>
    </div>
  </div>
</section>

      {/* ================= ANIMATION CLASSES ================= */}
      <style jsx>{`
        @keyframes fadeInUp { 0% { opacity:0; transform:translateY(20px); } 100% { opacity:1; transform:translateY(0); } }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease forwards; }
        .delay-200 { animation-delay:0.2s; }
        .delay-400 { animation-delay:0.4s; }
        .delay-600 { animation-delay:0.6s; }
        .delay-800 { animation-delay:0.8s; }
        .delay-1000 { animation-delay:1s; }
        .delay-1200 { animation-delay:1.2s; }

        @keyframes pulse { 0%,100%{transform:scale(1);} 50%{transform:scale(1.05);} }
        .animate-pulse { animation: pulse 6s ease-in-out infinite; }

        @keyframes fadeIn { 0%{opacity:0;}100%{opacity:1;} }
        .animate-fadeIn { animation: fadeIn 2s ease forwards; }
      `}</style>

      <footer className="mt-32 w-full text-center text-[11px] text-gray-500 px-4 relative z-10">
  This platform provides analytical insights and strategy recommendations only.
  It does not manage user funds or provide investment advice.
</footer>

    </div>
  );
}
