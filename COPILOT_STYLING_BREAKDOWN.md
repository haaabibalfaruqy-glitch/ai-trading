# 🎨 Copilot Homepage - Styling Breakdown

## Component Styling Reference

This document details every Tailwind class and CSS style used in `CopilotHomepage.tsx` to ensure consistency and provide a reference for future updates.

---

## 1. Root Container Styling

```typescript
<div className="w-full min-h-screen 
               bg-gradient-to-b from-[#0A0F1C] via-[#0B1220] to-[#070B14] 
               text-white overflow-hidden relative">
```

### Breakdown
| Class | Purpose |
|-------|---------|
| `w-full` | Full width |
| `min-h-screen` | Minimum full viewport height |
| `bg-gradient-to-b` | Vertical gradient background |
| `from-[#0A0F1C]` | Gradient start color (navy) |
| `via-[#0B1220]` | Gradient middle color |
| `to-[#070B14]` | Gradient end color (darker navy) |
| `text-white` | Default text color |
| `overflow-hidden` | Hide overflow content |
| `relative` | Position context for absolute elements |

---

## 2. Canvas Background (Particles)

```typescript
<canvas ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none" />
```

### Breakdown
| Class | Purpose |
|-------|---------|
| `absolute` | Position absolutely |
| `top-0 left-0` | Top-left corner |
| `w-full h-full` | Full width/height |
| `z-0` | Behind all content |
| `pointer-events-none` | Doesn't block clicks |

### Canvas JavaScript Styling
```javascript
// Colors used in canvas drawing
ctx.strokeStyle = "rgba(34,255,136,0.03)";  // Grid: green with 3% opacity
ctx.fillStyle = "rgba(34,255,136,0.3)";     // Particles: green with 30% opacity

// Line width
ctx.lineWidth = 1;                          // Thin grid lines

// Spacing
gridSpacing = 100 (desktop) / 150 (mobile)  // Grid line spacing
particleRadius = 1-3px                      // Particle size
```

---

## 3. Glow Layers (Background Effects)

```typescript
{/* Top Glow */}
<div className="absolute top-[-80px] left-1/2 -translate-x-1/2 
                w-[600px] h-[300px] 
                bg-gradient-to-r from-[#22ff88]/20 via-[#3cffaa]/10 to-[#22ff88]/10 
                rounded-full blur-[140px] animate-pulse 
                pointer-events-none" />

{/* Bottom Glow */}
<div className="absolute bottom-[-120px] right-1/3 
                w-[400px] h-[200px] 
                bg-gradient-to-t from-[#22ff88]/15 to-transparent 
                rounded-full blur-[100px] 
                pointer-events-none" />
```

### Breakdown

**Top Glow**
| Class | Purpose |
|-------|---------|
| `absolute` | Position absolutely |
| `top-[-80px]` | Start above viewport |
| `left-1/2` | Horizontally centered |
| `-translate-x-1/2` | Offset for centering |
| `w-[600px] h-[300px]` | Size |
| `bg-gradient-to-r` | Horizontal gradient |
| `from-[#22ff88]/20` | Green, 20% opacity start |
| `via-[#3cffaa]/10` | Lighter green, 10% middle |
| `to-[#22ff88]/10` | Green, 10% opacity end |
| `rounded-full` | Circular shape |
| `blur-[140px]` | Heavy blur for glow |
| `animate-pulse` | Pulsing animation (6s) |

**Bottom Glow** (Similar but positioned differently)

---

## 4. Hero Section

```typescript
<section className="min-h-screen flex flex-col 
                   items-center justify-center 
                   px-4 pt-20 pb-32">
  <div className="max-w-3xl mx-auto text-center">
```

### Breakdown
| Class | Purpose |
|-------|---------|
| `min-h-screen` | Full viewport height |
| `flex flex-col` | Vertical flex layout |
| `items-center` | Horizontally centered |
| `justify-center` | Vertically centered |
| `px-4` | Horizontal padding (mobile) |
| `pt-20 pb-32` | Top/bottom padding |
| `max-w-3xl` | Maximum width 768px |
| `mx-auto` | Horizontally centered |
| `text-center` | Center-aligned text |

