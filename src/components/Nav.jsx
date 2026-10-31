import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle.jsx'
import MobileDrawer from './MobileDrawer.jsx'
import { navLinks } from '../data/nav.js'
import { contact } from '../data/site.js'

/**
 * Primary Navigation Header
 * Core sections: /projects (work), /about, /skills, /contact
 */
export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const triggerRef = useRef(null)
  const { pathname } = useLocation()

  // Close drawer upon route navigation
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Scroll detection and progress calculation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      if (maxScroll > 0) {
        setScrollProgress(Math.min(1, Math.max(0, window.scrollY / maxScroll)))
      } else {
        setScrollProgress(0)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])

  // Auto-close mobile drawer on desktop resize breakpoint (>=1024px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <header
      className={`sticky top-0 inset-x-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'border-b border-rule bg-paper/85 backdrop-blur-xl shadow-card'
          : 'border-b border-transparent bg-paper/60 backdrop-blur-md'
      }`}
    >
      <div className="shell flex h-16 items-center justify-between gap-md lg:h-20">
        {/* Monogram & Identity */}
        <Link
          to="/"
          className="group flex min-h-11 items-center gap-3 whitespace-nowrap active:scale-[0.97] transition-transform duration-100"
          aria-label="Mary Grace V. Soronio, Home"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-accent/40 bg-accent-soft text-accent font-mono text-xs font-bold shadow-sm transition-colors duration-150 group-hover:border-accent group-hover:bg-accent-soft-hover">
            MG
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-display text-sm font-semibold tracking-tight text-ink transition-colors duration-150 group-hover:text-accent-light lg:text-base">
              Mary Grace V. Soronio
            </span>
            <span className="hidden font-mono text-[11px] text-muted sm:block">
              Embedded Systems · MSU-IIT
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links (No underlines per Emil Kowalski rules) */}
        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `inline-flex min-h-11 items-center rounded-pill px-md text-sm font-medium transition-colors duration-150 active:scale-[0.97] ${
                  isActive
                    ? 'bg-accent-soft text-accent-light shadow-sm'
                    : 'text-ink-2 hover:bg-paper-3 hover:text-ink'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* OJT Availability CTA Button */}
          <Link
            to="/contact"
            className="btn btn-primary hidden sm:inline-flex items-center gap-2 active:scale-[0.97]"
            title="Available for 700-Hour OJT Internship"
          >
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Available for OJT</span>
          </Link>

          {/* Mobile Hamburger Trigger */}
          <button
            ref={triggerRef}
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-pill border border-rule-2 px-3 text-sm font-medium text-ink-2 transition-colors duration-150 hover:border-accent hover:text-ink active:scale-[0.97] lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? 'Close mobile menu' : 'Open mobile menu'}
            onClick={() => setOpen((prev) => !prev)}
          >
            <span className="sr-only">{open ? 'Close' : 'Menu'}</span>
            {open ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Scroll Telemetry Progress Bar */}
      <div
        className="scroll-progress-bar"
        style={{ transform: `scaleX(${scrollProgress})` }}
        aria-hidden="true"
      />

      {/* Mobile Navigation Drawer with focus return to triggerRef */}
      <MobileDrawer open={open} onClose={() => setOpen(false)} triggerRef={triggerRef} />
    </header>
  )
}