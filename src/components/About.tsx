import { ArrowUpRight, Briefcase, GraduationCap } from 'lucide-react'
import { experience, profile } from '../data/profile'
import { Section } from './Section'
import { Reveal } from './Reveal'

export function About() {
  return (
    <Section
      id="about"
      index="01"
      title="About"
      lede="A developer who treats privacy and offline capability as features, not afterthoughts."
    >
      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div>
          <div className="space-y-5 text-[15px] leading-relaxed text-muted md:text-base">
            {profile.bio.map((paragraph, i) => (
              <Reveal key={i} delay={i * 90}>
                <p>{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={180}>
            <div className="mt-9 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
              {profile.facts.map((fact) => (
                <div key={fact.label} className="bg-surface px-4 py-4">
                  <p className="font-mono text-[10px] tracking-widest text-muted uppercase">
                    {fact.label}
                  </p>
                  <p className="mt-1.5 text-sm text-fg">{fact.value}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <div className="relative rounded-2xl border border-border bg-surface/60 p-6">
            <p className="font-mono text-[11px] tracking-widest text-muted uppercase">Timeline</p>
            <ol className="mt-5 space-y-6">
              {experience.map((item) => (
                <li key={item.title} className="relative pl-7">
                  <span
                    className="absolute left-0 top-1.5 grid h-4 w-4 place-items-center rounded-full border border-border bg-bg"
                    aria-hidden
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  </span>
                  <p className="font-mono text-[11px] text-accent">{item.period}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-fg">
                    {item.title}
                  </p>
                  <p className="text-[13px] text-muted">{item.org}</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted/90">{item.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </div>

      <Reveal delay={140}>
        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          <a
            href={`https://github.com/${profile.login}`}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center justify-between rounded-2xl border border-border bg-surface/50 px-5 py-4 transition-colors hover:border-accent/40"
          >
            <span className="flex items-center gap-3">
              <Briefcase className="h-4 w-4 text-accent" />
              <span className="text-sm text-fg">Browse my repositories</span>
            </span>
            <ArrowUpRight className="h-4 w-4 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
          </a>
          <a
            href={`mailto:${profile.socials[1].href.replace('mailto:', '')}`}
            className="group flex items-center justify-between rounded-2xl border border-border bg-surface/50 px-5 py-4 transition-colors hover:border-accent/40"
          >
            <span className="flex items-center gap-3">
              <GraduationCap className="h-4 w-4 text-accent" />
              <span className="text-sm text-fg">Ask about my background</span>
            </span>
            <ArrowUpRight className="h-4 w-4 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
          </a>
        </div>
      </Reveal>
    </Section>
  )
}
