import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ScrollReveal from '../components/ScrollReveal.jsx'
import { contact, developerProfile } from '../data/site.js'

export default function Contact() {
  const [searchParams] = useSearchParams()
  const initialSubject = searchParams.get('subject') || ''

  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: initialSubject,
    message: '',
  })

  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState(false)

  // Synchronize URL subject query param if it updates dynamically
  useEffect(() => {
    const querySubject = searchParams.get('subject')
    if (querySubject && querySubject !== form.subject) {
      setForm((prev) => ({ ...prev, subject: querySubject }))
    }
  }, [searchParams])

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setSent(false)
  }

  const handleCopyEmail = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(contact.email)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = contact.email
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      setCopiedEmail(true)
      setTimeout(() => setCopiedEmail(false), 2200)
    } catch {
      setCopiedEmail(false)
    }
  }

  const prefillOjtInquiry = () => {
    setForm({
      name: '',
      email: '',
      subject: '700-Hour OJT Internship Inquiry',
      message:
        'Hi Mary Grace, We reviewed your embedded systems engineering portfolio and would like to discuss an OJT internship placement with our engineering team...',
    })
    setErrors({})
    setSent(false)
    const el = document.getElementById('contact-name')
    if (el) {
      el.focus()
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const prefillTopic = (topicSubject, topicMessage) => {
    setForm((prev) => ({
      ...prev,
      subject: topicSubject,
      message: topicMessage,
    }))
    setErrors({})
    setSent(false)
  }

  const submit = (event) => {
    event.preventDefault()
    const nextErrors = {}

    if (!form.name || form.name.trim() === '') {
      nextErrors.name = 'Please provide your name or organization so I know who I am replying to.'
    }

    if (!form.email || form.email.trim() === '') {
      nextErrors.email = 'Email address is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid work or personal email address.'
    }

    if (!form.message || form.message.trim() === '') {
      nextErrors.message = 'Please provide a message.'
    } else if (form.message.trim().length < 20) {
      nextErrors.message = 'Please provide a little more detail (at least 20 characters).'
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      // Focus first erroneous field for accessibility
      const firstErrorKey = Object.keys(nextErrors)[0]
      const el = document.getElementById(`contact-${firstErrorKey}`)
      if (el) el.focus()
      return
    }

    const resolvedSubject = encodeURIComponent(
      form.subject.trim() || `Portfolio inquiry from ${form.name.trim()}`,
    )
    const resolvedBody = encodeURIComponent(
      `${form.message.trim()}\n\n---\nSender: ${form.name.trim()}\nContact: ${form.email.trim()}`,
    )

    window.location.href = `mailto:${contact.email}?subject=${resolvedSubject}&body=${resolvedBody}`
    setSent(true)
  }

  // Pre-computed fallback link with prefilled subject
  const mailtoFallbackUrl = `mailto:${contact.email}?subject=${encodeURIComponent(
    form.subject.trim() || 'OJT / Engineering Inquiry',
  )}`

  return (
    <div className="shell pb-5xl pt-3xl">
      {/* Page Header */}
      <ScrollReveal as="header" className="max-w-[65ch]">
        <div className="flex flex-wrap items-center gap-xs">
          <span className="font-mono text-xs uppercase tracking-wider text-accent-light">
            contact / 700-hour OJT consultation
          </span>
          <span className="text-xs text-muted" aria-hidden="true">
            /
          </span>
          <span className="inline-flex items-center gap-2xs font-mono text-xs text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
            active inbox
          </span>
        </div>

        <h1 className="mt-sm font-display text-display font-semibold tracking-tight text-ink">
          Let’s discuss the engineering.
        </h1>
        <p className="mt-md text-lead text-ink-2">
          Fourth-year BS Computer Applications student majoring in Embedded Systems at Mindanao State
          University – Iligan Institute of Technology (MSU-IIT), with a CGPA of{' '}
          <span className="tabular-nums font-medium text-ink">1.67351</span> (Dean’s Lister).
          Actively seeking a{' '}
          <span className="tabular-nums font-semibold text-accent-light">700-hour</span> On-the-Job
          Training (OJT) role in embedded systems, firmware, IoT, or software engineering.
        </p>
      </ScrollReveal>

      {/* Main Grid: Left Column (OJT Card + Channels) / Right Column (Validated Form) */}
      <div className="mt-2xl grid gap-2xl lg:grid-cols-12 lg:items-start lg:gap-col">
        {/* Left Column: 5 Cols */}
        <div className="flex flex-col gap-xl lg:col-span-5">
          {/* 700-Hour OJT Recruiter Card */}
          <ScrollReveal
            delay={60}
            className="rounded-card border border-rule bg-paper-2/90 p-lg shadow-card backdrop-blur-sm"
          >
            <div className="flex items-center justify-between gap-sm border-b border-rule pb-sm">
              <span className="font-mono text-xs uppercase tracking-wider text-muted">
                internship status
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-pill border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-mono text-[11px] text-emerald-400">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                AVAILABLE FOR 700H OJT
              </span>
            </div>

            <div className="mt-md">
              <div className="flex items-baseline justify-between gap-sm">
                <span className="font-display text-2xl font-bold tabular-nums text-accent-light">
                  700 Hours
                </span>
                <span className="font-mono text-xs text-muted">academic requirement</span>
              </div>
              <p className="mt-xs text-xs text-ink-2">
                Available for full-time on-site, hybrid, or remote placement. Ready for immediate
                onboarding and institutional coordination with MSU-IIT.
              </p>
            </div>

            <dl className="mt-md divide-y divide-rule border-t border-rule text-xs">
              <div className="flex items-center justify-between py-2">
                <dt className="font-mono text-muted">Institution</dt>
                <dd className="font-medium text-ink">MSU-IIT (CCS)</dd>
              </div>
              <div className="flex items-center justify-between py-2">
                <dt className="font-mono text-muted">Major</dt>
                <dd className="font-medium text-ink">Embedded Systems</dd>
              </div>
              <div className="flex items-center justify-between py-2">
                <dt className="font-mono text-muted">Target Roles</dt>
                <dd className="text-right font-medium text-ink">Firmware / Embedded / IoT</dd>
              </div>
              <div className="flex items-center justify-between py-2">
                <dt className="font-mono text-muted">Location Base</dt>
                <dd className="font-medium text-ink">Iligan City (PST, UTC+8)</dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={prefillOjtInquiry}
              className="mt-md flex min-h-[44px] w-full items-center justify-center gap-xs rounded-card-sm border border-accent/40 bg-accent/10 px-md py-sm font-mono text-xs font-medium text-accent-light transition-colors hover:bg-accent/20 active:scale-[0.97]"
            >
              <span>+ Prefill 700h OJT Inquiry</span>
            </button>
          </ScrollReveal>

          {/* Direct Channels Ledger */}
          <ScrollReveal delay={120}>
            <div className="flex items-center justify-between">
              <h2 className="font-mono text-xs uppercase tracking-wider text-muted">
                direct channels
              </h2>
              <span className="font-mono text-[11px] text-muted">verified</span>
            </div>

            <ul className="mt-sm divide-y divide-rule border-y border-rule">
              {/* Email */}
              <li className="py-sm">
                <div className="flex items-center justify-between gap-sm">
                  <div className="min-w-0">
                    <span className="block font-mono text-[11px] uppercase tracking-wider text-muted">
                      institutional email
                    </span>
                    <a
                      href={`mailto:${contact.email}`}
                      className="mt-3xs block truncate text-sm font-medium text-ink transition-colors hover:text-accent-light"
                    >
                      {contact.email}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    aria-label="Copy institutional email to clipboard"
                    className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-card-sm border border-rule-2 bg-paper-3 px-sm text-xs font-medium text-ink-2 transition-colors hover:border-accent hover:text-accent-light active:scale-[0.97]"
                  >
                    {copiedEmail ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </li>

              {/* Phone */}
              <li>
                <a
                  href={contact.phoneHref}
                  className="group flex min-h-[48px] items-center justify-between gap-md py-sm"
                >
                  <div>
                    <span className="block font-mono text-[11px] uppercase tracking-wider text-muted">
                      direct phone
                    </span>
                    <span className="mt-3xs block font-mono text-sm tabular-nums text-ink transition-colors group-hover:text-accent-light">
                      {contact.phone}
                    </span>
                  </div>
                  <span
                    aria-hidden="true"
                    className="font-mono text-sm text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent-light"
                  >
                    &rarr;
                  </span>
                </a>
              </li>

              {/* GitHub */}
              <li>
                <a
                  href={contact.github}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex min-h-[48px] items-center justify-between gap-md py-sm"
                >
                  <div>
                    <span className="block font-mono text-[11px] uppercase tracking-wider text-muted">
                      github
                    </span>
                    <span className="mt-3xs block font-mono text-sm text-ink transition-colors group-hover:text-accent-light">
                      {contact.githubLabel || 'github.com/MaryGraceSoronio'}
                    </span>
                  </div>
                  <span
                    aria-hidden="true"
                    className="font-mono text-sm text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent-light"
                  >
                    &rarr;
                  </span>
                </a>
              </li>

              {/* LinkedIn */}
              <li>
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex min-h-[48px] items-center justify-between gap-md py-sm"
                >
                  <div>
                    <span className="block font-mono text-[11px] uppercase tracking-wider text-muted">
                      linkedin
                    </span>
                    <span className="mt-3xs block font-mono text-sm text-ink transition-colors group-hover:text-accent-light">
                      {contact.linkedinLabel || 'linkedin.com/in/mary-grace-soronio'}
                    </span>
                  </div>
                  <span
                    aria-hidden="true"
                    className="font-mono text-sm text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent-light"
                  >
                    &rarr;
                  </span>
                </a>
              </li>
            </ul>

            <div className="mt-md flex items-center justify-between text-xs text-muted">
              <span className="font-mono">{contact.place}</span>
              <span className="font-mono">PST (UTC+8)</span>
            </div>
          </ScrollReveal>
        </div>

        {/* Right Column: 7 Cols (Interactive Form) */}
        <ScrollReveal
          delay={100}
          className="rounded-card border border-rule bg-paper-2 p-lg shadow-card lg:col-span-7 lg:p-xl"
        >
          <div className="flex flex-wrap items-center justify-between gap-xs border-b border-rule pb-md">
            <div>
              <h2 className="font-display text-title font-semibold text-ink">Send a transmission</h2>
              <p className="mt-2xs text-xs text-ink-2">
                Composes a direct dispatch in your mail client. No unencrypted server intermediaries.
              </p>
            </div>
            <span className="rounded-pill border border-rule px-2 py-0.5 font-mono text-[11px] text-muted">
              direct mailto
            </span>
          </div>

          {/* Quick Prefill Chips */}
          <div className="mt-md">
            <span className="block font-mono text-[11px] uppercase tracking-wider text-muted">
              quick prompt topics
            </span>
            <div className="mt-xs flex flex-wrap gap-xs">
              <button
                type="button"
                onClick={() =>
                  prefillTopic(
                    '700-Hour OJT Internship Inquiry',
                    'Hi Mary Grace, We would like to discuss an OJT internship placement for embedded systems engineering with our team...',
                  )
                }
                className="flex min-h-[36px] items-center rounded-pill border border-rule bg-paper-3 px-sm py-1 font-mono text-xs text-ink transition-colors hover:border-accent hover:text-accent-light active:scale-[0.97]"
              >
                700h OJT Practicum
              </button>
              <button
                type="button"
                onClick={() =>
                  prefillTopic(
                    'Inquiry regarding Fermonitor E-Nose',
                    'Hi Mary Grace, I reviewed your Fermonitor e-nose thesis project and would like to ask about the sensor analog front-end and ML telemetry...',
                  )
                }
                className="flex min-h-[36px] items-center rounded-pill border border-rule bg-paper-3 px-sm py-1 font-mono text-xs text-ink transition-colors hover:border-accent hover:text-accent-light active:scale-[0.97]"
              >
                Thesis / Fermonitor
              </button>
              <button
                type="button"
                onClick={() =>
                  prefillTopic(
                    'Embedded Systems & Hardware Collaboration',
                    'Hi Mary Grace, We have a hardware/firmware project and would like to consult on microcontroller implementation...',
                  )
                }
                className="flex min-h-[36px] items-center rounded-pill border border-rule bg-paper-3 px-sm py-1 font-mono text-xs text-ink transition-colors hover:border-accent hover:text-accent-light active:scale-[0.97]"
              >
                Hardware Collaboration
              </button>
            </div>
          </div>

          {/* Form Element */}
          <form onSubmit={submit} noValidate className="mt-lg">
            <div className="grid gap-md sm:grid-cols-2">
              {/* Name Field */}
              <div className="flex flex-col gap-2xs">
                <label htmlFor="contact-name" className="font-mono text-xs font-medium text-ink">
                  Name / Organization <span className="text-accent-light">*</span>
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="e.g. Elena Rostova / Acme Systems"
                  value={form.name}
                  onChange={update('name')}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'contact-name-error' : undefined}
                  className={`h-11 w-full rounded-card-sm border bg-paper px-sm text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none ${
                    errors.name ? 'border-accent-light ring-1 ring-accent-light' : 'border-rule-2'
                  }`}
                />
                {errors.name ? (
                  <p id="contact-name-error" role="alert" className="text-xs text-accent-light">
                    {errors.name}
                  </p>
                ) : null}
              </div>

              {/* Email Field */}
              <div className="flex flex-col gap-2xs">
                <label htmlFor="contact-email" className="font-mono text-xs font-medium text-ink">
                  Email Address <span className="text-accent-light">*</span>
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={update('email')}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'contact-email-error' : undefined}
                  className={`h-11 w-full rounded-card-sm border bg-paper px-sm text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none ${
                    errors.email ? 'border-accent-light ring-1 ring-accent-light' : 'border-rule-2'
                  }`}
                />
                {errors.email ? (
                  <p id="contact-email-error" role="alert" className="text-xs text-accent-light">
                    {errors.email}
                  </p>
                ) : null}
              </div>
            </div>

            {/* Subject Field */}
            <div className="mt-md flex flex-col gap-2xs">
              <label htmlFor="contact-subject" className="font-mono text-xs font-medium text-ink">
                Subject
              </label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                placeholder="e.g. 700-Hour OJT Internship Inquiry / Project Question"
                value={form.subject}
                onChange={update('subject')}
                className="h-11 w-full rounded-card-sm border border-rule-2 bg-paper px-sm text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
              />
            </div>

            {/* Message Field */}
            <div className="mt-md flex flex-col gap-2xs">
              <div className="flex items-center justify-between">
                <label htmlFor="contact-message" className="font-mono text-xs font-medium text-ink">
                  Message Transmission <span className="text-accent-light">*</span>
                </label>
                <span className="font-mono text-[11px] tabular-nums text-muted">
                  {form.message.length} chars (min 20)
                </span>
              </div>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                value={form.message}
                onChange={update('message')}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? 'contact-message-error' : 'contact-message-help'}
                placeholder="Details regarding your team, the internship scope, technical challenges, or project inquiry..."
                className={`w-full rounded-card-sm border bg-paper px-sm py-sm text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none ${
                  errors.message ? 'border-accent-light ring-1 ring-accent-light' : 'border-rule-2'
                }`}
              />
              <p id="contact-message-help" className="text-xs text-muted">
                Please include a brief overview of the role, requirements, or inquiry (minimum 20 characters).
              </p>
              {errors.message ? (
                <p id="contact-message-error" role="alert" className="text-xs text-accent-light">
                  {errors.message}
                </p>
              ) : null}
            </div>

            {/* Submit Action & Tactile Micro-Interactions */}
            <div className="mt-lg flex flex-wrap items-center gap-md">
              <button
                type="submit"
                className="btn btn-primary min-h-[48px] px-xl font-medium touch-target"
              >
                Launch Mail Client &rarr;
              </button>

              {sent ? (
                <p aria-live="polite" className="font-mono text-xs text-emerald-400">
                  &#10003; Transmission dispatched to mail client.
                </p>
              ) : null}
            </div>

            {/* Direct Mailto Fallback Link (F10-T2-5 Guarantee) */}
            <div className="mt-lg border-t border-rule pt-md">
              <p className="text-xs text-muted">
                Prefer using your external email client directly?{' '}
                <a
                  href={mailtoFallbackUrl}
                  className="font-medium text-accent-light underline underline-offset-4 hover:text-accent-hover"
                >
                  Open direct mailto link with prefilled subject &rarr;
                </a>
              </p>
            </div>
          </form>
        </ScrollReveal>
      </div>
    </div>
  )
}
