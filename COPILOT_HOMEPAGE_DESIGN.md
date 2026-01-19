# Copilot Homepage - Visual Layout Guide

## Page Structure (Mobile-First Responsive Design)

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  ✨ ANIMATED PARTICLE BACKGROUND + GRID           │
│     (Canvas with 60-120 particles, subtle glow)    │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│         🟢 HERO SECTION (Full Viewport)             │
│                                                     │
│  Autonomous AI                                      │
│  Trading Copilot                                    │
│  ─────────────────────                             │
│                                                     │
│  Real-time market intelligence, AI predictions,    │
│  and trade execution guidance — all under your      │
│  complete control.                                  │
│                                                     │
│  ┌─────────────────────────────────────┐           │
│  │  📊 12,500+  |  🎯 287  |  ⚡ 97.8%  │           │
│  │  Active      |  Running |  Uptime   │           │
│  │  Traders     |  Strategies          │           │
│  └─────────────────────────────────────┘           │
│                                                     │
│  [ 🚀 Launch Dashboard ] [ 📈 Watch Demo ]         │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  🔓 UNLOCK AI FEATURES SECTION                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ 🔒 Unlock Advanced AI Features              │   │
│  │                                             │   │
│  │ Connect your broker to access real-time     │   │
│  │ predictions, market signals, and AI-        │   │
│  │ powered insights.                           │   │
│  │                                             │   │
│  │ [ 🔌 Connect Broker →]                      │   │
│  │                                             │   │
│  │ What's included? ▼                          │   │
│  │ ✓ Real-Time Signals | ✓ Risk Analytics     │   │
│  │ ✓ Live Profit Table                        │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  📊 LIVE MARKET PREVIEW                            │
│  ┌─────────────────────┬─────────────────────┐    │
│  │ BTC Momentum 🔴     │ ETH Momentum 🟢     │    │
│  │                     │                     │    │
│  │  /\  /\            │   ___/\  /          │    │
│  │ /  \/  \           │  /     \/\  ___     │    │
│  │                     │              /\ /   │    │
│  │ 24h: +2.4% Vol 15.2%│ 24h: +2.4% Vol 15.2%│    │
│  └─────────────────────┴─────────────────────┘    │
│                                                     │
│  💡 Daily AI Insight                               │
│  ┌─────────────────────────────────────────────┐   │
│  │ 📈 Bullish Setup                       ✨  │   │
│  │ Support hold signals strength               │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  🎯 WHAT YOU GET (Feature Showcase)                 │
│  ┌──────────┬──────────┬──────────┐              │
│  │  📊      │   🎯     │   ⚡    │              │
│  │ Live P&L │ AI       │ Risk    │              │
│  │ Table    │ Signals  │ Manager │              │
│  ├──────────┼──────────┼──────────┤              │
│  │  📈      │   🔐     │   🛡️    │              │
│  │ Market   │ Secure   │ Capital │              │
│  │ Charts   │ Connect  │ Control │              │
│  └──────────┴──────────┴──────────┘              │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  🔧 HOW IT WORKS                                   │
│  ┌─────────────────────────────────────────────┐   │
│  │ 1️⃣  Connect Your Broker                     │   │
│  │    Securely link your trading account      │   │
│  ├─────────────────────────────────────────────┤   │
│  │ 2️⃣  AI Analyzes Markets                     │   │
│  │    Process price, volume, sentiment data    │   │
│  ├─────────────────────────────────────────────┤   │
│  │ 3️⃣  Receive Signals                         │   │
│  │    Get buy/sell with confidence scores     │   │
│  ├─────────────────────────────────────────────┤   │
│  │ 4️⃣  You Execute                             │   │
│  │    Make final execution decisions          │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  🏆 SOCIAL PROOF                                   │
│  ┌──────────┬──────────┬──────────┐              │
│  │ 12,500+  │ $2.4B+   │  97.8%   │              │
│  │ Active   │ Assets   │ Uptime   │              │
│  │ Users    │ Analyzed │          │              │
│  └──────────┴──────────┴──────────┘              │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│           🎯 FINAL CTA SECTION                     │
│                                                     │
│        Ready to Trade Smarter?                     │
│                                                     │
│  Start with real-time AI insights and build        │
│  your trading edge today.                          │
│                                                     │
│        [ 🚀 Launch Dashboard →]                    │
│                                                     │
│  You maintain full control over all trading        │
│  decisions. AI provides insights only — execution   │
│  is always your choice.                            │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  📋 FOOTER                                         │
│  AI Copilot provides analytical insights and      │
│  market recommendations only. It does not manage   │
│  funds, place trades, or provide investment advice.│
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Responsive Breakpoints

### Mobile (320px - 767px)
```
- Single column layout
- 60 canvas particles (lighter)
- Larger touch targets (48px minimum)
- Stacked feature cards (1 per row)
- Hero text: 24px
- Font scaling optimized
```

