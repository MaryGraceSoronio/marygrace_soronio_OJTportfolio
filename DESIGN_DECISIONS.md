# Design Decisions

**Project:** Mary Grace V. Soronio developer portfolio
**Date:** 31 October 2026
**Stack:** React 19, Vite, Tailwind CSS v4, React Router
**Scope:** Complete redesign per `Instruction.md`, replacing the earlier single-page build.

---

## 1. Starting point and scope

`Instruction.md` explicitly rejects the previous design direction and asks for a new visual
identity, new layouts, and a multi-page architecture. The earlier single-page composition
(`Hero`, `WorkLedger`, `CaseStudy`) was therefore retired rather than restyled. What was kept
is the part that had already been earned: the authentic data layer (`src/data/`), the
dual-theme token system, the theme provider, and the real project captures in `public/`.

The brief asked for a portfolio whose primary job is to help Mary Grace get hired. Every
decision below is subordinate to that: a recruiter should understand who she is, what she has
built, and what she wants (a 700-hour OJT placement) within the first screen and a half.

### Design methodology and skills

The visual identity and implementation follow the `pro-web-design-studio` standard, synthesizing
the `emil-design-engineering` principles (micro-interactions, snappy spring easing, strict typography
measure, hit targets) and `taste-frontend` directives (anti-slop art direction, high-contrast violet
palette, authentic engineering aesthetics). This deliberate framework governs all tokens, component
states, motion curves, and layout hierarchies.

---

## 2. Design concept: Cyber-Physical instrument panel for a builder

The subject is an embedded-systems engineer who moves between silicon, firmware, and
interface. The visual language embodies a custom Cyber-Physical engineering aesthetic, borrowing from the equipment she actually works with:
oscilloscopes, logic analysers, telemetry dashboards, calibration sheets. That gives the site
a reason to look the way it does instead of decorating a generic portfolio template.

Three rules follow from that concept:

1. **Readouts, not decoration.** Monospace metadata, labelled values, and tabular numerals
   carry real information (CGPA, OJT hours, build count, stack). Nothing is a fake metric.
2. **Hairlines over boxes.** Sections are separated by 1px rules and spacing, not by a stack of
   floating cards. This keeps the page calm at long scroll lengths.
3. **One accent, used sparingly.** Violet marks the live/active element: the current nav item,
   the category label, the signal bars, the primary action. It is not a background wash.

The tone is first person and factual: "I build the device and the dashboard." Claims are
limited to work that exists in the source material.

---

## 3. Colour system

A two-tier token system: raw values live in `--theme-*` custom properties per theme, then a
`@theme` bridge exposes them to Tailwind utilities (`bg-paper`, `text-ink`, `border-rule`,
`text-accent-light`, and so on). Components never hard-code a hex value, which is what makes
the light theme a real theme rather than an afterthought.

### Dark purple (default)

| Token | Value | Role |
| --- | --- | --- |
| `--theme-paper` | `#0b0612` | Page canvas, near-black plum |
| `--theme-paper-2` | `#12091f` | Cards, header, surfaces |
| `--theme-paper-3` | `#1a0d2e` | Elevated chips, image wells |
| `--theme-paper-4` | `#24123f` | Hover / pressed surface |
| `--theme-ink` | `#f5f2fb` | Primary text |
| `--theme-ink-2` | `#c4b5fd` | Secondary text |
| `--theme-muted` | `#9e8bb8` | Metadata, captions |
| `--theme-accent` | `#9d4edd` | Primary violet |
| `--theme-accent-light` | `#c084fc` | Labels, focus, highlights |
| `--theme-rule` | violet @ 12% | Hairline dividers |

### Light

| Token | Value | Role |
| --- | --- | --- |
| `--theme-paper` | `#faf8fd` | Violet-tinted paper |
| `--theme-paper-2` | `#ffffff` | Cards |
| `--theme-paper-3` | `#f3eef9` | Chips, image wells |
| `--theme-ink` | `#150d24` | Primary text |
| `--theme-ink-2` | `#3c2a5c` | Secondary text |
| `--theme-muted` | `#6b5b82` | Metadata |
| `--theme-accent` | `#7c3aed` | Primary violet |
| `--theme-accent-light` | `#8b5cf6` | Labels, focus |
| `--theme-rule` | violet @ 10% | Hairlines |

