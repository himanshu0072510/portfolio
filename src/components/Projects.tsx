import { ArrowUpRight, ExternalLink, Lock, Mail, Star } from 'lucide-react'
import { EMAIL, localProjects, projectDetails } from '../data/profile'
import { languageColor, useGitHub } from '../hooks/useGitHub'
import { Section } from './Section'

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
      title="Projects"
      lede="Things I have built, shipped and learned from — public repos pulled live from GitHub."
      datum={`${cards.length} shipped`}
    >
      <div className="border-t border-rule">
        {cards.map((project) => (
          <article
            key={project.name}
            className="group grid gap-5 border-b border-rule py-7 md:grid-cols-[1fr_auto] md:gap-8"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <h3 className="font-display text-2xl font-bold tracking-tight text-fg">
                  {project.name}
                </h3>
                {project.language && (
                  <span className="inline-flex items-center gap-1.5 measure text-muted">
                    <span
                      className="h-2 w-2"
                      style={{ background: languageColor(project.language) }}
                      aria-hidden
                    />
                    {project.language}
                  </span>
                )}
                {project.stars > 0 && (
                  <span className="inline-flex items-center gap-1 measure text-muted">
                    <Star className="h-3 w-3" aria-hidden />
                    {project.stars}
                  </span>
                )}
                {project.access !== 'public' && (
                  <span className="inline-flex items-center gap-1.5 measure text-muted">
                    <Lock className="h-3 w-3" aria-hidden />
                    {project.status ?? (project.access === 'private' ? 'Private repo' : 'Not public')}
                  </span>
                )}
              </div>

              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                {project.description}
              </p>

              {project.tags.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
                  {project.tags.map((tag) => (
                    <li key={tag} className="measure text-muted/80">
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex shrink-0 flex-row items-start gap-2 md:flex-col md:items-end">
              {project.sourceUrl && (
                <a
                  href={project.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="pressable inline-flex items-center gap-1.5 border border-control px-3.5 py-2 text-xs font-semibold text-fg transition-colors hover:border-accent hover:text-accent"
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
                  className="pressable inline-flex items-center gap-1.5 border border-control px-3.5 py-2 text-xs font-semibold text-fg transition-colors hover:border-accent hover:text-accent"
                >
                  Live demo
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
              {!project.sourceUrl && (
                <a
                  href={`mailto:${EMAIL}?subject=${encodeURIComponent(`Request to see ${project.name}`)}`}
                  className="pressable inline-flex items-center gap-1.5 border border-control px-3.5 py-2 text-xs font-semibold text-fg transition-colors hover:border-accent hover:text-accent"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Ask for access
                </a>
              )}
            </div>
          </article>
        ))}
      </div>

      <p className="mt-6 measure text-muted/70">
        Want the code? Ask me and I will open it up —{' '}
        <a href={`mailto:${EMAIL}`} className="text-accent underline underline-offset-4">
          send a mail
        </a>
      </p>
    </Section>
  )
}
