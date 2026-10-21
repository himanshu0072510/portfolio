import type { ReactNode } from 'react'
import { cn } from '../lib/utils'

/**
 * A frame on the drawing sheet, with registration marks at the corners.
 * Boxes are used only where something is genuinely a container — elsewhere
 * the sheet is separated with hairline rules.
 */
export function Sheet({
  children,
  className,
  fill = false,
}: {
  children: ReactNode
  className?: string
  fill?: boolean
}) {
  return (
    <div
      className={cn(
        'relative border border-rule',
        fill ? 'bg-surface/70' : 'bg-surface/30',
        className,
      )}
    >
      <Tick position="left-top" />
      <Tick position="right-top" />
      <Tick position="left-bottom" />
      <Tick position="right-bottom" />
      {children}
    </div>
  )
}

const TICK_CLASS: Record<string, string> = {
  'left-top': '-left-px -top-px border-l border-t',
  'right-top': '-right-px -top-px border-r border-t',
  'left-bottom': '-bottom-px -left-px border-b border-l',
  'right-bottom': '-bottom-px -right-px border-b border-r',
}

function Tick({ position }: { position: string }) {
  return (
    <span
      aria-hidden
      className={cn('absolute h-2 w-2 border-accent', TICK_CLASS[position])}
    />
  )
}
