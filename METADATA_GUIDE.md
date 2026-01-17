# Next.js 14+ Metadata & Viewport Configuration Guide

## Overview

Next.js 14+ separates metadata from viewport configuration. Each has its own export object with proper TypeScript typing.

## Quick Reference

### Metadata Export
```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My App",
  description: "App description",
  keywords: "keywords",
  // ... other metadata
};
```

### Viewport Export
```tsx
import type { Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // ... other viewport settings
};
```

## Metadata Configuration

### Basic Metadata
```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crypto AI Trading System",
  description: "Autonomous AI trading system for data-driven market intelligence",
};
```

### Full Metadata Object
```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  // Basic
  title: "Crypto AI Trading System",
  description: "Data-driven market intelligence without removing user control",
  
  // Keywords & author
  keywords: ["AI trading", "crypto", "bitcoin", "ethereum"],
  authors: [
    { name: "CryptoAI", url: "https://ai-trading.vercel.app" }
  ],
  
  // Creator & publisher
  creator: "CryptoAI Team",
  publisher: "CryptoAI",
  
  // Open Graph (Social sharing)
  openGraph: {
    type: "website",
    url: "https://ai-trading.vercel.app",
    title: "Crypto AI Trading System",
    description: "Data-driven market intelligence without removing user control",
    siteName: "CryptoAI",
    images: [
      {
        url: "https://ai-trading.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Crypto AI Trading",
      }
    ],
  },
  
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Crypto AI Trading System",
    description: "Data-driven market intelligence",
    images: ["https://ai-trading.vercel.app/twitter-image.png"],
  },
  
  // Robots & crawling
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  // Alternative languages (hreflang)
  alternates: {
    canonical: "https://ai-trading.vercel.app",
    languages: {
      "en-US": "https://ai-trading.vercel.app/en-US",
      "es-ES": "https://ai-trading.vercel.app/es-ES",
    },
  },
  
  // Verification
  verification: {
    google: "google-site-verification-code",
  },
};
```

## Viewport Configuration

### Basic Viewport
```tsx
import type { Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};
```

### Full Viewport Object
```tsx
import type { Viewport } from "next";

export const viewport: Viewport = {
  // Width & scale
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  
  // User zoom
  userScalable: true,
  
  // Theme colors
  themeColor: "#0A0F1C",
  colorScheme: "dark",
  
  // Interactive widgets (for iOS)
  interactiveWidget: "resizes-content",
  
  // Viewport fit (notch support)
  viewportFit: "cover",
};
```

### Viewport Properties Explained

| Property | Purpose | Example |
|----------|---------|---------|
| **width** | Viewport width | "device-width" or 800 |
| **initialScale** | Initial zoom level | 1 (100%) |
| **maximumScale** | Maximum zoom allowed | 5 (500%) |
| **minimumScale** | Minimum zoom allowed | 1 (100%) |
| **userScalable** | Allow user pinch zoom | true/false |
| **themeColor** | Browser chrome color | "#0A0F1C" |
| **colorScheme** | Preferred color scheme | "dark", "light", or "dark light" |
| **interactiveWidget** | How to handle keyboard on iOS | "resizes-content" or "overlays-content" |
| **viewportFit** | Safe area insets (notch) | "cover" or "auto" |

## Common Viewport Configurations

### Default (Mobile-first)
```tsx
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};
```

### Dark Mode App
```tsx
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0A0F1C",
  colorScheme: "dark",
};
```

### No User Zoom
```tsx
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
};
```

### Full Screen App (Notch support)
```tsx
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};
```

## Metadata per Page

Each page can override global metadata:

```tsx
// app/trade/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trading Dashboard - CryptoAI",
  description: "Real-time trading dashboard with AI insights",
  openGraph: {
    title: "Trading Dashboard",
    description: "Real-time trading with AI analysis",
  },
};

export default function TradePage() {
  return <div>Trade dashboard</div>;
}
```

## Metadata in Route Groups

Use route groups to set metadata for multiple pages:

```tsx
// app/(auth)/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s - Auth",
    default: "Authentication",
  },
};

export default function AuthLayout({ children }) {
  return <>{children}</>;
}
```

## Dynamic Metadata

Generate metadata dynamically based on route parameters:

```tsx
// app/trade/[id]/page.tsx
import type { Metadata } from "next";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  
  // Fetch data if needed
  const trade = await fetchTrade(id);
  
  return {
    title: `Trade #${id} - CryptoAI`,
    description: `Details for trade ${id}`,
    openGraph: {
      title: `Trade #${id}`,
      description: trade.description,
    },
  };
}

export default function TradePage({ params }: Props) {
  return <div>Trade details for {params.id}</div>;
}
```

## TypeScript Support

Both exports are fully typed:

```tsx
import type { Metadata, Viewport } from "next";

// Metadata is fully typed
export const metadata: Metadata = {
  title: "...", // ✅ IntelliSense
  description: "...",
  // viewport: "...", // ❌ Error - wrong export
};

// Viewport is fully typed
export const viewport: Viewport = {
  width: "device-width", // ✅ IntelliSense
  initialScale: 1,
  // title: "...", // ❌ Error - wrong export
};
```

## Migration from Next.js 13 to 14+

### Before (Next.js 13)
```tsx
export const metadata = {
  title: "App",
  viewport: "width=device-width, initial-scale=1",
};
```

### After (Next.js 14+)
```tsx
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "App",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};
```

## Checklist

- ✅ Use `type { Metadata, Viewport }` imports
- ✅ Separate metadata and viewport exports
- ✅ Add TypeScript types to exports
- ✅ No `viewport` property inside `metadata`
- ✅ Theme color in viewport for browser chrome
- ✅ OpenGraph for social sharing
- ✅ Robots configuration for SEO
- ✅ Canonical URLs for multi-language sites
- ✅ Twitter Card for Twitter sharing
- ✅ Dynamic metadata for route parameters

## Common Pitfalls

### ❌ Wrong: viewport inside metadata
```tsx
export const metadata = {
  title: "App",
  viewport: "...", // Error in Next.js 14+
};
```

### ✅ Correct: separate exports
```tsx
export const metadata: Metadata = { title: "App" };
export const viewport: Viewport = { width: "device-width" };
```

### ❌ Wrong: string viewport
```tsx
export const viewport: Viewport = "width=device-width, initial-scale=1"; // Error
```

### ✅ Correct: object viewport
```tsx
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};
```

## Resources

- [Next.js Metadata Documentation](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [MDN Viewport Meta Tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)

Your project is now **fully compliant with Next.js 14+ metadata standards**! ✨
