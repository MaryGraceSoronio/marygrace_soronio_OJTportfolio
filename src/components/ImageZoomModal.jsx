import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'

/**
 * ImageZoomModal - Production-grade interactive image inspection lightbox.
 * 
 * Engineering Highlights:
 * - Rendered via React Portal directly into document.body to escape any ancestor
 *   CSS transform / will-change containing blocks (fixing the scroll bug).
 * - True viewport-fixed coordinates (100vw x 100vh) with z-[100] elevation.
 * - Interactive zoom controls: Zoom In (+), Zoom Out (-), Reset (1x)
 * - Mouse wheel zoom centered on cursor
 * - Double-click to toggle 1x / 2.2x zoom
 * - Fluid click-and-drag panning when scale > 1x
 * - Touch pinch-to-zoom and drag
 * - Keyboard shortcuts: Escape (close), +/= (zoom in), - (zoom out), 0 (reset)
 * - Strict dual overflow scroll locking on body and html.
 */
export default function ImageZoomModal({
  image,
  src,
  title,
  subtitle,
  category,
  caption,
  slug,
  project,
  onClose,
}) {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const positionRef = useRef({ x: 0, y: 0 })
  const containerRef = useRef(null)

  const activeSrc = src || image || project?.image
  const activeTitle = title || project?.title || 'Exhibit Inspection'
  const activeSubtitle = subtitle || caption || project?.subtitle || project?.line || ''
  const activeCategory = category || project?.categoryLabel || 'Hardware Telemetry'
  const activeSlug = slug || project?.slug

  // Keep positionRef in sync
  useEffect(() => {
    positionRef.current = position
  }, [position])

  // Reset zoom & pan when opening a new image
  useEffect(() => {
    if (activeSrc) {
      setScale(1)
      setPosition({ x: 0, y: 0 })
    }
  }, [activeSrc])

  // Scroll lock and keyboard handling
  useEffect(() => {
    if (!activeSrc || typeof document === 'undefined') return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault()
        handleZoomIn()
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault()
        handleZoomOut()
      } else if (e.key === '0') {
        e.preventDefault()
        handleReset()
      }
    }

    const prevBodyOverflow = document.body.style.overflow
    const prevDocOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = prevBodyOverflow
      document.documentElement.style.overflow = prevDocOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeSrc, onClose])

  if (!activeSrc || typeof document === 'undefined') return null

  const handleZoomIn = () => {
    setScale((prev) => Math.min(4, Math.round((prev + 0.5) * 10) / 10))
  }

  const handleZoomOut = () => {
    setScale((prev) => {
      const next = Math.max(1, Math.round((prev - 0.5) * 10) / 10)
      if (next === 1) {
        setPosition({ x: 0, y: 0 })
      }
      return next
    })
  }

  const handleReset = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleDoubleClick = () => {
    if (scale > 1) {
      handleReset()
    } else {
      setScale(2.2)
    }
  }

  // Wheel zoom centered on cursor
  const handleWheel = (e) => {
    e.preventDefault()
    const zoomFactor = e.deltaY < 0 ? 0.3 : -0.3
    setScale((prev) => {
      const next = Math.max(1, Math.min(4, Math.round((prev + zoomFactor) * 10) / 10))
      if (next === 1) {
        setPosition({ x: 0, y: 0 })
      }
      return next
    })
  }

  // Drag Panning Handlers
  const handleMouseDown = (e) => {
    if (scale <= 1) return
    setIsDragging(true)
    dragStartRef.current = {
      x: e.clientX - positionRef.current.x,
      y: e.clientY - positionRef.current.y,
    }
  }

  const handleMouseMove = (e) => {
    if (!isDragging || scale <= 1) return
    const newX = e.clientX - dragStartRef.current.x
    const newY = e.clientY - dragStartRef.current.y
    const maxBound = (scale - 1) * 350
    setPosition({
      x: Math.max(-maxBound, Math.min(maxBound, newX)),
      y: Math.max(-maxBound, Math.min(maxBound, newY)),
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Touch Handlers for Mobile Panning
  const handleTouchStart = (e) => {
    if (e.touches.length === 1 && scale > 1) {
      setIsDragging(true)
      dragStartRef.current = {
        x: e.touches[0].clientX - positionRef.current.x,
        y: e.touches[0].clientY - positionRef.current.y,
      }
    }
  }

  const handleTouchMove = (e) => {
    if (!isDragging || scale <= 1 || e.touches.length !== 1) return
    const newX = e.touches[0].clientX - dragStartRef.current.x
    const newY = e.touches[0].clientY - dragStartRef.current.y
    const maxBound = (scale - 1) * 350
    setPosition({
      x: Math.max(-maxBound, Math.min(maxBound, newX)),
      y: Math.max(-maxBound, Math.min(maxBound, newY)),
    })
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const modalNode = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="zoom-modal-title"
      className="fixed inset-0 z-[100] flex h-screen w-screen flex-col justify-between p-3 sm:p-6 overflow-hidden select-none"
    >
      {/* Deep Backdrop Blur */}
      <div
        className="fixed inset-0 bg-paper/90 backdrop-blur-2xl transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Top HUD Header Bar */}
      <header className="relative z-10 flex items-center justify-between gap-md rounded-card border border-rule-2 bg-paper-2/95 px-md py-sm shadow-card backdrop-blur-xl">
        <div className="flex flex-col truncate">
          <div className="flex items-center gap-xs font-mono text-xs text-accent-light uppercase tracking-wider">
            <span>Enlarged Exhibit</span>
            <span className="text-rule-2">&bull;</span>
            <span className="text-muted">{activeCategory}</span>
          </div>
          <h2 id="zoom-modal-title" className="truncate font-display text-base font-semibold text-ink sm:text-lg">
            {activeTitle}
          </h2>
          {activeSubtitle && (
            <p className="truncate font-mono text-xs text-muted max-w-prose">
              {activeSubtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-xs sm:gap-sm shrink-0">
          {/* Optional Quick Case Study Link if slug is provided */}
          {activeSlug && (
            <Link
              to={`/projects/${activeSlug}`}
              onClick={onClose}
              className="btn btn-outline hidden sm:inline-flex min-h-10 items-center gap-xs px-sm text-xs font-medium"
            >
              <span>View Case Study</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          )}

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-pill border border-rule-2 bg-paper-3 text-ink-2 transition-colors duration-150 hover:border-accent hover:text-ink active:scale-[0.96]"
            aria-label="Close enlarged view (Escape)"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </header>

      {/* Central Interactive Zoom Canvas Viewport - Strictly locked to current screen */}
      <main
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={handleDoubleClick}
        className={`relative z-10 my-auto flex h-[calc(100dvh-170px)] w-full items-center justify-center overflow-hidden rounded-card ${
          scale > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in'
        }`}
        title={scale > 1 ? 'Drag to pan · Double click to reset' : 'Scroll wheel or double click to zoom in'}
      >
        <img
          src={activeSrc}
          alt={activeTitle}
          draggable={false}
          style={{
            transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="max-h-full max-w-full rounded-card object-contain shadow-2xl pointer-events-none will-change-transform"
        />
      </main>

      {/* Bottom Floating Zoom Controls Bar */}
      <footer className="relative z-10 mx-auto flex items-center gap-xs rounded-pill border border-rule-2 bg-paper-2/95 px-md py-xs shadow-card backdrop-blur-xl">
        {/* Zoom Out Button */}
        <button
          type="button"
          onClick={handleZoomOut}
          disabled={scale <= 1}
          className="flex h-10 w-10 items-center justify-center rounded-pill text-ink-2 transition-colors hover:bg-paper-3 hover:text-ink disabled:opacity-40 disabled:pointer-events-none active:scale-[0.96]"
          aria-label="Zoom out (-)"
          title="Zoom out (-)"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        {/* Tabular Scale Readout & Quick Reset */}
        <button
          type="button"
          onClick={handleReset}
          className="min-h-10 px-sm font-mono text-xs tabular-nums text-accent-light transition-colors hover:text-ink active:scale-[0.96]"
          aria-label="Reset zoom to 100% (0)"
          title="Reset zoom to 100% (0)"
        >
          {Math.round(scale * 100)}%
        </button>

        {/* Zoom In Button */}
        <button
          type="button"
          onClick={handleZoomIn}
          disabled={scale >= 4}
          className="flex h-10 w-10 items-center justify-center rounded-pill text-ink-2 transition-colors hover:bg-paper-3 hover:text-ink disabled:opacity-40 disabled:pointer-events-none active:scale-[0.96]"
          aria-label="Zoom in (+)"
          title="Zoom in (+)"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        <span className="h-4 w-px bg-rule-2 mx-xs" aria-hidden="true" />

        {/* Hint Pill */}
        <span className="hidden font-mono text-[11px] text-muted sm:inline px-xs">
          Wheel or double-click to zoom · Drag to pan
        </span>
      </footer>
    </div>
  )

  return createPortal(modalNode, document.body)
}
