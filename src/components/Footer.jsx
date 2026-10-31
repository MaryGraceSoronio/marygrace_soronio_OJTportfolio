import { Link } from 'react-router-dom'
import { navLinks } from '../data/nav.js'
import { contact } from '../data/site.js'

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative z-10 border-t border-rule bg-paper-2/50 backdrop-blur-sm">
      <div className="shell py-3xl lg:py-4xl">
        <div className="grid gap-xl lg:grid-cols-12 lg:gap-col">
          {/* Column 1: Identity, Academic Background & OJT Status (5 cols) */}
          <div className="lg:col-span-5">
            <Link
              to="/"
              className="inline-block font-display text-display-s font-semibold tracking-tight text-ink hover:text-accent-light active:scale-[0.97] transition-all"
            >
              Mary Grace V. Soronio
            </Link>
            <p className="mt-sm max-w-[65ch] text-sm text-ink-2 leading-relaxed">
              Embedded systems developer at MSU-IIT. Specialized in firmware architecture,
              sensor telemetry, hardware-software co-design, and real-time processing.
            </p>

            <div className="mt-md flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="inline-flex items-center gap-1.5 rounded-pill border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="tabular-nums">700h</span> OJT Available
              </span>
              <span className="inline-flex items-center rounded-pill border border-accent/30 bg-accent-soft px-3 py-1 text-accent-light">
                CGPA <span className="tabular-nums ml-1">1.67351</span> · Dean&apos;s Lister
              </span>
            </div>

            <p className="mt-sm font-mono text-xs text-muted">
              Fourth-year BS Computer Applications · MSU-Iligan Institute of Technology
            </p>
          </div>

          {/* Column 2: Site Navigation (3 cols) */}
          <nav aria-label="Footer Navigation" className="lg:col-span-3 lg:col-start-7">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
              Navigation
            </p>
            <ul className="mt-sm flex flex-col">
              <li>
                <Link
                  to="/"
                  className="inline-flex min-h-11 items-center text-sm text-ink-2 transition-colors duration-150 hover:text-ink active:scale-[0.97]"
                >
                  Home
                </Link>
              </li>
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="inline-flex min-h-11 items-center text-sm text-ink-2 transition-colors duration-150 hover:text-ink active:scale-[0.97]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 3: Verified Channels & Direct Access (4 cols) */}
          <div className="lg:col-span-3 lg:col-start-10">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
              Verified Channels
            </p>
            <ul className="mt-sm flex flex-col">
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex min-h-11 items-center text-sm text-ink-2 transition-colors duration-150 hover:text-ink active:scale-[0.97]"
                >
                  {contact.email}
                </a>
              </li>
              <li>
                <a
                  href={contact.phoneHref}
                  className="inline-flex min-h-11 items-center text-sm text-ink-2 transition-colors duration-150 hover:text-ink tabular-nums active:scale-[0.97]"
                >
                  {contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center text-sm text-ink-2 transition-colors duration-150 hover:text-ink active:scale-[0.97]"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center text-sm text-ink-2 transition-colors duration-150 hover:text-ink active:scale-[0.97]"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Metadata & Return to Top Bar */}
        <div className="mt-2xl flex flex-col gap-sm border-t border-rule pt-md font-mono text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <p>© 2026 Mary Grace V. Soronio. Authentic Portfolio.</p>
            <span className="hidden sm:inline text-rule-2">·</span>
            <p>Iligan City, Philippines</p>
          </div>
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex min-h-11 items-center gap-1.5 self-start text-xs text-muted transition-colors duration-150 hover:text-accent-light active:scale-[0.97] sm:self-auto"
            aria-label="Scroll back to top of page"
          >
            <span>Back to top</span>
            <span aria-hidden="true">↑</span>
          </button>
        </div>
      </div>
    </footer>
  )
}