The light theme is not an inversion. It keeps the violet identity by tinting the paper and
borders, and it darkens the accent so violet text still clears contrast on white. Both themes
were checked in the browser at full page height.

### Why this palette

Violet is the one colour that reads as both "electronics" (LED, PCB silkscreen, instrumentation)
and "design-forward" without drifting into the blue-purple SaaS default. Keeping the canvas
almost black rather than mid-purple makes the accent legible and the photography dominant.
Contrast was treated as a constraint, not a preference: body and secondary text target WCAG AA
or better in both themes, and the muted token is only used for genuinely secondary metadata.

---

## 4. Typography

Three families, each with a job:

- **Outfit** (display) for headings and the name. Geometric, slightly technical, tight at large
  sizes. Used at semibold, never heavier.
- **Onest** (body) for prose. Neutral enough to read for long paragraphs, with a humanist
  texture that keeps the site from feeling like a control panel only.
- **JetBrains Mono** (metadata) for labels, dates, stacks, counts, and section eyebrows. This is
  the typographic signature: the mono line above every section is what makes the page read as a
  technical document.

The scale is fluid: `--text-display` runs `clamp(2.75rem, 5.6vw, 5.25rem)`, with section and
sub-display steps below it. Headlines use `text-wrap: balance`; paragraphs use
`text-wrap: pretty` and are capped at `65ch` so no line runs the full width of a 1920px screen.
Numerals in readouts use `font-variant-numeric: tabular-nums` so values align vertically.

### Emil Kowalski typography discipline:
- **Measure / Line Length:** Strict `max-w-[65ch]` cap on body prose, case summaries, and narrative paragraphs (`max-w-prose` equivalent) to prevent eye tracking exhaustion.
- **Tabular Numerals:** Always enforced via `tabular-nums` (`font-variant-numeric: tabular-nums`) across metrics, counts, dates, CGPA readouts, and telemetry values to eliminate horizontal digit jitter.
- **Uppercase Tracking:** All uppercase metadata labels, tags, and category eyebrows apply expanded tracking (`tracking-wider` / `letter-spacing: 0.05em` to `0.1em`).
- **Punctuation Truncation:** Single ellipsis character (`…` / `&hellip;`) is used consistently rather than three periods.
- **Underline Discipline:** Underlines are strictly reserved for hyperlinks. Hierarchy emphasis relies exclusively on font weight (`font-medium` / `font-semibold`), contrast, and violet tint.
- **Font Fallbacks:** Calibrated system fallbacks (`system-ui`, `ui-monospace`, `monospace`) eliminate layout shifts (CLS) on initial load.

---

## 5. Layout

- **Container:** `--container-page: 1440px` with a fluid shell and generous side gutters. On
  very wide screens the content stops growing and the ambient field takes over, which is why
  1920px still reads as a composed page rather than a stretched one.
- **Grid:** a 12-column grid at `lg` and above, with a 32px column gap. Editorial asymmetry is
  deliberate: the hero is 7/5, project detail is 7/5 with a sticky spec rail, about is 5/7.
  Nothing is centred by default.
- **Spacing:** a strict 4/8px-derived scale (`3xs` 2px through `6xl` 176px). Section rhythm comes
  from `py-4xl` bands separated by hairline borders.
- **Surfaces:** cards use a 16px outer radius with a 12px inner radius for nested elements, so
  radii stay concentric instead of visually fighting.

### Page structure

- **Home:** asymmetric hero with a live "system readout" panel (program, major, standing, OJT
  target, base, documented builds), then a featured build triptych, then the toolchain, then a
  violet OJT call-to-action band.
- **Projects:** a ledger, not a gallery. Category filters plus a search field over title,
  summary, stack, and hardware/software lists, with a live result count and a real empty state.
- **Project detail:** full-bleed hero capture, numbered ledger position, overview / problem /
  what I built / hard parts, a sticky specification rail with metrics and hardware/software
  chips, curated extra captures, and previous/next navigation.