---

## 5. Hero Heading

```typescript
<h1 className="text-4xl sm:text-5xl md:text-6xl 
              font-extrabold leading-tight mb-6 
              animate-fadeInUp">
  <span className="block text-gray-100">Autonomous AI</span>
  <span className="block text-[#22ff88] mt-2">Trading Copilot</span>
</h1>
```

### Breakdown
| Class | Purpose |
|-------|---------|
| `text-4xl sm:text-5xl md:text-6xl` | Responsive text size |
| `font-extrabold` | Extra bold font weight (900) |
| `leading-tight` | Reduced line height |
| `mb-6` | Bottom margin |
| `animate-fadeInUp` | Fade in + slide up animation |
| `block` | Full width block |
| `text-gray-100` | Light gray (near white) |
| `text-[#22ff88]` | Bright green accent |
| `mt-2` | Top margin between lines |

---

## 6. Animated Stats Section

```typescript
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

{/* Render stats */}
<div className="mt-8 flex flex-wrap justify-center gap-6 sm:gap-10">
  <div className="flex flex-col items-center">
    <span className="text-2xl sm:text-3xl font-bold text-[#22ff88]">
      {animatedStats.traders.toLocaleString()}+
    </span>
    <span className="text-xs sm:text-sm text-gray-400 mt-1">Active Traders</span>
  </div>
  {/* More stats... */}
</div>
```

### Animation Details
| Property | Value |
|----------|-------|
| Duration | 1200ms (1.2s) |
| Easing | Linear progress |
| Start | 0 |
| End | Target values |
| Format | Locale string for numbers |

### Styling Breakdown
| Class | Purpose |
|-------|---------|
| `mt-8` | Top margin |
| `flex flex-wrap` | Wrap layout |
| `justify-center` | Center alignment |
| `gap-6 sm:gap-10` | Responsive gap |
| `text-2xl sm:text-3xl` | Large responsive text |
| `font-bold` | Bold weight |
| `text-[#22ff88]` | Bright green |
| `text-xs sm:text-sm` | Small responsive text |
| `text-gray-400` | Muted gray |

---

## 7. Primary CTA Buttons

```typescript
<Link href="/trade"
      className="inline-flex items-center gap-2 
                px-8 py-4 rounded-lg 
                bg-[#22ff88] text-[#0C1322] 
                font-semibold hover:scale-105 
                transition-transform">
  Launch Dashboard <Zap className="w-4 h-4" />
</Link>
```

### Breakdown
| Class | Purpose |
|-------|---------|
| `inline-flex` | Inline flex layout |
| `items-center` | Vertically centered |
| `gap-2` | Space between icon & text |
| `px-8 py-4` | Padding (32px horizontal, 16px vertical) |
| `rounded-lg` | Rounded corners (16px) |
| `bg-[#22ff88]` | Bright green background |
| `text-[#0C1322]` | Dark text for contrast |
| `font-semibold` | Bold font weight (600) |
| `hover:scale-105` | Scale up 5% on hover |
| `transition-transform` | Smooth scale transition |

---

## 8. Feature Showcase Cards

```typescript
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {features.map((feature, i) => (
    <div key={i}
         className="p-6 rounded-xl 
                    bg-white/5 border border-white/10 
                    hover:border-[#22ff88]/50 
                    transition-all duration-300 
                    animate-fadeInUp"
         style={{ animationDelay: `${i * 100}ms` }}>
      <div className="text-3xl mb-3">{feature.icon}</div>
      <h3 className="text-[#22ff88] font-semibold mb-2">{feature.title}</h3>
      <p className="text-sm text-gray-400">{feature.desc}</p>
    </div>
  ))}
</div>
```

