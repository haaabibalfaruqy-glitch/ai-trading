# ⚙️ TailwindCSS Configuration Reference

## Complete Tailwind Setup for Copilot Homepage

This document provides a complete reference for the TailwindCSS configuration used throughout the AI Trading Copilot application.

---

## 1. Content Configuration

```javascript
content: [
  "./app/**/*.{js,ts,jsx,tsx}",        // App routes
  "./components/**/*.{js,ts,jsx,tsx}",  // React components
  "./styles/**/*.css"                   // CSS files
]
```

### What This Does
- **Scans** all `.js`, `.ts`, `.jsx`, `.tsx` files in `app/` and `components/` directories
- **Includes** CSS files in `styles/` directory
- **Purges** unused CSS classes in production build
- **IntelliSense** enabled for autocomplete in these files

---

## 2. Theme Extensions

### Colors

```javascript
colors: {
  primary: '#5363ff',       // Primary blue (main accent)
  primary2: '#7c89ff',      // Secondary blue (lighter)
  bullish: '#22ff88',       // Green (up/positive)
  bearish: '#ff5555',       // Red (down/negative)
  neutral: '#9aa0c8',       // Gray-blue (neutral)
  card: '#0B1220',          // Card background
  surface: '#161c2e',       // Surface background
}
```

#### Usage
```typescript
// Background colors
<div className="bg-primary">  {/* #5363ff */}
<div className="bg-bullish">  {/* #22ff88 */}

// Text colors
<span className="text-bullish">Up</span>
<span className="text-bearish">Down</span>

// Border colors
<div className="border-primary">
```

---

### Spacing Scale

```javascript
spacing: {
  'xs': '4px',
  'sm': '8px',
  'md': '12px',
  'lg': '16px',
  'xl': '20px',
  '2xl': '24px',
  '3xl': '32px',
}
```

#### Usage
```typescript
// Padding
<div className="p-lg">           {/* 16px padding */}
<div className="px-xl py-lg">    {/* 20px horizontal, 16px vertical */}

// Margins
<div className="mb-md">          {/* 12px margin-bottom */}
<div className="mt-lg ml-xl">    {/* margin-top: 16px, margin-left: 20px */}

// Gaps (Grid/Flex)
<div className="gap-lg">         {/* 16px gap */}
```

---

### Border Radius

```javascript
borderRadius: {
  'xs': '4px',
  'sm': '8px',
  'md': '12px',
  'lg': '16px',
  'xl': '20px',
  'card': '18px',
}
```

#### Usage
```typescript
// Buttons
<button className="rounded-lg">        {/* 16px radius */}

// Cards
<div className="rounded-card">         {/* 18px radius */}

// Small elements
<div className="rounded-xs">           {/* 4px radius */}
```

---

### Shadows

```javascript
boxShadow: {
  'sm': '0 2px 8px rgba(0, 0, 0, 0.15)',
  'md': '0 6px 22px rgba(3, 6, 23, 0.6)',
  'lg': '0 14px 40px rgba(3, 6, 23, 0.55)',
  'xl': '0 20px 60px rgba(0, 0, 0, 0.45)',
}
```

#### Usage
```typescript
// Subtle shadows
<div className="shadow-sm">     {/* Small shadow */}

// Medium shadows
<div className="shadow-md">     {/* Medium shadow */}

// Large shadows (hover states)
<div className="hover:shadow-lg">
```

---

## 3. Keyframes & Animations

### Available Keyframes

#### FadeIn
```javascript
fadeIn: {
  '0%': { opacity: '0' },
  '100%': { opacity: '1' }
}
```
**Duration**: 0.3s | **Easing**: ease-out

#### FadeInUp (Most Used)
```javascript
fadeInUp: {
  '0%': { opacity: '0', transform: 'translateY(20px)' },
  '100%': { opacity: '1', transform: 'translateY(0)' }
}
```
**Duration**: 0.5s | **Easing**: ease-out | **Direction**: Up 20px

