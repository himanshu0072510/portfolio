import { STROKE_CENTRELINE, STROKE_OUTLINE, STROKE_VIEWBOX } from './stroke.generated'
import { cn } from '../lib/utils'

/**
 * The nib stroke — the one memorable thing on the sheet.
 *
 * It is a real variable-width stroke: thin where the nib lands, swelling
 * through the belly, tapering at the lift. It draws itself once on load,
 * with the nib travelling along the centreline as it goes.
 */
export function NibStroke({ className }: { className?: string }) {
  return (
    <svg
      viewBox={STROKE_VIEWBOX}
      className={cn('w-full', className)}
      role="img"
      aria-label="A drawn nib stroke, thin at the start, swelling through the middle and tapering at the end."
    >
      <defs>
        <clipPath id="nib-reveal">
          <rect
            x="-12"
            y="-12"
            width="284"
            height="174"
            style={{ transformBox: 'fill-box', transformOrigin: 'left center' }}
            className="animate-draw"
          />
        </clipPath>
      </defs>

      {/* the path the nib travels — a guide, not the ink */}
      <path
        d={STROKE_CENTRELINE}
        fill="none"
        stroke="var(--rule)"
        strokeWidth="0.75"
        strokeDasharray="2 5"
        strokeLinecap="round"
      />

      {/* the ink */}
      <g clipPath="url(#nib-reveal)">
        <path d={STROKE_OUTLINE} fill="var(--accent)" />
      </g>

      {/* the nib, riding the path while the stroke is drawn */}
      <rect
        x="-3.5"
        y="-3.5"
        width="7"
        height="7"
        fill="var(--accent)"
        className="nib-travel"
        style={{ '--stroke-path': `path("${STROKE_CENTRELINE}")` } as React.CSSProperties}
      />
    </svg>
  )
}