### Breakdown
| Class | Purpose |
|-------|---------|
| `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` | Responsive columns |
| `gap-6` | Spacing between cards |
| `p-6` | Padding inside cards |
| `rounded-xl` | Rounded corners (20px) |
| `bg-white/5` | White with 5% opacity |
| `border border-white/10` | White border, 10% opacity |
| `hover:border-[#22ff88]/50` | Green border on hover |
| `transition-all duration-300` | Smooth 300ms transition |
| `animate-fadeInUp` | Fade in + slide up |
| `text-3xl` | Large emoji size |
| `mb-3` | Bottom margin |
| `text-[#22ff88]` | Green heading |
| `font-semibold` | Bold (600) weight |
| `text-sm` | Small description text |
| `text-gray-400` | Muted gray text |

### Animation Delay
```typescript
style={{ animationDelay: `${i * 100}ms` }}
// Card 0: 0ms delay
// Card 1: 100ms delay
// Card 2: 200ms delay
// Creates staggered animation effect
```

---

## 9. Daily Insight Teaser

```typescript
const bgGradient = {
  bullish: "from-[#22ff88]/20 to-transparent border-[#22ff88]/30",
  bearish: "from-red-500/20 to-transparent border-red-500/30",
  neutral: "from-blue-500/20 to-transparent border-blue-500/30",
};

<div className={`p-4 rounded-lg bg-gradient-to-r ${bgGradient[insight.type]} border`}>
  <div className="flex items-start justify-between">
    <div className="flex-1">
      <h4 className="text-sm font-semibold text-gray-100 mb-1">
        {insight.title}
      </h4>
      <p className="text-xs text-gray-300">{insight.value}</p>
    </div>
    <Sparkles className="w-4 h-4 text-[#22ff88] flex-shrink-0 animate-pulse" />
  </div>
</div>
```

### Styling Breakdown
| Class | Purpose |
|-------|---------|
| `p-4` | Padding |
| `rounded-lg` | Rounded corners |
| `bg-gradient-to-r` | Horizontal gradient |
| `border` | Border |
| `flex items-start justify-between` | Layout with spacing |
| `flex-1` | Fill available space |
| `text-sm font-semibold` | Small bold text |
| `text-gray-100` | Light gray heading |
| `mb-1` | Bottom margin |
| `text-xs text-gray-300` | Extra small muted text |
| `flex-shrink-0` | Don't shrink icon |
| `animate-pulse` | Pulsing animation |

---

## 10. Unlock CTA Section

```typescript
<div className="p-6 rounded-2xl 
               bg-gradient-to-r from-[#22ff88]/10 via-transparent to-[#3cffaa]/5 
               border border-[#22ff88]/30">
  <div className="flex items-start justify-between gap-4">
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-2">
        {isLocked ? <Lock className="w-5 h-5 text-[#22ff88]" /> 
                  : <Unlock className="w-5 h-5 text-[#22ff88]" />}
        <h3 className="text-lg font-bold text-white">
          {isLocked ? "Unlock Advanced AI Features" : "AI Features Unlocked ✓"}
        </h3>
      </div>
```

### Styling Breakdown
| Class | Purpose |
|-------|---------|
| `p-6` | Padding |
| `rounded-2xl` | Extra rounded corners (24px) |
| `bg-gradient-to-r` | Horizontal gradient |
| `from-[#22ff88]/10` | Green, 10% opacity start |
| `via-transparent` | Transparent middle |
| `to-[#3cffaa]/5` | Lighter green, 5% end |
| `border border-[#22ff88]/30` | Green border, 30% opacity |
| `flex items-start` | Layout |
| `gap-2` | Space between icon & text |
| `text-lg font-bold` | Large bold text |

---

## 11. How It Works Section

```typescript
<div className="flex gap-4 p-4 rounded-lg 
               border border-white/10 bg-white/5 
               hover:bg-white/10 transition-all">
  <div className="flex-shrink-0 w-10 h-10 rounded-full 
                  bg-[#22ff88]/20 border border-[#22ff88]/50 
                  flex items-center justify-center 
                  font-bold text-[#22ff88]">
    {item.step}
  </div>
  <div className="flex-1">
    <h4 className="font-semibold text-white mb-1">{item.title}</h4>
    <p className="text-sm text-gray-400">{item.desc}</p>
  </div>
</div>
```

