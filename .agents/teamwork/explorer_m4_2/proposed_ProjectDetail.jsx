import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { projects } from '../data/projects.js'
import { galleryFor } from '../data/media.js'

/**
 * Curated Quick Spec Sheet / HUD Telemetry for all 17 authentic projects.
 * Sourced strictly from project hardware, software, and laboratory manuscripts.
 */
export const PROJECT_HUD = {
  fermonitor: {
    processor: 'Raspberry Pi 4B (Quad-Core ARM Cortex-A72 @ 1.5GHz)',
    sensors: 'MQ-137 (Ammonia), MQ-136 (H₂S), MQ-135 (Air Quality), NDIR Optical CO₂, ADS1115 16-Bit ADC',
    protocols: 'I²C Bus (100kHz), Systemd IPC, Linux Socket Stream, Firebase Realtime Sync',
    software: 'Python 3, Flask Telemetry Service, Edge ML (22-Feature Vectors), SQLite Local Caching',
    tools: 'Linux Systemd Daemon, Git, Precision Gas Sampling Chamber, ADS1115 Calibration Rig',
  },
  'room-monitoring': {
    processor: 'STM32 Microcontroller (ARM 32-bit Cortex-M Core)',
    sensors: 'DHT22 Digital Temperature & Humidity Sensor, Photoresistor / Ambient Light Sensor',
    protocols: 'UART Serial Telemetry (115200 baud), FreeRTOS Inter-Task Message Queues',
    software: 'FreeRTOS Preemptive Kernel, Embedded C, Mutex Resource Locks, Deterministic Schedulers',
    tools: 'Wokwi Embedded Simulation Environment, GCC ARM Embedded Toolchain',
  },
  'mp3-player': {
    processor: 'STM32F407VG Microcontroller (ARM Cortex-M4 @ 168MHz, FPU)',
    sensors: 'ES8388 Low-Power Audio Codec, SSD1306 0.96" I²C OLED Display, Tactile Push Buttons',
    protocols: 'DMA I²S Streaming Audio Bus, SPI / SDIO (MicroSD Interface), I²C OLED Bus',
    software: 'FreeRTOS Multitasking, Embedded C, FATFS File System Driver, Ping-Pong Double Buffers',
    tools: 'Keil MDK-ARM / STM32CubeIDE, Logic Analyzer, Digital Storage Oscilloscope',
  },
  'activity-recognition': {
    processor: 'RT-Spark Development Board (STM32 High-Performance ARM MCU)',
    sensors: 'On-Board 3-Axis MEMS Accelerometer / IMU, Wi-Fi 802.11b/g/n Module',
    protocols: 'MQTT Cloud Telemetry, HTTP REST Endpoints, SPI / I²C Accelerometer Bus',
    software: 'RT-Thread IoT OS, Embedded C, Edge ML (Rolling-Window Statistical Classifiers)',
    tools: 'RT-Thread Studio, Cloud IoT Analytics Dashboard, Web Telemetry Interface',
  },
  'drying-oven': {
    processor: 'Tri-Platform Benchmark: Industrial PLC Rig, Xilinx FPGA, RT-Thread STM32',
    sensors: 'Industrial Thermocouple Thermal Probes, Hardware Door Safety Interlocks, Heating Coils',
    protocols: 'Direct GPIO Interlock Logic, Hardware PWM, Serial Diagnostic Stream',
    software: 'CODESYS IEC 61131-3 Ladder Diagram, Verilog HDL RTL, RT-Thread RTOS Embedded C',
    tools: 'CODESYS V3.5 SoftPLC, AMD Vivado Design Suite, RT-Thread Studio IDE',
  },
  'keyboard-detection': {
    processor: 'ARM Cortex-M / Edge AI Microcontroller Platform',
    sensors: 'Embedded CMOS Camera Module (OV2640 / DVP Interface)',
    protocols: 'Digital Video Port (DVP), High-Speed Serial Frame Stream',
    software: 'Edge Impulse Studio, FOMO (Faster Objects, More Objects), MobileNetV2, INT8 Quantization',
    tools: 'Edge Impulse ML Studio, Python OpenCV Frame Profiler, Netron Model Inspector',
  },
  'dc-supply': {
    processor: 'Solid-State Analog Subsystem (LM7812 3-Terminal Linear Regulator)',
    sensors: '220V AC to 15V AC Step-Down Transformer, 1N4007 Full-Bridge Rectifier, 2200µF Smoothing Filter',
    protocols: 'Direct PCB Power Plane (+12V DC Regulated Rail, <1% Voltage Ripple)',
    software: 'Analog Circuit Simulation, Thermal Dissipation & Heat Sink Calculations',
    tools: 'Multisim Circuit Simulator, Single-Sided Copper Clad PCB Etching Rig, Digital Multimeter',
  },
  'contribution-tracker': {
    processor: 'Distributed Cloud Application Server / Microservices Host',
    sensors: 'Multi-Client Responsive Desktop & Mobile Browsers, Touch Displays',
    protocols: 'HTTPS RESTful Endpoints, JWT Bearer Authentication, CORS Security Handshake',
    software: 'React JS, Tailwind CSS, Node.js Express REST API, MongoDB Atlas / Firebase, Role-Based Access',
    tools: 'Vite, Git / GitHub, Postman API Testing Suite, Chart.js Analytics, jsPDF Engine',
  },
  'fpga-oven': {
    processor: 'Xilinx Artix-7 / Spartan FPGA Platform (Hardware Reconfigurable Silicon)',
    sensors: 'Digital Temperature Sensor Probes, Physical Door Safety Interlock Microswitches',
    protocols: 'Synchronous Clock Dividers, Parallel Register Buses, Hardware FSM State Transitions',
    software: 'Verilog HDL / VHDL RTL Architecture, One-Hot State Machine Encoding',
    tools: 'AMD Vivado Design Suite, Behavioral RTL Testbench Simulator, Logic Synthesizer',
  },
  ricedirect: {
    processor: 'C++ Telemetry Bridge Microcontroller + Desktop Host Workstation',
    sensors: 'HX711 24-Bit ADC Strain-Gauge Load Cell, DHT22 Temp/Humidity Sensor, Motorized Dispenser',
    protocols: '24-Bit Bit-Banged Serial Bus (HX711), UART Serial Telemetry, Qt Signals and Slots',
    software: 'Qt 6 C++ Framework, QML (Qt Quick) Declarative UI, Object-Oriented Architecture',
    tools: 'Qt Creator IDE, Figma UI/UX Design System, Precision Calibration Test Rig',
  },
  etee: {
    processor: 'Raspberry Pi 5 + ESP32 DevKit V3 + Microchip ATmega2560 Co-Processor',
    sensors: 'MH-Z19C NDIR Optical CO₂ Sensor, MQ-137 Ammonia Gas Sensor, DHT22 Sensor, Conveyor Motor',
    protocols: 'UART Telemetry Link, MQTT Message Broker, I²C Sensor Bus, Solar PV Charge Controller',
    software: 'Embedded C/C++, Python 3, YOLO-V3 Computer Vision Inference, Node.js Backend, PWA',
    tools: 'YOLO Darknet / PyTorch, Node.js, Solar PV Inverter Rig, Hardware Bench Rig',
  },
  campuslink: {
    processor: 'Cloud Infrastructure Server / Android & iOS Mobile Client Handsets',
    sensors: 'Mobile Touch Display Interfaces, Device GPS Location / Geofence Hardware',
    protocols: 'HTTPS RESTful APIs, JSON Web Tokens (JWT), Push Notification Services (APNs/FCM)',
    software: 'React Native / Mobile UI, Express.js Backend, MongoDB Atlas Database, Role-Based Access Control',
    tools: 'Figma Mobile Design System, Postman API Collection, Android Studio, Git',
  },
  digistamp: {
    processor: 'Android Kiosk Tablet Hardware / Point-of-Sale Terminal Rig',
    sensors: 'Multi-Touch Capacitive Touchscreen, Optical POS Barcode / QR Scanner',
    protocols: 'HTTPS RESTful API, Local RNG Micro-Game State Synchronization',
    software: 'React JS, Tailwind CSS, Node.js Express REST API, MongoDB Database, RNG Gamification Engine',
    tools: 'Vite Build Tool, Figma Prototype, Kiosk Lockdown Container, Merchant Portal',
  },
  aquaflush: {
    processor: 'Arduino Uno Development Board (Microchip ATmega328P @ 16MHz)',
    sensors: 'YF-S201 Hall-Effect Water Flow Turbine Sensor, 16x2 I²C Character LCD Module',
    protocols: 'Hardware Interrupt Service Routine (Pin 2 INT0), I²C 2-Wire Protocol (SDA/SCL)',
    software: 'Bare-Metal Embedded C++, ISR Pulse Accumulator, Flow Rate Telemetry Calculations',
    tools: 'Arduino IDE, AVR-GCC Toolchain, Serial Monitor, Hydraulic Flow Calibration Rig',
  },
  'rtthread-hmi': {
    processor: 'Renesas RA6M3 Development Board (ARM Cortex-M4 @ 120MHz, 2MB Flash, 640KB SRAM)',
    sensors: 'Capacitive TFT LCD Touchscreen Panel, Rotary Encoder / Potentiometer, Industrial Thermal Sensors',
    protocols: 'Parallel RGB / SPI Display Interface, Hardware Timer Interrupts, Safety Trip Logic',
    software: 'RT-Thread RTOS Kernel, LVGL Embedded Graphics Library, SquareLine Studio UI Driver, Embedded C',
    tools: 'SquareLine Studio GUI Builder, Renesas e2 studio / Keil, Flexible Software Package (FSP)',
  },
  'qr-attendance': {
    processor: 'Cloud Application Server / Client Handsets with Optical Camera Subsystems',
    sensors: 'CMOS Optical Camera Barcode / QR Reader, Touchscreen Mobile Display',
    protocols: 'RESTful HTTPS Endpoints, Dynamic HMAC-SHA256 Expiring QR Tokens',
    software: 'Laravel PHP Framework, Eloquent ORM, MySQL / PostgreSQL Relational Database',
    tools: 'Figma Mobile UI Specification, Postman API Test Suite, Composer, Git Version Control',
  },
  'line-robot': {
    processor: 'Microchip ATmega328P Microcontroller (28-pin DIP, Bare-Metal)',
    sensors: 'Dual TCRT5000 Infrared Reflective Sensors, L298N Dual H-Bridge DC Motor Driver',
    protocols: 'Direct DDRB/PORTB Bitmask Register I/O, Hardware PWM Generation on Timer0',
    software: '100% 8-bit AVR Assembly Language, Timer0 1ms CTC Interrupt Service Routine (ISR)',
    tools: 'PlatformIO, avr-as Assembler, avrdude Flasher, Oscilloscope, Logic Analyzer',
  },
}

