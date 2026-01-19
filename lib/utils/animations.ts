/**
 * Animation utility functions
 */

/**
 * Smooth number animation using requestAnimationFrame
 */
export function animateNumber(
  from: number,
  to: number,
  duration: number,
  onUpdate: (v: number) => void
): void {
  const start = typeof performance !== "undefined"
    ? performance.now()
    : Date.now();

  const tick = (now: number) => {
    const progress = Math.min((now - start) / duration, 1);
    const value = from + (to - from) * progress;
    onUpdate(value);

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
}
