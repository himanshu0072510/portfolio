import { skillGroups } from '../data/profile'
import { Section } from './Section'
import { Reveal } from './Reveal'

export function Skills() {
  return (
    <Section
      id="skills"
      index="02"
      title="Skills"
      lede="The tools I reach for, and roughly how deep I go with each."
    >
      <div className="grid gap-5 md:grid-cols-2">
        {skillGroups.map((group, gi) => (
          <Reveal key={group.title} delay={gi * 80}>
            <div className="h-full rounded-2xl border border-border bg-surface/50 p-6">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-xl text-fg">{group.title}</h3>
                <span className="font-mono text-[10px] tracking-widest text-muted uppercase">
                  {String(gi + 1).padStart(2, '0')}
                </span>
              </div>
              <p className="mt-1.5 text-[13px] text-muted">{group.caption}</p>

              <ul className="mt-6 space-y-3.5">
                {group.items.map((item) => (
                  <li key={item.name}>
                    <div className="flex items-baseline justify-between">
                      <span className="text-[13px] text-fg-soft">{item.name}</span>
                      <span className="font-mono text-[10px] text-muted">{item.level}%</span>
                    </div>
                    <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-border-soft">
                      <div
                        className="h-full rounded-full bg-accent transition-[width] duration-1000 ease-out"
                        style={{ width: `${item.level}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <div className="mt-8 overflow-hidden mask-fade-x">
          <div className="flex w-max animate-marquee gap-3">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 gap-3" aria-hidden={copy === 1}>
                {[
                  'Offline-first',
                  'Chrome MV3',
                  'Canvas rendering',
                  'TypeScript',
                  'React',
                  'Node.js',
                  'MCP servers',
                  'IndexedDB',
                  'Web Workers',
                  'Linux CLI',
                  'GitHub Actions',
                  'Web Audio',
                  'Pointer Events',
                  'Pen input',
                  'Service Workers',
                ].map((tag) => (
                  <span
                    key={`${copy}-${tag}`}
                    className="shrink-0 rounded-full border border-border bg-surface/50 px-4 py-2 font-mono text-xs whitespace-nowrap text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