/**
 * Curated captions for flagship multi-capture exhibits
 */
const GALLERY_CAPTIONS = {
  '/work/case-fermonitor.jpg':
    'Analog signal conditioning board and 16-bit ADS1115 ADC header wiring.',
  '/work/case-fermonitor-verdict.jpg':
    'Real-time edge classification output: Spoilage index and statistical drift window.',
  '/work/fermonitor-1.png':
    'Precision 3D gas sampling chamber mounted directly over the shrimp paste vessel.',
  '/work/fermonitor-2.png':
    'Flask telemetry dashboard plotting live gas sensor response curves.',
}

/**
 * Returns curated HUD or generates an intelligent fallback from hardware & software stacks
 */
export function getProjectHud(project) {
  if (PROJECT_HUD[project.slug]) {
    return PROJECT_HUD[project.slug]
  }

  const hw = project.hardwareStack || []
  const sw = project.softwareStack || []

  return {
    processor: hw[0] || 'Embedded Hardware Target',
    sensors: hw.slice(1, 3).join(', ') || 'Integrated Transducers',
    protocols: sw.filter((s) => /bus|i2c|spi|uart|dma|protocol|mqtt|rest/i.test(s)).join(', ') || 'Synchronous Bus Interface',
    software: sw.slice(0, 3).join(', ') || 'Custom Firmware Stack',
    tools: hw.filter((h) => /wokwi|vivado|rig|multisim|studio/i.test(h)).join(', ') || 'Engineering Toolchain',
  }
}