- **About:** portrait and a factual readout beside the bio, then education, work, leadership,
  and languages as timelines.
- **Skills:** six skill groups, four "bench" layers, certifications with working document
  links, and training as a dated ledger.
- **Contact:** direct channels (email, phone, GitHub, LinkedIn) next to a validated form that
  composes a `mailto:` message in the visitor's own client. No server, no stored data.
- **404:** a real page with routes back into the site, not a redirect.

---

## 6. Components

| Component | Responsibility |
| --- | --- |
| `Header` | Fixed translucent bar, active route state, theme toggle, mobile menu trigger |
| `MobileDrawer` | Full-height navigation, focus trap, Escape to close, scroll lock |
| `Footer` | Identity, page links, direct channels, location |
| `ThemeToggle` | 44×44px control, icon swap, persisted preference |
| `AmbientCanvas` | Decorative circuit-mesh field behind the page |
| `Reveal` | One-shot intersection reveal for sections and cards |
| `ProjectCard` | Image, ledger number, category, title, one-line summary, stack |
| `App` | Route table, scroll restoration, per-route document titles |

The card is the workhorse. It is a single link target (whole card clickable), shows a graceful
text fallback if a capture fails to load, and uses a fixed 16:10 image well so a mixed set of
screenshots and photographs still forms an even grid.

### HUD Spec Telemetry (`PROJECT_HUD`)

Project detail views feature a dedicated cyber-physical engineering HUD specification panel (`PROJECT_HUD`) embedded in the sticky specifications rail. Sourced directly from laboratory logs, schematic documentation, and research manuscripts, it instruments projects with a 5-tuple telemetry profile:

1. **Processing Core:** MCU/MPU architecture, core clock, DSP/FPU capabilities (e.g. `Raspberry Pi 4B Quad-Core ARM Cortex-A72 @ 1.5GHz`, `STM32F407VG Cortex-M4 @ 168MHz`, `Microchip ATmega328P DIP-28`).
2. **Sensors & Transducers:** Discrete analog/digital sensors, ADCs, and transducers (e.g. `MQ-137 / MQ-136 / MQ-135 / NDIR CO₂ / ADS1115 16-Bit ADC`, `DHT22`, `ES8388 Audio Codec`).
3. **Protocols & Buses:** Hardware buses, baud rates, and IPC communication channels (e.g. `I²C 100kHz`, `UART 115200 baud`, `DMA I²S Streaming Audio Bus`, `FreeRTOS Queues`, `MQTT / HTTP REST`).
4. **Software & Runtime:** Operating system kernel, embedded firmware, drivers, and frameworks (e.g. `FreeRTOS Preemptive Kernel`, `RT-Thread IoT OS`, `CODESYS IEC 61131-3 Ladder Diagram`, `100% 8-bit AVR Assembly`).
5. **Laboratory Toolchain:** Engineering rigs, IDEs, and diagnostic equipment (e.g. `Keil MDK-ARM`, `AMD Vivado Design Suite`, `Digital Storage Oscilloscope`, `Logic Analyzer`).

For projects without custom HUD overrides, `getProjectHud()` synthesizes a fallback specification from verified hardware and software stacks so telemetry coverage is 100% complete across all 17 projects.

---

## 7. Navigation and routing

React Router with `BrowserRouter` and seven routes:

```
/                    Home
/projects            Projects ledger
/projects/:slug      Project detail (17 slugs)
/about               About
/skills              Skills & toolchain
/contact             Contact
*                    Not found
```

- The dev server and Vite preview both fall back to `index.html`, so a direct load or refresh
  on `/projects/fermonitor` renders the project, not a 404. This was verified by reloading the
  deep URL in a production preview.
- Route changes reset scroll to the top, except when a hash is present, in which case the
  target element is scrolled into view.
- `document.title` is set per route, including the project name on detail pages and a
  not-found title for unknown routes.
- The nav is route-based rather than scroll-based. The previous build used in-page anchors,
  which cannot represent a multi-page architecture.
- The mobile drawer closes on navigation, traps Tab focus, closes on Escape, and locks body
  scroll while open.

---

