/* =========================================
   Animation Utilities
   ========================================= */

export type EasingFunction = (t: number) => number;

export const easing = {
  linear: (t: number) => t,
  easeOut: (t: number) => 1 - Math.pow(1 - t, 3),
  easeInOut: (t: number) =>
    t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2,
};

interface AnimateNumberOptions {
  easing?: EasingFunction;
  round?: boolean;
  onComplete?: () => void;
}

/**
 * Animate number value over time
 *
 * @example
 * animateNumber(0, 1000, 800, setValue, { easing: easing.easeOut })
 */
export function animateNumber(
  from: number,
  to: number,
  duration: number,
  onUpdate: (value: number) => void,
  options: AnimateNumberOptions = {}
): () => void {
  const {
    easing: easingFn = easing.easeOut,
    round = false,
    onComplete,
  } = options;

  const start =
    typeof performance !== "undefined"
      ? performance.now()
      : Date.now();

  let rafId: number | null = null;
  let cancelled = false;

  const tick = (now: number) => {
    if (cancelled) return;

    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easingFn(progress);

    const value = from + (to - from) * eased;
    onUpdate(round ? Math.round(value) : value);

    if (progress < 1) {
      rafId = requestAnimationFrame(tick);
    } else {
      onComplete?.();
    }
  };

  rafId = requestAnimationFrame(tick);

  /* cleanup / cancel */
  return () => {
    cancelled = true;
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }
  };
}
