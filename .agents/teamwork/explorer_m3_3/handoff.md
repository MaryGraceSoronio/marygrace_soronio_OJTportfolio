# Milestone 3 Explorer Report: Contact Page & Scroll Reveal Infrastructure

## 1. Observation

Direct observations from codebase inspection, test suite analysis, and design standards:

1. **Existing Contact Page (`src/pages/Contact.jsx`)**:
   - Lines 4, 11-15, 17-36: Form state is initialized with `{ name: '', email: '', message: '' }`. There is no `subject` field in the form state, and it does not parse URL search parameters (`?subject=...`).
   - Line 40-48: The header features a brief text blurb, but lacks a dedicated, high-impact 700-hour OJT discussion prompt card for recruiters, engineering managers, and internship coordinators.
   - Lines 53-126: Contact channels (`email`, `phone`, `github`, `linkedin`, `place`) are rendered as simple list items without a quick 1-click clipboard copy utility for the institutional email, or explicit timezone context (`PST / UTC+8`).
   - Line 139-219: Lacks prompt topic chips (e.g., "700h OJT Practicum", "Thesis / Fermonitor", "Hardware Collaboration") to help hiring managers quickly draft targeted inquiries.
   - Line 212-219: Lacks an explicit direct mailto fallback link with prefilled subject (`mailto:marygrace.soronio@g.msuiit.edu.ph?subject=...`), which is tested in `tests/tier2-boundaries/b06-b10-content-boundaries.test.js:158-163`.

2. **Existing Reveal Component & Motion Tokens (`src/components/Reveal.jsx`, `src/styles/app.css`)**:
   - `src/components/Reveal.jsx:1-45`: Currently exists as `Reveal.jsx`. However, `src/components/ScrollReveal.jsx` does not exist yet.
   - `src/styles/app.css:525-531`:
     ```css
     .reveal {
       opacity: 0;
       transform: translateY(16px);
       transition:
         opacity 420ms cubic-bezier(0.16, 1, 0.3, 1),
         transform 420ms cubic-bezier(0.16, 1, 0.3, 1);
     }
     ```
     Transition duration is `420ms`. This directly violates the Emil Kowalski design engineering rule ("Speed Limit: All UI transitions must resolve in `<= 300ms`") and the test invariant in `tests/tier1-features/f18-scroll-reveals.test.js:12-16` (`standardDurationMs <= maxAllowedDurationMs`).
   - `src/components/Reveal.jsx:14-18`: Uses `window.matchMedia('(prefers-reduced-motion: reduce)')` but does not update if preference changes dynamically, and does not provide inline style overrides if CSS fails to load.

