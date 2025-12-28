const PREMIUM_KEY = "ai_premium_access";
const PREMIUM_EXPIRE_KEY = "ai_premium_expire";
const PREMIUM_SOURCE_KEY = "ai_premium_source";

const TRIAL_HOURS = 24;

// ✅ CEK PREMIUM AKTIF
export function hasPremiumAccess(): boolean {
  if (typeof window === "undefined") return false;

  const active = localStorage.getItem(PREMIUM_KEY) === "true";
  const expire = localStorage.getItem(PREMIUM_EXPIRE_KEY);

  if (!active || !expire) return false;

  return Date.now() < Number(expire);
}

// ✅ UNLOCK PREMIUM (TRIAL)
export function unlockPremium(source?: string) {
  if (typeof window === "undefined") return;

  const expireAt = Date.now() + TRIAL_HOURS * 60 * 60 * 1000;

  localStorage.setItem(PREMIUM_KEY, "true");
  localStorage.setItem(PREMIUM_EXPIRE_KEY, expireAt.toString());

  if (source) {
    localStorage.setItem(PREMIUM_SOURCE_KEY, source);
  }
}

// ✅ AMBIL WAKTU EXPIRE (UNTUK COUNTDOWN)
export function getPremiumExpire(): number | null {
  if (typeof window === "undefined") return null;

  const value = localStorage.getItem(PREMIUM_EXPIRE_KEY);
  return value ? Number(value) : null;
}

// ✅ AMBIL SOURCE PREMIUM (OPTIONAL)
export function getPremiumSource(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(PREMIUM_SOURCE_KEY);
}