#### FadeSlide
```javascript
fadeSlide: {
  '0%': { opacity: '0', transform: 'translateY(8px)' },
  '100%': { opacity: '1', transform: 'translateY(0)' }
}
```
**Duration**: 0.35s | **Easing**: ease-out | **Direction**: Up 8px

#### SlideUp
```javascript
slideUp: {
  '0%': { transform: 'translateY(10px)', opacity: '0' },
  '100%': { transform: 'translateY(0)', opacity: '1' }
}
```
**Duration**: 0.3s | **Easing**: ease-out

#### Pulse
```javascript
pulse: {
  '0%, 100%': { opacity: '1' },
  '50%': { opacity: '0.5' }
}
```
**Duration**: 2s | **Easing**: cubic-bezier | **Infinite**: Yes

#### Shimmer (Skeleton Loader)
```javascript
shimmer: {
  '0%': { backgroundPosition: '-1000px 0' },
  '100%': { backgroundPosition: '1000px 0' }
}
```
**Duration**: 2s | **Infinite**: Yes

#### Bounce
```javascript
bounce: {
  '0%, 100%': { transform: 'translateY(0)' },
  '50%': { transform: 'translateY(-4px)' }
}
```
**Duration**: 1s | **Infinite**: Yes

#### Marquee (Scrolling Text)
```javascript
marquee: {
  '0%': { transform: 'translateX(0%)' },
  '100%': { transform: 'translateX(-50%)' }
}
```
**Duration**: 18s | **Infinite**: Yes

---

### Animation Classes

```javascript
animation: {
  fadeIn: 'fadeIn 0.3s ease-out',
  fadeInUp: 'fadeInUp 0.5s ease-out forwards',
  fadeSlide: 'fadeSlide 0.35s ease-out',
  slideUp: 'slideUp 0.3s ease-out',
  pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  marquee: 'marquee 18s linear infinite',
  shimmer: 'shimmer 2s infinite',
  bounce: 'bounce 1s infinite'
}
```

#### Usage
```typescript
// Fade in animation
<div className="animate-fadeIn">Content</div>

// Fade in and slide up (most common)
<div className="animate-fadeInUp">Content</div>

// Pulsing loading state
<div className="animate-pulse">Loading...</div>

// Shimmer skeleton
<div className="animate-shimmer">Skeleton</div>

// Bounce icon
<div className="animate-bounce">↓</div>
```

---

### Staggered Animation with Delays

```typescript
// Homepage uses CSS delays via inline styles
<div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
  Staggered content
</div>

// Or use custom delay classes if added to globals.css
<div className="animate-fadeInUp delay-200">Content</div>
```

---

## 4. Transition Configuration

### Transition Durations

```javascript
transitionDuration: {
  'fast': '150ms',
  'base': '250ms',
  'slow': '350ms'
}
```

#### Usage
```typescript
// Default Tailwind transitions (150ms-350ms)
<button className="transition">
<button className="transition-all">

// Custom durations
<button className="duration-fast">
<button className="duration-base">
<button className="duration-slow">
```

### Transition Timing Functions

```javascript
transitionTimingFunction: {
  'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  'ease-out': 'cubic-bezier(0.4, 0, 0.6, 1)'
}
```

#### Usage
```typescript
// Smooth easing on transitions
<div className="transition-colors ease-out">

// Combined with duration
<div className="transition-all duration-base ease-in-out">
```

---

## 5. Font Sizing Scale

```javascript
fontSize: {
  'xs': ['12px', { lineHeight: '16px' }],
  'sm': ['14px', { lineHeight: '20px' }],
  'base': ['16px', { lineHeight: '24px' }],
  'lg': ['18px', { lineHeight: '28px' }],
  'xl': ['20px', { lineHeight: '28px' }],
  '2xl': ['24px', { lineHeight: '32px' }],
}
```

