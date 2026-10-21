import type { ReactNode } from 'react'
import { cn } from '../lib/utils'
import { Reveal } from './Reveal'

type SectionProps = {
  id: string
  index: string
  title: string
  lede?: string
  children: ReactNode
  className?: string
}

export function Section({ id, index, title, lede, children, className }: SectionProps) {
  return (
    <section id={id} className={cn('relative scroll-mt-24 py-16 md:py-24', className)}>
      <div className="mx-auto w-full max-w-5xl px-5 sm:px-8">
        <Reveal>
          <div className="mb-10 md:mb-14">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs tracking-[0.2em] text-accent">{index}</span>
              <span className="h-px w-8 bg-border" />
              <span className="font-mono text-xs tracking-[0.2em] text-muted uppercase">
                {title}
              </span>
            </div>
            {lede ? (
              <h2 className="mt-5 max-w-2xl font-display text-3xl leading-[1.15] tracking-tight text-fg text-balance sm:text-4xl md:text-[2.75rem]">
                {lede}
              </h2>
            ) : null}
          </div>
        </Reveal>
        {children}
      </div>
    </section>
  )
}
