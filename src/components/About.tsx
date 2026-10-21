import { ArrowUpRight } from 'lucide-react'
import { EMAIL, experience, profile } from '../data/profile'
import { Section } from './Section'
import { Sheet } from './Sheet'

export function About() {
  return (
    <Section
      id="about"
      title="About"
      lede="A developer who treats privacy and offline capability as features, not afterthoughts."
      datum={profile.location}
    >
      <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
        <div>
          <div className="space-y-5 text-[15px] leading-relaxed text-muted md:text-base">
            {profile.bio.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>

          {/* spec table */}
          <dl className="mt-10 grid grid-cols-2 gap-px border border-rule bg-rule">
            {profile.facts.map((fact) => (
              <div key={fact.label} className="bg-surface px-4 py-4">
                <dt className="measure text-muted/80">{fact.label}</dt>
                <dd className="mt-1.5 text-sm font-medium text-fg">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <a
              href={`https://github.com/${profile.login}`}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between border border-rule px-4 py-3.5 text-sm text-fg transition-colors hover:border-accent hover:text-accent"
            >
              Browse my repositories
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="group flex items-center justify-between border border-rule px-4 py-3.5 text-sm text-fg transition-colors hover:border-accent hover:text-accent"
            >
              Ask about my background
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        {/* revision history */}
        <Sheet className="p-6" fill>
          <p className="measure text-muted">Revision history</p>
          <ol className="mt-5">
            {experience.map((item, i) => (
              <li
                key={item.title}
                className={i === 0 ? 'pb-6' : 'border-t border-rule py-6'}
              >
                <div className="flex items-baseline gap-3">
                  <span className="measure shrink-0 text-accent">{item.period}</span>
                </div>
                <p className="mt-2 text-[15px] font-semibold text-fg">{item.title}</p>
                <p className="measure mt-1 text-muted">{item.org}</p>
                <p className="mt-3 text-[13px] leading-relaxed text-muted">{item.detail}</p>
              </li>
            ))}
          </ol>
        </Sheet>
      </div>
    </Section>
  )
}