3. **Test Invariants**:
   - `tests/tier1-features/f10-contact-page.test.js`: Requires institutional email `marygrace.soronio@g.msuiit.edu.ph`, phone `+63 966 043 4042`, `phoneHref` starting with `tel:+63`, GitHub `https://github.com/MaryGraceSoronio`, LinkedIn pointing to Mary Grace Soronio, and location including `Iligan City` and `Philippines`.
   - `tests/tier1-features/f18-scroll-reveals.test.js`: Requires targeting `transform` and `opacity` only, duration `<= 300ms`, easing avoiding `ease-in`, start scale `>= 0.95` (rejecting `scale(0)`), and reduced-motion duration forced to `0ms`.
   - `tests/tier2-boundaries/b06-b10-content-boundaries.test.js`: Requires validation rejecting empty name/email/message, rejecting malformed email with regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`, active compression `scale(0.97)`, and mailto fallback link with prefilled subject.
   - `tests/tier3-combinations/combo-card-detail-modal.test.js:50-55`: Requires prefilling contact form via `/contact?subject=${encodeURIComponent('Inquiry regarding ' + name)}`.
   - `tests/tier4-scenarios/scenario-recruiter-flow.test.js`: Recruiter navigates to `/contact` and audits verified direct channels.

---

## 2. Logic Chain

1. **Routing and Prefilling (Obs 1, 3)**:
   - Recruiter inquiry CTAs throughout the application navigate to `/contact?subject=...`.
   - Utilizing `useSearchParams` from `react-router-dom` in `Contact.jsx` allows instant pre-population of the subject field on mount, while allowing manual edits and prefill topic chips.

2. **Dedicated 700h OJT Hiring Consultation Card (Obs 1, 3)**:
   - Mary Grace Soronio's primary career objective is securing a 700-hour OJT practicum required by MSU-IIT for BS Computer Applications (Embedded Systems).
   - Placing a prominent 700h OJT status card on the Contact page immediately answers the hiring manager's key questions:
     - Availability: Immediate / Onboarding ready (Full-time, Hybrid, Remote).
     - Required hours: `700 hours` (`tabular-nums`).
     - Academic standing: CGPA `1.67351`, Dean's Lister, MSU-IIT College of Computer Studies.
     - Specialized target roles: Embedded Systems Engineer Intern, Firmware Engineer Intern, IoT Solutions Intern, Software Engineer Intern.
     - 1-click CTA: `+ Prefill 700h OJT Inquiry` instantly loads the consultation template into the message form.

3. **Accessibility, Direct Fallbacks & Active Tactility (Obs 1, 3)**:
   - For accessibility, input fields must declare `aria-invalid`, `aria-describedby` pointing to error IDs, and errors must carry `role="alert"`.
   - If popups or desktop mail handlers fail to trigger `window.location.href`, an explicit fallback `<a>` link (`mailtoFallbackUrl`) ensures the recruiter can click or copy the prefilled mailto URL directly.
   - 1-click "Copy" email button provides instant copy feedback (`Copied!`) via `navigator.clipboard`.
   - All interactive controls enforce `>= 44px` minimum hit target and active tactile compression `:active { transform: scale(0.97); }`.

4. **Hardware-Accelerated ScrollReveal Infrastructure (Obs 2, 3)**:
   - Implementing `src/components/ScrollReveal.jsx` targets GPU-composited properties (`transform: translateY(8px) scale(0.98)` -> `translateY(0) scale(1)`, `opacity: 0` -> `1`).
   - Caps duration strictly at `<= 300ms` (standard: `250ms`) using snappy `cubic-bezier(0.16, 1, 0.3, 1)`.
   - Enforces entrance scale `>= 0.95` (rejecting jarring `scale(0)`).
   - Strictly overrides transitions to `0ms` when `prefers-reduced-motion: reduce` is detected.
   - Cleans up `IntersectionObserver` on unmount.
   - Re-exporting `ScrollReveal` from `src/components/Reveal.jsx` guarantees 100% backward compatibility for all existing pages (`Home.jsx`, `About.jsx`, `Projects.jsx`).

---

## 3. Caveats

1. **Email Dispatch Protocol**:
   - Smtp/backend services are not configured in this client-side Vite SPA. The form operates by constructing a prefilled `mailto:` transmission, launching the user's default email client, while providing a clear fallback link and 1-click email copy action.
2. **IntersectionObserver Support**:
   - In environments where `IntersectionObserver` is unavailable (or mock Node test harnesses), `ScrollReveal` immediately falls back to `shown: true` so no content is obscured.
3. No other caveats.

---

## 4. Conclusion & Proposed Implementation Plan

The Worker should perform the following actions:

1. **Create `src/components/ScrollReveal.jsx`**:
   Drop in the hardware-accelerated scroll reveal component with Emil Kowalski standards and strict prefers-reduced-motion overrides.
   *(Source: `.agents/teamwork/explorer_m3_3/proposed_ScrollReveal.jsx`)*.

2. **Update `src/components/Reveal.jsx`**:
   Re-export `ScrollReveal` as default to maintain 100% backwards compatibility.
   *(Source: `.agents/teamwork/explorer_m3_3/proposed_Reveal.jsx`)*.

3. **Update `src/pages/Contact.jsx`**:
   Replace with the full interactive validated form, prefilled subject parameter handling, 700h OJT hiring consultation card, direct communication channels, topic prefill chips, and direct mailto fallback link.
   *(Source: `.agents/teamwork/explorer_m3_3/proposed_Contact.jsx`)*.

4. **Apply Patch to `src/styles/app.css`**:
   Update `.reveal` duration from 420ms to 250ms, add `.scroll-reveal`, and ensure 0ms override in `@media (prefers-reduced-motion: reduce)`.
   *(Source: `.agents/teamwork/explorer_m3_3/proposed_app_css.patch`)*.

---

### Concrete Code Artifacts for Worker

#### A. `src/components/ScrollReveal.jsx`
```jsx
import { useEffect, useRef, useState } from 'react'

/**
 * ScrollReveal - Hardware-accelerated viewport scroll reveal component.
 * 
 * Strict Emil Kowalski & Anti-AI-Slop standards:
 * - GPU acceleration: strictly targets `transform` and `opacity`
 * - Duration limit: capped at <= 300ms (default: 250ms)
 * - Easing: snappy cubic-bezier(0.16, 1, 0.3, 1) - rejects sluggish ease-in
 * - Entrance scale: starts from >= 0.95 (default: 0.98), rejects scale(0)
 * - Reduced motion: instant 0ms display with no transform when prefers-reduced-motion is active
 * - Observer lifecycle: cleanly disconnects on unmount
 * - Layout bounds: zero horizontal overflow (no translateX(100vw))
 */