## 8. Theme system

- `ThemeContext` owns the theme, persists it to `localStorage` under `mg_theme`, and syncs
  `data-theme`, the `dark`/`light` classes, `color-scheme`, and the `theme-color` meta tag.
- A synchronous inline script in `index.html` resolves the stored preference (or the OS
  preference) before first paint, so there is no flash of the wrong theme.
- The toggle is a 44×44px button with a real accessible label that changes with state.
- The ambient canvas reads the accent token and re-reads it when the theme attribute changes,
  so the field shifts with the palette instead of staying dark-theme violet.

---

## 9. Motion

Motion is high-intensity by request, but bounded by three rules: it must communicate
something, it must not block reading, and it must have a reduced-motion equivalent.

- **Ambient field:** a canvas mesh of drifting nodes with proximity links and a soft pointer
  repulsion. Density scales with viewport area; device pixel ratio is capped at 2; the loop
  pauses when the tab is hidden.
- **Route transition:** a 220ms opacity/translate entrance on each page container.
- **Scroll reveal:** sections and cards fade and lift once via `IntersectionObserver`, then
  disconnect. Delays are capped so a long grid never feels like a queue.
- **Signal bars:** a slow scaleY pulse in the hero readout, evoking a live instrument.
- **Micro-interactions:** 150ms colour transitions on links and buttons, a 1.03 image scale on
  card hover, and a 0.97 active compression on controls.
- **Reduced motion:** `prefers-reduced-motion: reduce` removes the canvas and signal bars
  entirely and forces reveals and page transitions to their final state. No content depends on
  animation to become visible.

Performance: the canvas is the only continuous animation, it is `pointer-events: none`, it
draws with a single rAF loop, and it stops on tab hide. Everything else is CSS transform and
opacity, which stays on the compositor.

### Emil Kowalski motion engineering rules:
- **Frequency-Appropriate Timing:** High-frequency actions (0ms), standard menus/hover states (150ms-200ms), heavy page reveals (200ms-250ms), with a strict 300ms ceiling.
- **No `scale(0)` Entrances:** Scale reveals start smoothly from `scale(0.96)` combined with `opacity: 0`, preventing jarring pinhole effects.
- **Snappy Easing:** Entrances employ `cubic-bezier(0.16, 1, 0.3, 1)` for immediate responsiveness and smooth deceleration.
- **Tactile Button Clicks:** Interactive controls and cards implement active tactile compression: `:active { transform: scale(0.97); }` with `transition: transform 100ms ease`.
- **GPU-Only Animation:** Motion is restricted strictly to `transform` and `opacity` properties to prevent costly layout recalculations and repaint passes.
- **Hit Area Minimums:** All interactive controls (theme toggle, nav items, mobile menu trigger, form controls) meet the minimum 44×44px tap target standard.

---

## 10. Responsive behaviour

Verified at 375, 390, 768, 1280, 1440, and 1920px, plus a production build check for horizontal
overflow on every route.

- **< 640px:** single column; the header collapses to name, theme toggle, email, and menu;
  filter chips wrap; the drawer is full height; the portrait is capped at `max-w-sm`.
- **768px:** two-column card grid; the About portrait is still centred and bounded rather than
  filling the viewport.
- **1024px+:** the 12-column editorial grid activates, the sticky project spec rail appears,
  and the desktop nav replaces the drawer.
- **1280–1920px:** the shell stops at 1440px; the ambient field fills the remaining space.

`html` and `body` use `overflow-x: clip` as a hard guard, but the layout itself was checked for
zero overflow rather than relying on the guard.

---

## 11. Accessibility

- Semantic landmarks: `header`, `nav` with labels, `main`, `footer`, `article`, `figure`.
- A skip link to `#main` on every page.
- Visible focus rings (`:focus-visible`, 2px accent, 3px offset) on all interactive elements.
- Minimum 44×44px targets for the theme toggle, nav links, drawer items, and form controls.
- Form fields have real labels, `aria-invalid`, `aria-describedby` error wiring, and a live
  region for the submission status.
- The project search has a live result count; filters use `aria-pressed`.
- Images carry descriptive alt text derived from the project title and subtitle.
- Decorative canvas is `aria-hidden`; the skip link and nav order follow reading order.

