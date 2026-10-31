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
      className={`reveal scroll-reveal ${shown ? 'is-shown' : ''} ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </Tag>
  )
}
