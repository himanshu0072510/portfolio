import { type FormEvent, useState } from 'react'
import { ArrowRight, Check, Copy, Loader2, Mail, Send, Sparkles } from 'lucide-react'
import { GithubIcon } from './icons'
import { EMAIL, profile } from '../data/profile'
import { Section } from './Section'
import { Sheet } from './Sheet'

const FORMSPREE_ID = (import.meta.env.VITE_FORMSPREE_ID as string | undefined)?.trim()

type Field = 'name' | 'email' | 'message'
type Errors = Partial<Record<Field, string>>

const EMPTY = { name: '', email: '', message: '' }

export function Contact() {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errors, setErrors] = useState<Errors>({})
  const [form, setForm] = useState(EMPTY)
  const [copied, setCopied] = useState(false)

  function validate(values: typeof EMPTY, only?: Field): Errors {
    const next: Errors = {}
    const check = (field: Field) => {
      if (only && only !== field) return
      const value = values[field].trim()
      if (!value) {
        next[field] =
          field === 'name'
            ? 'Tell me who you are.'
            : field === 'email'
              ? 'I need an address to reply to.'
              : 'Add a message.'
        return
      }
      if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        next.email = 'That address does not look right.'
      }
    }
    check('name')
    check('email')
    check('message')
    return next
  }

  const update =
    (field: Field) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const values = { ...form, [field]: e.target.value }
      setForm(values)
      if (errors[field]) setErrors(validate(values, field))
    }

  const onBlur =
    (field: Field) =>
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const values = { ...form, [field]: e.target.value }
      setForm(values)
      setErrors(validate(values, field))
    }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      setState('error')
      return
    }

    if (!FORMSPREE_ID) {
      // No form endpoint configured — hand the message to the visitor's mail app.
      const subject = encodeURIComponent(`Portfolio enquiry from ${form.name.trim()}`)
      const body = encodeURIComponent(`${form.message.trim()}\n\n— ${form.name.trim()}\n${form.email.trim()}`)
      window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`
      return
    }

    setState('sending')
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, _subject: `Portfolio enquiry from ${form.name}` }),
      })
      if (!res.ok) throw new Error(`Formspree responded ${res.status}`)
      setState('sent')
      setForm(EMPTY)
    } catch {
      setState('error')
      setErrors({ message: 'Something went wrong sending that. Please email me directly instead.' })
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

  const inputClass =
    'mt-2 w-full border border-control bg-bg px-4 py-3 text-sm text-fg outline-none transition-colors placeholder:text-muted/50 focus:border-accent'

  return (
    <Section
      id="contact"
      title="Contact"
      lede="Got something to build, a bug to chase, or an idea to argue about? My inbox is open."
      datum={profile.timezone}
    >
      <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        {/* ---------------- form ---------------- */}
        <Sheet className="p-6 sm:p-8" fill>
          {state === 'sent' ? (
            <div className="flex flex-col items-start py-8">
              <span className="grid h-11 w-11 place-items-center bg-accent text-accent-fg">
                <Check className="h-5 w-5" />
              </span>
              <h3 className="mt-6 font-display text-3xl font-bold tracking-tight text-fg">
                Message sent.
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
                Thanks for reaching out — it landed in my Gmail inbox. I usually reply within a
                day or two.
              </p>
              <button
                type="button"
                onClick={() => setState('idle')}
                className="pressable mt-7 border border-control px-4 py-2.5 text-sm font-semibold text-fg transition-colors hover:border-accent hover:text-accent"
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-display text-xl font-bold tracking-tight text-fg">
                  Send a message
                </h3>
                <span className="inline-flex items-center gap-1.5 measure text-muted">
                  <Sparkles className="h-3 w-3 text-accent" aria-hidden />
                  {FORMSPREE_ID ? 'Straight to Gmail' : 'Opens your mail app'}
                </span>
              </div>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="measure text-muted">
                    Name <span className="text-accent">*</span>
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={form.name}
                    onChange={update('name')}
                    onBlur={onBlur('name')}
                    placeholder="Ada Lovelace"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'contact-name-error' : undefined}
                    className={inputClass}
                  />
                  {errors.name && (
                    <p
                      id="contact-name-error"
                      role="alert"
                      className="mt-2 text-[12px] text-accent"
                    >
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-email" className="measure text-muted">
                    Email <span className="text-accent">*</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={form.email}
                    onChange={update('email')}
                    onBlur={onBlur('email')}
                    placeholder="you@company.com"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'contact-email-error' : undefined}
                    className={inputClass}
                  />
                  {errors.email && (
                    <p
                      id="contact-email-error"
                      role="alert"
                      className="mt-2 text-[12px] text-accent"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5">
                <label htmlFor="contact-message" className="measure text-muted">
                  Message <span className="text-accent">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  required
                  value={form.message}
                  onChange={update('message')}
                  onBlur={onBlur('message')}
                  placeholder="Tell me what you are building…"
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'contact-message-error' : undefined}
                  className={`${inputClass} resize-y`}
                />
                {errors.message && (
                  <p
                    id="contact-message-error"
                    role="alert"
                    className="mt-2 text-[12px] text-accent"
                  >
                    {errors.message}
                  </p>
                )}
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={state === 'sending'}
                  className="inline-flex items-center gap-2 bg-accent px-5 py-3 text-sm font-semibold text-accent-fg transition-colors hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {state === 'sending' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" aria-hidden />
                      Send message
                    </>
                  )}
                </button>
                <a
                  href={`mailto:${EMAIL}?subject=${mailtoSubject}&body=${mailtoBody}`}
                  className="pressable inline-flex items-center gap-2 border border-control px-5 py-3 text-sm font-semibold text-fg transition-colors hover:border-accent hover:text-accent"
                >
                  <Mail className="h-4 w-4" aria-hidden />
                  Use my own mail app
                </a>
              </div>
            </form>
          )}
        </Sheet>

        {/* ---------------- direct channels ---------------- */}
        <div className="flex flex-col gap-6">
          <Sheet className="p-6 sm:p-8" fill>
            <p className="measure text-muted/80">Direct line</p>
            <p className="mt-3 break-all font-display text-xl font-bold tracking-tight text-fg">
              {EMAIL}
            </p>
            <button
              type="button"
              onClick={copyEmail}
              className="pressable mt-5 inline-flex items-center gap-2 border border-control px-3.5 py-2 text-xs font-semibold text-fg transition-colors hover:border-accent hover:text-accent"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" aria-hidden />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" aria-hidden />
                  Copy address
                </>
              )}
            </button>

            <dl className="mt-7">
              {profile.facts.map((fact) => (
                <div
                  key={fact.label}
                  className="flex items-baseline justify-between gap-4 border-t border-rule-soft py-3 first:border-t-0"
                >
                  <dt className="measure text-muted/80">{fact.label}</dt>
                  <dd className="text-right text-[13px] text-fg-soft">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Sheet>

          <Sheet className="p-6">
            <p className="measure text-muted/80">Elsewhere</p>
            <a
              href={`https://github.com/${profile.login}`}
              target="_blank"
              rel="noreferrer"
              className="pressable group mt-4 flex items-center justify-between border border-control px-4 py-3.5 transition-colors hover:border-accent"
            >
              <span className="flex items-center gap-3">
                <GithubIcon className="h-4 w-4 text-accent" />
                <span className="text-sm text-fg">github.com/{profile.login}</span>
              </span>
              <ArrowRight className="h-4 w-4 text-muted transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="https://himanshu0072510.github.io/gloss/"
              target="_blank"
              rel="noreferrer"
              className="pressable group mt-2.5 flex items-center justify-between border border-control px-4 py-3.5 transition-colors hover:border-accent"
            >
              <span className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-accent" />
                <span className="text-sm text-fg">Gloss — contextual dictionary</span>
              </span>
              <ArrowRight className="h-4 w-4 text-muted transition-transform group-hover:translate-x-0.5" />
            </a>
          </Sheet>
        </div>
      </div>
    </Section>
  )
}
