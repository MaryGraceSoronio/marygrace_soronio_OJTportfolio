import { useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { navLinks } from '../data/nav.js'
import { contact } from '../data/site.js'
import ThemeToggle from './ThemeToggle.jsx'

export default function MobileDrawer({ open, onClose, triggerRef }) {
  const panelRef = useRef(null)
  const firstLinkRef = useRef(null)

  // Body scroll lock and accessible focus trap / escape handling
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
        triggerRef?.current?.focus()
        return
      }
      if (event.key !== 'Tab' || !panelRef.current) return

      const focusable = panelRef.current.querySelectorAll(
        'a[href], button:not([disabled]), input, textarea, select, [tabindex="0"]',
      )
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    // Focus first interactive link smoothly
    const timer = window.setTimeout(() => firstLinkRef.current?.focus(), 50)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
      window.clearTimeout(timer)
    }
  }, [open, onClose, triggerRef])

  // Dismiss on desktop breakpoint resize (>=1024px)
  useEffect(() => {
    if (!open) return
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        onClose()
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [open, onClose])

  if (!open) return null

  const handleLinkClick = () => {
    onClose()
    window.scrollTo(0, 0)
  }

  return (
    <>
      {/* Backdrop overlay (dismisses drawer on click, blocks background activation) */}
      <div
        className="fixed inset-0 top-16 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-200"
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        aria-hidden="true"
      />

      {/* Slide-down drawer panel */}
      <div
        id="mobile-navigation"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
        className="fixed inset-x-0 top-16 z-50 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-rule bg-paper/95 backdrop-blur-xl shadow-elevated lg:hidden origin-top transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <nav aria-label="Mobile Navigation" className="shell flex flex-col gap-sm py-md">
          {/* Home Link */}
          <NavLink
            ref={firstLinkRef}
            to="/"
            onClick={handleLinkClick}
            className={({ isActive }) =>
              `flex min-h-12 items-center justify-between border-b border-rule py-sm font-display text-lg font-medium transition-colors duration-150 active:scale-[0.97] ${
                isActive ? 'text-accent-light' : 'text-ink hover:text-accent-light'
              }`
            }
          >
            <span>Home</span>
            <span className="font-mono text-xs text-muted">00</span>
          </NavLink>

          {/* Core Route Links */}
          {navLinks.map((link, index) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `flex min-h-12 items-center justify-between border-b border-rule py-sm font-display text-lg font-medium transition-colors duration-150 active:scale-[0.97] ${
                  isActive ? 'text-accent-light' : 'text-ink hover:text-accent-light'
                }`
              }
            >
              <span>{link.label}</span>
              <span className="font-mono text-xs text-muted">
                {String(index + 1).padStart(2, '0')}
              </span>
            </NavLink>
          ))}

          {/* In-Drawer Theme Switcher (toggling theme does not close drawer) */}
          <div className="flex min-h-12 items-center justify-between border-b border-rule py-xs">
            <span className="text-sm font-medium text-ink-2">Theme Switcher</span>
            <ThemeToggle />
          </div>

          {/* OJT CTA Button */}
          <Link
            to="/contact"
            onClick={handleLinkClick}
            className="btn btn-primary mt-2 w-full flex items-center justify-center gap-2 active:scale-[0.97]"
          >
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Available for OJT (700h)</span>
          </Link>

          {/* Verified Contact Details & Coordinates */}
          <div className="mt-xs flex flex-col gap-1 border-t border-rule/50 pt-sm font-mono text-xs text-muted">
            <a
              href={`mailto:${contact.email}`}
              className="flex min-h-11 items-center hover:text-ink active:scale-[0.97] transition-all"
            >
              {contact.email}
            </a>
            <a
              href={contact.phoneHref}
              className="flex min-h-11 items-center hover:text-ink tabular-nums active:scale-[0.97] transition-all"
            >
              {contact.phone}
            </a>
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center hover:text-ink active:scale-[0.97] transition-all"
            >
              {contact.githubLabel || 'github.com/MaryGraceSoronio'}
            </a>
            <p className="py-1 text-[11px] text-muted/80">
              Iligan City, Philippines · MSU-IIT
            </p>
          </div>
        </nav>
      </div>
    </>
  )
}
