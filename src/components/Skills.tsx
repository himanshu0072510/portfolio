import { useState } from 'react'
import { skillGroups } from '../data/profile'
import { useInView } from '../hooks/useInView'
import { Section } from './Section'
import { Sheet } from './Sheet'

const kit = [
  'TypeScript',
  'React',
  'Node.js',
  'Chrome MV3',
  'Canvas',
  'IndexedDB',
  'Web Workers',
  'MCP',
  'Tailwind',
  'Vite',
  'GitHub Actions',
  'Linux CLI',
]

export function Skills() {
  const total = skillGroups.reduce((sum, group) => sum + group.items.length, 0)
  const [shown, setShown] = useState(false)
  const ref = useInView<HTMLDivElement>(() => setShown(true), { threshold: 0.15 })

  return (
    <Section
      id="skills"
      title="Skills"
      lede="The tools I reach for, and roughly how deep I go with each."
      datum={`${total} listed`}
    >
      <div ref={ref} className="grid gap-6 md:grid-cols-2">
        {skillGroups.map((group) => (
          <Sheet key={group.title} className="p-6" fill>
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-display text-lg font-bold tracking-tight text-fg">{group.title}</h3>
              <span className="measure text-muted/80">{group.items.length} tools</span>
            </div>
            <p className="mt-2 text-[13px] text-muted">{group.caption}</p>

            <ul className="mt-6">
              {group.items.map((item, i) => (
                <li
                  key={item.name}
                  className="flex items-center gap-4 border-t border-rule-soft py-2.5 first:border-t-0 first:pt-0"
                >
                  <span className="w-[38%] shrink-0 text-[13px] text-fg-soft">{item.name}</span>
                  {/* the fill is scaled, never sized — and it grows from the left */}
                  <span className="h-1 flex-1 bg-border-soft" aria-hidden>
                    <span
                      className="block h-full w-full origin-left bg-fg-soft transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                      style={{
                        transform: `scaleX(${shown ? item.level / 100 : 0})`,
                        transitionDelay: `${i * 60}ms`,
                      }}
                    />
                  </span>
                  <span className="measure w-9 shrink-0 text-right text-muted">{item.level}%</span>
                </li>
              ))}
            </ul>
          </Sheet>
        ))}
      </div>

      {/* material list */}
      <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 border-y border-rule py-3">
        <span className="measure text-muted/80">Kit</span>
        {kit.map((tool, i) => (
          <span key={tool} className="flex items-center gap-3">
            {i > 0 && <span className="h-3 w-px bg-rule" aria-hidden />}
            <span className="measure text-fg-soft">{tool}</span>
          </span>
        ))}
      </div>
    </Section>
  )
}