### Styling Breakdown
| Class | Purpose |
|-------|---------|
| `flex gap-4` | Layout with spacing |
| `p-4` | Padding |
| `rounded-lg` | Rounded corners |
| `border border-white/10` | Subtle border |
| `bg-white/5` | Light background |
| `hover:bg-white/10` | Lighter on hover |
| `transition-all` | Smooth transition |
| `w-10 h-10` | Square size (40x40px) |
| `rounded-full` | Circular |
| `bg-[#22ff88]/20` | Green background, 20% |
| `border-[#22ff88]/50` | Green border, 50% |
| `flex items-center justify-center` | Center circle content |
| `font-bold text-[#22ff88]` | Bold green number |

---

## 12. Footer

```typescript
<footer className="px-4 py-8 border-t border-white/10">
  <div className="max-w-4xl mx-auto text-center text-xs text-gray-500">
    <p>
      AI Copilot provides analytical insights and market recommendations only...
    </p>
  </div>
</footer>
```

### Styling Breakdown
| Class | Purpose |
|-------|---------|
| `px-4 py-8` | Padding |
| `border-t border-white/10` | Top border |
| `max-w-4xl` | Max width |
| `mx-auto` | Centered |
| `text-center` | Center aligned |
| `text-xs` | Extra small text |
| `text-gray-500` | Muted gray |

---

## 13. Animation & Style Classes Summary

### Animations Used
```css
animate-fadeInUp       /* Fade in + slide up 20px, 0.8s */
animate-pulse          /* Pulsing effect, 6s, infinite */
animate-fadeIn         /* Simple fade, 0.3s */
```

### Delays
```css
delay-200    /* animation-delay: 0.2s */
delay-400    /* animation-delay: 0.4s */
delay-600    /* animation-delay: 0.6s */
delay-800    /* animation-delay: 0.8s */
```

### Colors Used
```
#0A0F1C   - bg-primary (navy)
#0B1220   - bg-secondary
#070B14   - bg-tertiary
#22ff88   - accent (bright green)
#3cffaa   - accent-light (lighter green)
#5363ff   - primary-blue
#ffffff   - white (text)
#9aa0c8   - text-secondary (gray-blue)
#7a8399   - text-muted
rgba(..., 0.05-0.3)  - transparency for layering
```

### Common Spacing
```
px-4, px-6, px-8        - Horizontal padding
py-2, py-4, py-6        - Vertical padding
mb-1, mb-2, mb-6        - Bottom margins
mt-1, mt-2, mt-6        - Top margins
gap-2, gap-4, gap-6     - Grid/flex gaps
```

---

## 14. Responsive Behavior

### Breakpoint Usage
```typescript
// Text sizing
text-4xl sm:text-5xl md:text-6xl

// Grid layout
grid-cols-1 sm:grid-cols-2 lg:grid-cols-3

// Padding
px-4 sm:px-6 md:px-8

// Gaps
gap-4 sm:gap-6

// Display
hidden sm:block    /* Hide on mobile, show on tablet+ */
sm:hidden          /* Show on mobile, hide on tablet+ */
```

### Responsive Typography
```
text-xs    - 12px (mobile labels)
text-sm    - 14px (descriptions)
text-base  - 16px (body text)
text-lg    - 18px (section text)
text-xl    - 20px (subheadings)
text-2xl   - 24px (small headings)
text-3xl   - 30px (headings)
text-4xl   - 36px (hero on mobile)
text-5xl   - 48px (hero on tablet)
text-6xl   - 60px (hero on desktop)
```

---

## Summary

✅ **Tailwind CSS** - All classes from standard Tailwind  
✅ **CSS Variables** - Used via `var(--color)` syntax  
✅ **Responsive** - Mobile-first with sm:/md:/lg: breakpoints  
✅ **Animations** - Smooth, GPU-accelerated effects  
✅ **Consistent** - Same design language throughout  
✅ **Accessible** - WCAG AA color contrast, semantic HTML  

🎨 **Production-ready styling complete!**
