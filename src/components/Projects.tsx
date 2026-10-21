import { ArrowUpRight, GitFork, Lock, Star } from 'lucide-react'
import { extraProjects, EMAIL } from '../data/profile'
import { languageColor, useGitHub } from '../hooks/useGitHub'
import { Section } from './Section'
import { Reveal } from './Reveal'

export function Projects() {
  const { repos } = useGitHub()

  return (
    <Section
      id="projects"
      index="04"
      title="Projects"
      lede="Things I have built, shipped and learned from — public repos pulled live from GitHub."
    >
      {/* ---------------- public repos ---------------- */}
      <div className="grid gap-4">
        {repos.length === 0 && (
          <p className="rounded-2xl border border-border bg-surface/50 p-6 text-sm text-muted">
            No public repositories found yet.
          </p>
        )}

        {repos.map((repo, i) => (
          <Reveal key={repo.name} delay={i * 80}>
            <article className="group relative overflow-hidden rounded-2xl border border-border bg-surface/50 p-6 transition-colors hover:border-accent/40">
              <div
                className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: 'var(--glow)' }}
                aria-hidden
              />
              <div className="relative flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="font-display text-2xl text-fg">{repo.name}</h3>
                    {repo.language && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] text-muted">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ background: languageColor(repo.language) }}
                        />
                        {repo.language}
                      </span>
                    )}
                    {repo.stargazers_count > 0 && (
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] text-muted">
                        <Star className="h-3 w-3" />
                        {repo.stargazers_count}
                      </span>
                    )}
                    {repo.forks_count > 0 && (
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] text-muted">
                        <GitFork className="h-3 w-3" />
                        {repo.forks_count}
                      </span>
                    )}
                  </div>

                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                    {repo.description || 'No description provided.'}
                  </p>

                  {repo.topics.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {repo.topics.slice(0, 8).map((topic) => (
                        <span
                          key={topic}
                          className="rounded-md bg-border-soft px-2 py-1 font-mono text-[10px] text-muted"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2 text-xs font-medium text-fg transition-colors hover:border-accent/50 hover:text-accent"
                  >
                    Source
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                  {repo.homepage && (
                    <a
                      href={repo.homepage}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium text-accent transition-colors hover:bg-surface-hi"
                    >
                      Live demo
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  )}
                  <p className="font-mono text-[10px] text-muted/70">
                    updated{' '}
                    {new Date(repo.updated_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {/* ---------------- additional work ---------------- */}
      <div className="mt-14">
        <Reveal>
          <div className="mb-6 flex items-center gap-3">
            <span className="font-mono text-[11px] tracking-widest text-muted uppercase">
              More I have worked on
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-2">
          {extraProjects.map((project, i) => (
            <Reveal key={project.name} delay={i * 90}>
              <article className="flex h-full flex-col rounded-2xl border border-border bg-surface/40 p-6 transition-colors hover:border-accent/40">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-xl text-fg">{project.name}</h3>
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] text-muted">
                    <Lock className="h-2.5 w-2.5" />
                    {project.status}
                  </span>
                </div>

                <p className="mt-3 flex-1 text-[13px] leading-relaxed text-muted">
                  {project.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-border-soft px-2 py-1 font-mono text-[10px] text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <p className="mt-6 text-center font-mono text-[11px] text-muted/70">
            Want the code? Ask me and I will open it up —{' '}
            <a href={`mailto:${EMAIL}`} className="text-accent underline underline-offset-4">
              send a mail
            </a>
          </p>
        </Reveal>
      </div>
    </Section>
  )
}
