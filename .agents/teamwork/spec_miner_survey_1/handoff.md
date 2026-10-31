# Specification Mining & Architecture Survey Report

## Executive Summary
This document provides the authoritative, exhaustive specification mining report for the complete redesign and rebuild of the **Mary Grace V. Soronio Developer Portfolio Website**. Mined directly from `Instruction.md`, `ORIGINAL_REQUEST.md`, `pro-web-design-studio/SKILL.md`, and the existing workspace repository (`Sources/`, `src/data/`, `public/work/`).

---

## 1. Observation

### 1.1 Direct Repository & File Observations
1. **Authoritative Mandates**:
   - `ORIGINAL_REQUEST.md` (Lines 5, 15-26, 29-48): Demands a complete redesign and rebuild from scratch in React and Tailwind CSS featuring a distinctive dark purple visual identity, high-intensity animations, multi-page routing (Home, Projects showcase, dedicated Project Details pages, About, Skills, Contact), full responsiveness, and a light theme toggle option. Document choices in `DESIGN_DECISIONS.md`.
   - `Instruction.md` (Lines 1-45, 71-89, 134-193, 248-284, 324-363, 443-494): Emphasizes creative autonomy, ban of generic AI templates, multi-page structure, project cards opening dedicated details pages, high animation intensity (60fps, touch-safe, reduced-motion), and rigorous visual inspection via Playwright.
   - `Instruction.md` (Lines 47-67): Mandates strictly adhering to the `pro-web-design-studio` skill workflow, integrating Emil Kowalski motion rules, Impeccable typography, and Taste anti-slop heuristics.

2. **Current Codebase Baseline**:
   - `package.json` (Lines 11-21):
     ```json
     "dependencies": {
       "react": "^19.3.1",
       "react-dom": "^19.3.1"
     },
     "devDependencies": {
       "@tailwindcss/vite": "^4.3.3",
       "@vitejs/plugin-react": "^6.1.2",
       "puppeteer-core": "^25.16.0",
       "tailwindcss": "^4.3.3",
       "vite": "^8.3.5"
     }
     ```
     Currently no client router is installed; `src/App.jsx` implements a single-page anchor-based layout (`#work`, `#about`, `#training`, `#contact`) with a modal (`ProjectModal.jsx`). Multi-page routing requires introducing a routing solution (such as `react-router-dom`) or client router to fulfill R2.
   - `vite.config.js`: Employs `@vitejs/plugin-react` and `@tailwindcss/vite`.
   - Build Execution: Running `npm run build` in Windows Powershell without elevated sandbox permissions resulted in `EPERM: operation not permitted, open '...node_modules\.vite-temp\vite.config.js.timestamp-*.mjs'`. Executing with `BypassSandbox: true` succeeded cleanly in 1.18s with code 0.

