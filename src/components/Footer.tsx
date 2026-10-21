import { ArrowUp, Mail } from 'lucide-react'
import { GithubIcon } from './icons'
import { EMAIL, profile } from '../data/profile'

const SHEET_DATE = new Date()
  .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  .toUpperCase()

export function Footer() {
  return (
    <footer className="border-t border-rule py-10">
      <div className="mx-auto w-full max-w-5xl px-5 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-display text-xl font-bold tracking-tight text-fg">{profile.name}</p>
            <p className="measure mt-2 text-muted">
              github.com/{profile.login}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://github.com/${profile.login}`}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub profile"
              className="pressable grid h-9 w-9 place-items-center border border-control text-muted transition-colors hover:border-accent hover:text-accent"
            >
              <GithubIcon className="h-4 w-4" />
            </a>
            <a
              href={`mailto:${EMAIL}`}
              aria-label="Email"
              className="pressable grid h-9 w-9 place-items-center border border-control text-muted transition-colors hover:border-accent hover:text-accent"
            >
              <Mail className="h-4 w-4" />
            </a>
            <a
              href="#top"
              aria-label="Back to top"
              className="pressable grid h-9 w-9 place-items-center border border-control text-muted transition-colors hover:border-accent hover:text-accent"
            >
              <ArrowUp className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-rule pt-4">
          <p className="measure text-muted/70">
            Designed and built from scratch — React, TypeScript and Tailwind.
          </p>
          <p className="measure text-muted/70">
            GitHub data pulled live from the public API · REV A · {SHEET_DATE}
          </p>
        </div>
      </div>
    </footer>
  )
}
