import { useMemo } from 'react'
import { Activity, ExternalLink, GitFork, Star, Users } from 'lucide-react'
import { languageColor, useGitHub } from '../hooks/useGitHub'
import { Section } from './Section'
import { Sheet } from './Sheet'

/** Contribution levels, drawn as chalk building up on the sheet. */
const LEVEL_FILL = [
  'color-mix(in oklab, var(--fg) 9%, transparent)',
  'color-mix(in oklab, var(--fg) 22%, transparent)',
  'color-mix(in oklab, var(--fg) 38%, transparent)',
  'color-mix(in oklab, var(--fg) 58%, transparent)',
  'var(--accent)',
]

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
    return {
      stars,
      forks,
      langs,
      publicCount,
      privateCount: repos.length - publicCount,
    }
  }, [repos])

  const cards = [
    {
      icon: GitFork,
      label: 'Repositories',
      value: repos.length,
      sub: `${totals.publicCount} public, ${totals.privateCount} private`,
    },
    { icon: Star, label: 'Stars', value: totals.stars, sub: `${totals.forks} forks` },
    { icon: Users, label: 'Followers', value: profile.followers, sub: `${profile.following} following` },
    {
      icon: Activity,
      label: 'Contributions',
      value: contributions.total,
      sub: 'last 12 months',
    },
  ]

  const langEntries = Object.entries(totals.langs).sort((a, b) => b[1] - a[1])
  const langTotal = langEntries.reduce((sum, [, size]) => sum + size, 0)

  return (
    <Section
      id="github"
      title="GitHub"
      lede="Live numbers from my GitHub account — pulled straight from the API, not a screenshot."
      datum={status === 'live' ? 'live' : 'cached'}
    >
      {/* ------------- schedule of figures ------------- */}
      <dl className="grid grid-cols-2 gap-px border border-rule bg-rule lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-surface px-5 py-5">
            <div className="flex items-center justify-between gap-2">
              <dt className="measure text-muted/80">{card.label}</dt>
              <card.icon className="h-3.5 w-3.5 text-accent" aria-hidden />
            </div>
            <dd className="mt-3 font-display text-4xl font-bold leading-none tracking-tight text-fg">
              {card.value}
            </dd>
            <p className="measure mt-2 text-muted">{card.sub}</p>
          </div>
        ))}
      </dl>

      {/* ------------- contribution graph ------------- */}
      <Sheet className="mt-6 p-5 sm:p-6" fill>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-fg">Contribution activity</p>
            <p className="measure mt-1.5 text-muted">
              {contributions.total} contributions in the last year
            </p>
          </div>
          <div className="flex items-center gap-1.5" aria-hidden>
            <span className="measure text-muted">Less</span>
            {LEVEL_FILL.map((fill) => (
              <span
                key={fill}
                className="h-2.5 w-2.5"
                style={{ background: fill }}
              />
            ))}
            <span className="measure text-muted">More</span>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <div className="flex shrink-0 flex-col gap-[3px]" aria-hidden>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((label, i) => (
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
                        className="h-[11px] w-[11px] transition-transform hover:scale-125"
                        style={{ background: LEVEL_FILL[level] }}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-rule pt-4">
          <span className="measure text-muted/70">
            {new Date(fetchedAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
          <span className="measure text-muted/70">
            {status === 'live' ? 'Live from api.github.com' : 'Snapshot from build time'}
          </span>
        </div>
      </Sheet>

      {/* ------------- languages + reference ------------- */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.15fr] lg:items-start">
        <Sheet className="p-6" fill>
          <p className="measure text-muted/80">Languages by repository size</p>

          {langEntries.length > 0 && (
            <div className="mt-5 flex h-2.5 w-full overflow-hidden" aria-hidden>
              {langEntries.map(([lang, size]) => (
                <span
                  key={lang}
                  style={{
                    width: `${(size / langTotal) * 100}%`,
                    background: languageColor(lang),
                  }}
                />
              ))}
            </div>
          )}

          <ul className="mt-6">
            {langEntries.map(([lang, size]) => (
              <li
                key={lang}
                className="flex items-center gap-3 border-t border-rule-soft py-2.5 first:border-t-0 first:pt-0"
              >
                <span
                  className="h-2.5 w-2.5 shrink-0"
                  style={{ background: languageColor(lang) }}
                  aria-hidden
                />
                <span className="flex-1 text-[13px] text-fg-soft">{lang}</span>
                <span className="measure text-muted">
                  {Math.round((size / langTotal) * 100)}%
                </span>
              </li>
            ))}
          </ul>
        </Sheet>

        <a
          href={profile.html_url}
          target="_blank"
          rel="noreferrer"
          className="group flex flex-col justify-between border border-rule p-6 transition-colors hover:border-accent"
        >
          <div>
            <p className="measure text-muted/80">Reference</p>
            <p className="mt-4 break-words font-display text-2xl font-bold tracking-tight text-fg">
              github.com/{profile.login}
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
              Every repository on this site is read from the GitHub API at load time — the
              counts, the stars, the languages and the commit graph are all live.
            </p>
          </div>
          <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent">
            Open profile
            <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </a>
      </div>
    </Section>
  )
}