3. **Authentic Data & Assets**:
   - `src/data/projects.js`: Contains 16 authentic technical projects across 4 categories (`embedded`, `iot`, `digital-logic`, `software`).
   - `Sources/Soronio, Mary grace V..md`: 22KB markdown containing verified curriculum vitae, 700-hour OJT objective, education (MSU-IIT, BS Computer Applications Major in Embedded Systems, CGPA 1.67351 Dean's Lister; Tomas Cabili NHS TVL CSS with Honors), work experience (ESL Teacher at Native Camp Japan, Remote Video Automation Editor), leadership (CCS Student Council Budget and Finance Undersecretary 2025-2026, Associate 2024-2025, CAS Executive Secretary 2023-2024), 5 seminars/certifications, and detailed technical narratives.
   - `Sources/mary-grace-1x1-id-image.jpg`: Verified high-quality authentic photographic portrait of Mary Grace.
   - `public/work/`: Contains 15 authentic project photographic captures (`aquaflush.jpg`, `case-fermonitor-verdict.jpg`, `case-fermonitor.jpg`, `contribution-tracker.jpg`, `dc-supply.jpg`, `digistamp.jpg`, `drying-oven.jpg`, `etee.jpg`, `fermonitor.jpg`, `fpga-oven.jpg`, `hero-board.jpg`, `line-robot.jpg`, `mp3-player.jpg`, `ricedirect.jpg`, `room-monitoring.jpg`).
   - Note on Project Images: 5 projects (`rtthread-hmi`, `keyboard-detection`, `activity-recognition`, `campuslink`, `qr-attendance`) have `image: null` in `projects.js`, requiring dedicated visual schematic/circuit fallbacks or media from `Sources/PROJECT PICTURES/` where available.

---

## 2. Logic Chain

1. **Routing Architecture**:
   - *Observation*: `ORIGINAL_REQUEST.md` R2 specifies "Build a multi-page portfolio in React with functional routing across core views: Home, Projects showcase, dedicated Project Details pages, About, Skills, and Contact" and Acceptance Criteria requires "All routes render correctly and survive direct URL access and browser refresh."
   - *Deduction*: The current single-page anchor implementation (`App.jsx`) does not satisfy the multi-page requirement. We must establish a client routing architecture (`react-router-dom` with BrowserRouter or HashRouter/Vite SPA fallback) providing dedicated URL paths: `/`, `/projects`, `/projects/:slug`, `/about`, `/skills`, `/contact`, and `*` (404).

2. **Visual Design System**:
   - *Observation*: `ORIGINAL_REQUEST.md` R1 and `Instruction.md` Section 4 mandate a "rich dark purple primary theme with violet surfaces, sophisticated contrast, layered depth, and intentional typography" plus a "light theme toggle option", while banning generic AI tropes (purple-to-blue neon gradients, repetitive 3-column cards).
   - *Deduction*: The color system must define hierarchical semantic tokens:
     - Dark Purple Mode: Deep obsidian-purple canvas (`#0d0714` / `oklch(13% 0.02 290)`), violet surface layer (`#160b24` / `oklch(17% 0.03 290)`), elevated card surface (`#211038` / `oklch(22% 0.04 290)`), border rules (`oklch(30% 0.04 290)` / subtle white alpha hairline), and glowing lavender/amethyst accents (`#a855f7` / `#c084fc`).
     - Light Theme Mode: Pale lavender/parchment surface (`#faf5ff` / `#f3e8ff`), deep violet text (`#1a0933`), crisp hairline violet borders, and vivid amethyst accents.
     - Document all decisions in `DESIGN_DECISIONS.md`.

3. **Motion, Interaction & Performance**:
   - *Observation*: `Instruction.md` Section 8 and `pro-web-design-studio` demand "High animation intensity" (animated backgrounds, scroll-triggered reveals, page transitions, tactile hovers) while strictly demanding 60fps performance, mobile touch support (min 44px hit areas), and `prefers-reduced-motion` compliance.
   - *Deduction*: Animations must be hardware-accelerated (`transform` and `opacity` only). Background animation should employ a lightweight Canvas or SVG telemetry grid with gentle drifting particles/nodes that disables or pauses under `prefers-reduced-motion: reduce`. Micro-interactions must use Emil Kowalski timing (150ms-220ms, active compression `scale(0.97)`).

4. **Authenticity & Integrity Mode**:
   - *Observation*: `ORIGINAL_REQUEST.md` lines 8-9 specify `Integrity mode: demo`, and explicitly prohibit copying code from existing open-source projects for core logic, running external scripts, or fabricating any credentials, experience, or metrics.
   - *Deduction*: Every biographical fact, project detail, link, metric, and skill must originate exclusively from `Sources/Soronio, Mary grace V..md`, `src/data/projects.js`, and `src/data/site.js`.

---

## 3. Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Navigation & Routing | Multi-Page Router | Declarative client-side routing supporting direct URL access and browser refresh | URL path string | Rendered page view matching route | Renders styled 404 view for unmatched paths | ORIGINAL_REQUEST R2, Instruction §5, §11 |
| 2 | Navigation & Routing | Primary Navigation Header | Sticky/fixed floating header with site branding, route links, theme toggle, and OJT email CTA | User clicks, current URL | Visual active state, route transition | Falls back to default state gracefully | ORIGINAL_REQUEST R2, Instruction §5, §10 |
| 3 | Navigation & Routing | Mobile Drawer/Menu | Responsive hamburger trigger with animated slide-down or overlay navigation menu | Touch/click event | Full-screen or drawer menu with 44px+ tap targets | Body scroll lock prevents background leakage | Instruction §12, pro-web-design-studio |
| 4 | Navigation & Routing | Home View (`/`) | High-impact hero landing featuring Mary Grace's identity, hardware status badge ("AVAILABLE FOR 700-HOUR OJT"), featured builds, and quick CTAs | Navigation to `/` | Hero section, interactive telemetry teaser, featured project highlights | Direct render | ORIGINAL_REQUEST R2, Instruction §5 |
| 5 | Navigation & Routing | Projects Showcase (`/projects`) | Complete catalog of all 16 projects displayed as cards with screenshots, tech stacks, and categories | Filter selection, search/sort | Grid/ledger of project cards | Displays "No projects in category" if empty | ORIGINAL_REQUEST R2, Instruction §5, §7 |
| 6 | Navigation & Routing | Category Filter Pills | Filter projects by category (`all`, `embedded`, `iot`, `digital-logic`, `software`) | Pill click event | Filtered project view with active pill styling | Resets to 'all' if invalid | src/data/projects.js, Instruction §5 |
| 7 | Navigation & Routing | Dedicated Project Details (`/projects/:slug`) | In-depth engineering case study page for each project with overview, problem, solution, hardware/software stack, challenges, screenshots, and live/repo links | Route parameter `slug` | Dedicated project case study layout | 404 / Project Not Found view with back link | ORIGINAL_REQUEST R2, Instruction §5, §7 |
| 8 | Navigation & Routing | About Page (`/about`) | Personal story, education at MSU-IIT, embedded systems focus, CGPA 1.67351 Dean's Lister, leadership roles, ESL teaching, and authentic ID photo | Navigation to `/about` | Rich editorial profile view with authentic timeline | Direct render | ORIGINAL_REQUEST R2, Instruction §5, Sources |
| 9 | Navigation & Routing | Skills & Toolchain Page (`/skills`) | Grouped technical competencies (Programming, Hardware, Web, EDA Tools, AI/Edge) plus training and certifications matrix | Navigation to `/skills` | Structured competency matrix and credential lists | Direct render | ORIGINAL_REQUEST R2, Instruction §5, site.js |
| 10 | Navigation & Routing | Contact Page (`/contact`) | Dedicated contact interface featuring email, phone, location, GitHub/LinkedIn links, and interactive contact form | Form inputs (name, email, message, type) | Submission confirmation toast/message and mailto fallback | Client-side validation errors for invalid input | ORIGINAL_REQUEST R2, Instruction §5, site.js |
| 11 | Navigation & Routing | 404 Not Found Page (`*`) | Distinctive dark purple styled 404 page with helpful recovery links (Home, Projects) | Unmatched URL route | 404 status hero with navigation buttons | Direct render | Instruction §11, Acceptance Criteria |
| 12 | Visual Design & Theme | Dark Purple Primary Identity | Deep obsidian/purple background, layered violet surfaces, amethyst/lavender accents, and ambient glow lighting | Dark theme active | Rich purple aesthetic across all elements | Guaranteed 4.5:1 text contrast | ORIGINAL_REQUEST R1, Instruction §4 |
| 13 | Visual Design & Theme | Light Theme Toggle | High-contrast light violet/lavender theme with toggle switch in navigation header | Click toggle / system preference | Instant theme shift via CSS classes/tokens | Fallback to dark purple if undefined | ORIGINAL_REQUEST R1, Instruction §4 |
| 14 | Visual Design & Theme | Theme Persistence | Preserves user's theme selection across page reloads and browsing sessions | User toggle selection | Stored preference in `localStorage` | Falls back to system `prefers-color-scheme` | ORIGINAL_REQUEST R1, Acceptance Criteria |
| 15 | Visual Design & Theme | Typography Hierarchy | Fluid display typography (Outfit, clamp sizing, tight tracking) and readable body (Onest, 60ch-65ch max width) | Viewport width / text content | Clean, proportional text without horizontal overflow | Font fallback to system sans-serif | Instruction §4, pro-web-design-studio |
| 16 | Visual Design & Theme | Tabular Numeric Discipline | Monospace/tabular alignment (`tabular-nums`) on all metrics, dates, CGPA, and technical telemetry | Numerical data in UI | Vertically aligned digits without jitter | Standard font fallback | Emil Kowalski Rules, pro-web-design-studio |
| 17 | Interaction & Motion | Ambient Canvas/SVG Background | 60fps particle or circuit grid animation in background with subtle mouse interaction | Animation frame tick / mouse pos | Fluid, ambient visual motion | Automatically disabled when reduced motion is preferred | ORIGINAL_REQUEST R3, Instruction §8 |
| 18 | Interaction & Motion | Scroll-Triggered Reveals | Smooth reveal animations as sections enter viewport via IntersectionObserver | Scroll position | Elements glide in (`translateY(8px)` -> 0, opacity 0 -> 1) | Instant display without animation if reduced motion | ORIGINAL_REQUEST R3, Instruction §8 |
| 19 | Interaction & Motion | Page Transitions | Smooth view transitions between route changes | Route change event | Subtle cross-fade/slide entrance (150-250ms) | Instant transition on low-spec / reduced-motion | ORIGINAL_REQUEST R3, Instruction §8 |
| 20 | Interaction & Motion | Tactile Micro-Interactions | Physical feedback on button and card clicks (`:active { transform: scale(0.97); }`) | User pointer down/up | Instant compression with smooth spring recovery | Graceful no-op on non-supporting devices | Emil Kowalski Rules, pro-web-design-studio |
| 21 | Interaction & Motion | Hover Elevation & Glow | Hairline border brightening and subtle shadow glow on hoverable project cards and links | Pointer hover | Smooth 150ms-200ms transition | Pure hover states ignored on touch screens | Emil Kowalski Rules, Instruction §7 |
| 22 | Interaction & Motion | Touch Target Compliance | All interactive elements (buttons, links, toggles) have minimum 44×44px hit area | Touch / pointer input | Reliable activation on mobile devices | Pseudo-element expansion if visual size < 44px | Emil Kowalski Rules, Instruction §12 |
| 23 | Content & Authenticity | 16-Project Authentic Catalog | Complete preservation of all 16 projects, tech stacks, manuscripts, and GitHub links | Project data source | Authentic project representations | No fabricated data or placeholder stats | ORIGINAL_REQUEST R2, Instruction §6 |
| 24 | Content & Authenticity | Authentic Image Handling | Renders authentic photography from `public/work/` and `Sources/` with graceful fallback for null images | Image URL string | Sharp responsive image or custom schematic card | Clean custom schematic fallback, no broken img icons | Instruction §6, §7 |
| 25 | Content & Authenticity | 700-Hour OJT Callout | Prominent highlighting of Mary Grace's availability for a 700-hour embedded systems OJT | User visits Home or Contact | High-visibility status badge and direct contact action | Direct render | Sources/Soronio CV, Instruction §2 |
| 26 | Technical Quality | Zero Horizontal Overflow | Constrained containers (`min-w-0`, `max-w-prose`, `overflow-x-clip`) preventing layout breakages | Screen widths 320px to 3840px | Perfectly fitted viewports across all devices | Overflow logged and prevented | ORIGINAL_REQUEST R4, Instruction §12 |
| 27 | Technical Quality | Design Decisions Document | Creation and maintenance of `DESIGN_DECISIONS.md` documenting visual identity, colors, and motion | Architectural choices | Markdown documentation file in repository | Continuous sync | ORIGINAL_REQUEST R1, Instruction §10 |
| 28 | Verification | Playwright Visual Verification | Automated browser testing across desktop (1440x900) and mobile (390x844) viewports | Local dev server URL | Verification report and layout confirmation | Fails build if unhandled console errors occur | Acceptance Criteria, pro-web-design-studio |

---

## 4. Edge Cases

| # | Feature | Input | Observed / Expected Behavior |
|---|---------|-------|------------------------------|
| 1 | Dedicated Project Route | Non-existent slug: `/projects/quantum-teleporter` | Router catches invalid slug, renders styled "Project Not Found" card with a button "Back to Projects", returning 0 unhandled console errors. |
| 2 | Project Cards & Details | Projects with `image: null` (`rtthread-hmi`, `keyboard-detection`, `activity-recognition`, `campuslink`, `qr-attendance`) | Displays custom high-craft SVG circuit/schematic graphic badge with project category badge instead of broken `<img>` element or blank space. |
| 3 | Project Details Links | Projects with `links: []` (`fermonitor`, `dc-supply`) | Displays authentic context note (e.g. "Undergraduate thesis manuscript forthcoming" / "Laboratory prototype, hardware testing bench build") instead of empty link list or broken button. |
| 4 | Deep URL Navigation | User refreshes browser while on `/projects/fermonitor` or `/about` | Client router serves `index.html` fallback cleanly, recovers state, and preserves the active route without 404 HTTP errors. |
| 5 | Theme Toggle | Rapid toggling between dark purple and light theme | CSS transition smoothly interpolates tokens without layout shift, FOUC (flash of unstyled content), or state deadlock; persists final state in `localStorage`. |
| 6 | System Color Scheme | User changes OS dark/light mode while site is open | If user hasn't explicitly overridden theme in app, site responds to `(prefers-color-scheme: dark)` media query changes automatically. |
| 7 | Accessibility Motion | OS setting `prefers-reduced-motion: reduce` enabled | Background particle animation pauses/freezes, scroll-triggered reveals convert to instant 0ms opacity reveals, eliminating motion sickness. |
| 8 | Mobile Navigation Menu | User opens mobile menu on small phone (375px) and scrolls | Mobile sheet opens smoothly, background body scrolling is locked (`overflow: hidden`), all links have min 44px hit targets, and closing restores scroll seamlessly. |
| 9 | Contact Form Input | User submits empty contact form or malformed email (`mary@`) | Instant client-side validation triggers with accessible warning message; does not trigger empty form dispatch. |
| 10 | Ultra-Wide Displays | Viewport expanded to 2560px or 3840px (4K monitors) | Main content remains comfortably constrained within max container (`max-w-7xl` or `1440px`), backgrounds bleed gracefully to edge without visual breakage. |
| 11 | Production Build on Windows | `npm run build` executed inside sandbox | Requires `BypassSandbox: true` due to Windows file permission lock on `node_modules/.vite-temp`; executes cleanly in 1.18s. |

---

## 5. Caveats
1. **Routing Dependency**: The existing project currently has no routing library installed (`react-router-dom` is absent in `package.json`). Installing `react-router-dom` is necessary to satisfy multi-page routing with direct URL navigation and browser refresh.
2. **Missing Project Images in `public/work/`**: Five projects currently have `image: null` in `projects.js`. Sources in `Sources/PROJECT PICTURES/` have raw screenshots and lab reports that can be adapted, or a fallback design pattern (schematic vector card) must be implemented so no layout has broken imagery.
3. **Contact Submission Backend**: The repository is currently a frontend-only Vite application. Contact handling should provide a validated interactive client UI with mailto fallback and optional integration hook (e.g. Formspree/EmailJS or mailto protocol) without pretending a non-existent backend exists.

---

## 6. Conclusion
The requirements set forth in `ORIGINAL_REQUEST.md` and `Instruction.md` demand a complete, multi-page transformation from the existing single-page layout to an immersive, dark purple portfolio. All authentic assets, credentials, and 16 projects are fully accounted for in the repository. The visual direction must strictly adhere to the `pro-web-design-studio` framework with Emil Kowalski motion rules, Impeccable typography, and high-contrast theme toggling.

---

## 7. Verification Method

To independently verify the observations and specifications documented in this report:

1. **Verify Baseline Production Build**:
   ```powershell
   npm run build
   ```
   *Expected outcome*: Exits code 0 in ~1.2s when executed with appropriate file access permissions.

2. **Verify Authentic Assets and Data**:
   - Inspect `Sources/Soronio, Mary grace V..md` to verify all 16 projects, CGPA (1.67351), leadership, and experience.
   - Inspect `public/work/` to verify existence of all 15 authentic JPG image files.
   - Inspect `src/data/projects.js` to verify project slugs and metadata.

3. **Verify Route & Architectural Specifications**:
   - Confirm that Home, Projects (`/projects`), Project Details (`/projects/:slug`), About (`/about`), Skills (`/skills`), Contact (`/contact`), and 404 (`*`) routes are specified with zero fabricated data.
   - Confirm that `DESIGN_DECISIONS.md` is designated as the design governance document.
