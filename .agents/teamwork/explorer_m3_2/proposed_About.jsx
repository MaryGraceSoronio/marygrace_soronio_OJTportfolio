import { useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import {
  developerProfile,
  education,
  experience,
  leadership,
  languages,
  contact,
} from '../data/site.js'

function TimelineSection({ title, eyebrow, items, renderMeta, renderDetails }) {
  return (
    <section className="border-t border-rule pt-xl">
      <div className="flex flex-wrap items-baseline justify-between gap-xs">
        <h2 className="font-display text-title font-semibold tracking-tight text-ink">
          {title}
        </h2>
        {eyebrow && (
          <span className="font-mono text-xs uppercase-tracked text-accent-light">
            {eyebrow}
          </span>
        )}
      </div>
      <ol className="mt-lg flex flex-col gap-lg">
        {items.map((item, idx) => {
          const key = `${item.role || item.degree || item.name}-${item.period || item.date || idx}`
          return (
            <li
              key={key}
              className="group relative rounded-card border border-rule bg-paper-2 p-lg transition-colors duration-200 hover:border-rule-2 hover:bg-paper-3"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-md gap-y-2xs">
                <h3 className="font-display text-lg font-semibold text-ink group-hover:text-accent-light transition-colors">
                  {item.role || item.degree || item.name}
                </h3>
                <span className="font-mono text-xs tabular-nums text-muted">
                  {item.period || item.date}
                </span>
              </div>
              <p className="mt-2xs text-sm font-medium text-ink-2">
                {renderMeta ? renderMeta(item) : item.organization || item.institution}
              </p>
              {renderDetails ? (
                renderDetails(item)
              ) : item.details?.length ? (
                <ul className="mt-sm flex flex-col gap-2xs">
                  {item.details.map((detail) => (
                    <li
                      key={detail}
                      className="text-sm leading-relaxed text-muted max-w-[65ch]"
                    >
                      • {detail}
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          )
        })}
      </ol>
    </section>
  )
}

export default function About() {
  const bioList = developerProfile?.bio || [
    'Fourth-year BS Computer Applications student at MSU-IIT majoring in Embedded Systems, with a solid academic standing of CGPA 1.67351 (Dean’s Lister).',
    'Motivated by turning raw cyber-physical concepts into working, reliable systems through disciplined testing. Across 17 authentic projects, my work spans bare-metal 8-bit AVR assembly, multi-tasking FreeRTOS telemetry, FPGA hardware-deterministic FSM logic, edge machine learning electronic nose arrays, and full-stack web platforms.',
    'Seeking a 700-hour On-the-Job Training (OJT) role in Embedded Systems, Firmware, IoT, or Software Engineering to contribute effectively to production workflows and build impactful real-world solutions.',
  ]

  // Ensure leadership is rendered in strict chronological descending order
  const sortedLeadership = [...leadership].sort((a, b) => {
    const yearA = parseInt(a.period?.match(/\d{4}/)?.[0] || '0', 10)
    const yearB = parseInt(b.period?.match(/\d{4}/)?.[0] || '0', 10)
    return yearB - yearA
  })

  return (
    <div className="shell pb-5xl pt-3xl">
      {/* Editorial Header */}
      <header className="max-w-prose">
        <div className="flex items-center gap-xs font-mono text-xs uppercase-tracked text-accent-light">
          <span className="inline-block h-2 w-2 rounded-full bg-accent animate-pulse" />
          about / the engineer behind the ledger
        </div>
        <h1 className="mt-sm font-display text-display font-semibold tracking-tight text-ink">
          I like the part where it has to work.
        </h1>
        <p className="mt-md text-lead text-ink-2 max-w-[65ch]">
          {developerProfile?.subtitle ||
            'Fourth-year BS Computer Applications student at MSU-IIT specializing in Embedded Systems, IoT architecture, and digital logic.'}
        </p>
      </header>

      {/* Main Grid: Portrait HUD (Col 1-5) and In-Depth Narrative (Col 6-12) */}
      <div className="mt-2xl grid gap-2xl lg:grid-cols-12 lg:items-start lg:gap-col">
        {/* Left Column: Portrait & Telemetry HUD */}
        <Reveal className="lg:col-span-5">
          <div className="sticky top-24 space-y-lg">
            <figure className="relative mx-auto overflow-hidden rounded-card border border-rule bg-paper-2 shadow-card transition-transform duration-300 hover:border-rule-2">
              <img
                src={developerProfile?.portrait || '/mary-grace-1x1-id-image.jpg'}
                alt="Mary Grace V. Soronio - Embedded Systems Engineer"
                width={640}
                height={640}
                className="aspect-square w-full object-cover object-top transition-transform duration-300 hover:scale-[1.02]"
              />
              {/* OJT Callout Badge Overlay */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-xs rounded-card-inner border border-rule bg-paper/90 px-sm py-xs backdrop-blur-md">
                <div className="flex items-center gap-2xs">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-mono text-xs font-medium text-ink">700h OJT Ready</span>
                </div>
                <span className="font-mono text-xs text-muted tabular-nums">1.67351 CGPA</span>
              </div>
            </figure>

            {/* Quick Telemetry Spec Sheet */}
            <div className="rounded-card border border-rule bg-paper-2 p-lg">
              <h3 className="font-mono text-xs uppercase-tracked text-accent-light">
                Engineering Telemetry
              </h3>
              <dl className="mt-md divide-y divide-rule">
                <div className="flex items-baseline justify-between gap-md py-sm">
                  <dt className="font-mono text-xs text-muted">Cumulative GPA</dt>
                  <dd className="font-mono text-sm font-semibold tabular-nums text-ink">
                    {developerProfile?.cgpa || '1.67351'}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-md py-sm">
                  <dt className="font-mono text-xs text-muted">Academic Honors</dt>
                  <dd className="text-sm font-medium text-accent-light">
                    Dean&apos;s Lister
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-md py-sm">
                  <dt className="font-mono text-xs text-muted">OJT Target</dt>
                  <dd className="font-mono text-sm font-semibold tabular-nums text-ink">
                    {developerProfile?.ojtTargetHours || 700} hours
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-md py-sm">
                  <dt className="font-mono text-xs text-muted">University</dt>
                  <dd className="text-right text-xs font-medium text-ink">
                    MSU-IIT (Iligan City)
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-md py-sm">
                  <dt className="font-mono text-xs text-muted">Undergraduate Thesis</dt>
                  <dd className="text-right text-xs font-medium text-ink-2">
                    FERMONITOR (E-Nose)
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-md py-sm">
                  <dt className="font-mono text-xs text-muted">Location</dt>
                  <dd className="text-sm text-ink">{developerProfile?.location || 'Iligan City, Philippines'}</dd>
                </div>
              </dl>

              {/* Direct Action Channels */}
              <div className="mt-lg flex flex-col gap-xs">
                <Link
                  to="/contact"
                  className="btn btn-primary w-full text-center min-tap touch-target"
                >
                  Contact for 700-Hour OJT
                </Link>
                <a
                  href={contact?.github || 'https://github.com/MaryGraceSoronio'}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline w-full text-center min-tap touch-target"
                >
                  View GitHub Repositories
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Right Column: Bio Narrative & Categorized Milestones */}
        <div className="lg:col-span-7 space-y-2xl">
          {/* Engineering Philosophy Narrative */}
          <section className="space-y-md text-md text-ink-2 leading-relaxed">
            <h2 className="font-mono text-xs uppercase-tracked text-accent-light">
              Engineering Narrative & Background
            </h2>
            {bioList.map((paragraph, index) => (
              <p
                key={`bio-${index}`}
                className="max-w-[65ch] text-pretty text-ink-2 leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </section>

          {/* Education Timeline */}
          <TimelineSection
            title="Academic Foundations"
            eyebrow="MSU-IIT & Pre-University"
            items={education}
            renderMeta={(item) => `${item.degree} — ${item.institution}`}
            renderDetails={(item) => (
              <div className="mt-sm space-y-xs">
                {item.honors && (
                  <div className="inline-flex items-center gap-xs rounded-pill border border-rule-2 bg-paper px-sm py-3xs text-xs font-mono text-accent-light">
                    <span>★</span>
                    <span>{item.honors}</span>
                    {item.cgpa && (
                      <span className="tabular-nums font-semibold text-ink">
                        (CGPA {item.cgpa})
                      </span>
                    )}
                  </div>
                )}
                {item.details?.length ? (
                  <ul className="mt-xs flex flex-col gap-2xs">
                    {item.details.map((detail) => (
                      <li
                        key={detail}
                        className="text-sm leading-relaxed text-muted max-w-[65ch]"
                      >
                        • {detail}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            )}
          />

          {/* Professional Work Experience */}
          <TimelineSection
            title="Work & Remote Experience"
            eyebrow="Pedagogy & Digital Automation"
            items={experience}
            renderMeta={(item) => `${item.organization} · ${item.location}`}
          />

          {/* University Student Leadership */}
          <TimelineSection
            title="Student Leadership & Governance"
            eyebrow="MSU-IIT College of Computer Studies"
            items={sortedLeadership}
            renderMeta={(item) => item.organization}
          />

          {/* Language Competencies */}
          <section className="border-t border-rule pt-xl">
            <div className="flex flex-wrap items-baseline justify-between gap-xs">
              <h2 className="font-display text-title font-semibold tracking-tight text-ink">
                Language Competencies
              </h2>
              <span className="font-mono text-xs uppercase-tracked text-accent-light">
                Multilingual Agility
              </span>
            </div>
            <p className="mt-xs text-sm text-muted max-w-[65ch]">
              Developed through professional ESL teaching with Japanese students and native immersion across Philippine languages.
            </p>
            <ul className="mt-md grid gap-sm sm:grid-cols-2">
              {languages.map((language) => (
                <li
                  key={language}
                  className="rounded-card border border-rule bg-paper-2 p-md transition-colors duration-200 hover:border-rule-2"
                >
                  <div className="flex items-center gap-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    <span className="text-sm font-medium text-ink">{language}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* OJT Invitation Callout Band */}
          <section className="rounded-card border border-rule-2 bg-gradient-to-br from-paper-2 to-paper-3 p-xl">
            <div className="flex items-center gap-xs font-mono text-xs uppercase-tracked text-accent-light">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Internship Partnership Opportunity
            </div>
            <h3 className="mt-sm font-display text-title font-semibold text-ink">
              Ready to deploy 700 hours of disciplined engineering.
            </h3>
            <p className="mt-xs text-sm leading-relaxed text-muted max-w-[65ch]">
              Seeking an OJT placement in embedded systems, RTOS firmware, edge machine learning, or software engineering. Available for onsite placement in Northern Mindanao or remote technical roles.
            </p>
            <div className="mt-lg flex flex-wrap items-center gap-sm">
              <Link to="/contact" className="btn btn-primary min-tap touch-target">
                Initiate OJT Inquiry
              </Link>
              <Link to="/projects" className="btn btn-outline min-tap touch-target">
                Review 17 Project Builds
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
