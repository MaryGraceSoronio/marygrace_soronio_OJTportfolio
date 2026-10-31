import { useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import TechMarquee from '../components/TechMarquee.jsx'
import { certifications, skills, toolchain, trainings } from '../data/site.js'

// Detailed toolchain groups mapping to developer specialties
const specializedGroups = [
  {
    key: 'embedded',
    title: 'Embedded & Microcontrollers',
    domain: 'Silicon & Architecture',
    description: 'Target silicon architectures, bare-metal registers, and low-level firmware integration.',
    items: skills.embedded,
  },
  {
    key: 'programming',
    title: 'Programming & HDLs',
    domain: 'Languages & Logic',
    description: 'System-level languages, hardware description, and structured industrial control syntax.',
    items: skills.programming,
  },
  {
    key: 'tools',
    title: 'EDA & Development Toolchains',
    domain: 'Simulation & Synthesis',
    description: 'Silicon simulation, RTOS IDEs, logic analyzers, and circuit synthesis suites.',
    items: skills.tools,
  },
  {
    key: 'ai',
    title: 'Edge AI & Computer Vision',
    domain: 'Inference & Sensors',
    description: 'Embedded ML pipelines, edge classification models, and sensor telemetry processing.',
    items: skills.ai,
  },
  {
    key: 'web',
    title: 'Web & Systems Architecture',
    domain: 'Interfaces & APIs',
    description: 'Full-stack web applications, telemetry visualization dashboards, and institutional databases.',
    items: skills.web,
  },
  {
    key: 'soft',
    title: 'Working Style & Collaboration',
    domain: 'Execution & Teamwork',
    description: 'Cross-cultural communication, technical documentation, and structured team workflows.',
    items: skills.soft,
  },
]

// Filter options for interactive filtering
const FILTER_TABS = [
  { id: 'all', label: 'All Toolchains' },
  { id: 'silicon', label: 'Silicon & Hardware' },
  { id: 'eda', label: 'EDA & Digital Logic' },
  { id: 'ai', label: 'Edge AI & Vision' },
  { id: 'web', label: 'Web & Systems' },
]

export default function Skills() {
  const [activeTab, setActiveTab] = useState('all')

  const filteredGroups = specializedGroups.filter((g) => {
    if (activeTab === 'all') return true
    if (activeTab === 'silicon') return g.key === 'embedded' || g.key === 'programming'
    if (activeTab === 'eda') return g.key === 'tools' || g.key === 'programming'
    if (activeTab === 'ai') return g.key === 'ai'
    if (activeTab === 'web') return g.key === 'web'
    return true
  })

  return (
    <div className="shell pb-5xl pt-3xl">
      {/* Editorial Header */}
      <header className="max-w-prose">
        <div className="flex items-center gap-xs font-mono text-xs uppercase-tracked text-accent-light">
          <span className="inline-block h-2 w-2 rounded-full bg-accent animate-pulse" />
          skills / cyber-physical toolchain &amp; bench
        </div>
        <h1 className="mt-sm font-display text-display font-semibold tracking-tight text-ink">
          The toolchain behind the ledger.
        </h1>
        <p className="mt-md text-lead text-ink-2 max-w-[65ch]">
          Grouped by where the work happens: the bare silicon, the firmware kernel, the FPGA synthesis suite, the edge machine learning model, and the interface.
        </p>
      </header>

      {/* Looped Toolchain & Architecture Marquee */}
      <div className="mt-2xl">
        <TechMarquee label="CONTINUOUS HARDWARE & SYSTEMS BUS" />
      </div>

      {/* Interactive Filter Pills */}
      <div className="mt-xl flex flex-wrap items-center gap-xs border-b border-rule pb-md">
        <span className="mr-xs font-mono text-xs uppercase-tracked text-muted">
          Filter View:
        </span>
        {FILTER_TABS.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              aria-pressed={isActive}
              className={`min-tap touch-target rounded-pill px-md py-xs font-mono text-xs transition-colors duration-150 ${
                isActive
                  ? 'border border-rule-2 bg-accent text-accent-ink font-semibold shadow-sm'
                  : 'border border-rule bg-paper-2 text-ink-2 hover:border-rule-2 hover:bg-paper-3'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Core Competencies Grid */}
      <div className="mt-xl grid gap-lg md:grid-cols-2 xl:grid-cols-3">
        {filteredGroups.map((group) => (
          <Reveal
            key={group.key}
            className="flex flex-col justify-between rounded-card border border-rule bg-paper-2 p-lg transition-colors duration-200 hover:border-rule-2 hover:bg-paper-3"
          >
            <div>
              <div className="flex items-center justify-between gap-xs">
                <span className="font-mono text-xs uppercase-tracked text-accent-light">
                  {group.domain}
                </span>
                <span className="font-mono text-xs text-muted tabular-nums">
                  {group.items.length} items
                </span>
              </div>
              <h2 className="mt-xs font-display text-title font-semibold text-ink">
                {group.title}
              </h2>
              <p className="mt-2xs text-xs leading-relaxed text-muted max-w-[65ch]">
                {group.description}
              </p>
            </div>
            <ul className="mt-lg flex flex-wrap gap-2xs">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-pill border border-rule bg-paper px-sm py-2xs font-mono text-xs text-ink-2 transition-colors duration-150 hover:border-accent-light hover:text-ink"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      {/* Bench Groups Architecture: 4 Pillars (Hardware, Languages, Web, EDA) */}
      <section className="mt-4xl border-t border-rule pt-2xl">
        <div className="flex flex-wrap items-baseline justify-between gap-sm">
          <div>
            <span className="font-mono text-xs uppercase-tracked text-accent-light">
              System Architecture
            </span>
            <h2 className="mt-2xs font-display text-section font-semibold tracking-tight text-ink">
              Bench Groups
            </h2>
          </div>
          <p className="font-mono text-xs text-muted">
            four layers, one cyber-physical stack
          </p>
        </div>

        <div className="mt-xl grid gap-lg sm:grid-cols-2 xl:grid-cols-4">
          {toolchain.map((group) => (
            <div
              key={group.label}
              className="rounded-card border border-rule bg-paper-2 p-lg transition-colors duration-200 hover:border-rule-2 hover:bg-paper-3"
            >
              <div className="flex items-center justify-between border-b border-rule pb-xs">
                <h3 className="font-mono text-xs font-semibold uppercase-tracked text-accent-light">
                  {group.label}
                </h3>
                <span className="font-mono text-xs text-muted tabular-nums">
                  {group.items.length}
                </span>
              </div>
              <ul className="mt-md flex flex-col gap-xs">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2xs text-sm font-medium text-ink-2"
                  >
                    <span className="h-1 w-1 rounded-full bg-accent-light" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Authentic Professional Certifications Matrix */}
      <section className="mt-4xl border-t border-rule pt-2xl">
        <div className="flex flex-wrap items-baseline justify-between gap-sm">
          <div>
            <span className="font-mono text-xs uppercase-tracked text-accent-light">
              Verifiable Credentials
            </span>
            <h2 className="mt-2xs font-display text-section font-semibold tracking-tight text-ink">
              Authentic Certifications &amp; Credentials
            </h2>
          </div>
          <p className="font-mono text-xs text-muted">
            from Sources/CERTIFICATES/
          </p>
        </div>

        <ul className="mt-xl grid gap-lg md:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert) => (
            <li
              key={cert.title}
              className="group flex flex-col justify-between rounded-card border border-rule bg-paper-2 p-lg transition-colors duration-200 hover:border-rule-2 hover:bg-paper-3"
            >
              <div>
                <div className="flex items-center justify-between gap-xs">
                  <span className="font-mono text-xs font-semibold tabular-nums text-accent-light">
                    {cert.date}
                  </span>
                  <span className="font-mono text-3xs uppercase-tracked rounded-pill border border-rule bg-paper px-xs py-3xs text-muted">
                    {cert.type ? cert.type.toUpperCase() : 'VERIFIED'}
                  </span>
                </div>
                <h3 className="mt-sm font-display text-lg font-semibold text-ink group-hover:text-accent-light transition-colors">
                  {cert.title}
                </h3>
                <p className="mt-2xs text-sm text-ink-2">
                  {cert.issuer}
                </p>
              </div>

              <div className="mt-lg border-t border-rule pt-sm">
                {cert.file ? (
                  <a
                    href={cert.file}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-tap touch-target min-h-11 items-center gap-xs font-mono text-xs font-semibold text-accent-light transition-colors duration-150 hover:text-accent"
                  >
                    <span>View Certificate Asset</span>
                    <span aria-hidden="true">&rarr;</span>
                  </a>
                ) : (
                  <div className="inline-flex min-h-11 items-center font-mono text-xs text-muted">
                    <span>Institutional Credential on File</span>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Structured Training & Seminars Ledger */}
      <section className="mt-4xl border-t border-rule pt-2xl">
        <div className="flex flex-wrap items-baseline justify-between gap-sm">
          <div>
            <span className="font-mono text-xs uppercase-tracked text-accent-light">
              Continuous Education
            </span>
            <h2 className="mt-2xs font-display text-section font-semibold tracking-tight text-ink">
              Workshops &amp; Seminars
            </h2>
          </div>
          <p className="font-mono text-xs text-muted">
            IoT, AI Readiness &amp; RTOS
          </p>
        </div>

        <ol className="mt-xl divide-y divide-rule border-y border-rule">
          {trainings.map((training) => (
            <li
              key={training.name}
              className="grid gap-2xs py-md md:grid-cols-12 md:items-baseline md:gap-col transition-colors duration-150 hover:bg-paper-2/50"
            >
              <div className="md:col-span-6">
                <h3 className="font-display text-md font-semibold text-ink">
                  {training.name}
                </h3>
                {training.location && (
                  <span className="mt-2xs block font-mono text-xs text-muted">
                    {training.location}
                  </span>
                )}
              </div>
              <p className="text-sm text-ink-2 md:col-span-4">
                {training.issuer}
              </p>
              <div className="md:col-span-2 md:text-right">
                <span className="font-mono text-xs tabular-nums text-muted">
                  {training.date}
                </span>
                {training.file && (
                  <a
                    href={training.file}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2xs block font-mono text-3xs text-accent-light hover:underline"
                  >
                    View Document
                  </a>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Bottom CTA Section */}
      <section className="mt-4xl rounded-card border border-rule-2 bg-gradient-to-br from-paper-2 to-paper-3 p-xl">
        <div className="flex items-center gap-xs font-mono text-xs uppercase-tracked text-accent-light">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          Applied Hardware-Software Co-Design
        </div>
        <h3 className="mt-sm font-display text-title font-semibold text-ink">
          Want to see these toolchains in production?
        </h3>
        <p className="mt-xs text-sm leading-relaxed text-muted max-w-[65ch]">
          Every tool, RTOS, sensor, and HDL state machine listed above is deployed across 17 documented projects—from bare-metal AVR line robotics to 16-bit electronic nose fermentation telemetry.
        </p>
        <div className="mt-lg flex flex-wrap items-center gap-sm">
          <Link to="/projects" className="btn btn-primary min-tap touch-target">
            Browse All 17 Builds
          </Link>
          <Link to="/contact" className="btn btn-outline min-tap touch-target">
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  )
}
