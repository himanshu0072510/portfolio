import { ArrowUpRight, ExternalLink, GitFork, Lock, Mail, Star } from 'lucide-react'
import { EMAIL, localProjects, projectDetails } from '../data/profile'
import { languageColor, useGitHub } from '../hooks/useGitHub'
import { Section } from './Section'
import { Reveal } from './Reveal'

type ProjectCard = {
  name: string
  description: string
  language: string | null
  stars: number
  tags: string[]
  sourceUrl: string | null
  demoUrl: string | null
  access: 'public' | 'private' | 'local'
  status?: string
}

export function Projects() {
  const { repos } = useGitHub()

  const cards: ProjectCard[] = [
    ...repos.map((repo) => {
      const override = projectDetails[repo.name]
      return {
        name: repo.name,
        description: override?.description ?? repo.description ?? 'No description provided.',
        language: repo.language,
        stars: repo.stargazers_count,
        tags: override?.tags ?? repo.topics,
        sourceUrl: repo.private ? null : repo.html_url,
        demoUrl: repo.private ? null : (override?.demoUrl ?? repo.homepage),
        access: repo.private ? ('private' as const) : ('public' as const),
      }
    }),
    ...localProjects.map((project) => ({
      name: project.name,
      description: project.description,
      language: project.language,
      stars: 0,
      tags: project.tags,
      sourceUrl: null,
      demoUrl: null,
      access: 'local' as const,
      status: project.status,
    })),
  ]

  return (
    <Section
      id="projects"
      index="04"
      title="Projects"
      lede="Things I have built, shipped and learned from — public repos pulled live from GitHub."
    >
      <div className="grid gap-4">
        {cards.length === 0 && (
          <p className="rounded-2xl border border-border bg-surface/50 p-6 text-sm text-muted">
            No projects found yet.
          </p>
        )}

        {cards.map((project, i) => (
          <Reveal key={project.name} delay={i * 80}>
            <article className="group relative overflow-hidden rounded-2xl border border-border bg-surface/50 p-6 transition-colors hover:border-accent/40">
              <div
                className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: 'var(--glow)' }}
                aria-hidden
              />
              <div className="relative flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="font-display text-2xl text-fg">{project.name}</h3>
                    {project.language && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] text-muted">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ background: languageColor(project.language) }}
                        />
                        {project.language}
                      </span>
                    )}
                    {project.stars > 0 && (
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] text-muted">
                        <Star className="h-3 w-3" />
                        {project.stars}
                      </span>
                    )}
                    {project.access !== 'public' && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] text-muted">
                        <Lock className="h-2.5 w-2.5" />
                        {project.status ?? (project.access === 'private' ? 'Private repo' : 'Not public')}
                      </span>
                    )}
                  </div>

                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                    {project.description}
                  </p>

                  {project.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.tags.slice(0, 8).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-border-soft px-2 py-1 font-mono text-[10px] text-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                  {project.sourceUrl && (
                    <a
                      href={project.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2 text-xs font-medium text-fg transition-colors hover:border-accent/50 hover:text-accent"
                    >
                      Source
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium text-accent transition-colors hover:bg-surface-hi"
                    >
                      Live demo
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {!project.sourceUrl && (
                    <a
                      href={`mailto:${EMAIL}?subject=${encodeURIComponent(`Request to see ${project.name}`)}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2 text-xs font-medium text-fg transition-colors hover:border-accent/50 hover:text-accent"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      Ask for access
                    </a>
                  )}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <p className="mt-6 flex items-center justify-center gap-2 text-center font-mono text-[11px] text-muted/70">
          <GitFork className="h-3.5 w-3.5" />
          Want the code? Ask me and I will open it up —{' '}
          <a href={`mailto:${EMAIL}`} className="text-accent underline underline-offset-4">
            send a mail
          </a>
        </p>
      </Reveal>
    </Section>
  )
}
