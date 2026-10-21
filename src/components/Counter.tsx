import { useEffect, useRef, useState } from 'react'
import { useInView } from '../hooks/useInView'
import { easeOut, motionDisabled } from '../lib/motion'
import { cn } from '../lib/utils'

type CounterProps = {
  value: number
  className?: string
  duration?: number
  delay?: number
}

/**
 * A number that counts up while its transform grows to the final size.
 *
 * The value and the scale share one driver and one ease, so the number and
 * its weight arrive together. Digits are tabular so the figures keep equal
 * width while they run, and the final size is static CSS — only the
 * transform moves.
 */
export function Counter({ value, className, duration = 900, delay = 0 }: CounterProps) {
  const [display, setDisplay] = useState(0)
  const spanRef = useRef<HTMLSpanElement | null>(null)
  const latest = useRef(value)
  latest.current = value

  // With motion off, the figure is simply the value — no waiting for the
  // section to scroll into frame.
  useEffect(() => {
    if (motionDisabled()) setDisplay(latest.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ref = useInView<HTMLSpanElement>(() => {
    const node = spanRef.current
    if (!node) return

    if (motionDisabled()) {
      setDisplay(latest.current)
      return
    }

    const target = latest.current
    const begin = performance.now() + delay
    let raf = 0

    const step = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - begin) / duration))
      setDisplay(Math.round(target * easeOut(t)))
      if (t < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)

    // The scale rides the same duration and ease as the count.
    const anim = node.animate(
      [{ transform: 'scale(0.82)' }, { transform: 'scale(1)' }],
      {
        duration: duration + delay,
        delay,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        fill: 'forwards',
      },
    )

    return () => {
      cancelAnimationFrame(raf)
      anim.cancel()
    }
  })

  useEffect(() => {
    const node = spanRef.current
    return () => node?.getAnimations().forEach((a) => a.cancel())
  }, [])

  return (
    <span
      ref={(node) => {
        ref.current = node
        spanRef.current = node
      }}
      className={cn('inline-block', className)}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {display}
    </span>
  )
}
