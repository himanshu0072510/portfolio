import { useMemo } from 'react'
import { Activity, ExternalLink, GitFork, Star, Users } from 'lucide-react'
import { languageColor, useGitHub } from '../hooks/useGitHub'
import { Section } from './Section'
import { Reveal } from './Reveal'

const LEVEL_COLORS = ['var(--heat-0)', 'var(--heat-1)', 'var(--heat-2)', 'var(--heat-3)', 'var(--heat-4)']

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const LEVEL_INDEX: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
}

export function GitHubSection() {
  const { profile, repos, status, contributions, fetchedAt } = useGitHub()

  const totals = useMemo(() => {
    const stars = repos.reduce((sum, r) => sum + r.stargazers_count, 0)
    const forks = repos.reduce((sum, r) => sum + r.forks_count, 0)
    const langs: Record<string, number> = {}
    for (const repo of repos) {
      if (repo.language) langs[repo.language] = (langs[repo.language] || 0) + repo.size
    }
    const publicCount = repos.filter((r) => !r.private).length
    const privateCount = repos.length - publicCount
    return { stars, forks, langs, publicCount, privateCount }
  }, [repos])

  const cards = [
    {
      icon: GitFork,
      label: 'Repositories',
      value: repos.length,
      sub: `${totals.publicCount} public · ${totals.privateCount} private`,
    },
    { icon: Star, label: 'Total stars', value: totals.stars, sub: `${totals.forks} forks` },
    { icon: Users, label: 'Followers', value: profile.followers, sub: `${profile.following} following` },
    {
      icon: Activity,
      label: 'Contributions',
      value: contributions.total,
      sub: 'last 12 months',
    },
  ]

  const maxLang = Math.max(1, ...Object.values(totals.langs))
  const langEntries = Object.entries(totals.langs).sort((a, b) => b[1] - a[1]).slice(0, 6)

  return (
    <Section
      id="github"
      index="03"
      title="GitHub"
      lede="Live numbers from my GitHub account — pulled straight from the API, not a screenshot."
    >
      {/* ------------- stat cards ------------- */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card, i) => (
          <Reveal key={card.label} delay={i * 70}>
            <div className="group h-full rounded-2xl border border-border bg-surface/50 p-5 transition-colors hover:border-accent/40">
              <div className="flex items-center justify-between">
                <card.icon className="h-4 w-4 text-accent" />
                <span className="font-mono text-[10px] tracking-widest text-muted uppercase">
                  {card.label}
                </span>
              </div>
              <p className="mt-4 font-display text-4xl leading-none text-fg">{card.value}</p>
              <p className="mt-1.5 font-mono text-[11px] text-muted">{card.sub}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* ------------- contribution graph ------------- */}
      <Reveal delay={100}>
        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-surface/50 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-fg">Contribution activity</p>
              <p className="mt-0.5 font-mono text-[11px] text-muted">
                {contributions.total} contributions in the last year
              </p>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted">
              <span>Less</span>
              {LEVEL_COLORS.map((color, i) => (
                <span
                  key={color}
                  className="h-2.5 w-2.5 rounded-[3px]"
                  style={{ background: color }}
                  title={`Level ${i}`}
                />
              ))}
              <span>More</span>
            </div>
          </div>

          <div className="mt-5 flex gap-2">
            {/* day-of-week gutter, aligned to rows 1 / 3 / 5 */}
            <div className="flex shrink-0 flex-col gap-[3px]">
              {DAY_LABELS.map((label, i) => (
                <span
                  key={label}
                  className="flex h-[11px] items-center font-mono text-[8px] leading-none text-muted/70"
                >
                  {i % 2 === 1 ? label.charAt(0) : ''}
                </span>
              ))}
            </div>

            <div className="overflow-x-auto pb-1">
              <div className="flex min-w-max gap-[3px]">
                {contributions.weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-[3px]">
                    {Array.from({ length: 7 }).map((_, di) => {
                      const day = week[di]
                      if (!day) return <span key={di} className="h-[11px] w-[11px]" />
                      const level = LEVEL_INDEX[day.level] ?? 0
                      return (
                        <span
                          key={di}
                          title={`${day.count} contribution${day.count === 1 ? '' : 's'} on ${day.date}`}
                          className="h-[11px] w-[11px] rounded-[3px] transition-transform hover:scale-125"
                          style={{ background: LEVEL_COLORS[level] }}
                        />
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border-soft pt-4">
            <p className="font-mono text-[10px] text-muted/70">
              {contributions.total} contributions ·{' '}
              {new Date(fetchedAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
            <p className="font-mono text-[10px] text-muted/70">
              {status === 'live' ? 'Live from api.github.com' : 'Snapshot from build time'}
            </p>
          </div>
        </div>
      </Reveal>

      {/* ------------- languages ------------- */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-start">
        <Reveal delay={80}>
          <div className="rounded-2xl border border-border bg-surface/50 p-6">
            <p className="font-mono text-[11px] tracking-widest text-muted uppercase">
              Languages by repo size
            </p>
            <ul className="mt-5 space-y-4">
              {langEntries.length === 0 && (
                <li className="text-sm text-muted">No public repositories yet.</li>
              )}
              {langEntries.map(([lang, size]) => (
                <li key={lang}>
                  <div className="flex items-baseline justify-between">
                    <span className="flex items-center gap-2 text-[13px] text-fg-soft">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: languageColor(lang) }}
                      />
                      {lang}
                    </span>
                    <span className="font-mono text-[10px] text-muted">
                      {Math.round((size / maxLang) * 100)}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-border-soft">
                    <div
                      className="h-full rounded-full transition-[width] duration-1000"
                      style={{
                        width: `${Math.max(6, (size / maxLang) * 100)}%`,
                        background: languageColor(lang),
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <a
            href={profile.html_url}
            target="_blank"
            rel="noreferrer"
            className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface to-surface-hi p-6 transition-colors hover:border-accent/40"
          >
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-100"
              style={{ background: 'var(--glow)', opacity: 0.6 }}
              aria-hidden
            />
            <div className="relative">
              <p className="font-mono text-[11px] tracking-widest text-muted uppercase">
                The source of truth
              </p>
              <p className="mt-4 font-display text-3xl leading-tight text-fg">
                github.com/{profile.login}
              </p>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
                Every repository on this site is read from the GitHub API at load time — the
                counts, the stars, the languages and the commit graph are all live.
              </p>
            </div>
            <div className="relative mt-8 flex items-center gap-2 text-sm font-medium text-accent">
              Open profile
              <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </a>
        </Reveal>
      </div>
    </Section>
  )
}
