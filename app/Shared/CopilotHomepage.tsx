// app/Shared/CopilotHomepage.tsx


"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import type React from "react";
import Link from "next/link";
import { useAccess } from "@/context/UserAccessContext";
import { trackEvent, trackFeatureEvent } from "@/lib/events";
import dynamic from "next/dynamic";
import { ArrowRight, Zap, TrendingUp, Lock, Unlock, ChevronDown, Sparkles } from "lucide-react";

// Trade Components
const DynamicSystemStatus = dynamic(() => import("@/app/trading-tools/components/SystemStatus"), {
  loading: () => <div className="h-32 bg-[#1a2a3a]/40 rounded-2xl animate-pulse border border-[#1F2937]" />,
});
const DynamicSparkline = dynamic(() => import("../trade/components/Sparkline").then(m => ({ default: m.Sparkline })), {
  loading: () => <div className="h-24 bg-white/5 rounded animate-pulse" />,
});

// Shared Tools/Features - SESUAI STRUKTUR FOLDERMU
const DynamicTradeSimulator = dynamic(() => import("../trading-tools/components/TradeSimulator"), {
  loading: () => <div className="h-96 bg-white/5 rounded-2xl animate-pulse" />,
});
const DynamicVoiceAssistant = dynamic(() => import("./VoiceAssistant"), { // File ini ada di folder Shared
  loading: () => <div className="h-80 bg-white/5 rounded-2xl animate-pulse" />,
});
const DynamicSocialSharing = dynamic(() => import("./SocialSharing"), { // File ini ada di folder Shared
  loading: () => <div className="h-64 bg-white/5 rounded-2xl animate-pulse" />,
});
const DynamicMarketHeatmap = dynamic(() => import("../utilities/components/MarketHeatmap"), {
  loading: () => <div className="h-96 bg-white/5 rounded-2xl animate-pulse" />,
});
const DynamicGamification = dynamic(() => import("./Gamification"), { // File ini ada di folder Shared
  loading: () => <div className="h-80 bg-white/5 rounded-2xl animate-pulse" />,
});

// ============= SKELETON LOADERS =============

const SkeletonLoader = ({ count = 3 }: { count?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="h-12 bg-white/5 rounded animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
    ))}
  </div>
);

const ChartSkeleton = () => (
  <div className="h-32 bg-white/5 rounded-lg animate-pulse" />
);

// ============= ANIMATED SPARKLINE PREVIEW =============

