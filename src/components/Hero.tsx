import { useEffect, useState } from 'react'
import { ArrowDownRight, Mail, MapPin, Sparkles } from 'lucide-react'
import { GithubIcon } from './icons'
import { profile } from '../data/profile'
import { useGitHub } from '../hooks/useGitHub'
import { cn } from '../lib/utils'

const firstName = profile.name.split(' ')[0]
const lastName = profile.name.split(' ').slice(1).join(' ')

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
      }, 280)
    }, 3200)
    return () => window.clearInterval(timer)
  }, [])

  const stats = [
    { label: 'Repos', value: repos.length },
    { label: 'Stars', value: repos.reduce((sum, r) => sum + r.stargazers_count, 0) },
    { label: 'Since', value: new Date(gh.created_at).getFullYear() },
  ]

  return (
    <section id="top" className="relative pt-28 pb-16 md:pt-36 md:pb-24">
      {/* backdrop */}
      <div
        className="pointer-events-none absolute inset-0 grid-bg opacity-70"
        style={{
          maskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full blur-[120px]"
        style={{ background: 'var(--glow)' }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-[18%] left-[-6%] h-[460px] w-[460px] rounded-full blur-[140px]"
        style={{ background: 'var(--glow)' }}
        aria-hidden
      />

      <div className="relative mx-auto grid w-full max-w-5xl gap-14 px-5 sm:px-8 lg:grid-cols-[1.35fr_1fr] lg:items-center lg:gap-10">
        {/* ---------------- Left: copy ---------------- */}
        <div>
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1.5 backdrop-blur">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono text-[11px] tracking-wide text-muted">
              {profile.availability}
            </span>
          </div>

          <h1 className="animate-fade-up mt-7 font-display text-[clamp(3rem,10vw,5.5rem)] leading-[0.92] tracking-[-0.02em]">
            <span className="text-gradient block">{firstName}</span>
            <span className="block italic text-accent">{lastName}</span>
          </h1>

          <div className="animate-fade-up mt-6 flex min-h-8 items-center gap-3">
            <span className="h-px w-8 bg-accent/60" aria-hidden />
            <span
              className={cn(
                'font-mono text-sm tracking-wide text-fg-soft transition-all duration-300',
                fading ? 'translate-y-1 opacity-0' : 'translate-y-0 opacity-100',
              )}
            >
              {profile.roles[roleIndex]}
            </span>
          </div>

          <p className="animate-fade-up mt-7 max-w-xl text-[15px] leading-relaxed text-muted md:text-base">
            {profile.headline} I build Chrome extensions, React apps and the Node.js tooling
            around them — the kind of software that keeps working when the network does not.
          </p>

          <div className="animate-fade-up mt-9 flex flex-wrap items-center gap-3">
            <a
              href={`https://github.com/${profile.login}`}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-xl bg-fg px-5 py-3 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5"
            >
              <GithubIcon className="h-4 w-4" />
              View GitHub
              <ArrowDownRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </a>
            <a
              href={`mailto:${profile.socials[1].href.replace('mailto:', '')}`}
              className="group inline-flex items-center gap-2 rounded-xl border border-border bg-surface/60 px-5 py-3 text-sm font-medium text-fg transition-colors hover:border-accent/50 hover:text-accent"
            >
              <Mail className="h-4 w-4" />
              Email me
            </a>
          </div>

          <div className="animate-fade-up mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-xs text-muted">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {profile.location} · {profile.timezone}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              {status === 'live' ? 'Live from GitHub' : 'Synced from GitHub'}
            </span>
          </div>
        </div>

        {/* ---------------- Right: identity card ---------------- */}
        <div className="animate-fade-up relative mx-auto w-full max-w-sm lg:max-w-none">
          <div className="absolute -inset-3 rounded-[28px] bg-gradient-to-br from-accent/20 via-transparent to-transparent blur-2xl" />
          <div className="relative rounded-3xl border border-border bg-surface/80 p-6 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div
                  className="absolute -inset-1.5 rounded-full border border-accent/40 animate-pulse-ring"
                  aria-hidden
                />
                <img
                  src={gh.avatar_url}
                  alt={`${profile.name} avatar`}
                  width="72"
                  height="72"
                  className="h-[72px] w-[72px] rounded-full border border-border object-cover"
                  loading="eager"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium text-fg">{profile.name}</p>
                <a
                  href={gh.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate font-mono text-xs text-accent hover:underline"
                >
                  @{profile.login}
                </a>
                <p className="mt-1 font-mono text-[11px] text-muted">
                  GitHub since {new Date(gh.created_at).getFullYear()}
                </p>
              </div>
            </div>

            <dl className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-border bg-border">
              {stats.map((s) => (
                <div key={s.label} className="bg-surface px-2 py-3.5 text-center">
                  <dt className="font-mono text-[10px] tracking-widest text-muted uppercase">
                    {s.label}
                  </dt>
                  <dd className="mt-1 font-display text-2xl text-fg">{s.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 flex items-center justify-between rounded-xl border border-border-soft bg-bg-soft/60 px-4 py-3">
              <span className="font-mono text-[11px] text-muted">Shipped projects</span>
              <span className="font-mono text-xs text-fg-soft">
                {repos.length} on GitHub
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
