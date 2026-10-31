import { useEffect, useRef } from 'react'

/**
 * ParticleBackground: High-craft 60fps GPU-accelerated HTML5 Canvas simulating
 * hardware telemetry circuit nodes with interactive mouse spring dynamics,
 * cursor spotlight torch, click shockwaves, and luminous data packet trails.
 *
 * Design Engineering Specifications:
 * - 60fps/120fps display refresh synchronized via requestAnimationFrame
 * - Interactive Cursor Spotlight: Soft radial amethyst glow tracking pointer
 * - Constellation Laser Tethers: High-energy traces connecting cursor to nearby nodes
 * - Click Shockwave Ripples: Radial impulse wave pushing nodes with spring restitution
 * - High-Velocity Telemetry Packets: 16 packets with glowing phosphor trails
 * - Clock Speed Telemetry Listener: Responds to 'particle-speed-change' custom event
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
    let ripples = []

    // Energy / Clock speed multiplier (1.0 = 80MHz default, 1.6 = 160MHz, 2.4 = 240MHz turbo)
    let speedMultiplier = 1.0

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

    // Pointer state with smooth trailing
    const pointer = {
      x: -9999,
      y: -9999,
      targetX: -9999,
      targetY: -9999,
      active: false,
    }

    const initNetwork = (w, h) => {
      // Dynamic density based on viewport area (24 to 64 nodes)
      const count = Math.max(24, Math.min(64, Math.round((w * h) / 28000)))
      nodes = Array.from({ length: count }, () => {
        const isTelemetryPad = Math.random() < 0.22 // 22% of nodes are PCB telemetry pads
        const vx = (Math.random() - 0.5) * 0.35
        const vy = (Math.random() - 0.5) * 0.35
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx,
          vy,
          baseVx: vx,
          baseVy: vy,
          r: isTelemetryPad ? 2.8 : Math.random() * 1.4 + 1.0,
          isPad: isTelemetryPad,
          padRadius: isTelemetryPad ? 5.5 : 0,
          pulse: Math.random() * Math.PI * 2,
        }
      })

      // Allocate telemetry signal packets (16 packets traversing active circuit lines)
      packets = Array.from({ length: 16 }, () => ({
        from: Math.floor(Math.random() * count),
        to: Math.floor(Math.random() * count),
        progress: Math.random(),
        speed: 0.014 + Math.random() * 0.022,
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

    const onSpeedChange = (e) => {
      if (typeof e.detail?.multiplier === 'number') {
        speedMultiplier = e.detail.multiplier
      }
    }

    const render = () => {
      if (!isRunning) return

      ctx.clearRect(0, 0, width, height)

      // Smooth pointer coordinate lerp
      if (pointer.active) {
        pointer.x += (pointer.targetX - pointer.x) * 0.2
        pointer.y += (pointer.targetY - pointer.y) * 0.2
      }

      // 1. Render Interactive Cursor Spotlight Glow
      if (pointer.active && pointer.x > 0 && pointer.y > 0) {
        const spotlightRadius = 240
        const glow = ctx.createRadialGradient(
          pointer.x,
          pointer.y,
          0,
          pointer.x,
          pointer.y,
          spotlightRadius
        )
        glow.addColorStop(0, `rgba(${accentRgb}, 0.16)`)
        glow.addColorStop(0.4, `rgba(${accentRgb}, 0.05)`)
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)')

        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(pointer.x, pointer.y, spotlightRadius, 0, Math.PI * 2)
        ctx.fill()
      }

      // 2. Render & Update Click Shockwave Ripples
      for (let r = ripples.length - 1; r >= 0; r--) {
        const rip = ripples[r]
        rip.radius += rip.speed
        rip.alpha *= 0.94

        if (rip.alpha < 0.01 || rip.radius > rip.maxRadius) {
          ripples.splice(r, 1)
          continue
        }

        ctx.strokeStyle = `rgba(${highlightRgb}, ${rip.alpha})`
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2)
        ctx.stroke()

        // Ripple impulse force on nodes
        for (let i = 0; i < nodes.length; i++) {
          const p = nodes[i]
          const dx = p.x - rip.x
          const dy = p.y - rip.y
          const d = Math.sqrt(dx * dx + dy * dy)
          const diff = Math.abs(d - rip.radius)
          if (diff < 30 && d > 1) {
            const push = (1 - diff / 30) * 1.4 * rip.alpha
            p.vx += (dx / d) * push
            p.vy += (dy / d) * push
          }
        }
      }

      const connectionDistance = 155
      const connectionDistSq = connectionDistance * connectionDistance
      const mouseRadius = 190
      const mouseRadiusSq = mouseRadius * mouseRadius

      // 3. Update Physics & Spring Interactions
      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i]
        p.pulse += 0.035

        // Restitution towards baseline ambient drift multiplied by speedMultiplier
        p.vx += (p.baseVx * speedMultiplier - p.vx) * 0.05
        p.vy += (p.baseVy * speedMultiplier - p.vy) * 0.05

        // Mouse Spring Displacement (repulsion + orbit)
        if (pointer.active) {
          const dx = p.x - pointer.x
          const dy = p.y - pointer.y
          const d2 = dx * dx + dy * dy

          if (d2 < mouseRadiusSq && d2 > 1) {
            const d = Math.sqrt(d2)
            const springForce = ((mouseRadius - d) / mouseRadius) * 0.75
            p.vx += (dx / d) * springForce
            p.vy += (dy / d) * springForce
          }
        }

        // Viscous damping
        p.vx *= 0.94
        p.vy *= 0.94

        p.x += p.vx
        p.y += p.vy

        // Viewport wrap with safety gutter
        if (p.x < -24) p.x = width + 24
        if (p.x > width + 24) p.x = -24
        if (p.y < -24) p.y = height + 24
        if (p.y > height + 24) p.y = -24
      }

      // 4. Render Circuit Traces (Connections between nodes)
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
            // Enhanced alpha for crisp visibility
            const alpha = (1 - dist / connectionDistance) * 0.28
            ctx.strokeStyle = `rgba(${accentRgb}, ${alpha})`
            ctx.lineWidth = 0.75
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()

            if (activePairs.length < 48) {
              activePairs.push({ i, j })
            }
          }
        }
      }

      // 5. Render Constellation Laser Tethers to Cursor
      if (pointer.active && pointer.x > 0 && pointer.y > 0) {
        const tetherDist = 175
        const tetherDistSq = tetherDist * tetherDist
        for (let i = 0; i < nodes.length; i++) {
          const p = nodes[i]
          const dx = p.x - pointer.x
          const dy = p.y - pointer.y
          const d2 = dx * dx + dy * dy
          if (d2 < tetherDistSq) {
            const dist = Math.sqrt(d2)
            const alpha = (1 - dist / tetherDist) * 0.38
            ctx.strokeStyle = `rgba(${highlightRgb}, ${alpha})`
            ctx.lineWidth = 1.0
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(pointer.x, pointer.y)
            ctx.stroke()
          }
        }
      }

      // 6. Render Telemetry Signal Data Packets with Phosphor Trails
      if (activePairs.length > 0) {
        for (let k = 0; k < packets.length; k++) {
          const pkt = packets[k]
          pkt.progress += pkt.speed * speedMultiplier

          const a = nodes[pkt.from]
          const b = nodes[pkt.to]

          if (!a || !b || pkt.progress >= 1) {
            const randomPair = activePairs[Math.floor(Math.random() * activePairs.length)]
            pkt.from = randomPair.i
            pkt.to = randomPair.j
            pkt.progress = 0
            continue
          }

          const px = a.x + (b.x - a.x) * pkt.progress
          const py = a.y + (b.y - a.y) * pkt.progress

          // Trail segment
          const trailLength = 0.12
          const tailProgress = Math.max(0, pkt.progress - trailLength)
          const tx = a.x + (b.x - a.x) * tailProgress
          const ty = a.y + (b.y - a.y) * tailProgress

          const packetGrad = ctx.createLinearGradient(tx, ty, px, py)
          packetGrad.addColorStop(0, `rgba(${highlightRgb}, 0)`)
          packetGrad.addColorStop(1, `rgba(${highlightRgb}, 0.85)`)

          ctx.strokeStyle = packetGrad
          ctx.lineWidth = 1.8
          ctx.beginPath()
          ctx.moveTo(tx, ty)
          ctx.lineTo(px, py)
          ctx.stroke()

          // Packet head glow
          ctx.fillStyle = `rgba(${highlightRgb}, 0.95)`
          ctx.beginPath()
          ctx.arc(px, py, 1.8, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // 7. Render Telemetry Nodes and Concentric Test Pads
      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i]
        const pulseEffect = Math.sin(p.pulse) * 0.3 + 1.0

        // Center dot
        ctx.fillStyle = `rgba(${accentRgb}, ${p.isPad ? 0.85 : 0.6})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * (p.isPad ? 1.0 : pulseEffect), 0, Math.PI * 2)
        ctx.fill()

        // Concentric ring for PCB test pads
        if (p.isPad) {
          ctx.strokeStyle = `rgba(${highlightRgb}, ${0.35 + Math.sin(p.pulse) * 0.15})`
          ctx.lineWidth = 0.85
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.padRadius * pulseEffect, 0, Math.PI * 2)
          ctx.stroke()
        }
      }

      rafId = window.requestAnimationFrame(render)
    }

    // Event Handlers
    const onPointerMove = (e) => {
      pointer.targetX = e.clientX
      pointer.targetY = e.clientY
      if (!pointer.active) {
        pointer.x = e.clientX
        pointer.y = e.clientY
      }
      pointer.active = true
    }

    const onPointerLeave = () => {
      pointer.targetX = -9999
      pointer.targetY = -9999
      pointer.active = false
    }

    const onPointerDown = (e) => {
      // Trigger interactive shockwave ripple
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 8,
        maxRadius: Math.min(width, height) * 0.45,
        alpha: 0.7,
        speed: 6.5,
      })
    }

    const onVisibilityChange = () => {
      isRunning = !document.hidden
      if (isRunning) {
        rafId = window.requestAnimationFrame(render)
      } else {
        window.cancelAnimationFrame(rafId)
      }
    }

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

    resize()
    rafId = window.requestAnimationFrame(render)

    const themeObserver = new MutationObserver(syncThemeColors)
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class'],
    })

    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('particle-speed-change', onSpeedChange)
    document.addEventListener('visibilitychange', onVisibilityChange)
    motionQuery.addEventListener('change', onMotionPreferenceChange)

    return () => {
      isRunning = false
      window.cancelAnimationFrame(rafId)
      themeObserver.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('particle-speed-change', onSpeedChange)
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
