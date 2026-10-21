import { type FormEvent, useState } from 'react'
import { Check, Copy, Loader2, Mail, Send, Sparkles } from 'lucide-react'
import { GithubIcon } from './icons'
import { EMAIL, profile } from '../data/profile'
import { Section } from './Section'
import { Reveal } from './Reveal'

const FORMSPREE_ID = (import.meta.env.VITE_FORMSPREE_ID as string | undefined)?.trim()

type FormState = 'idle' | 'sending' | 'sent' | 'error'

export function Contact() {
  const [state, setState] = useState<FormState>('idle')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setState('error')
      setError('Please fill in every field.')
      return
    }

    if (!FORMSPREE_ID) {
      // No form endpoint configured — hand the message to the visitor's mail app.
      const subject = encodeURIComponent(`Portfolio enquiry from ${form.name}`)
      const body = encodeURIComponent(`${form.message}\n\n— ${form.name}\n${form.email}`)
      window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`
      return
    }

    setState('sending')
    setError('')
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, _subject: `Portfolio enquiry from ${form.name}` }),
      })
      if (!res.ok) throw new Error(`Formspree responded ${res.status}`)
      setState('sent')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setState('error')
      setError('Something went wrong sending that. Please email me directly instead.')
    }
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${EMAIL}`
    }
  }

  const mailtoSubject = encodeURIComponent('Hello Himanshu')
  const mailtoBody = encodeURIComponent(
    `Hi Himanshu,\n\nI found your portfolio and would like to talk about `,
  )

  return (
    <Section
      id="contact"
      index="05"
      title="Contact"
      lede="Got something to build, a bug to chase, or an idea to argue about? My inbox is open."
    >
      <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        {/* ---------------- form ---------------- */}
        <Reveal>
          <div className="rounded-3xl border border-border bg-surface/50 p-6 sm:p-8">
            {state === 'sent' ? (
              <div className="flex flex-col items-start py-8">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-emerald-500/15 text-emerald-400">
                  <Check className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-3xl text-fg">Message sent.</h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
                  Thanks for reaching out — it landed in my Gmail inbox. I usually reply within a
                  day or two.
                </p>
                <button
                  type="button"
                  onClick={() => setState('idle')}
                  className="mt-7 rounded-xl border border-border px-4 py-2.5 text-sm text-fg transition-colors hover:border-accent/50 hover:text-accent"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate>
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl text-fg">Send a message</h3>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 font-mono text-[10px] text-muted">
                    <Sparkles className="h-3 w-3" />
                    {FORMSPREE_ID ? 'Direct to Gmail' : 'Opens your mail app'}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="font-mono text-[11px] tracking-widest text-muted uppercase">
                      Name
                    </span>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={update('name')}
                      placeholder="Ada Lovelace"
                      className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-fg outline-none transition-colors placeholder:text-muted/50 focus:border-accent/60"
                    />
                  </label>
                  <label className="block">
                    <span className="font-mono text-[11px] tracking-widest text-muted uppercase">
                      Email
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={update('email')}
                      placeholder="you@company.com"
                      className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-fg outline-none transition-colors placeholder:text-muted/50 focus:border-accent/60"
                    />
                  </label>
                </div>

                <label className="mt-4 block">
                  <span className="font-mono text-[11px] tracking-widest text-muted uppercase">
                    Message
                  </span>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={update('message')}
                    rows={5}
                    placeholder="Tell me what you are building…"
                    className="mt-2 w-full resize-y rounded-xl border border-border bg-bg px-4 py-3 text-sm leading-relaxed text-fg outline-none transition-colors placeholder:text-muted/50 focus:border-accent/60"
                  />
                </label>

                {state === 'error' && error && (
                  <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-[13px] text-red-400">
                    {error}
                  </p>
                )}

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={state === 'sending'}
                    className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-medium text-accent-fg transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    {state === 'sending' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send message
                      </>
                    )}
                  </button>
                  <a
                    href={`mailto:${EMAIL}?subject=${mailtoSubject}&body=${mailtoBody}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-medium text-fg transition-colors hover:border-accent/50 hover:text-accent"
                  >
                    <Mail className="h-4 w-4" />
                    Use my own mail app
                  </a>
                </div>
              </form>
            )}
          </div>
        </Reveal>

        {/* ---------------- direct channels ---------------- */}
        <Reveal delay={110}>
          <div className="flex h-full flex-col gap-4">
            <div className="rounded-3xl border border-border bg-surface/50 p-6 sm:p-8">
              <p className="font-mono text-[11px] tracking-widest text-muted uppercase">
                Direct line
              </p>
              <p className="mt-3 font-display text-2xl leading-snug break-all text-fg">{EMAIL}</p>
              <button
                type="button"
                onClick={copyEmail}
                className="mt-5 inline-flex items-center gap-2 rounded-lg border border-border px-3.5 py-2 text-xs text-fg transition-colors hover:border-accent/50 hover:text-accent"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy address
                  </>
                )}
              </button>

              <div className="mt-7 space-y-3 border-t border-border-soft pt-6">
                {profile.facts.map((fact) => (
                  <div key={fact.label} className="flex items-baseline justify-between gap-4">
                    <span className="font-mono text-[11px] tracking-widest text-muted uppercase">
                      {fact.label}
                    </span>
                    <span className="text-right text-[13px] text-fg-soft">{fact.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-gradient-to-br from-surface to-surface-hi p-6">
              <p className="font-mono text-[11px] tracking-widest text-muted uppercase">
                Elsewhere
              </p>
              <a
                href={`https://github.com/${profile.login}`}
                target="_blank"
                rel="noreferrer"
                className="group mt-4 flex items-center justify-between rounded-xl border border-border-soft bg-bg/40 px-4 py-3.5 transition-colors hover:border-accent/40"
              >
                <span className="flex items-center gap-3">
                  <GithubIcon className="h-4 w-4 text-accent" />
                  <span className="text-sm text-fg">github.com/{profile.login}</span>
                </span>
                <span className="font-mono text-[10px] text-muted transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </a>
              <a
                href="https://himanshu0072510.github.io/gloss/"
                target="_blank"
                rel="noreferrer"
                className="group mt-2.5 flex items-center justify-between rounded-xl border border-border-soft bg-bg/40 px-4 py-3.5 transition-colors hover:border-accent/40"
              >
                <span className="flex items-center gap-3">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <span className="text-sm text-fg">Gloss — contextual dictionary</span>
                </span>
                <span className="font-mono text-[10px] text-muted transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
