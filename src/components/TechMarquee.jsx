/**
 * TechMarquee: Continuous, hardware-accelerated infinite looping marquee
 * showcasing verified Silicon architectures, firmware RTOS, and software toolchains.
 *
 * Engineering Features:
 * - Double-track seamless CSS animation (GPU composited transform: translate3d)
 * - Pause on hover for interactive recruiter inspection
 * - Vector SVG badges with domain-specific color accents
 * - Gradient mask feathering at viewport edges
 * - Accessible with prefers-reduced-motion fallback
 */

const technologies = [
  {
    name: 'STM32',
    category: 'ARM Cortex-M',
    color: '#03234b',
    accent: '#38bdf8',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" />
        <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
      </svg>
    ),
  },
  {
    name: 'ESP32',
    category: 'Wi-Fi & BLE SoC',
    color: '#e7352c',
    accent: '#f87171',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12" />
        <path d="M12 6a6 6 0 0 1 6 6c0 3.314-2.686 6-6 6" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: 'FreeRTOS',
    category: 'Real-Time Kernel',
    color: '#16a34a',
    accent: '#4ade80',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 6h16M4 12h16M4 18h10" />
        <circle cx="19" cy="18" r="2" />
      </svg>
    ),
  },
  {
    name: 'C / C++',
    category: 'Systems & Bare Metal',
    color: '#00599c',
    accent: '#60a5fa',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 8a5 5 0 1 0 0 8M19 10v4M17 12h4M22 10v4M20 12h4" />
      </svg>
    ),
  },
  {
    name: 'Python',
    category: 'ML & Automation',
    color: '#3776ab',
    accent: '#facc15',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2c4 0 4 2 4 2v3H9V6s0-2 3-2zM8 8h8v3H8zM12 22c-4 0-4-2-4-2v-3h7v1s0 2-3 2z" />
        <circle cx="10" cy="5" r="1" fill="currentColor" />
        <circle cx="14" cy="19" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: 'AMD Vivado',
    category: 'FPGA & VHDL',
    color: '#ed1c24',
    accent: '#fb7185',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
  {
    name: 'React JS',
    category: 'Web Frontends',
    color: '#61dafb',
    accent: '#38bdf8',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(30 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(90 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(150 12 12)" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: 'TypeScript',
    category: 'Typed Systems',
    color: '#3178c6',
    accent: '#93c5fd',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M7 8h6M10 8v8M15 11c1-1 3-1 3 1s-2 2-2 3 2 1 2 1" />
      </svg>
    ),
  },
  {
    name: 'Tailwind CSS',
    category: 'Design Systems',
    color: '#38bdf8',
    accent: '#67e8f9',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 12c2-4 5-4 7 0s5 4 7 0M2 16c2-4 5-4 7 0s5 4 7 0" />
      </svg>
    ),
  },
  {
    name: 'Raspberry Pi',
    category: 'Linux Edge Telemetry',
    color: '#c51a4a',
    accent: '#f43f5e',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="14" r="6" />
        <circle cx="9" cy="8" r="2" />
        <circle cx="15" cy="8" r="2" />
        <path d="M12 4v4" />
      </svg>
    ),
  },
  {
    name: 'RT-Thread',
    category: 'IoT Microkernel',
    color: '#0284c7',
    accent: '#38bdf8',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2v20M2 12h20" />
        <circle cx="12" cy="12" r="7" />
      </svg>
    ),
  },
  {
    name: 'CODESYS',
    category: 'PLC & Automation',
    color: '#ea580c',
    accent: '#fb923c',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M7 12h10M7 8h4M7 16h6" />
      </svg>
    ),
  },
  {
    name: 'Laravel & PHP',
    category: 'Backend & APIs',
    color: '#ff2d20',
    accent: '#f87171',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 21 7 21 17 12 22 3 17 3 7 12 2" />
        <polyline points="12 22 12 12 21 7" />
        <line x1="3" y1="7" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    name: 'Git & GitHub',
    category: 'Version Control',
    color: '#f05032',
    accent: '#fb923c',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="6" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="9" r="3" />
        <path d="M6 9v6M9 6h4a3 3 0 0 1 3 3v0" />
      </svg>
    ),
  },
  {
    name: 'Edge Impulse',
    category: 'TinyML & E-Nose',
    color: '#00d084',
    accent: '#34d399',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 14l4-8 4 12 4-6 4 2" />
      </svg>
    ),
  },
]

function BadgeList() {
  return (
    <>
      {technologies.map((tech) => (
        <div
          key={tech.name}
          className="group/item inline-flex items-center gap-xs rounded-pill border border-rule bg-paper-2/90 px-md py-xs text-xs shadow-card backdrop-blur-md transition-all duration-150 hover:border-accent hover:bg-paper-3 hover:shadow-elevated active:scale-[0.96]"
        >
          <span
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-transform duration-150 group-hover/item:scale-110"
            style={{ color: tech.accent }}
          >
            {tech.icon}
          </span>
          <span className="font-display font-semibold tracking-tight text-ink">
            {tech.name}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
            {tech.category}
          </span>
        </div>
      ))}
    </>
  )
}

export default function TechMarquee({ label = 'VERIFIED TOOLCHAIN & SILICON ARCHITECTURES' }) {
  return (
    <section className="relative overflow-hidden border-y border-rule bg-paper-2/40 py-md">
      {label && (
        <div className="shell mb-sm flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
            {label}
          </p>
          <span className="font-mono text-[10px] text-accent-light">
            Continuous Bus · 15 Stacks
          </span>
        </div>
      )}

      {/* Infinite Scrolling Track with Edge Gradient Masks */}
      <div className="pause-on-hover mask-gradient-x overflow-hidden">
        <div className="animate-marquee flex items-center gap-sm pr-sm">
          <BadgeList />
          <BadgeList />
        </div>
      </div>
    </section>
  )
}
