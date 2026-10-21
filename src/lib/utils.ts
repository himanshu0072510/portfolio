import type { ClassValue } from './types'

/** Tiny classnames joiner — no dependency needed. */
export function cn(...values: ClassValue[]): string {
  const out: string[] = []
  for (const value of values) {
    if (!value) continue
    if (typeof value === 'string' || typeof value === 'number') {
      out.push(String(value))
    } else if (Array.isArray(value)) {
      const inner = cn(...value)
      if (inner) out.push(inner)
    } else {
      for (const [key, on] of Object.entries(value)) {
        if (on) out.push(key)
      }
    }
  }
  return out.join(' ')
}