const SparklinePreview = ({ coin }: { coin: string }) => {
  const [values, setValues] = useState<number[]>(() => {
    const base = 100;
    const data = [];
    for (let i = 0; i < 60; i++) {
      data.push(base + (Math.sin(i * 0.1) * 20) + (Math.random() - 0.5) * 15);
    }
    return data;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setValues(prev => {
        const newVal = prev[prev.length - 1] + (Math.random() - 0.5) * 8;
        return [...prev.slice(1), Math.max(80, Math.min(newVal, 130))];
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 rounded-lg bg-gradient-to-b from-white/5 to-transparent border border-white/10">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-semibold text-gray-200">{coin} Momentum</h4>
        <span className="text-xs text-[#22ff88]">Live</span>
      </div>
      <DynamicSparkline values={values} />
      <div className="mt-2 text-[11px] text-gray-400 flex justify-between">
        <span>24h Change: +2.4%</span>
        <span>Vol: 15.2%</span>
      </div>
    </div>
  );
};

// ============= GAMIFICATION INSIGHT TEASER =============

const DailyInsightTeaser = () => {
  const [insight, setInsight] = useState<{ title: string; value: string; type: "bullish" | "bearish" | "neutral" }>({
    title: "AI Insight",
    value: "Loading...",
    type: "neutral",
  });

  useEffect(() => {
    const insights = [
      { title: "📈 Bullish Setup", value: "Support hold signals strength", type: "bullish" as const },
      { title: "⚡ High Volatility", value: "Range breakout probability up 34%", type: "bullish" as const },
      { title: "🎯 Golden Cross", value: "EMA(20) × EMA(50) confirmed", type: "bullish" as const },
      { title: "📊 Volume Surge", value: "2.3x above 30-day average", type: "neutral" as const },
      { title: "⚠️ Consolidation", value: "Awaiting directional confirmation", type: "bearish" as const },
    ];

    const randomInsight = insights[Math.floor(Math.random() * insights.length)];
    setInsight(randomInsight);
  }, []);

  const bgGradient = {
    bullish: "from-[#22ff88]/20 to-transparent border-[#22ff88]/30",
    bearish: "from-red-500/20 to-transparent border-red-500/30",
    neutral: "from-blue-500/20 to-transparent border-blue-500/30",
  };

  return (
    <div className={`p-4 rounded-lg bg-gradient-to-r ${bgGradient[insight.type]} border`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-100 mb-1">{insight.title}</h4>
          <p className="text-xs text-gray-300">{insight.value}</p>
        </div>
        <Sparkles className="w-4 h-4 text-[#22ff88] flex-shrink-0 animate-pulse" />
      </div>
    </div>
  );
};

// ============= UNLOCK AI FEATURES CTA =============

const UnlockCTASection = () => {
  const { access, unlockBroker } = useAccess();
  const isLocked = access === "guest";
  const [showDetails, setShowDetails] = useState(false);

  const handleUnlock = () => {
    trackFeatureEvent("unlock_requested", "ai_predictions", {
      source: "homepage_hero",
    });
    unlockBroker();
  };

  return (
    <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-[#22ff88]/10 via-transparent to-[#3cffaa]/5 border border-[#22ff88]/30">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {isLocked ? <Lock className="w-5 h-5 text-[#22ff88]" /> : <Unlock className="w-5 h-5 text-[#22ff88]" />}
            <h3 className="text-lg font-bold text-white">
              {isLocked ? "Unlock Full Market Intelligence" : "AI Features Unlocked ✓"}
            </h3>
          </div>
          <p className="text-sm text-gray-300 mb-4">
            {isLocked
              ? "Connect your broker to access real-time predictions, market signals, and AI-powered insights."
              : "You now have access to premium AI features, real-time market analysis, and advanced signals."}
          </p>

          {isLocked && (
            <button
              onClick={handleUnlock}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#22ff88] text-[#0C1322] font-semibold text-sm hover:bg-[#22ff88]/90 transition-all"
            >
              Connect Broker <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {!isLocked && (
            <button
              onClick={() => trackEvent("feature_explorer_opened", { source: "homepage" })}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-white/10 text-white font-semibold text-sm hover:bg-white/20 transition-all"
            >
              Explore Features <ChevronDown className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="hidden sm:block text-4xl opacity-20">🤖</div>
      </div>

      {/* Feature Benefits */}
      {!showDetails && (
        <button
          onClick={() => setShowDetails(true)}
          className="mt-4 text-xs text-gray-400 hover:text-gray-300 transition flex items-center gap-1"
        >
          What's included? <ChevronDown className="w-3 h-3" />
        </button>
      )}

      {showDetails && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10">
          <div className="text-xs text-gray-300">
            <span className="text-[#22ff88] font-semibold block mb-1">✓ Real-Time Signals</span>
            AI-powered buy/sell recommendations
          </div>
          <div className="text-xs text-gray-300">
            <span className="text-[#22ff88] font-semibold block mb-1">✓ Risk Analytics</span>
            Volatility & drawdown tracking
          </div>
          <div className="text-xs text-gray-300">
            <span className="text-[#22ff88] font-semibold block mb-1">✓ Live Profit Table</span>
            Track positions in real-time
          </div>
        </div>
      )}
    </div>
  );
};

// ============= HERO STATS SECTION =============

const HeroStatsSection = () => {
  const [animatedStats, setAnimatedStats] = useState({
    traders: 0,
    strategies: 0,
    uptime: 0,
  });

  useEffect(() => {
    const targets = { traders: 12500, strategies: 287, uptime: 97.8 };
    const start = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - start) / 1200, 1);
      setAnimatedStats({
        traders: Math.floor(targets.traders * progress),
        strategies: Math.floor(targets.strategies * progress),
        uptime: parseFloat((targets.uptime * progress).toFixed(1)),
      });

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, []);

  return (
    <div className="mt-8 flex flex-wrap justify-center gap-6 sm:gap-10">
      <div className="flex flex-col items-center">
        <span className="text-2xl sm:text-3xl font-bold text-[#22ff88]">{animatedStats.traders.toLocaleString()}+</span>
        <span className="text-xs sm:text-sm text-gray-400 mt-1">Active Traders</span>
      </div>
      <div className="w-px bg-white/10" />
      <div className="flex flex-col items-center">
        <span className="text-2xl sm:text-3xl font-bold text-[#22ff88]">{animatedStats.strategies}</span>
        <span className="text-xs sm:text-sm text-gray-400 mt-1">Strategies Running</span>
      </div>
      <div className="w-px bg-white/10" />
      <div className="flex flex-col items-center">
        <span className="text-2xl sm:text-3xl font-bold text-[#22ff88]">{animatedStats.uptime.toFixed(1)}%</span>
        <span className="text-xs sm:text-sm text-gray-400 mt-1">Uptime</span>
      </div>
    </div>
  );
};

// ============= MAIN COMPONENT =============

export default function CopilotHomepage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { access } = useAccess();
  const [showProfitAnimation, setShowProfitAnimation] = useState(false);

  const DynamicHeroStats = () => {
    return <HeroStatsSection />;
  };

  // Track page view
  useEffect(() => {
    trackEvent("homepage_viewed", { access_level: access });
  }, [access]);

  // ============= ANIMATED CANVAS BACKGROUND =============
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: { x: number; y: number; r: number; dx: number; dy: number }[] = [];
    const particleCount = width < 768 ? 60 : 120;

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

      // Subtle grid
      ctx.strokeStyle = "rgba(34,255,136,0.03)";
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

      // Particles
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(34,255,136,0.3)";
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

  const [activeSection, setActiveSection] = useState<'overview' | 'trading' | 'ai' | 'community' | 'gamification'>('overview');
  const [unlockedFeatures, setUnlockedFeatures] = useState<Set<string>>(new Set());
  const [showUnlockFlow, setShowUnlockFlow] = useState(false);

  // Check if AI features are unlocked (Feature 7: Unlock flow via broker registration)
  useEffect(() => {
    const locked = access === 'guest';
    setUnlockedFeatures(prev => {
      const newSet = new Set(prev);
      if (!locked) {
        newSet.add('trade_simulator');
        newSet.add('voice_assistant');
        newSet.add('social_sharing');
        newSet.add('market_heatmap');
        newSet.add('gamification');
      }
      return newSet;
    });
  }, [access]);

  // Lock/Unlock component wrapper (Feature 7)
  const LockedFeature = ({ featureId, children }: { featureId: string; children: React.ReactNode }) => {
    const isLocked = !unlockedFeatures.has(featureId);
    
    if (isLocked) {
      return (
        <div className="w-full bg-gradient-to-br from-[#0B1220] to-[#070B14] rounded-2xl border border-[#22ff88]/10 p-6 mb-8">
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <Lock className="text-[#ff5555]" size={48} />
            <h3 className="text-xl font-bold text-white text-center">Premium Feature Locked</h3>
            <p className="text-[#9aa0c8] text-center max-w-md text-sm">
              Connect your broker account to unlock AI-powered trading features
            </p>
            <button
              onClick={() => setShowUnlockFlow(true)}
              className="px-8 py-3 rounded-lg bg-[#22ff88] text-[#0B1220] font-bold hover:scale-105 transition-transform flex items-center gap-2"
            >
              <Unlock size={16} /> Unlock Now
            </button>
          </div>
        </div>
      );
    }

    return <>{children}</>;
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#0A0F1C] via-[#0B1220] to-[#070B14] text-white overflow-hidden relative">
      {/* ============= ANIMATED BACKGROUND =============*/}
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none" />

      {/* ============= GLOW LAYERS =============*/}
      <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-[#22ff88]/20 via-[#3cffaa]/10 to-[#22ff88]/10 rounded-full blur-[140px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-120px] right-1/3 w-[400px] h-[200px] bg-gradient-to-t from-[#22ff88]/15 to-transparent rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10">
        {/* ============= HERO SECTION =============*/}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 animate-fadeInUp">
              <span className="block text-gray-100">One AI Copilot</span>
              <span className="block text-[#22ff88] mt-2">For Every Market You Trade</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-400 mb-8 leading-relaxed animate-fadeInUp delay-200">
              Real-time market intelligence, AI predictions, and trade execution guidance — all under your complete control.
            </p>

            {/* ============= HERO STATS =============*/}
            <DynamicHeroStats />

            {/* ============= PRIMARY CTA =============*/}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeInUp delay-400">
              <Link
                href="/trade"
                onClick={() => trackEvent("cta_click_hero", { source: "homepage_hero" })}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-[#22ff88] text-[#0C1322] font-semibold hover:scale-105 transition-transform"
              >
                Launch Dashboard <Zap className="w-4 h-4" />
              </Link>

              <button
                onClick={() => setShowProfitAnimation(!showProfitAnimation)}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg border border-[#22ff88]/50 text-[#22ff88] font-semibold hover:bg-[#22ff88]/10 transition-all"
              >
                Watch Demo <TrendingUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* ============= UNLOCK CTA SECTION =============*/}
        <section className="px-4 py-8">
          <UnlockCTASection />
        </section>

        {/* ============= ANIMATED CHARTS & INSIGHTS =============*/}
        <section className="px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">Live Market Preview</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeInUp delay-600">
              <SparklinePreview coin="BTC" />
              <SparklinePreview coin="ETH" />
            </div>

            {/* ============= DAILY INSIGHT TEASER =============*/}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Daily AI Insight</h3>
              <DailyInsightTeaser />
            </div>
          </div>
        </section>

        {/* ============= FEATURE SHOWCASE =============*/}
        <section className="px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-12 text-center">What You Get</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: "📊", title: "Live Profit Table", desc: "Track open positions & P&L in real-time" },
                { icon: "🎯", title: "AI Signals", desc: "Entry/exit recommendations powered by ML" },
                { icon: "⚡", title: "Risk Manager", desc: "Automated volatility & drawdown controls" },
                { icon: "📈", title: "Market Charts", desc: "Technical analysis with multiple timeframes" },
                { icon: "🔐", title: "Secure Connection", desc: "Read-only API integration with brokers" },
                { icon: "🛡️", title: "Capital Control", desc: "You decide when to execute trades" },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-[#22ff88]/50 transition-all duration-300 animate-fadeInUp"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="text-[#22ff88] font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============= HOW IT WORKS =============*/}
        <section className="px-4 py-16 bg-white/2">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-12 text-center">How AI Copilot Works</h2>

            <div className="space-y-4">
              {[
                {
                  step: "1",
                  title: "Connect Your Broker",
                  desc: "Securely link your trading account for real-time data (read-only)",
                },
                {
                  step: "2",
                  title: "AI Analyzes Markets",
                  desc: "Our system processes price, volume, and sentiment data continuously",
                },
                {
                  step: "3",
                  title: "Receive Signals",
                  desc: "Get buy/sell recommendations with confidence scores and risk metrics",
                },
                {
                  step: "4",
                  title: "You Execute",
                  desc: "Review insights and make final execution decisions — always in control",
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#22ff88]/20 border border-[#22ff88]/50 flex items-center justify-center font-bold text-[#22ff88]">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============= EXTRA FEATURES NAVIGATION =============*/}
        <section className="px-4 py-8 border-y border-white/10">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2 overflow-x-auto pb-2 justify-center flex-wrap">
              {(['overview', 'trading', 'ai', 'community', 'gamification'] as const).map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                    activeSection === section
                      ? 'bg-[#22ff88] text-[#0B1220]'
                      : 'bg-white/10 text-gray-300 hover:text-white'
                  }`}
                >
                  {section === 'overview' && '📊 Overview'}
                  {section === 'trading' && '💹 Trading Simulator'}
                  {section === 'ai' && '🎤 AI Voice'}
                  {section === 'community' && '👥 Community'}
                  {section === 'gamification' && '🏆 Gamification'}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ============= FEATURE SECTIONS (Feature 1-5 + 6: Dynamic Import + 7: Unlock Flow) =============*/}
        {activeSection === 'trading' && (
          <section className="px-4 py-16">
            <div className="max-w-4xl mx-auto">
              <LockedFeature featureId="trade_simulator">
                <DynamicTradeSimulator />
              </LockedFeature>
            </div>
          </section>
        )}

        {activeSection === 'ai' && (
          <section className="px-4 py-16">
            <div className="max-w-4xl mx-auto">
              <LockedFeature featureId="voice_assistant">
                <DynamicVoiceAssistant />
              </LockedFeature>
              <LockedFeature featureId="market_heatmap">
                <DynamicMarketHeatmap />
              </LockedFeature>
            </div>
          </section>
        )}

        {activeSection === 'community' && (
          <section className="px-4 py-16">
            <div className="max-w-4xl mx-auto">
              <LockedFeature featureId="social_sharing">
                <DynamicSocialSharing />
              </LockedFeature>
            </div>
          </section>
        )}

        {activeSection === 'gamification' && (
          <section className="px-4 py-16">
            <div className="max-w-4xl mx-auto">
              <LockedFeature featureId="gamification">
                <DynamicGamification />
              </LockedFeature>
            </div>
          </section>
        )}

        {/* ============= SOCIAL PROOF =============*/}
        <section className="px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8">Why Traders Choose AI Copilot</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { metric: "12,500+", label: "Active Users" },
                { metric: "$2.4B+", label: "Assets Analyzed" },
                { metric: "97.8%", label: "Uptime" },
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-lg bg-gradient-to-b from-[#22ff88]/10 to-transparent border border-[#22ff88]/20">
                  <div className="text-3xl font-bold text-[#22ff88] mb-2">{item.metric}</div>
                  <div className="text-gray-400">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============= FINAL CTA =============*/}
        <section className="px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Trade Smarter?</h2>
            <p className="text-gray-400 mb-8">Start with real-time AI insights and build your trading edge today.</p>

            <Link
              href="/trade"
              onClick={() => trackEvent("cta_click_final", { source: "homepage_footer" })}
              className="inline-flex items-center gap-2 px-10 py-4 rounded-lg bg-[#22ff88] text-[#0C1322] font-bold text-lg hover:scale-105 transition-transform"
            >
              Launch Dashboard <ArrowRight className="w-5 h-5" />
            </Link>

            <p className="mt-6 text-xs text-gray-500 max-w-md mx-auto">
              You maintain full control over all trading decisions. AI provides insights only — execution is always your choice.
            </p>
          </div>
        </section>

        {/* ============= FOOTER =============*/}
        <footer className="px-4 py-8 border-t border-white/10">
          <div className="max-w-4xl mx-auto text-center text-xs text-gray-500">
            <p>
              AI Copilot provides analytical insights and market recommendations only. It does not manage funds, place trades, or provide investment advice. Always conduct your own due diligence.
            </p>
          </div>
        </footer>
      </div>

      {/* ============= ANIMATIONS =============*/}
      <style jsx>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease forwards;
          opacity: 0;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-400 {
          animation-delay: 0.4s;
        }
        .delay-600 {
          animation-delay: 0.6s;
        }
        .delay-800 {
          animation-delay: 0.8s;
        }
      `}</style>
    </div>
  );
};