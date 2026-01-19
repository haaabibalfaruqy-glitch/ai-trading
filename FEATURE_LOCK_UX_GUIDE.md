# GLOBAL FEATURE LOCK SYSTEM – UX FLOW DIAGRAM

## Locked State (Guest User)

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  [BLURRED PREVIEW - opacity-50, blur-sm]       │
│  ┌──────────────────────────────────┐           │
│  │ 🔍 Market analysis cards...      │           │
│  │ 📊 Live profit table...          │           │
│  │ 🎯 AI timeline...                │           │
│  └──────────────────────────────────┘           │
│                                                 │
│  [LOCK OVERLAY - bg-black/30 backdrop-blur]    │
│  ┌──────────────────────────────────┐           │
│  │          🔒 LOCKED               │           │
│  │  Connect broker to unlock        │           │
│  └──────────────────────────────────┘           │
│                                                 │
│  [Click overlay] → Opens Modal                  │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Unlock Modal (Professional SaaS Style)

```
┌─────────────────────────────────────────────────┐
│  ×                                              │
│  Connect Your Broker                            │
│  Unlock advanced AI trading features with       │
│  real-time execution                            │
│                                                 │
│  ✓ Real-time market analysis                   │
│  ✓ Automated strategy execution                │
│  ✓ Portfolio risk management                   │
│  ✓ Advanced signal detection                   │
│                                                 │
│  [       Connect Broker        ]                │
│                                                 │
│  Secure connection • No credit card • Cancel    │
│  anytime                                        │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Unlocked State (Broker Connected)

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  [FULL CONTENT - no blur, fully interactive]   │
│  ┌──────────────────────────────────┐           │
│  │ 🔍 Market analysis cards...      │           │
│  │    (clickable, functional)       │           │
│  │ 📊 Live profit table...          │           │
│  │    (real-time updates)           │           │
│  │ 🎯 AI timeline...                │           │
│  │    (full analytics)              │           │
│  └──────────────────────────────────┘           │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Key Visual Elements

### Locked Features
- **Blur Effect:** `blur-sm`
- **Opacity:** `opacity-50`
- **Overlay:** `bg-black/30 backdrop-blur-sm`
- **Cursor:** `cursor-not-allowed`
- **Interaction:** Shows unlock modal

### Lock Overlay
- **Icon:** 🔒
- **Message:** Professional tone (no urgency)
- **Action:** Click to connect broker
- **Tone:** "Connect to unlock" not "Premium required"

### Unlock Modal
- **Background:** Fixed overlay with dark backdrop
- **Card:** `bg-[#0B1220] border border-[#22ff88]/30 rounded-2xl`
- **Shadow:** `shadow-[0_0_60px_rgba(34,255,136,0.25)]`
- **CTA:** Green gradient from `#22ff88` to `#3cffaa`
- **Close:** ✕ button in top-right
- **Trust Line:** "Secure connection • No credit card required • Cancel anytime"

---

## Feature Lock Levels

### Level: "basic"
- Locked for guests only
- Unlocked for `broker_connected` and `premium`

### Level: "advanced" (Default)
- Locked for `guest` and `broker_connected`
- Unlocked for `premium` only

### Level: "premium"
- Locked for guests
- Unlocked for `broker_connected` and `premium`

---

## Access States

```
User Journey:

[GUEST] 
  ↓ (click feature)
[EXECUTION GATE MODAL]
  ↓ (click "Connect Broker")
[connectBroker() + unlockBroker()]
  ↓
[BROKER_CONNECTED] 
  ↓
[Full feature access]
```

---

## Language Guidelines

### ✅ ALLOWED (Professional SaaS)
- "Connect your broker"
- "Unlock advanced AI features"
- "Enable real-time execution"
- "Access premium analytics"
- "Secure connection"
- "Real-time market analysis"

### ❌ NOT ALLOWED (Affiliate Language)
- "Join our referral program"
- "Affiliate link"
- "IB (Introducing Broker)"
- "Refer friends"
- "Commission earned"
- "Affiliate benefits"

---

## CSS Classes Used

### Blur & Preview
```
blur-sm opacity-50           // Blurred preview
backdrop-blur-sm             // Lock overlay blur
bg-black/30                  // Lock overlay darkness
transition                   // Smooth hover
```

### Interactive
```
cursor-not-allowed           // Locked state cursor
hover:bg-black/40            // Unlock modal hover
pointer-events-none          // Prevent preview clicks
```

### Visual Hierarchy
```
text-white font-bold         // Modal title
text-sm text-gray-300        // Feature list
text-xs text-gray-500        // Trust line
text-[#22ff88]              // Brand accent
```

