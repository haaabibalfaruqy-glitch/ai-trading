"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation"; // <-- import useRouter

export default function HomePageUltraCleanProMaxMobile() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter(); // <-- inisialisasi router

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

      {/* ================= HERO ================= */}
      <section className="pt-24 pb-24 container mx-auto text-center relative z-10 px-4">
        <h1 className="text-[36px] sm:text-[50px] md:text-[68px] font-extrabold leading-[1.1] mb-4 tracking-tight">
          <span className="block text-gray-100 animate-fadeInUp delay-200">AI Trading Advisor</span>
          <span className="block text-[#22ff88] animate-fadeInUp delay-400">
            Precision-Driven Decisions, Not Hype
          </span>
        </h1>

        <p className="text-gray-400 mb-10 max-w-[500px] sm:max-w-[600px] mx-auto text-[14px] sm:text-[15px] md:text-[16px] leading-relaxed animate-fadeInUp delay-600">
          Leverage AI to optimize capital behavior, execute with clarity, and stay fully in control — actionable insights, risk-aware strategies, and data-first execution.
        </p>

        {/* ================= BUTTON NAVIGATE TO TRADE ================= */}
        <button
          onClick={() => router.push("/trade")} // <-- navigasi ke trade page
          className="px-10 sm:px-16 py-3 sm:py-4 font-bold rounded-3xl bg-gradient-to-r from-[#22ff88] to-[#3cffaa] text-black shadow-[0_15px_45px_rgba(34,255,136,0.35)] hover:scale-105 active:scale-95 transition-all animate-fadeInUp delay-800 relative overflow-hidden"
        >
          Start Optimizing →
          <span className="absolute top-0 left-0 w-full h-full bg-white/10 opacity-0 hover:opacity-30 transition-all rounded-3xl pointer-events-none"></span>
        </button>

        {/* SUBTLE DIVIDER */}
        <div className="mt-8 w-20 sm:w-28 h-[2px] bg-[#22ff88]/30 mx-auto rounded-full animate-fadeInUp delay-1000"></div>

        {/* MICRO-TRUST STATS */}
        <div className="mt-6 flex flex-wrap justify-center gap-4 sm:gap-6 text-[10px] sm:text-[12px] text-gray-400 animate-fadeInUp delay-1200">
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
    </div>
  );
}