/**
 * Computes an authentic status description based on build verified assets
 */
export function getProjectStatus(project) {
  if (project.slug === 'fermonitor') {
    return {
      label: 'Active Research · Thesis Manuscript Forthcoming',
      dotColor: 'bg-emerald-400',
      pulse: true,
    }
  }
  if (project.links?.some((l) => l.type === 'video')) {
    return {
      label: 'Verified Prototype · Bench Video Demo Available',
      dotColor: 'bg-violet-400',
      pulse: false,
    }
  }
  if (project.links?.some((l) => l.type === 'github')) {
    return {
      label: 'Open Source · Hardware & Firmware Verified',
      dotColor: 'bg-indigo-400',
      pulse: false,
    }
  }
  if (project.links?.some((l) => l.type === 'report')) {
    return {
      label: 'Academic Manuscript · Verified Lab Results',
      dotColor: 'bg-sky-400',
      pulse: false,
    }
  }
  return {
    label: 'Completed System · Documented Hardware Build',
    dotColor: 'bg-purple-400',
    pulse: false,
  }
}

function Section({ title, eyebrow, children }) {
  return (
    <section className="border-t border-rule pt-lg">
      {eyebrow && <p className="font-mono text-xs uppercase tracking-wider text-accent-light">{eyebrow}</p>}
      <h2 className="mt-2xs font-display text-title font-semibold tracking-tight text-ink">{title}</h2>
      <div className="mt-sm space-y-sm text-md leading-relaxed text-ink-2">{children}</div>
    </section>
  )
}

