import { useEffect, useState } from 'react'
import { GithubIcon } from './icons'
import { ArrowRight, Mail } from 'lucide-react'
import { EMAIL, profile } from '../data/profile'
import { useGitHub } from '../hooks/useGitHub'
import { cn } from '../lib/utils'
import { NibStroke } from './NibStroke'
import { Sheet } from './Sheet'

const [firstName, ...rest] = profile.name.split(' ')

export function Hero() {
  const { profile: gh, repos, status } = useGitHub()
  const [roleIndex, setRoleIndex] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setFading(true)
      window.setTimeout(() => {
        setRoleIndex((i) => (i + 1) % profile.roles.length)
        setFading(false)
      }, 260)
    }, 3400)
    return () => window.clearInterval(timer)
  }, [])

  const stars = repos.reduce((sum, r) => sum + r.stargazers_count, 0)
  const languages = new Set(repos.map((r) => r.language).filter(Boolean)).size

  const titleBlock = [
    { label: 'Repos', value: repos.length },
    { label: 'Stars', value: stars },
    { label: 'Languages', value: languages },
    { label: 'Since', value: new Date(gh.created_at).getFullYear() },
  ]

  return (
    <section id="top" className="relative pt-28 pb-14 md:pt-36 md:pb-20">
      <div
        className="pointer-events-none absolute inset-0 sheet-grid opacity-60"
        style={{
          maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
        }}
        aria-hidden
      />

      <div className="relative mx-auto grid w-full max-w-5xl gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14">
        {/* ---------------- left: the name block ---------------- */}
        <div>
          <p className="animate-rise flex items-center gap-2.5 text-[13px] text-muted">
            <span className="h-2 w-2 shrink-0 bg-accent" aria-hidden />
            {profile.availability}
          </p>

          <h1 className="animate-rise mt-7 font-display text-[clamp(2.75rem,8.5vw,4.75rem)] font-extrabold leading-[0.92] tracking-[-0.035em] text-fg">
            <span className="block">{firstName}</span>
            <span className="block">{rest.join(' ')}</span>
          </h1>

          <div className="animate-rise mt-7 flex items-center gap-3">
            <span className="h-px w-8 shrink-0 bg-accent" aria-hidden />
            <span
              className={cn(
                'measure text-fg-soft transition-all duration-300',
                fading ? 'translate-y-1 opacity-0' : 'translate-y-0 opacity-100',
              )}
            >
              {profile.roles[roleIndex]}
            </span>
          </div>

          <p className="animate-rise mt-7 max-w-xl text-[15px] leading-relaxed text-muted md:text-base">
            {profile.headline} I build Chrome extensions, React apps and the Node.js tooling
            around them — software that keeps working when the network does not.
          </p>

          <div className="animate-rise mt-9 flex flex-wrap items-center gap-3">
            <a
              href={`https://github.com/${profile.login}`}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2.5 bg-fg px-5 py-3 text-sm font-semibold text-bg transition-colors hover:bg-accent hover:text-accent-fg"
            >
              <GithubIcon className="h-4 w-4" />
              View GitHub
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center gap-2.5 border border-rule px-5 py-3 text-sm font-semibold text-fg transition-colors hover:border-accent hover:text-accent"
            >
              <Mail className="h-4 w-4" />
              Email me
            </a>
          </div>

          <div className="animate-rise mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 measure text-muted">
            <span>{profile.location}</span>
            <span className="hidden h-3 w-px bg-rule sm:block" aria-hidden />
            <span>{profile.timezone}</span>
            <span className="hidden h-3 w-px bg-rule sm:block" aria-hidden />
            <span>{status === 'live' ? 'Live from api.github.com' : 'Snapshot from build time'}</span>
          </div>
        </div>

        {/* ---------------- right: the drawing ---------------- */}
        <div className="animate-rise" style={{ animationDelay: '120ms' }}>
          <Sheet className="p-5 sm:p-7">
            <div className="flex items-baseline justify-between gap-4">
              <p className="measure text-muted">Nib specimen</p>
              <p className="measure text-muted">Gel 0.5 mm</p>
            </div>

            <NibStroke className="mt-4" />

            {/* dimension line */}
            <div className="mt-1 flex items-center gap-2" aria-hidden>
              <span className="h-3 w-px bg-rule" />
              <span className="h-px flex-1 bg-rule" />
              <span className="measure text-muted">0.4 to 1.9 mm</span>
              <span className="h-px flex-1 bg-rule" />
              <span className="h-3 w-px bg-rule" />
            </div>

            {/* leader callout */}
            <div className="mt-4 flex items-center gap-2" aria-hidden>
              <span className="h-1.5 w-1.5 rotate-45 bg-accent" />
              <span className="h-px w-10 bg-rule" />
              <span className="measure text-muted">width follows pressure and speed</span>
            </div>

            {/* title block */}
            <dl className="mt-7 grid grid-cols-2 gap-px border border-rule bg-rule sm:grid-cols-4">
              {titleBlock.map((cell) => (
                <div key={cell.label} className="bg-surface px-3 py-3 text-center">
                  <dt className="measure text-muted/80">{cell.label}</dt>
                  <dd className="mt-1.5 font-display text-2xl font-bold tracking-tight text-fg">
                    {cell.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Sheet>

          <p className="measure mt-3 text-muted/70">
            Drawn live in the browser — one stroke, drawn once.
          </p>
        </div>
      </div>
    </section>
  )
}