### Tablet (768px - 1023px)
```
- 2-column feature grid
- 90 canvas particles
- Side-by-side comparisons
- Medium font sizes
- Hero text: 40px
```

### Desktop (1024px+)
```
- 3-column feature grid
- 120 canvas particles (full effect)
- Optimal reading width (max-w-4xl)
- Hero text: 48px
- Full animations enabled
```

---

## Animation Timeline

```
0s       200ms      400ms      600ms      800ms      1000ms
|        |          |          |          |          |
↓ Hero   ↓ Stats    ↓ Unlock   ↓ Insights ↓ Features
[Fade]   [Fade]     [Fade]     [Fade]     [Fade]
|◄─────►||◄─────►||◄─────►||◄─────►||◄─────►|
 0.8s     0.8s       0.8s       0.8s       0.8s
```

---

## Component Dimensions

| Component | Width | Height | Notes |
|-----------|-------|--------|-------|
| Hero Section | 100vw | 100vh | Full viewport |
| Unlock Card | 100% | Auto | Responsive width |
| Sparkline | 100% | 120px | Charts |
| Feature Grid | 100% | Auto | 3 cols on desktop |
| How It Works | 100% | Auto | Full width cards |
| Social Proof | 100% | Auto | 3 equal cards |
| Canvas | 100vw | 100vh | Window size |

---

## Color Scheme

```
Primary:
  - Brand Green: #22ff88
  - Accent Green: #3cffaa
  
Background:
  - Hero BG: #0A0F1C
  - Mid BG: #0B1220
  - Dark BG: #070B14
  - Section BG: rgba(255,255,255,0.05)
  
Text:
  - Primary: #FFFFFF (White)
  - Secondary: #D1D5DB (Gray 300)
  - Tertiary: #9CA3AF (Gray 400)
  - Muted: #6B7280 (Gray 500)
  
Borders:
  - Default: rgba(255,255,255,0.1)
  - Hover: #22ff88/50
  - Active: #22ff88
```

---

## Interactive States

### Button States
```
Normal:     bg-[#22ff88] text-[#0C1322]
Hover:      scale(1.05) + shadow
Active:     scale(0.98) (press feedback)
Disabled:   opacity-50 cursor-not-allowed
```

### Card States
```
Normal:     border-white/10 bg-white/5
Hover:      border-[#22ff88]/50 bg-white/10
Selected:   border-[#22ff88] shadow-lg
```

### Icon States
```
Normal:     opacity-100
Hover:      pulse animation
Active:     animation-play-state: running
```

---

## Loading States

### Skeleton Screens
```
Sparkline:   [████████] Pulsing (1.2s)
Stats:       [████████] Pulsing (1.2s)
System:      [████████] Pulsing (1.2s)

Stagger:     50ms delay between each skeleton row
Duration:    1.2 seconds fade-in
```

### Lazy Loading
```
Dynamic Sparkline:   Show skeleton → Load chart
Dynamic HeroStats:   Show skeleton → Load stats
Dynamic SystemStatus: Show skeleton → Load health
```

---

## Accessibility Features

✅ Semantic HTML (section, article, nav, footer)
✅ Proper heading hierarchy (h1 → h2 → h3)
✅ Color contrast WCAG AA compliant
✅ Touch targets 48px minimum on mobile
✅ Keyboard navigation support
✅ Focus indicators on interactive elements
✅ ARIA labels on icons
✅ Form labels associated with inputs
✅ Alt text ready for images
✅ Screen reader friendly structure

---

## Performance Optimizations

| Technique | Benefit |
|-----------|---------|
| Canvas background | Hardware-accelerated animations |
| CSS animations | GPU rendering, smooth 60fps |
| Dynamic imports | Lazy load heavy components |
| Skeleton loaders | Perceived performance improvement |
| Staggered animations | CPU-friendly sequential rendering |
| Particle optimization | Mobile: 60, Desktop: 120 |
| Event debouncing | Smooth resize handlers |
| Memoization | Prevent unnecessary re-renders |

---

## Browser DevTools Checklist

```
Performance Tab:
  ✓ FCP (First Contentful Paint): < 1.5s
  ✓ LCP (Largest Contentful Paint): < 2.5s
  ✓ CLS (Cumulative Layout Shift): < 0.1
  ✓ Animation FPS: 60fps (steady)

Network Tab:
  ✓ Homepage bundle: ~35KB
  ✓ Lazy chunks: 10-15KB each
  ✓ Total after load: ~80KB (gzipped ~25KB)

Coverage Tab:
  ✓ Unused CSS: Minimal (Tailwind purged)
  ✓ Unused JS: Lazy components not loaded initially

Lighthouse Audit:
  ✓ Performance: > 90
  ✓ Accessibility: > 95
  ✓ Best Practices: > 90
  ✓ SEO: > 95
```

---

✨ **Design System**: Cohesive, responsive, performant
✨ **User Experience**: Smooth, engaging, conversion-focused
✨ **Developer Experience**: Type-safe, well-documented, maintainable
