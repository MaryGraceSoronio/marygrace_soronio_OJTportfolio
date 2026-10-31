import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function NotFound() {
  const location = useLocation()

  useEffect(() => {
    document.title = '404 · Page Not Found · Mary Grace V. Soronio'
  }, [])

  const recoveryLinks = [
    { to: '/', label: 'Home', desc: 'Introduction, OJT target & telemetry' },
    { to: '/projects', label: 'Projects Showcase', desc: '17 authentic hardware & firmware builds' },
    { to: '/about', label: 'About & Thesis', desc: 'MSU-IIT academic background & leadership' },
    { to: '/skills', label: 'Skills & Toolchain', desc: 'Hardware, firmware, EDA & software matrix' },
    { to: '/contact', label: 'Contact & Channels', desc: 'Direct email, phone & verified GitHub' },
  ]

  return (
    <section
      aria-labelledby="not-found-heading"
      className="shell flex min-h-[75dvh] flex-col items-center justify-center py-4xl text-center"
    >
      {/* Cyber-Physical Telemetry Chip */}
      <div className="inline-flex items-center gap-xs rounded-pill border border-rule bg-paper-3 px-sm py-2xs font-mono text-xs text-accent-light shadow-sm">
        <span
          className="h-2 w-2 rounded-full bg-accent-light animate-pulse"
          aria-hidden="true"
        />
        <span className="tabular-nums uppercase tracking-wider font-semibold">
          0x0404 · HARDWARE INTERRUPT: UNMAPPED_VECTOR
        </span>
      </div>

      {/* Main Heading */}
      <h1
        id="not-found-heading"
        className="mt-md font-display text-display-s sm:text-display font-semibold tracking-tight text-ink"
      >
        Signal Lost on Address Bus
      </h1>

      {/* Diagnostic & Recovery Copy */}
      <p className="mt-sm max-w-[65ch] text-lead text-ink-2">
        The requested address{' '}
        <code className="rounded border border-rule bg-paper-2 px-1.5 py-0.5 font-mono text-xs text-accent-light break-all">
          {location.pathname}
        </code>{' '}
        is not wired to any register or portfolio view. The seventeen authentic engineering builds
        and developer credentials remain intact.
      </p>

      {/* Primary Recovery Action Buttons */}
      <div className="mt-xl flex flex-wrap items-center justify-center gap-sm">
        <Link to="/" className="btn btn-primary min-tap">
          <span>Return Home</span>
        </Link>
        <Link to="/projects" className="btn btn-outline min-tap">
          <span>Explore 17 Builds</span>
        </Link>
      </div>

      {/* Structured Recovery Matrix */}
      <div className="mt-3xl w-full max-w-2xl text-left">
        <div className="flex items-center justify-between border-b border-rule pb-xs">
          <p className="font-mono text-xs uppercase tracking-wider text-muted font-medium">
            Active Routing Vectors
          </p>
          <span className="font-mono text-xs text-accent-light tabular-nums">05 Endpoints</span>
        </div>

        <ul className="mt-sm grid gap-xs sm:grid-cols-2">
          {recoveryLinks.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className="group flex flex-col justify-center rounded-card-sm border border-rule bg-paper-2/70 p-sm transition-all duration-150 hover:border-accent hover:bg-paper-3 min-h-[44px]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm font-semibold text-ink group-hover:text-accent-light transition-colors">
                    {item.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className="font-mono text-xs text-muted group-hover:text-accent-light transition-colors"
                  >
                    →
                  </span>
                </div>
                <span className="mt-2xs font-mono text-xs text-muted">
                  {item.desc}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