export default function ScrollReveal({
  children,
  delay = 0,
  duration = 250,
  distance = 8,
  scale = 0.98,
  as: Tag = 'div',
  className = '',
  threshold = 0.08,
  rootMargin = '0px 0px -10% 0px',
  ...rest
}) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    // 1. Detect prefers-reduced-motion
    const mediaQuery =
      typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null

    const isReduced = mediaQuery ? mediaQuery.matches : false
    setReduced(isReduced)

    // If reduced motion is requested or IntersectionObserver is unsupported, reveal instantly
    if (isReduced || typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }

    const handleMotionChange = (e) => {
      if (e.matches) {
        setReduced(true)
        setShown(true)
      } else {
        setReduced(false)
      }
    }

    if (mediaQuery?.addEventListener) {
      mediaQuery.addEventListener('change', handleMotionChange)
    }

    const node = ref.current
    if (!node) return

    // 2. Set up IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true)
            observer.disconnect()
            break
          }
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
      if (mediaQuery?.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMotionChange)
      }
    }
  }, [threshold, rootMargin])

  // Constrain parameters to Emil Kowalski standards
  const safeDuration = reduced ? 0 : Math.min(Math.max(0, duration), 300)
  const safeDelay = reduced ? 0 : Math.min(Math.max(0, delay), 250)
  const safeScale = Math.max(0.95, Math.min(1, scale))

  // Hardware-accelerated GPU style contract
  const style = reduced
    ? {
        opacity: 1,
        transform: 'none',
        transition: 'none',
      }
    : {
        opacity: shown ? 1 : 0,
        transform: shown
          ? 'translateY(0) scale(1)'
          : `translateY(${distance}px) scale(${safeScale})`,
        transitionProperty: 'opacity, transform',
        transitionDuration: `${safeDuration}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: shown ? `${safeDelay}ms` : '0ms',
        willChange: shown ? 'auto' : 'transform, opacity',
      }

  return (
    <Tag
      ref={ref}
      className={`scroll-reveal ${shown ? 'is-shown' : ''} ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </Tag>
  )
}
```

#### B. `src/components/Reveal.jsx`
```jsx
/**
 * Reveal - Backward-compatibility shim that delegates to ScrollReveal.
 * Ensures existing imports in Home.jsx, About.jsx, and Projects.jsx retain 100% compatibility
 * while gaining hardware acceleration and strict reduced-motion support.
 */
export { default } from './ScrollReveal.jsx'
```

#### C. `src/pages/Contact.jsx`
```jsx
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ScrollReveal from '../components/ScrollReveal.jsx'
import { contact } from '../data/site.js'

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
```

#### D. `src/styles/app.css` (Patch)
```diff
--- a/src/styles/app.css
+++ b/src/styles/app.css
@@ -525,12 +525,14 @@
-  .reveal {
+  .reveal,
+  .scroll-reveal {
     opacity: 0;
-    transform: translateY(16px);
+    transform: translateY(8px);
     transition:
-      opacity 420ms cubic-bezier(0.16, 1, 0.3, 1),
-      transform 420ms cubic-bezier(0.16, 1, 0.3, 1);
+      opacity 250ms cubic-bezier(0.16, 1, 0.3, 1),
+      transform 250ms cubic-bezier(0.16, 1, 0.3, 1);
+    will-change: transform, opacity;
   }
 
-  .reveal.is-shown {
+  .reveal.is-shown,
+  .scroll-reveal.is-shown {
     opacity: 1;
     transform: none;
   }
@@ -578,6 +580,7 @@
     .page-enter,
-    .reveal {
+    .reveal,
+    .scroll-reveal {
       animation: none !important;
       opacity: 1 !important;
       transform: none !important;
       transition: none !important;
     }
```

---

## 5. Verification Method

To independently verify after Worker implements the changes:

1. **Full Automated 330-Test Regression**:
   ```bash
   npm test
   ```
   or:
   ```bash
   node tests/run-e2e.js
   ```
   **Expected**: Exit code 0, all 330 test cases pass.

2. **Targeted Feature Verifications**:
   ```bash
   node --test tests/tier1-features/f10-contact-page.test.js
   node --test tests/tier1-features/f18-scroll-reveals.test.js
   node --test tests/tier2-boundaries/b06-b10-content-boundaries.test.js
   node --test tests/tier2-boundaries/b16-b20-motion-micro-boundaries.test.js
   ```

3. **Vite Production Build Verification**:
   ```bash
   npm run build
   ```
   **Expected**: Zero bundling or JSX syntax errors; clean output in `dist/`.

4. **Invalidation Conditions**:
   - If `npm test` fails any test case.
   - If `ScrollReveal` duration exceeds 300ms or starts entrance from `scale(0)`.
   - If `/contact?subject=...` fails to prefill the subject input field.
   - If contact form submit button lacks active compression (`scale(0.97)`).
   - If any button or link interactive hit target is smaller than 44x44px.
