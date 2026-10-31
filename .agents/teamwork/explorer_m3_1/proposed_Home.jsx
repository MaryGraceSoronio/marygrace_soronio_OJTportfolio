import { Link } from 'react-router-dom'
import ProjectCard from '../components/ProjectCard.jsx'
import Reveal from '../components/Reveal.jsx'
import { projects } from '../data/projects.js'
import { toolchain, developerProfile, contact } from '../data/site.js'

const telemetryReadout = [
  { label: 'Candidate', value: developerProfile.name },
  { label: 'Institution', value: 'MSU-IIT (CCS)' },
  { label: 'Program', value: 'BS Computer Applications' },
  { label: 'Major', value: 'Embedded Systems' },
  { label: 'Academic Standing', value: 'CGPA 1.67351, Dean\u2019s Lister' },
  { label: 'Target OJT', value: '700 Hours (Available)' },
  { label: 'Flagship Thesis', value: 'FERMONITOR (E-Nose ML)' },
  { label: 'Target Silicon', value: 'STM32 \u00B7 ESP32 \u00B7 RPi \u00B7 FPGA' },
]

const engineeringPillars = [
  {
    step: '01',
    title: 'Physical Silicon & Sensors',
    subtitle: 'Analog front-ends to bare metal',
    description:
      'Designing precision sensor front-ends with 16-bit ADS1115 ADCs, MQ gas arrays, NDIR optical CO\u2082, and ES8388 audio codecs down to 8-bit AVR assembly routines.',
    tags: ['ADS1115 16-Bit', 'MQ Arrays', 'STM32F4', 'AVR Assembly'],
  },
  {
    step: '02',
    title: 'Real-Time Firmware & RTL',
    subtitle: 'Deterministic scheduling & logic',
    description:
      'Implementing multi-tasking FreeRTOS telemetry streams, RT-Thread IoT event queues, and deterministic finite state machine controllers synthesized in AMD Vivado VHDL.',
    tags: ['FreeRTOS', 'RT-Thread IoT', 'VHDL FSM', 'CODESYS PLC'],
  },
  {
    step: '03',
    title: 'Connected Telemetry & Web',
    subtitle: 'Store-and-forward to dashboard',
    description:
      'Bridging edge hardware to operators with local SQLite caching, store-and-forward Firebase sync for 100% integrity during network outages, and responsive web consoles.',
    tags: ['Store-and-Forward', 'SQLite Cache', 'React JS', 'Tailwind CSS'],
  },
]

