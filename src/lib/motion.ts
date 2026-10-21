/** True when the visitor has asked for less motion. */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * True when motion should be skipped entirely: either the visitor asked for
 * less motion, or the page was loaded with `?noanim=1` (handy for
 * screenshots and print).
 */
export function motionDisabled(): boolean {
  if (typeof window === 'undefined') return true
  if (prefersReducedMotion()) return true
  return new URLSearchParams(window.location.search).has('noanim')
}

/** power3.out — matches cubic-bezier(0.22, 1, 0.36, 1). */
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