#### Usage
```typescript
// Text sizing
<p className="text-xs">Extra small (12px)</p>
<p className="text-sm">Small (14px)</p>
<p className="text-base">Base (16px)</p>
<p className="text-lg">Large (18px)</p>
<p className="text-xl">Extra Large (20px)</p>
<p className="text-2xl">2XL (24px)</p>

// Responsive
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
  Responsive Heading
</h1>
```

---

## 6. Default Tailwind Breakpoints (Not Extended)

```
xs:  Mobile first (default)
sm:  640px   (mobile landscape, small tablets)
md:  768px   (tablets)
lg:  1024px  (desktops)
xl:  1280px  (large desktops)
2xl: 1536px  (extra large displays)
```

#### Usage
```typescript
// Mobile first approach
<div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">

// Responsive text
<h1 className="text-xl md:text-2xl lg:text-3xl">

// Responsive padding
<div className="p-2 sm:p-4 md:p-6 lg:p-8">

// Hide/show on breakpoints
<div className="hidden md:block">Show on desktop+</div>
<div className="md:hidden">Show on mobile/tablet only</div>
```

---

## 7. Common Tailwind Classes Reference

### Display
```
flex              - Display: flex
flex-col          - flex-direction: column
flex-row          - flex-direction: row (default)
grid              - Display: grid
block             - Display: block
inline-flex       - Display: inline-flex
hidden            - Display: none
```

### Sizing
```
w-full            - Width: 100%
w-1/2, w-1/3      - Width: 50%, 33.33%
h-screen          - Height: 100vh
min-h-screen      - Min-height: 100vh
max-w-3xl         - Max-width: 768px
```

### Positioning
```
absolute          - Position: absolute
relative          - Position: relative
fixed             - Position: fixed
top-0, left-0     - Top: 0, Left: 0
-translate-x-1/2  - Transform: translateX(-50%)
z-10              - Z-index: 10
```

### Alignment
```
items-center      - align-items: center
justify-center    - justify-content: center
justify-between   - justify-content: space-between
text-center       - text-align: center
```

### Spacing
```
p-4               - Padding: 16px
px-6              - Padding-left/right: 24px
py-2              - Padding-top/bottom: 8px
mb-4              - Margin-bottom: 16px
mt-6              - Margin-top: 24px
gap-4             - Grid gap: 16px
```

### Colors
```
bg-primary        - Background: #5363ff
text-white        - Color: white
text-gray-400     - Color: gray-400
border-white/10   - Border: white with 10% opacity
```

### Borders & Radius
```
border            - Border: 1px solid
border-2          - Border: 2px solid
rounded-lg        - Border-radius: 16px
rounded-card      - Border-radius: 18px
```

### Shadows
```
shadow-sm         - Small shadow
shadow-md         - Medium shadow
shadow-lg         - Large shadow
shadow-xl         - Extra large shadow
```

### Transitions
```
transition        - Transition: default properties
transition-all    - Transition: all properties
transition-colors - Transition: color properties
duration-fast     - Transition-duration: 150ms
ease-out          - Transition-timing-function: ease-out
```

### Hover & States
```
hover:scale-105   - Transform: scale(1.05) on hover
hover:shadow-lg   - Box-shadow: lg on hover
hover:bg-white/10 - Background opacity on hover
active:scale-95   - Transform: scale(0.95) on active
focus:ring-2      - Ring: 2px on focus
```

---

## 8. Tips & Best Practices

### DO ✅
```typescript
// Use Tailwind classes
<button className="px-6 py-2 rounded-lg bg-primary hover:scale-105">

// Use responsive prefixes
<div className="text-sm md:text-lg lg:text-xl">

// Combine multiple utilities
<div className="flex flex-col items-center justify-center gap-4">

// Use animations for interactions
<div className="hover:shadow-lg transition-all">
```

