import type { ReactNode } from 'react'
import { cn } from '../lib/utils'

type SectionProps = {
  id: string
  title: string
  lede?: string
  /** A real measurement printed at the end of the leader line. */
  datum?: string
  children: ReactNode
  className?: string
}

/**
 * A region of the sheet. The heading is a leader line with the name at its
 * root and, where there is something worth measuring, the figure at its end.
 */
export function Section({ id, title, lede, datum, children, className }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={cn('relative scroll-mt-24 py-16 md:py-24', className)}>
      <div className="mx-auto w-full max-w-5xl px-5 sm:px-8">
        <div className="mb-10 md:mb-14">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 shrink-0 bg-accent" aria-hidden />
            <h2 id={`${id}-heading`} className="text-[13px] font-semibold tracking-tight text-fg">
              {title}
            </h2>
            <span className="leader flex-1" aria-hidden />
            {datum ? <span className="measure text-muted">{datum}</span> : null}
          </div>
          {lede ? (
            <p className="mt-6 max-w-2xl font-display text-[clamp(1.75rem,4.4vw,2.75rem)] leading-[1.12] tracking-[-0.02em] text-fg text-balance">
              {lede}
            </p>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  )
}
