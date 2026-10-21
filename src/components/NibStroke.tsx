import { STROKE_CENTRELINE, STROKE_OUTLINE, STROKE_VIEWBOX } from './stroke.generated'
import { cn } from '../lib/utils'

/**
 * The nib stroke — the one memorable thing on the sheet.
 *
 * It is a real variable-width stroke: thin where the nib lands, swelling
 * through the belly, tapering at the lift.
 *
 * The ink is revealed by a wide stroke travelling the centreline inside an
 * SVG mask. `pathLength="100"` normalises the dash units so the length is
 * never guessed, and the dash runs on a linear ease — the same ease the nib
 * rides — so the nib tip and the growing edge of the ink stay locked
 * together. A pen does not bounce, so neither does this.
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
        <mask
          id="ink-reveal"
          maskUnits="userSpaceOnUse"
          x="-24"
          y="-24"
          width="308"
          height="198"
        >
          <rect x="-24" y="-24" width="308" height="198" fill="black" />
          {/* the brush: a fat round-capped stroke following the centreline */}
          <path
            d={STROKE_CENTRELINE}
            pathLength={100}
            fill="none"
            stroke="white"
            strokeWidth={18}
            strokeLinecap="round"
            strokeDasharray={100}
            className="animate-draw"
          />
        </mask>
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
      <path d={STROKE_OUTLINE} fill="var(--accent)" mask="url(#ink-reveal)" />

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
