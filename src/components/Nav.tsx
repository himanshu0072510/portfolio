import { useEffect, useState } from 'react'
import { GithubIcon } from './icons'
import { Mail, Menu, Moon, Sun, X } from 'lucide-react'
import { EMAIL, profile } from '../data/profile'
import { cn } from '../lib/utils'
import { useTheme } from '../hooks/useTheme'

const links = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'github', label: 'GitHub' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

const SHEET_DATE = new Date()
  .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  .toUpperCase()

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
      {/* ---------------- Title block (desktop) ---------------- */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-[250px] flex-col justify-between border-r border-rule px-6 py-8 lg:flex">
        <div>
          <a href="#top" className="group flex items-center gap-3">
            <span className="relative shrink-0">
              <img
                src="https://avatars.githubusercontent.com/u/70277619?v=4"
                alt=""
                width="40"
                height="40"
                className="h-10 w-10 border border-rule object-cover grayscale transition-[filter,border-color] duration-300 group-hover:border-accent group-hover:grayscale-0"
              />
              <span className="absolute -left-1 -top-1 h-2 w-2 bg-accent" aria-hidden />
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block text-sm font-semibold text-fg">{profile.name}</span>
              <span className="measure mt-1 block text-muted">@{profile.login}</span>
            </span>
          </a>

          <nav className="mt-12" aria-label="Sections">
            <p className="measure mb-3 text-muted/70">Sheet contents</p>
            <ul className="space-y-0.5">
              {links.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    aria-current={active === link.id ? 'true' : undefined}
                    className="group flex items-center gap-3 py-1.5 text-sm transition-colors"
                  >
                    <span
                      className={cn(
                        'h-px shrink-0 transition-all duration-300',
                        active === link.id
                          ? 'w-6 bg-accent'
                          : 'w-3 bg-rule group-hover:w-5 group-hover:bg-muted',
                      )}
                      aria-hidden
                    />
                    <span
                      className={cn(
                        'transition-colors',
                        active === link.id ? 'text-fg' : 'text-muted group-hover:text-fg-soft',
                      )}
                    >
                      {link.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div>
          <a
            href={`mailto:${EMAIL}`}
            className="measure block break-all text-fg-soft transition-colors hover:text-accent"
          >
            {EMAIL}
          </a>

          <div className="mt-4 flex items-center gap-2">
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
              aria-label="Send an email"
              className="pressable grid h-9 w-9 place-items-center border border-control text-muted transition-colors hover:border-accent hover:text-accent"
            >
              <Mail className="h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={toggle}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              className="pressable grid h-9 w-9 place-items-center border border-control text-muted transition-colors hover:border-accent hover:text-accent"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-rule pt-3">
            <span className="measure text-muted/70">REV A</span>
            <span className="measure text-muted/70">{SHEET_DATE}</span>
          </div>
        </div>
      </aside>

      {/* ---------------- Mobile bar ---------------- */}
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b px-5 py-3 transition-colors lg:hidden',
          scrolled ? 'border-rule bg-bg' : 'border-transparent bg-bg',
        )}
      >
        <a href="#top" className="flex items-center gap-2.5">
          <span className="relative">
            <img
              src="https://avatars.githubusercontent.com/u/70277619?v=4"
              alt=""
              width="32"
              height="32"
              className="h-8 w-8 border border-rule object-cover grayscale"
            />
            <span className="absolute -left-1 -top-1 h-1.5 w-1.5 bg-accent" aria-hidden />
          </span>
          <span className="text-sm font-semibold text-fg">{profile.name}</span>
        </a>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            className="pressable grid h-9 w-9 place-items-center border border-control text-muted"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            className="pressable grid h-9 w-9 place-items-center border border-control text-fg"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* ---------------- Mobile sheet ---------------- */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-bg transition-opacity duration-300 lg:hidden',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <nav className="flex h-full flex-col justify-center gap-1 px-8 pt-16" aria-label="Sections">
          {links.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-baseline gap-4 border-b border-rule py-4 font-display text-3xl transition-colors',
                active === link.id ? 'text-accent' : 'text-fg-soft',
              )}
            >
              <span className="measure text-muted">{link.label}</span>
            </a>
          ))}
          <div className="mt-10 flex flex-col gap-2">
            <a href={`https://github.com/${profile.login}`} className="measure text-muted hover:text-accent">
              github.com/{profile.login}
            </a>
            <a href={`mailto:${EMAIL}`} className="measure break-all text-muted hover:text-accent">
              {EMAIL}
            </a>
          </div>
        </nav>
      </div>
    </>
  )
}
