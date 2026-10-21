import { useEffect, useState } from 'react'
import { Mail, Menu, Moon, Sun, X } from 'lucide-react'
import { GithubIcon } from './icons'
import { profile } from '../data/profile'
import { cn } from '../lib/utils'
import { useTheme } from '../hooks/useTheme'

const links = [
  { id: 'about', index: '01', label: 'About' },
  { id: 'skills', index: '02', label: 'Skills' },
  { id: 'github', index: '03', label: 'GitHub' },
  { id: 'projects', index: '04', label: 'Projects' },
  { id: 'contact', index: '05', label: 'Contact' },
]

export function Nav() {
  const { theme, toggle } = useTheme()
  const [active, setActive] = useState('about')
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => Boolean(el))

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) setActive(visible.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.5] },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      {/* ---------------- Desktop rail ---------------- */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col justify-between border-r border-border-soft bg-bg/80 px-7 py-8 backdrop-blur-xl lg:flex">
        <div>
          <a href="#top" className="group flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-surface font-display text-lg text-accent transition-colors group-hover:border-accent/50">
              {profile.initials}
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-medium text-fg">{profile.name}</span>
              <span className="block font-mono text-[11px] text-muted">@{profile.login}</span>
            </span>
          </a>

          <nav className="mt-14 flex flex-col gap-1">
            {links.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={cn(
                  'group flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors',
                  active === link.id ? 'text-fg' : 'text-muted hover:text-fg-soft',
                )}
              >
                <span
                  className={cn(
                    'font-mono text-[10px] tracking-widest transition-colors',
                    active === link.id ? 'text-accent' : 'text-muted/50',
                  )}
                >
                  {link.index}
                </span>
                <span
                  className={cn(
                    'h-px w-3 transition-all duration-300',
                    active === link.id
                      ? 'w-6 bg-accent'
                      : 'bg-transparent group-hover:w-5 group-hover:bg-border',
                  )}
                />
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="space-y-5">
          <a
            href={`mailto:${profile.socials[1].href.replace('mailto:', '')}`}
            className="block truncate font-mono text-[11px] text-muted transition-colors hover:text-accent"
          >
            {profile.socials[1].handle}
          </a>
          <div className="flex items-center gap-2">
            <a
              href={`https://github.com/${profile.login}`}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub profile"
              className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted transition-colors hover:border-accent/50 hover:text-accent"
            >
              <GithubIcon className="h-4 w-4" />
            </a>
            <a
              href={`mailto:${profile.socials[1].href.replace('mailto:', '')}`}
              aria-label="Send an email"
              className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted transition-colors hover:border-accent/50 hover:text-accent"
            >
              <Mail className="h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={toggle}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted transition-colors hover:border-accent/50 hover:text-accent"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </aside>

      {/* ---------------- Mobile bar ---------------- */}
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b px-5 py-3 backdrop-blur-xl transition-colors lg:hidden',
          scrolled ? 'border-border bg-bg/85' : 'border-transparent bg-bg/50',
        )}
      >
        <a href="#top" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-surface font-display text-base text-accent">
            {profile.initials}
          </span>
          <span className="text-sm font-medium text-fg">{profile.name}</span>
        </a>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            className="grid h-9 w-9 place-items-center rounded-lg border border-border text-fg"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* ---------------- Mobile sheet ---------------- */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-bg/95 backdrop-blur-xl transition-opacity duration-300 lg:hidden',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <nav className="flex h-full flex-col justify-center gap-2 px-8 pt-16">
          {links.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-baseline gap-4 border-b border-border-soft py-4 font-display text-3xl transition-colors',
                active === link.id ? 'text-accent' : 'text-fg-soft',
              )}
            >
              <span className="font-mono text-xs tracking-widest text-muted">{link.index}</span>
              {link.label}
            </a>
          ))}
          <div className="mt-10 flex flex-col gap-3 font-mono text-sm text-muted">
            <a href={`https://github.com/${profile.login}`} className="hover:text-accent">
              github.com/{profile.login}
            </a>
            <a
              href={`mailto:${profile.socials[1].href.replace('mailto:', '')}`}
              className="hover:text-accent"
            >
              {profile.socials[1].handle}
            </a>
          </div>
        </nav>
      </div>
    </>
  )
}