### DON'T ❌
```typescript
// Avoid inline styles if Tailwind class exists
❌ <div style={{ color: 'white' }}>
✅ <div className="text-white">

// Avoid @media queries if breakpoints exist
❌ @media (max-width: 768px)
✅ Use md: prefix

// Don't duplicate animations
❌ @keyframes custom { ... }
✅ Use Tailwind's animate-fadeInUp

// Avoid arbitrary values when standard exists
❌ className="w-[500px]"
✅ className="max-w-3xl"
```

---

## 9. Debugging Tailwind Issues

### Issue: Class Not Applying

```typescript
// Check 1: Spelling
className="bg-primary"     ✅ Correct
className="bg-primar"      ❌ Typo

// Check 2: File in content paths
// Must be in: ./app/**, ./components/**, ./styles/**

// Check 3: Build needed
// Run: npm run dev  (auto-recompiles Tailwind)

// Check 4: Use IntelliSense
// Ctrl+Space to see available classes
```

### Issue: Color Not Matching

```typescript
// Verify custom colors in tailwind.config.js
colors: {
  primary: '#5363ff',
  bullish: '#22ff88',
  // etc.
}

// Use directly
<div className="bg-primary">

// Or use hex
<div className="bg-[#5363ff]">
```

### Issue: Animation Not Playing

```typescript
// Check animation name
animate-fadeInUp    ✅ Correct
animate-fadeinup    ❌ Wrong case

// Check duration
fadeInUp: 'fadeInUp 0.5s ease-out forwards'

// Add !important if overridden
className="!animate-fadeInUp"
```

---

## 10. Performance Optimization

### Production Build
```bash
npm run build
# Tailwind PurgeCSS removes unused classes
# Result: ~50KB CSS file (optimized)
```

### What Gets Purged
- Unused animation classes
- Unused color classes
- Unused spacing utilities
- Unused custom colors

### What Stays
- Classes used in component code
- Dynamic class names (must be literal strings)
- CSS variables (separate file)

---

## 11. Customization Checklist

- [x] Colors configured (primary, bullish, bearish, etc.)
- [x] Spacing scale defined (xs, sm, md, lg, xl, 2xl, 3xl)
- [x] Border radius customized (xs, sm, md, lg, xl, card)
- [x] Shadows configured (sm, md, lg, xl)
- [x] Animations configured (fadeIn, fadeInUp, pulse, etc.)
- [x] Transitions configured (fast, base, slow)
- [x] Font sizes defined (xs through 2xl)
- [x] Content paths configured (app/**, components/**)

---

## Summary

✅ **Complete Tailwind Setup** - All utilities configured  
✅ **Custom Theme** - Colors, spacing, animations  
✅ **IntelliSense Ready** - Full autocomplete support  
✅ **Production Optimized** - CSS purging enabled  
✅ **Responsive** - Mobile-first breakpoints  
✅ **Animations** - Smooth GPU-accelerated effects  

🎨 **Tailwind is ready for production!**

---

## Quick Reference Card

| Feature | Config | Usage |
|---------|--------|-------|
| Colors | `colors: { primary, bullish, bearish... }` | `bg-primary`, `text-bullish` |
| Spacing | `spacing: { xs: 4px, sm: 8px... }` | `p-lg`, `mb-md`, `gap-xl` |
| Radius | `borderRadius: { xs, sm, md, lg, card }` | `rounded-lg`, `rounded-card` |
| Shadows | `boxShadow: { sm, md, lg, xl }` | `shadow-md`, `hover:shadow-lg` |
| Animations | `fadeIn`, `fadeInUp`, `pulse`, `shimmer` | `animate-fadeInUp` |
| Transitions | `fast` (150ms), `base` (250ms), `slow` | `transition-all duration-base` |
| Fonts | `xs-2xl` with line heights | `text-lg sm:text-xl md:text-2xl` |
| Breakpoints | `sm:640px`, `md:768px`, `lg:1024px` | `hidden md:block`, `sm:w-1/2` |
