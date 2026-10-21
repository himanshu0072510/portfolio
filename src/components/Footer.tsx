import { ArrowUp, Mail } from 'lucide-react'
import { GithubIcon } from './icons'
import { profile } from '../data/profile'

const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="border-t border-border-soft py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-5 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-display text-2xl text-fg">{profile.name}</p>
            <p className="mt-1 font-mono text-[11px] text-muted">
              © {YEAR} · github.com/{profile.login}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://github.com/${profile.login}`}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted transition-colors hover:border-accent/50 hover:text-accent"
            >
              <GithubIcon className="h-4 w-4" />
            </a>
            <a
              href={`mailto:${profile.socials[1].href.replace('mailto:', '')}`}
              aria-label="Email"
              className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted transition-colors hover:border-accent/50 hover:text-accent"
            >
              <Mail className="h-4 w-4" />
            </a>
            <a
              href="#top"
              aria-label="Back to top"
              className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted transition-colors hover:border-accent/50 hover:text-accent"
            >
              <ArrowUp className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-2 border-t border-border-soft pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-[11px] text-muted/70">
            Designed and built from scratch — React, TypeScript and Tailwind.
          </p>
          <p className="font-mono text-[11px] text-muted/70">
            GitHub data pulled live from the public API.
          </p>
        </div>
      </div>
    </footer>
  )
}