---

## 12. Content integrity

The instruction is explicit that credentials, experience, metrics, and results must not be
fabricated. The site therefore uses only values present in `Sources/`:

- 17 authentic projects: Fermonitor, Room Monitoring, STM32 MP3 Player, RT-Spark Activity Recognition, Drying Oven System, Keyboard Detection, DC Power Supply, CCS Contribution Tracker, FPGA Drying Oven FSM, RiceDirect Logistics, E-Tee Smart Incubator, MSU-IIT CampusLink, DigiStamp Loyalty, AquaFlush Automation, RT-Thread HMI, QR Attendance System, and Bare-Metal Line Robot.
- 43 curated secondary captures: Documented in `src/data/media.js` and shipped in `public/work/`, providing authentic lab exhibits (ADS1115 ADC header wiring, Flask telemetry response curves, Wokwi circuit schematics, Keil logic traces, CODESYS ladder diagrams, Vivado FSM state diagrams, PCB layout renders, and 8-bit AVR assembly code snippets).
- Full academic standing: MSU-IIT Computer Applications, CGPA 1.67351, Dean's Lister, and 700-hour required OJT availability.
- Genuine professional and leadership records: Native Camp ESL tutoring, YouTube automation video engineering, MSU-IIT CCS Student Council Representative, and Computer Applications Society leadership.
- Audited certifications: Verified against `Sources/CERTIFICATES/` and public assets. Where a certificate was confirmed via CV records but has no public PDF copy (e.g. ZX Calculus webinar), the interface displays "Certificate held, no public copy" rather than linking to non-existent assets.
- Privacy compliance: Personal contact images containing third-party credentials or personal signatures were excluded from the distribution build.

---

## 13. Trade-offs and known limits

- **No backend contact form.** A static site cannot send mail without a service; the form
  composes a `mailto:` draft instead. This is honest, private, and zero-maintenance, but it
  depends on the visitor having a mail client configured.
- **Legacy gallery arrays.** `projects.js` still carries secondary capture paths for images not
  shipped in `public/`. They are not rendered; `media.js` is the single source of truth for
  galleries. Trimming the data file further would risk editing authentic source records for no
  user-visible gain.
- **Fonts are remote.** Outfit, Onest, and JetBrains Mono load from Google Fonts. Self-hosting
  would remove a third-party request but adds build complexity that was not justified here.
- **Canvas cost.** The ambient field is deliberately subtle and pauses off-screen, but it is
  still a continuous animation. Reduced-motion users get none of it.
- **Test suite scope.** The existing 330 tests are static content and contract checks. They
  pass independently of routing, so they are treated as a regression guard, not as proof that
  the rendered app works. The real verification was browser-based across all routes and
  widths, against the production build.

---

## 14. Verification performed

- `npm run build` completes cleanly with 0 errors and generates production assets in `dist/`.
- `node tests/run-e2e.js`: 330/330 tests across all 4 tiers pass cleanly (0 failures, 0 skips).
- Automated multi-viewport layout verification across Mobile (375px, 390px), Tablet (768px), and Desktop (1280px, 1440px) on all 7 routes (`/`, `/projects`, `/projects/fermonitor`, `/about`, `/skills`, `/contact`, `*`).
- Zero horizontal overflow (`document.documentElement.scrollWidth <= window.innerWidth`) verified programmatically across every viewport and route combination.
- Zero unhandled console errors or exceptions detected during client-side navigation and route transitions.
- Deep-link refresh and alias routing: both canonical `/projects/fermonitor` and alias `/projects/fermonitor-iot-incubator` render the authentic project and set the browser `document.title`.
- Theme toggle switches seamlessly between Dark Purple (`#0b0612`) and Light Paper (`#faf8fd`) with zero FOUC and persistent `localStorage` synchronization.
- Mobile drawer navigation operates smoothly with 44px+ touch targets, focus trapping, Escape dismissal, and body scroll lock.
- All 60 project and exhibit images in `public/work/` and certificate assets in `public/certificates/` were audited with zero missing references or broken links.
