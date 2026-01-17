# CSS Design System Documentation

## Overview

The AI Trading platform uses a comprehensive CSS variable system with Tailwind CSS for responsive, consistent styling across all components.

## CSS Variables Location

- **Core Variables**: `styles/variables.css`
- **Global Styles**: `app/globals.css`
- **Component Styles**: Inline Tailwind classes in components

## Color Palette

### Background Colors
```css
--bg-primary: #0A0F1C;      /* Main background */
--bg-secondary: #0B1220;    /* Secondary background */
--bg-tertiary: #070B14;     /* Tertiary background */
```

### Text Colors
```css
--text-primary: #ffffff;    /* Main text */
--text-secondary: #9aa0c8;  /* Secondary text */
--text-tertiary: #b7bee5;   /* Tertiary text */
--text-muted: #7a8399;      /* Muted text */
```

### Accent Colors
```css
--accent: #5363ff;          /* Primary accent (blue) */
--accent-2: #7c89ff;        /* Secondary accent */
--accent-soft: rgba(83, 99, 255, 0.08);  /* Soft accent background */
```

### Trading Semantic Colors
```css
--bullish: #22ff88;         /* Bullish trend (green) */
--bearish: #ff5555;         /* Bearish trend (red) */
--neutral: #9aa0c8;         /* Neutral trend (gray) */
```

### Status Colors
```css
--success: #22c55e;         /* Success state */
--danger: #ef4444;          /* Error/danger state */
--warning: #eab308;         /* Warning state */
--info: #3b82f6;            /* Info state */
```

## Spacing & Radius

### Border Radius
```css
--radius-xs: 4px;           /* Extra small (forms, badges) */
--radius-sm: 8px;           /* Small (buttons) */
--radius-md: 12px;          /* Medium (default) */
--radius-lg: 16px;          /* Large */
--radius-base: 14px;        /* Base component radius */
--radius-card: 18px;        /* Card component radius */
--radius-xl: 24px;          /* Extra large */
```

### Shadows
```css
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.15);
--shadow-md: 0 6px 22px rgba(3, 6, 23, 0.6);
--shadow-lg: 0 14px 40px rgba(3, 6, 23, 0.55);
--shadow-xl: 0 20px 60px rgba(0, 0, 0, 0.45);
```

## Transitions

```css
--transition-fast: 150ms ease-out;                          /* Quick feedback */
--transition-base: 250ms ease;                              /* Default */
--transition-slow: 350ms cubic-bezier(0.22, .61, .36, 1);  /* Deliberate */
```

## Usage Examples

### Using CSS Variables

```css
/* In a CSS file */
.my-component {
  background-color: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-md);
  color: var(--text-primary);
  transition: all var(--transition-base);
}
```

### Using Tailwind Classes

```tsx
<div className="
  w-full
  bg-[#0B1220]
  border border-[#1F2937]
  rounded-2xl
  shadow-[0_6px_22px_rgba(3,6,23,0.6)]
  p-6
  transition-all duration-250
">
  Content here
</div>
```

### Combining Variables & Tailwind

```tsx
<style jsx>{`
  .custom-card {
    background-color: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius-card);
    box-shadow: var(--shadow-md);
    padding: 1.5rem;
    transition: all var(--transition-base);
  }
`}</style>

<div className="custom-card hover:shadow-lg">
  Content
</div>
```

## Responsive Design

### Mobile-First Approach

```tsx
<div className="
  /* Mobile (default) */
  text-sm
  px-4
  py-2
  
  /* Tablet (md: 768px) */
  md:text-base
  md:px-6
  md:py-3
  
  /* Desktop (lg: 1024px) */
  lg:text-lg
  lg:px-8
  lg:py-4
">
  Responsive content
</div>
```

### Responsive Visibility

```tsx
{/* Hidden on mobile, visible on tablet and up */}
<div className="hidden md:block">
  Desktop-only content
</div>

{/* Visible on mobile, hidden on tablet and up */}
<div className="md:hidden">
  Mobile-only content
</div>
```

## Dark Mode

The platform uses a dark theme by default. All colors are optimized for dark mode.

```tsx
/* If light mode support needed in future */
@media (prefers-color-scheme: light) {
  :root {
    --bg-primary: #ffffff;
    --text-primary: #000000;
    /* ... adjust other variables */
  }
}
```

## Animation Patterns

### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}
```

### Slide Up
```css
@keyframes slideUp {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.slide-up {
  animation: slideUp 0.3s ease-out;
}
```

### Pulse
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

## Z-Index Scale

```css
--z-dropdown: 1000;    /* Dropdown menus */
--z-sticky: 1020;      /* Sticky headers */
--z-fixed: 1030;       /* Fixed elements */
--z-backdrop: 1040;    /* Backdrops */
--z-offcanvas: 1050;   /* Offcanvas menus */
--z-modal: 1060;       /* Modals & dialogs */
```

## Common Component Patterns

### Card Component
```tsx
<div className="
  bg-[#0B1220]
  border border-[#1F2937]
  rounded-2xl
  px-5 py-4
  shadow-[0_6px_22px_rgba(3,6,23,0.6)]
  hover:shadow-[0_14px_40px_rgba(3,6,23,0.55)]
  transition-all duration-250
">
  Card content
</div>
```

### Button Component
```tsx
<button className="
  px-6 py-2
  bg-[#22ff88]
  text-black
  font-semibold
  rounded-xl
  transition-all duration-250
  hover:scale-105
  active:scale-95
">
  Click me
</button>
```

### Input Component
```tsx
<input
  className="
    w-full
    px-4 py-3
    bg-[#0B1220]
    border border-[#1F2937]
    rounded-lg
    text-white
    placeholder:text-[#7a8399]
    focus:outline-none
    focus:ring-2
    focus:ring-[#5363ff]
    transition-all duration-250
  "
  placeholder="Enter text..."
/>
```

## Best Practices

1. **Use CSS Variables** for colors, spacing, and shadows
2. **Use Tailwind Classes** for layout and responsive utilities
3. **Combine Both** for complex components
4. **Maintain Consistency** - Follow existing patterns
5. **Test Responsive** - Check mobile (320px), tablet (768px), desktop (1024px)
6. **Prefer Dark Mode** - All components designed for dark theme
7. **Use Semantic Colors** - Use --bullish, --bearish for market data
8. **Accessibility** - Ensure sufficient color contrast

## File Structure

```
styles/
├── variables.css          ← CSS custom properties
└── (globals.css in app/) ← Global styles & animations

components/
└── *.tsx                  ← Tailwind classes in JSX
```

## Updates & Maintenance

When updating colors or spacing:

1. Update CSS variables in `styles/variables.css`
2. Update corresponding Tailwind hex values if needed
3. Test across all responsive breakpoints
4. Verify dark mode appearance
5. Check component consistency
