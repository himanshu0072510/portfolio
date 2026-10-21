import { useEffect, useRef } from 'react'

/**
 * Calls `onEnter` the first time the element scrolls into view. Used to
 * start a one-shot animation exactly when it comes into frame, and not
 * before.
 */
export function useInView<T extends HTMLElement>(
  onEnter: () => void,
  options: { threshold?: number; rootMargin?: string } = {},
) {
  const ref = useRef<T | null>(null)
  const fired = useRef(false)
  const { threshold = 0.25, rootMargin = '0px 0px -12% 0px' } = options

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (typeof IntersectionObserver === 'undefined') {
      onEnter()
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired.current) {
          fired.current = true
          onEnter()
          observer.disconnect()
        }
      },
      { threshold, rootMargin },
    )
    observer.observe(node)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return ref
}