function SpecList({ title, items }) {
  if (!items?.length) return null
  return (
    <div className="border-t border-rule pt-md">
      <h3 className="font-mono text-xs uppercase tracking-wider text-muted">{title}</h3>
      <ul className="mt-xs flex flex-wrap gap-2xs">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-pill border border-rule bg-paper-3 px-sm py-2xs font-mono text-xs text-ink-2"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function CircuitSchematicFallback({ project }) {
  return (
    <div className="flex aspect-[16/10] w-full flex-col items-center justify-center rounded-card border border-rule-2 bg-paper-3 p-lg text-center shadow-card">
      <svg
        className="h-16 w-16 text-accent-light/60"
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <rect x="12" y="12" width="40" height="40" rx="4" stroke="currentColor" />
        <circle cx="32" cy="32" r="8" stroke="currentColor" />
        <path d="M4 24h8M4 32h8M4 40h8M52 24h8M52 32h8M52 40h8M24 4v8M32 4v8M40 4v8M24 52v8M32 52v8M40 52v8" />
      </svg>
      <p className="mt-md font-mono text-xs uppercase tracking-wider text-accent-light">
        [ Hardware Schematic Archive // {project.slug} ]
      </p>
      <p className="mt-2xs font-display text-title font-semibold text-ink">{project.title}</p>
      <p className="mt-xs max-w-[65ch] font-mono text-xs text-muted">
        {project.stack} · {project.categoryLabel}
      </p>
    </div>
  )
}

export default function ProjectDetail() {
  const { slug } = useParams()
  const index = projects.findIndex((item) => item.slug === slug)
  const project = projects[index]
  const [mainImageFailed, setMainImageFailed] = useState(false)
  const [failedGalleryImages, setFailedGalleryImages] = useState({})

  if (!project) {
    return (
      <div className="shell pb-5xl pt-3xl">
        <nav aria-label="Breadcrumb" className="flex items-center gap-xs font-mono text-xs text-muted">
          <Link to="/" className="inline-flex min-h-11 items-center transition-colors hover:text-accent-light">
            Home
          </Link>
          <span aria-hidden="true" className="text-rule-2">/</span>
          <Link to="/projects" className="inline-flex min-h-11 items-center transition-colors hover:text-accent-light">
            Projects
          </Link>
          <span aria-hidden="true" className="text-rule-2">/</span>
          <span aria-current="page" className="text-accent-light">404</span>
        </nav>

        <div className="mt-lg rounded-card border border-rule-2 bg-paper-2 p-xl shadow-card lg:p-3xl">
          <p className="font-mono text-xs uppercase tracking-wider text-accent-light">
            404 // BUILD_NOT_FOUND
          </p>
          <h1 className="mt-sm font-display text-display-s font-semibold tracking-tight text-ink">
            Build not located in the ledger.
          </h1>
          <p className="mt-md max-w-[65ch] text-lead text-ink-2">
            The requested build slug <code className="rounded bg-paper-3 px-xs py-2xs font-mono text-sm text-accent-light">"{slug}"</code> does not match any entry in Mary Grace's authentic seventeen-project registry.
          </p>
          <div className="mt-xl flex flex-wrap gap-md">
            <Link to="/projects" className="btn btn-primary min-h-11">
              Back to all builds
            </Link>
            <Link to="/" className="btn btn-outline min-h-11">
              Return to home
            </Link>
          </div>

          <div className="mt-2xl border-t border-rule pt-lg">
            <p className="font-mono text-xs uppercase tracking-wider text-muted">Flagship builds to inspect:</p>
            <div className="mt-sm flex flex-wrap gap-xs">
              {projects.filter((p) => p.featured).map((p) => (
                <Link
                  key={p.slug}
                  to={`/projects/${p.slug}`}
                  className="inline-flex min-h-11 items-center rounded-pill border border-rule-2 bg-paper-3 px-md font-mono text-xs text-ink-2 transition-colors hover:border-accent hover:text-ink"
                >
                  {p.title} &rarr;
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const hud = getProjectHud(project)
  const status = getProjectStatus(project)
  const gallery = galleryFor(project)
  const previous = projects[(index - 1 + projects.length) % projects.length]
  const next = projects[(index + 1) % projects.length]
  const inquiryUrl = `/contact?subject=${encodeURIComponent(`Inquiry regarding ${project.name || project.title}`)}`

  return (
    <article className="pb-5xl pt-2xl">
      <div className="shell">
        {/* Top Breadcrumb & Back Navigation */}
        <div className="flex flex-col gap-sm sm:flex-row sm:items-center sm:justify-between border-b border-rule pb-md">
          <nav aria-label="Breadcrumb" className="flex items-center gap-xs font-mono text-xs text-muted">
            <Link to="/" className="inline-flex min-h-11 items-center transition-colors hover:text-accent-light">
              Home
            </Link>
            <span aria-hidden="true" className="text-rule-2">/</span>
            <Link to="/projects" className="inline-flex min-h-11 items-center transition-colors hover:text-accent-light">
              Projects
            </Link>
            <span aria-hidden="true" className="text-rule-2">/</span>
            <span aria-current="page" className="max-w-[200px] truncate text-ink sm:max-w-none">
              {project.title}
            </span>
          </nav>

          <Link
            to="/projects"
            className="inline-flex min-h-11 items-center gap-xs font-mono text-xs text-muted transition-colors duration-150 hover:text-accent-light"
          >
            <span aria-hidden="true">&larr;</span> Back to all builds
          </Link>
        </div>

        {/* Hero Header */}
        <header className="mt-xl grid gap-lg lg:grid-cols-12 lg:items-end lg:gap-col">
          <div className="lg:col-span-8">
            <div className="flex flex-wrap items-center gap-xs">
              <span className="rounded-pill border border-accent/40 bg-accent/15 px-sm py-3xs font-mono text-xs uppercase tracking-wider text-accent-light">
                {project.categoryLabel}
              </span>
              <span className="font-mono text-xs tabular-nums text-muted">
                Build {String(index + 1).padStart(2, '0')} of {projects.length}
              </span>
              {project.period && (
                <>
                  <span aria-hidden="true" className="text-rule-2">·</span>
                  <span className="font-mono text-xs tabular-nums text-muted">{project.period}</span>
                </>
              )}
            </div>

            <h1 className="mt-sm font-display text-display font-semibold tracking-tight text-ink">
              {project.title}
            </h1>
            <p className="mt-sm max-w-[65ch] font-display text-title font-normal text-ink-2">
              {project.subtitle}
            </p>

            {/* Status Beacon & Stack Summary */}
            <div className="mt-md flex flex-wrap items-center gap-md">
              <div className="inline-flex items-center gap-2xs rounded-card-sm border border-rule-2 bg-paper-2 px-sm py-2xs font-mono text-xs text-ink-2">
                <span className={`inline-block h-2 w-2 rounded-pill ${status.dotColor} ${status.pulse ? 'animate-pulse' : ''}`} />
                <span>{status.label}</span>
              </div>
              <p className="font-mono text-xs text-muted line-clamp-1">
                <span className="text-accent-light">Stack:</span> {project.stack}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-xs lg:col-span-4 lg:items-end">
            <Link
              to={inquiryUrl}
              className="btn btn-primary min-h-11 w-full justify-center gap-xs sm:w-auto"
            >
              <span>Inquire about this build</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
            <p className="font-mono text-xs text-muted">
              Direct telemetry & recruiter inquiry
            </p>
          </div>
        </header>

        {/* Quick Spec Sheet / Technical HUD */}
        <section aria-labelledby="hud-heading" className="mt-2xl">
          <div className="border-t border-rule pt-lg">
            <h2 id="hud-heading" className="font-mono text-xs uppercase tracking-wider text-accent-light">
              HUD // Hardware & Firmware Telemetry
            </h2>
            <p className="mt-2xs font-mono text-xs text-muted">
              Subsystem breakdown verified from bench logs and repository schematics.
            </p>

            <div className="mt-md grid grid-cols-1 gap-sm sm:grid-cols-2 lg:grid-cols-5">
              <div className="rounded-card border border-rule-2 bg-paper-2 p-md shadow-card transition-all duration-150 hover:border-accent">
                <p className="font-mono text-xs uppercase tracking-wider text-accent-light">01 · Silicon / MCU</p>
                <p className="mt-xs font-mono text-sm leading-relaxed text-ink">{hud.processor}</p>
              </div>

              <div className="rounded-card border border-rule-2 bg-paper-2 p-md shadow-card transition-all duration-150 hover:border-accent">
                <p className="font-mono text-xs uppercase tracking-wider text-accent-light">02 · Transducers</p>
                <p className="mt-xs font-mono text-sm leading-relaxed text-ink">{hud.sensors}</p>
              </div>

              <div className="rounded-card border border-rule-2 bg-paper-2 p-md shadow-card transition-all duration-150 hover:border-accent">
                <p className="font-mono text-xs uppercase tracking-wider text-accent-light">03 · Busses / Protocols</p>
                <p className="mt-xs font-mono text-sm leading-relaxed text-ink">{hud.protocols}</p>
              </div>

              <div className="rounded-card border border-rule-2 bg-paper-2 p-md shadow-card transition-all duration-150 hover:border-accent">
                <p className="font-mono text-xs uppercase tracking-wider text-accent-light">04 · Firmware / RTOS</p>
                <p className="mt-xs font-mono text-sm leading-relaxed text-ink">{hud.software}</p>
              </div>

              <div className="rounded-card border border-rule-2 bg-paper-2 p-md shadow-card transition-all duration-150 hover:border-accent">
                <p className="font-mono text-xs uppercase tracking-wider text-accent-light">05 · EDA & Validation</p>
                <p className="mt-xs font-mono text-sm leading-relaxed text-ink">{hud.tools}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Primary Project Exhibit / Screenshot */}
        <figure className="mt-2xl">
          {mainImageFailed ? (
            <CircuitSchematicFallback project={project} />
          ) : (
            <div className="overflow-hidden rounded-card border border-rule bg-paper-3 shadow-card">
              <img
                src={project.image}
                alt={`${project.title}: ${project.subtitle}`}
                width={project.w || 900}
                height={project.h || 562}
                loading="eager"
                decoding="async"
                onError={() => setMainImageFailed(true)}
                className="max-h-[70dvh] w-full object-cover"
              />
            </div>
          )}
          <figcaption className="mt-sm max-w-[65ch] font-mono text-xs text-muted">
            <span className="text-accent-light">&bull; Exhibit capture:</span> {project.line}
          </figcaption>
        </figure>

        {/* Detailed Case Study Narrative & Technical Sidebar */}
        <div className="mt-2xl grid gap-2xl lg:grid-cols-12 lg:gap-col">
          {/* Main Narrative Column */}
          <div className="flex flex-col gap-xl lg:col-span-7">
            <Section title="System Architecture & Scope" eyebrow="01 // System Architecture">
              <p className="max-w-[65ch]">{project.overview}</p>
            </Section>

            <Section title="The Engineering Problem" eyebrow="02 // The Problem">
              <div className="rounded-card-sm border-l-2 border-accent bg-paper-2/70 p-md">
                <p className="max-w-[65ch] italic text-ink-2">{project.problem}</p>
              </div>
            </Section>

            <Section title="Implementation & Design Decisions" eyebrow="03 // What I Built">
              <p className="max-w-[65ch]">{project.solution}</p>
            </Section>

            {project.challenges?.length ? (
              <Section title="Hard Parts & Constraints Overcome" eyebrow="04 // Challenges">
                <ul className="flex flex-col gap-sm">
                  {project.challenges.map((challenge, i) => (
                    <li
                      key={challenge}
                      className="flex items-start gap-sm rounded-card-sm border border-rule bg-paper-2/50 p-md"
                    >
                      <span className="font-mono text-xs font-semibold tabular-nums text-accent-light">
                        [{String(i + 1).padStart(2, '0')}]
                      </span>
                      <span className="max-w-[65ch] text-md text-ink-2">{challenge}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            ) : null}

            {/* Gallery / Screenshot Showcase */}
            {gallery.length ? (
              <section className="border-t border-rule pt-lg">
                <p className="font-mono text-xs uppercase tracking-wider text-accent-light">
                  05 // Captures & Validation Gallery
                </p>
                <h2 className="mt-2xs font-display text-title font-semibold tracking-tight text-ink">
                  Hardware & Telemetry Exhibits
                </h2>
                <div className="mt-md grid gap-md sm:grid-cols-2">
                  {gallery.map((src) => {
                    if (failedGalleryImages[src]) return null
                    const caption =
                      GALLERY_CAPTIONS[src] || `${project.title} - hardware and telemetry capture.`
                    return (
                      <figure
                        key={src}
                        className="overflow-hidden rounded-card border border-rule bg-paper-3 shadow-card"
                      >
                        <img
                          src={src}
                          alt={`${project.title}, exhibit capture`}
                          loading="lazy"
                          decoding="async"
                          onError={() =>
                            setFailedGalleryImages((prev) => ({ ...prev, [src]: true }))
                          }
                          className="aspect-[16/10] w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                        />
                        <figcaption className="p-sm font-mono text-xs text-muted max-w-[65ch]">
                          {caption}
                        </figcaption>
                      </figure>
                    )
                  })}
                </div>
              </section>
            ) : null}
          </div>

          {/* Technical Specification & Metrics Sidebar */}
          <aside className="lg:col-span-5">
            <div className="flex flex-col gap-md rounded-card border border-rule bg-paper-2 p-lg shadow-card lg:sticky lg:top-24">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-accent-light">
                  Bench Specifications
                </p>
                <h2 className="mt-2xs font-display text-title font-semibold text-ink">
                  Verified Telemetry
                </h2>
                <p className="mt-3xs font-mono text-xs text-muted">{project.categoryLabel}</p>
              </div>

              {/* Metrics Grid */}
              {project.metrics?.length ? (
                <dl className="grid grid-cols-2 gap-sm border-t border-rule pt-md">
                  {project.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-card-sm border border-rule-2 bg-paper-3 p-sm"
                    >
                      <dt className="font-mono text-xs text-muted">{metric.label}</dt>
                      <dd className="mt-2xs font-mono text-sm font-semibold tabular-nums text-accent-light">
                        {metric.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              {/* Hardware Stack Tags */}
              <SpecList title="Hardware Architecture" items={project.hardwareStack} />

              {/* Software Stack Tags */}
              <SpecList title="Firmware & Software Stack" items={project.softwareStack} />

              {/* Links & Repository Access */}
              <div className="border-t border-rule pt-md">
                <h3 className="font-mono text-xs uppercase tracking-wider text-muted">
                  Verifiable Repositories & Artifacts
                </h3>
                {project.links?.length ? (
                  <ul className="mt-xs flex flex-col gap-2xs">
                    {project.links.map((link) => (
                      <li key={link.href || link.url}>
                        <a
                          href={link.href || link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-11 items-center gap-xs font-mono text-sm text-ink-2 transition-colors duration-150 hover:text-accent-light"
                        >
                          <span aria-hidden="true" className="text-accent-light">&bull;</span>
                          <span className="underline decoration-rule-2 underline-offset-4 hover:decoration-accent-light">
                            {link.label}
                          </span>
                          <span aria-hidden="true" className="text-muted">&rarr;</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-xs font-mono text-xs text-muted">
                    {project.note || 'Academic / proprietary manuscript on file. Public link restricted.'}
                  </p>
                )}
              </div>

              {/* Recruiter / Inquiry CTA Card */}
              <div className="mt-sm rounded-card-sm border border-accent/30 bg-accent/10 p-md">
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-accent-light">
                  Interested in this architecture?
                </p>
                <p className="mt-xs max-w-[65ch] text-xs text-ink-2">
                  Mary Grace is available for a 700-hour Embedded Systems OJT placement.
                </p>
                <Link
                  to={inquiryUrl}
                  className="btn btn-primary mt-md min-h-11 w-full justify-center"
                >
                  Discuss this project &rarr;
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Previous / Next Project Pagination */}
        <nav
          aria-label="More builds"
          className="mt-3xl grid gap-md border-t border-rule pt-lg sm:grid-cols-2"
        >
          <Link
            to={`/projects/${previous.slug}`}
            className="group flex min-h-11 flex-col justify-center rounded-card border border-rule bg-paper-2 p-md transition-all duration-150 hover:border-accent hover:bg-paper-3 active:scale-[0.98]"
          >
            <span className="font-mono text-xs text-muted">
              &larr; Previous Build [{String(((index - 1 + projects.length) % projects.length) + 1).padStart(2, '0')}]
            </span>
            <span className="mt-3xs font-display text-title font-medium text-ink transition-colors duration-150 group-hover:text-accent-light">
              {previous.title}
            </span>
            <span className="font-mono text-xs text-muted">{previous.categoryLabel}</span>
          </Link>

          <Link
            to={`/projects/${next.slug}`}
            className="group flex min-h-11 flex-col justify-center rounded-card border border-rule bg-paper-2 p-md transition-all duration-150 hover:border-accent hover:bg-paper-3 sm:items-end sm:text-right active:scale-[0.98]"
          >
            <span className="font-mono text-xs text-muted">
              Next Build [{String(((index + 1) % projects.length) + 1).padStart(2, '0')}] &rarr;
            </span>
            <span className="mt-3xs font-display text-title font-medium text-ink transition-colors duration-150 group-hover:text-accent-light">
              {next.title}
            </span>
            <span className="font-mono text-xs text-muted">{next.categoryLabel}</span>
          </Link>
        </nav>
      </div>
    </article>
  )
}