function TelemetryPanel() {
  return (
    <div className="rounded-card border border-rule bg-paper-2/80 p-lg shadow-card backdrop-blur-md">
      <div className="flex items-center justify-between gap-sm border-b border-rule pb-sm">
        <div className="flex items-center gap-xs">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <p className="font-mono text-xs uppercase tracking-wider text-muted">system readout</p>
        </div>
        <span className="inline-flex items-center gap-2xs rounded-pill border border-rule bg-paper-3 px-xs py-3xs font-mono text-xs text-accent-light">
          telemetry live
        </span>
      </div>

      <dl className="mt-sm divide-y divide-rule">
        {telemetryReadout.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-md py-xs">
            <dt className="font-mono text-xs text-muted">{row.label}</dt>
            <dd className="text-right font-body text-sm font-medium tabular-nums text-ink">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-md flex items-end justify-between gap-md border-t border-rule pt-md">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-muted">documented builds</p>
          <p className="text-xs text-ink-2">Silicon, RTOS, IoT &amp; Full-Stack</p>
        </div>
        <p className="font-display text-section font-semibold tabular-nums text-accent-light">
          {projects.length}
        </p>
      </div>

      <div className="mt-md" aria-hidden="true">
        <div className="flex items-center justify-between font-mono text-[10px] text-muted">
          <span>ADC SIGNAL SPECTROGRAM</span>
          <span className="tabular-nums">16 CHANNELS</span>
        </div>
        <div className="mt-xs flex h-10 items-end gap-2xs">
          {[18, 34, 26, 48, 40, 62, 44, 70, 52, 78, 60, 86, 66, 92, 74, 100].map((height, i) => (
            <span
              key={i}
              className="signal-bar"
              style={{ height: `${height}%`, animationDelay: `${i * 90}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const featured = projects.filter((project) => project.featured).slice(0, 3)
  const [lead, ...rest] = featured

  return (
    <>
      {/* Hero Section */}
      <section className="shell pb-4xl pt-2xl lg:pt-3xl">
        <div className="grid gap-2xl lg:grid-cols-12 lg:items-start lg:gap-col">
          <div className="lg:col-span-7">
            {/* Live pulsing OJT availability beacon */}
            <div className="inline-flex items-center gap-xs rounded-pill border border-rule-2 bg-paper-2/90 px-md py-xs text-xs font-medium text-ink-2 backdrop-blur-sm">
              <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="font-mono tabular-nums uppercase tracking-wider text-accent-light">
                Available for 700-Hour OJT
              </span>
              <span className="text-muted" aria-hidden="true">·</span>
              <span className="font-mono uppercase tracking-wider text-muted">MSU-IIT 2026</span>
            </div>

            {/* Candidate identity & tagline */}
            <p className="mt-md font-mono text-xs uppercase tracking-wider text-muted">
              Mary Grace V. Soronio · Embedded Systems Engineer
            </p>
            <h1 className="mt-xs font-display text-display font-semibold tracking-tight text-ink">
              I build the device and the dashboard.
            </h1>
            <p className="mt-lg max-w-[65ch] text-lead text-ink-2">
              Fourth-year BS Computer Applications student at MSU-IIT specializing in Embedded
              Systems (CGPA 1.67351, Dean’s Lister). I engineer physical hardware devices and
              digital telemetry systems—from bare-metal AVR, FreeRTOS sensor networks, and FPGA logic
              to real-time connected dashboards.
            </p>

            {/* Tactile Call-To-Action buttons */}
            <div className="mt-xl flex flex-wrap items-center gap-sm">
              <Link to="/projects" className="btn btn-primary min-tap pressable">
                See the builds ({projects.length})
              </Link>
              <Link to="/projects/fermonitor" className="btn btn-outline min-tap pressable">
                Read the thesis
              </Link>
              <Link to="/contact" className="btn btn-outline min-tap pressable">
                Inquire for OJT
              </Link>
            </div>
          </div>

          {/* Right Column: Real-time Telemetry Readout */}
          <div className="lg:col-span-5">
            <Reveal delay={80}>
              <TelemetryPanel />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Cyber-Physical Engineering Pillars (The 3 Capabilities) */}
      <section className="border-t border-rule bg-paper-2/20">
        <div className="shell py-3xl">
          <div className="flex flex-col gap-xs">
            <p className="font-mono text-xs uppercase tracking-wider text-accent-light">
              End-to-End Capabilities
            </p>
            <h2 className="font-display text-section font-semibold tracking-tight text-ink">
              From raw sensor voltages to browser screens.
            </h2>
            <p className="max-w-[65ch] text-sm text-ink-2">
              Hardware-software co-design validated across seventeen documented builds and an active
              undergraduate thesis.
            </p>
          </div>

          <div className="mt-xl grid gap-lg md:grid-cols-3">
            {engineeringPillars.map((pillar, idx) => (
              <Reveal key={pillar.step} delay={idx * 60}>
                <div className="group flex h-full flex-col justify-between rounded-card border border-rule bg-paper-2 p-lg shadow-card transition-all duration-200 hover:border-accent/60 hover:shadow-elevated">
                  <div>
                    <div className="flex items-center justify-between border-b border-rule pb-xs">
                      <span className="font-mono text-xs tabular-nums text-accent-light">
                        {pillar.step}
                      </span>
                      <span className="font-mono text-[11px] text-muted uppercase tracking-wider">
                        Layer
                      </span>
                    </div>
                    <h3 className="mt-md font-display text-title font-semibold tracking-tight text-ink">
                      {pillar.title}
                    </h3>
                    <p className="mt-2xs font-mono text-xs text-muted">{pillar.subtitle}</p>
                    <p className="mt-sm max-w-[65ch] text-sm text-ink-2 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  <ul className="mt-md flex flex-wrap gap-2xs pt-sm border-t border-rule">
                    {pillar.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-pill border border-rule bg-paper-3 px-xs py-3xs font-mono text-[11px] text-ink-2"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Selected Featured Builds Showcase */}
      <section className="border-t border-rule bg-paper-2/30">
        <div className="shell py-4xl">
          <div className="flex flex-wrap items-end justify-between gap-md">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-accent-light">
                Flagship Work
              </p>
              <h2 className="mt-xs font-display text-section font-semibold tracking-tight text-ink">
                Selected builds
              </h2>
              <p className="mt-xs max-w-[65ch] text-sm text-ink-2">
                Three of seventeen authentic builds. The catalog spans edge ML electronic noses,
                industrial RTOS control, FPGA hardware logic, and institutional web systems.
              </p>
            </div>
            <Link
              to="/projects"
              className="inline-flex min-h-11 items-center gap-xs font-body text-sm font-medium text-ink-2 transition-colors duration-150 hover:text-accent-light"
            >
              All 17 builds <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <div className="mt-2xl grid gap-lg lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <ProjectCard project={lead} index={0} featured eager />
            </Reveal>
            <div className="grid gap-lg lg:col-span-5">
              {rest.map((project, index) => (
                <Reveal key={project.slug} delay={80 + index * 60}>
                  <ProjectCard project={project} index={index + 1} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Toolchain & Competencies Teaser */}
      <section className="border-t border-rule">
        <div className="shell py-4xl">
          <div className="flex flex-wrap items-baseline justify-between gap-sm">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-accent-light">
                Hardware &amp; Software Toolchain
              </p>
              <h2 className="mt-xs font-display text-section font-semibold tracking-tight text-ink">
                What I work with
              </h2>
            </div>
            <Link
              to="/skills"
              className="inline-flex min-h-11 items-center gap-xs font-body text-sm font-medium text-ink-2 transition-colors duration-150 hover:text-accent-light"
            >
              Full toolchain &amp; credentials <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <div className="mt-2xl grid gap-lg sm:grid-cols-2 xl:grid-cols-4">
            {toolchain.map((group) => (
              <div key={group.label} className="border-t border-rule-2 pt-md">
                <h3 className="font-mono text-xs uppercase tracking-wider text-accent-light">
                  {group.label}
                </h3>
                <ul className="mt-sm flex flex-wrap gap-2xs">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-pill border border-rule bg-paper-2 px-sm py-2xs text-xs text-ink-2 transition-colors duration-150 hover:border-rule-2 hover:text-ink"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 700-Hour OJT Callout Band */}
      <section id="ojt-callout" className="border-t border-rule bg-band">
        <div className="shell grid gap-xl py-4xl lg:grid-cols-12 lg:items-end lg:gap-col">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-xs rounded-pill border border-band-ink/20 bg-band-ink/10 px-sm py-2xs text-xs font-mono text-band-ink/90">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="tabular-nums uppercase tracking-wider">
                Open to 700-Hour OJT Placements
              </span>
            </div>
            <h2 className="mt-md font-display text-display-s font-semibold tracking-tight text-band-ink">
              Seven hundred hours, one team.
            </h2>
            <p className="mt-md max-w-[65ch] text-lead text-band-ink/85">
              I am seeking a 700-hour On-the-Job Training internship where I can take ownership of
              real engineering deliverables—whether that means sensor calibration, RTOS firmware
              routines, hardware testing, or shipping a telemetry web dashboard.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-sm lg:col-span-5 lg:justify-end">
            <Link to="/contact" className="btn btn-invert min-tap pressable">
              Inquire for OJT
            </Link>
            <a
              href={`mailto:${contact.email}`}
              className="inline-flex min-h-11 items-center font-mono text-xs tabular-nums text-band-ink/80 transition-colors duration-150 hover:text-band-ink"
            >
              {contact.email}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
