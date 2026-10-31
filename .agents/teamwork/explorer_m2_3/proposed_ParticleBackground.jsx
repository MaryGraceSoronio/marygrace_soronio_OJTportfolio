import { useEffect, useRef } from 'react'

/**
 * ParticleBackground: 60fps GPU-accelerated HTML5 Canvas simulating
 * hardware telemetry circuit nodes with interactive mouse spring dynamics.
 *
 * Design Engineering Specifications:
 * - 60fps/120fps display refresh synchronized via requestAnimationFrame
 * - Mouse spring interaction: Hooke's law perturbation + viscous damping
 * - Hardware telemetry aesthetic: test pads, signal traces, and animated data packets
 * - Zero CPU waste: automatically halts when document.hidden (tab unfocused)
 * - Strict reduced motion: completely halts to 0fps when prefers-reduced-motion is active
 * - High-DPI Retina support: devicePixelRatio coordinate compensation
 * - Theme synchronization: dynamically coordinates with dark obsidian and light paper palettes
 * - Pointer transparency: pointer-events: none, aria-hidden="true"
 */
export default function ParticleBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Gracefully degrade if canvas 2D context cannot be acquired
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Accessibility check: halt immediately under prefers-reduced-motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motionQuery.matches) return

    let width = 0
    let height = 0
    let rafId = 0
    let isRunning = true
    let nodes = []
    let packets = []

    // Theme RGB color coordinates (Dark default: #9d4edd / #c084fc; Light: #7c3aed / #8b5cf6)
    let accentRgb = '157, 78, 221'
    let highlightRgb = '192, 132, 252'

    const syncThemeColors = () => {
      const root = document.documentElement
      const isLight = root.getAttribute('data-theme') === 'light' || root.classList.contains('light')
      if (isLight) {
        accentRgb = '124, 58, 237'     // Royal violet
        highlightRgb = '139, 92, 246'  // Bright violet highlight
      } else {
        accentRgb = '157, 78, 221'     // Electric amethyst
        highlightRgb = '192, 132, 252' // Lavender glow highlight
      }
    }

    // Pointer state
    const pointer = {
      x: -9999,
      y: -9999,
      active: false,
    }

    const initNetwork = (w, h) => {
      // Dynamic density based on viewport area (16 to 50 nodes)
      const count = Math.max(16, Math.min(50, Math.round((w * h) / 36000)))
      nodes = Array.from({ length: count }, () => {
        const isTelemetryPad = Math.random() < 0.18 // 18% of nodes are PCB telemetry pads
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          baseVx: (Math.random() - 0.5) * 0.22,
          baseVy: (Math.random() - 0.5) * 0.22,
          r: isTelemetryPad ? 2.4 : Math.random() * 1.2 + 0.8,
          isPad: isTelemetryPad,
          padRadius: isTelemetryPad ? 4.8 : 0,
        }
      })

      // Allocate telemetry signal packets (8 packets traversing active circuit lines)
      packets = Array.from({ length: 8 }, () => ({
        from: Math.floor(Math.random() * count),
        to: Math.floor(Math.random() * count),
        progress: Math.random(),
        speed: 0.012 + Math.random() * 0.018,
      }))
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight

      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      initNetwork(width, height)
      syncThemeColors()
    }

    const render = () => {
      if (!isRunning) return

      ctx.clearRect(0, 0, width, height)

      const connectionDistance = 140
      const connectionDistSq = connectionDistance * connectionDistance
      const mouseRadius = 175
      const mouseRadiusSq = mouseRadius * mouseRadius

      // 1. Update Physics & Spring Interactions
      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i]

        // Restitution towards baseline ambient drift
        p.vx += (p.baseVx - p.vx) * 0.04
        p.vy += (p.baseVy - p.vy) * 0.04

        // Mouse Spring Displacement
        if (pointer.active) {
          const dx = p.x - pointer.x
          const dy = p.y - pointer.y
          const d2 = dx * dx + dy * dy

          if (d2 < mouseRadiusSq && d2 > 1) {
            const d = Math.sqrt(d2)
            // Hooke-inspired spring perturbation force
            const springForce = ((mouseRadius - d) / mouseRadius) * 0.65
            p.vx += (dx / d) * springForce
            p.vy += (dy / d) * springForce
          }
        }

        // Viscous damping
        p.vx *= 0.95
        p.vy *= 0.95

        p.x += p.vx
        p.y += p.vy

        // Viewport wrap with safety gutter
        if (p.x < -24) p.x = width + 24
        if (p.x > width + 24) p.x = -24
        if (p.y < -24) p.y = height + 24
        if (p.y > height + 24) p.y = -24
      }

      // 2. Render Circuit Traces (Connections)
      const activePairs = []
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d2 = dx * dx + dy * dy

          if (d2 < connectionDistSq) {
            const dist = Math.sqrt(d2)
            const alpha = (1 - dist / connectionDistance) * 0.18
            ctx.strokeStyle = `rgba(${accentRgb}, ${alpha})`
            ctx.lineWidth = 0.65
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()

            if (activePairs.length < 32) {
              activePairs.push({ i, j })
            }
          }
        }
      }

      // 3. Render Telemetry Signal Data Packets
      if (activePairs.length > 0) {
        for (let k = 0; k < packets.length; k++) {
          const pkt = packets[k]
          pkt.progress += pkt.speed

          const a = nodes[pkt.from]
          const b = nodes[pkt.to]

          if (!a || !b || pkt.progress >= 1) {
            const randomPair = activePairs[Math.floor(Math.random() * activePairs.length)]
            pkt.from = randomPair.i
            pkt.to = randomPair.j
            pkt.progress = 0
            continue
          }

          // Packet position along circuit trace
          const px = a.x + (b.x - a.x) * pkt.progress
          const py = a.y + (b.y - a.y) * pkt.progress

          ctx.fillStyle = `rgba(${highlightRgb}, 0.75)`
          ctx.beginPath()
          ctx.arc(px, py, 1.4, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // 4. Render Telemetry Nodes and Test Pads
      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i]

        // Center dot
        ctx.fillStyle = `rgba(${accentRgb}, 0.45)`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()

        // Concentric ring for PCB test pads
        if (p.isPad) {
          ctx.strokeStyle = `rgba(${highlightRgb}, 0.22)`
          ctx.lineWidth = 0.75
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.padRadius, 0, Math.PI * 2)
          ctx.stroke()
        }
      }

      rafId = window.requestAnimationFrame(render)
    }

    // Event Handlers
    const onPointerMove = (e) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
      pointer.active = true
    }

    const onPointerLeave = () => {
      pointer.x = -9999
      pointer.y = -9999
      pointer.active = false
    }

    // Tab unfocus optimization: freeze animation when tab hidden to eliminate CPU usage
    const onVisibilityChange = () => {
      isRunning = !document.hidden
      if (isRunning) {
        rafId = window.requestAnimationFrame(render)
      } else {
        window.cancelAnimationFrame(rafId)
      }
    }

    // Reduced motion dynamic listener (handles on-the-fly toggling in devtools / OS)
    const onMotionPreferenceChange = (e) => {
      if (e.matches) {
        isRunning = false
        window.cancelAnimationFrame(rafId)
        ctx.clearRect(0, 0, width, height)
      } else {
        isRunning = true
        resize()
        rafId = window.requestAnimationFrame(render)
      }
    }

    // Initial setup
    resize()
    rafId = window.requestAnimationFrame(render)

    // MutationObserver for instant theme toggle reactivity
    const themeObserver = new MutationObserver(syncThemeColors)
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class'],
    })

    // Register listeners
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerleave', onPointerLeave)
    document.addEventListener('visibilitychange', onVisibilityChange)
    motionQuery.addEventListener('change', onMotionPreferenceChange)

    return () => {
      isRunning = false
      window.cancelAnimationFrame(rafId)
      themeObserver.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      motionQuery.removeEventListener('change', onMotionPreferenceChange)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="ambient-canvas"
      aria-hidden="true"
      style={{ pointerEvents: 'none' }}
    />
  )
}
