import { type ReactNode, useEffect, useRef, useState } from 'react'
import { cn } from '../lib/utils'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'section' | 'li' | 'article' | 'span'
}

/**
 * True when the visitor asked for less motion, or when `?noanim=1` is in the
 * URL (handy for screenshots and print). In that case content is rendered
 * visible immediately instead of waiting for an intersection.
 */
function shouldSkipAnimation(): boolean {
  if (typeof window === 'undefined') return true
  if (new URLSearchParams(window.location.search).has('noanim')) return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Fades content up the first time it scrolls into view. */
export function Reveal({ children, className, delay = 0, as = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [shown, setShown] = useState(shouldSkipAnimation)
  const observable = typeof IntersectionObserver !== 'undefined'

  useEffect(() => {
    const node = ref.current
    if (!node || shown || !observable) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [shown, observable])

  const Tag = as as 'div'
  const visible = shown || !observable

  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn(
        'transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0',
        className,
      )}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </Tag>
  )
}
