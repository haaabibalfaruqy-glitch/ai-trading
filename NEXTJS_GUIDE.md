# Next.js 14+ Client vs Server Components Guide

## Overview

Next.js 14+ uses the App Router with React Server Components (RSC) by default. Understanding when to use "use client" is critical for proper functionality.

## Quick Reference

| File Type | "use client" needed? | Reason |
|-----------|---|---|
| Page components | ✅ Yes | Use interactive features |
| Layout files | ✅ Yes | Providers, context, interactivity |
| Loading skeletons | ✅ Yes | Maps, conditional rendering, animations |
| Components with hooks | ✅ Yes | useState, useEffect, useContext, etc. |
| Components with events | ✅ Yes | onClick, onChange, form handlers |
| Utility functions | ❌ No | Can be imported by client components |
| Data fetching (fetch) | ❌ No | Use Server Components or API routes |
| Database queries | ❌ No | Server Components only |
| Auth checks | ❌ No | Server Components only |

## When to Use "use client"

### 1. **Using React Hooks**
```tsx
"use client";

import { useState, useEffect } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### 2. **Using Browser APIs**
```tsx
"use client";

import { useEffect } from "react";

export default function WindowSize() {
  useEffect(() => {
    const handleResize = () => console.log(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  return <div>Check console for window size</div>;
}
```

### 3. **Using Event Listeners**
```tsx
"use client";

export default function Button() {
  return (
    <button onClick={() => alert("Clicked!")}>
      Click me
    </button>
  );
}
```

### 4. **Using Context/Providers**
```tsx
"use client";

import { ReactNode } from "react";
import { AccessProvider } from "@/context/UserAccessContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AccessProvider>
      {children}
    </AccessProvider>
  );
}
```

### 5. **Dynamic Content with Maps**
```tsx
"use client";

export default function List() {
  const items = [1, 2, 3];
  
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
```

### 6. **Conditional Rendering**
```tsx
"use client";

import { useState } from "react";

export default function Toggle() {
  const [show, setShow] = useState(false);
  
  return (
    <>
      {show && <div>Shown!</div>}
      <button onClick={() => setShow(!show)}>Toggle</button>
    </>
  );
}
```

## When to Use Server Components (No "use client")

### 1. **Direct Database Queries**
```tsx
// Server Component (no "use client")
import { db } from "@/lib/db";

export default async function UserList() {
  const users = await db.users.findAll();
  
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### 2. **Environment Variables**
```tsx
// Server Component
export default function Config() {
  return <div>API: {process.env.API_URL}</div>;
}
```

### 3. **Authentication Checks**
```tsx
// Server Component
import { auth } from "@/lib/auth";

export default async function ProtectedPage() {
  const session = await auth();
  
  if (!session) {
    return <div>Please log in</div>;
  }
  
  return <div>Welcome, {session.user.name}</div>;
}
```

### 4. **Server-Only Code**
```tsx
// Server Component
import { headers } from "next/headers";

export default function Example() {
  const headersList = headers();
  const userAgent = headersList.get("user-agent");
  
  return <div>User Agent: {userAgent}</div>;
}
```

## Mixed Approach (Best Practice)

Combine server and client components:

```tsx
// pages/dashboard.tsx (Server Component)
import { getUser } from "@/lib/auth";
import { getUserData } from "@/lib/db";
import DashboardClient from "@/components/DashboardClient";

export default async function Dashboard() {
  const user = await getUser();
  const data = await getUserData(user.id);
  
  return <DashboardClient user={user} data={data} />;
}
```

```tsx
// components/DashboardClient.tsx (Client Component)
"use client";

import { useState } from "react";

interface Props {
  user: User;
  data: Data;
}

export default function DashboardClient({ user, data }: Props) {
  const [filter, setFilter] = useState("");
  
  return (
    <div>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter..."
      />
      {/* Use user and data here */}
    </div>
  );
}
```

## Common Patterns in This Project

### Pattern 1: Page with Provider
```tsx
// app/layout.tsx
"use client";

import { AccessProvider } from "@/context/UserAccessContext";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>
        <AccessProvider>
          {children}
        </AccessProvider>
      </body>
    </html>
  );
}
```

### Pattern 2: Loading Skeleton
```tsx
// app/trade/loading.tsx
"use client";

export default function LoadingTrade() {
  return (
    <div className="min-h-screen">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse">
          Loading...
        </div>
      ))}
    </div>
  );
}
```

### Pattern 3: Interactive Component
```tsx
// components/TradeHero.tsx
"use client";

import { useState } from "react";
import { SystemMode } from "@/lib/types";

interface Props {
  systemMode: SystemMode;
  setShowGate: (v: boolean) => void;
}

export default function TradeHero({ systemMode, setShowGate }: Props) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div onClick={() => setExpanded(!expanded)}>
      {/* Interactive content */}
    </div>
  );
}
```

## Checklist Before Deployment

- ✅ Add "use client" to all interactive components
- ✅ No "use client" on server-only operations
- ✅ Providers are marked "use client"
- ✅ Loading/error boundary components are "use client"
- ✅ Layout.tsx is "use client"
- ✅ All hooks have "use client" at top of file
- ✅ Event handlers are in client components
- ✅ No useState in Server Components
- ✅ No useEffect in Server Components
- ✅ No "use client" in utility files (unless they use hooks)

## Debugging Tips

### Error: "Cannot use client-only feature"
```
Solution: Add "use client" to the top of the file
```

### Error: "async/await in client component"
```
Solution: Move async code to server component or API route,
then pass data as props to client component
```

### Error: "useContext in Server Component"
```
Solution: Move to client component with "use client"
```

### Error: "Cannot access environment variables in client"
```
Solution: Move to server component, or pass as prop from server
```

## File Structure Example

```
app/
├── layout.tsx              (use client - has providers)
├── page.tsx               (use client - interactive)
├── trade/
│   ├── layout.tsx         (use client)
│   ├── page.tsx           (use client)
│   ├── loading.tsx        (use client - ✅ Shows skeleton)
│   └── error.tsx          (use client - error boundary)
├── api/
│   └── strategies/
│       └── route.ts       (no "use client" - server API route)
└── components/
    ├── TradeHero.tsx      (use client - interactive)
    ├── HeroStats.tsx      (use client - displays data)
    ├── Footer.tsx         (use client - safe)
    └── ... other components
```

## Summary

| Concept | Rule |
|---------|------|
| **Default** | Server Components (no "use client") |
| **Interactivity** | "use client" |
| **Hooks** | "use client" |
| **State/Effects** | "use client" |
| **Event Listeners** | "use client" |
| **Async/Fetch** | Server Components |
| **Secrets/Auth** | Server Components |
| **Database** | Server Components |

The project is now **fully optimized for Next.js 14+ server/client boundaries**! 🚀
