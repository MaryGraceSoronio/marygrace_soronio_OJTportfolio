# Project: Mary Grace V. Soronio Developer Portfolio

## Architecture

A modern, high-performance, accessible multi-page React application built with Vite and Tailwind CSS v4, embodying a custom "Cyber-Physical Engineering" aesthetic.

```
                    ┌──────────────────────────────────────────┐
                    │            Vite HTML Shell               │
                    │        (index.html & Google Fonts)       │
                    └────────────────────┬─────────────────────┘
                                         │
                    ┌────────────────────▼─────────────────────┐
                    │               ThemeProvider              │
                    │   (data-theme & .dark/.light sync,       │
                    │    localStorage persistence, 0ms FOUC)   │
                    └────────────────────┬─────────────────────┘
                                         │
                    ┌────────────────────▼─────────────────────┐
                    │        Global Animation Canvas           │
                    │    (60fps particle circuit mesh,         │
                    │     prefers-reduced-motion override)     │
                    └────────────────────┬─────────────────────┘
                                         │
                    ┌────────────────────▼─────────────────────┐
                    │            BrowserRouter                 │
                    │       (Client-side SPA Routing)          │
                    └────────────────────┬─────────────────────┘
                                         │
         ┌───────────────┬───────────────┼───────────────┬───────────────┐
         ▼               ▼               ▼               ▼               ▼
      Header           Hero          Content          Footer        MobileDrawer
   (Nav + Toggle)  (Telemetry)     (Page Views)    (Authentic)     (Touch 44px+)
                                         │
         ┌───────────────┬───────────────┼───────────────┬───────────────┐
         ▼               ▼               ▼               ▼               ▼
       Home          Projects         Details          About          Skills &
       (`/`)       (`/projects`)  (`/projects/:id`)  (`/about`)    Contact (`/skills`,
                                                                      `/contact`)
```

### Visual Identity & Theme System
- **Dark Purple Theme (Default)**:
  - Deep obsidian-plum canvas (`#0b0612` / `oklch(11% 0.035 292)`)
  - Elevated violet surfaces (`#12091f`, `#1a0d2e`, hover `#24123f`)
  - Subtle hairline borders (`rgba(186, 147, 245, 0.12)`)
  - Radiant electric violet/amethyst accents (`#9d4edd`, `#a855f7`)
  - 100% WCAG AA compliant text contrast (`#f5f2fb` primary text, 14.2:1 contrast)
- **Light Theme (Accessible Toggle)**:
  - Crisp violet-tinted paper canvas (`#faf8fd` / `oklch(98% 0.008 295)`)
  - Clean white elevated surfaces (`#ffffff`, container `#f3eef9`)
  - High-contrast indigo-plum ink (`#150d24`, 15.8:1 contrast)
  - Deep violet interactive accents (`#7c3aed`)
- **Theme Toggle State**: React Context synchronizing `document.documentElement` attributes (`data-theme="dark"` / `data-theme="light"` and class `.dark` / `.light`) with instant persistence in `localStorage`.

### Motion & Micro-Interaction Principles (Emil Kowalski Standards)
- **Fluid 60fps Canvas**: HTML5 Canvas particle/mesh constellation simulating hardware telemetry with mouse spring attraction.
- **Hardware Acceleration**: Transitions strictly animate `transform` and `opacity`.
- **Snappy Easing**: `cubic-bezier(0.16, 1, 0.3, 1)` for entrances; durations strictly `<= 300ms`.
- **Tactile Feedback**: Button and card clicks feature active compression `:active { transform: scale(0.97); }` with 100ms ease.
- **Accessibility**: `@media (prefers-reduced-motion: reduce)` completely disables canvas ticks and reduces motion to instant transitions.
- **Hit Targets**: All interactive elements satisfy `>= 44x44px` click/tap targets.
- **Reading Measure**: Paragraph text capped at `max-w-[65ch]`.

---

## Feature Inventory

Every feature identified in the Survey phase is enumerated and assigned to a milestone below.

| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Multi-Page Router | Declarative client-side routing with direct URL & refresh support | M2 | Survey / ORIGINAL_REQUEST R2 |
| 2 | Primary Navigation Header | Fixed header with site branding, route links, theme toggle, and OJT CTA | M2 | Survey / ORIGINAL_REQUEST R2 |
| 3 | Mobile Navigation Drawer | Accessible responsive hamburger menu with 44px+ tap targets | M2 | Survey / Instruction §12 |
| 4 | Home View (`/`) | High-impact hero, OJT availability badge, telemetry tease, featured builds | M3 | Survey / ORIGINAL_REQUEST R2 |
| 5 | Projects Showcase (`/projects`) | Complete catalog of all 17 projects with category filters and search | M4 | Survey / ORIGINAL_REQUEST R2 |
| 6 | Category Filter Pills | Filter by `all`, `embedded`, `iot`, `digital-logic`, `software` | M4 | Survey / projects.js |
| 7 | Dedicated Project Details (`/projects/:slug`) | In-depth case study for all 17 projects with stack, schematics, links | M4 | Survey / ORIGINAL_REQUEST R2 |
| 8 | About Page (`/about`) | Editorial profile, MSU-IIT, CGPA 1.67351, leadership, ESL experience, photo | M3 | Survey / ORIGINAL_REQUEST R2 |
| 9 | Skills & Toolchain Page (`/skills`) | Grouped competencies (Hardware, Firmware, Web, EDA, AI) & certs matrix | M3 | Survey / ORIGINAL_REQUEST R2 |
| 10 | Contact Page (`/contact`) | Interactive contact form with validation, mailto fallback, contact channels | M3 | Survey / ORIGINAL_REQUEST R2 |
| 11 | 404 Not Found Page (`*`) | Themed dark purple 404 page with recovery navigation buttons | M2 | Survey / Instruction §11 |
| 12 | Dark Purple Primary Identity | Deep obsidian/purple canvas, layered violet surfaces, radiant accents | M1 | Survey / ORIGINAL_REQUEST R1 |
| 13 | Light Theme Toggle | High-contrast light violet theme switch with smooth transition | M1 | Survey / ORIGINAL_REQUEST R1 |
| 14 | Theme Persistence | Persistent theme selection in `localStorage` across reloads | M1 | Survey / ORIGINAL_REQUEST R1 |
| 15 | Typography Hierarchy | Fluid clamp display sizing and readable body measure (<=65ch) | M1 | Survey / pro-web-design-studio |
| 16 | Tabular Numeric Discipline | Vertical alignment (`tabular-nums`) on dates, metrics, CGPA | M1 | Survey / Emil Kowalski |
| 17 | Ambient Canvas Background | 60fps particle/circuit grid with mouse interaction & reduced-motion | M2 | Survey / ORIGINAL_REQUEST R3 |
| 18 | Scroll-Triggered Reveals | Viewport reveal transitions with hardware acceleration | M3 | Survey / ORIGINAL_REQUEST R3 |
| 19 | Page Transitions | Smooth route transition cross-fades (150-250ms) | M2 | Survey / ORIGINAL_REQUEST R3 |
| 20 | Tactile Micro-Interactions | Active compression `:active { transform: scale(0.97); }` | M1 | Survey / Emil Kowalski |
| 21 | Hover Elevation & Glow | Hairline border brightening and subtle shadow glow on hover | M1 | Survey / Instruction §7 |
| 22 | Touch Target Compliance | Min 44x44px hit areas on all buttons, links, toggles | M1 | Survey / Emil Kowalski |
| 23 | 17-Project Authentic Catalog | Complete preservation of all 17 projects, tech stacks, links, specs | M1 | Survey / ORIGINAL_REQUEST R2 |
| 24 | Authentic Image Pipeline | Copying missing project images from Sources/ to public/ and fallback graphics | M1 | Survey / Sources |
| 25 | 700-Hour OJT Callout | Prominent highlighting of Mary Grace's OJT availability | M3 | Survey / Soronio CV |
| 26 | Zero Horizontal Overflow | Strict responsive layout bounds across 320px to 3840px displays | M5 | Survey / ORIGINAL_REQUEST R4 |
| 27 | Design Decisions Document | Creation and maintenance of `DESIGN_DECISIONS.md` | M5 | Survey / ORIGINAL_REQUEST R1 |
| 28 | Playwright Visual Verification | Automated browser visual & responsive layout verification | M5 | Survey / Acceptance Criteria |

---

## Milestones

| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Design System & Authentic Data Foundation | Tokens, CSS variables (dark purple & light), ThemeProvider, authentic data module (17 projects, bio, skills, certs), asset copy to public/ | none | DONE (app.css, ThemeContext, 17 projects, profile.js, 330/330 tests pass) |
| M2 | Navigation Shell, Routing & Canvas Background | React Router setup, Nav header with theme toggle, Mobile drawer, Footer, 60fps canvas background, 404 page | M1 | DONE (Nav.jsx, MobileDrawer.jsx, Footer.jsx, ParticleBackground.jsx, NotFound.jsx, 330/330 tests pass) |
| M3 | Core Profile Pages (Home, About, Skills, Contact) | Home hero & featured builds, About editorial view with authentic photo, Skills competency & certs matrix, Contact form & direct channels | M2 | DONE (Home.jsx, About.jsx, Skills.jsx, Contact.jsx, ScrollReveal.jsx, 330/330 tests pass) |
| M4 | Projects Showcase & Dedicated Details Pages | Projects ledger/grid with category filters, dynamic `/projects/:slug` case studies for all 17 projects with full specs & schematics | M2, M3 | DONE (Projects.jsx, ProjectDetail.jsx, 43 assets, 330/330 tests pass) |
| M5 | E2E Integration, Playwright Verification & Polish | E2E test execution, Playwright cross-device screenshots (desktop/mobile), zero console errors, DESIGN_DECISIONS.md | M3, M4 | DONE (330/330 tests pass, verify-layout 38/38 pass, clean audit, DESIGN_DECISIONS.md) |

---

## Interface Contracts

### Theme Context
```ts
interface ThemeContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
}
```

### Project Model
```ts
interface Project {
  slug: string;
  title: string;
  subtitle: string;
  category: 'embedded' | 'iot' | 'digital-logic' | 'software';
  categoryLabel: string;
  featured: boolean;
  order: number;
  period: string;
  image: string; // Valid URL or path in /work/
  summary: string;
  overview: string;
  problem: string;
  solution: string;
  hardwareStack: string[];
  softwareStack: string[];
  challenges: string[];
  links: { label: string; url: string; type: 'github' | 'hackster' | 'live' | 'report' }[];
  metrics?: { label: string; value: string }[];
}
```

### Developer Profile Model
```ts
interface DeveloperProfile {
  name: string;
  title: string;
  subtitle: string;
  cgpa: string;
  deanLister: boolean;
  ojtTargetHours: number;
  location: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  bio: string[];
  education: Array<{ institution: string; degree: string; period: string; honors?: string }>;
  experience: Array<{ role: string; organization: string; period: string; details: string[] }>;
  leadership: Array<{ role: string; organization: string; period: string; details: string[] }>;
  certifications: Array<{ title: string; issuer: string; date: string; file?: string }>;
}
```

---

## Code Layout

```
C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio\
├── public/
│   ├── work/                        # Authentic project images (17 projects + case studies)
│   ├── certificates/                # Authentic certification images
│   └── mary-grace-1x1-id-image.jpg  # Authentic portrait photo
├── src/
│   ├── components/
│   │   ├── Nav.jsx                  # Header navigation with theme toggle & mobile drawer
│   │   ├── Footer.jsx               # Authentic footer with copyright & quick channels
│   │   ├── ThemeToggle.jsx          # Tactile theme toggle button
│   │   ├── ParticleBackground.jsx   # 60fps canvas circuit mesh animation
│   │   ├── ProjectCard.jsx          # Interactive card linking to /projects/:slug
│   │   ├── CategoryPills.jsx        # Category filter selector
│   │   └── ContactForm.jsx          # Validated contact form
│   ├── context/
│   │   └── ThemeContext.jsx         # Theme provider with localStorage persistence
│   ├── data/
│   │   ├── projects.js              # Complete authentic 17-project dataset
│   │   └── profile.js               # Complete authentic developer profile & skills
│   ├── pages/
│   │   ├── Home.jsx                 # Landing view with hero, OJT badge, featured projects
│   │   ├── Projects.jsx             # Showcase catalog with search & category filters
│   │   ├── ProjectDetail.jsx        # Dedicated case study page for /projects/:slug
│   │   ├── About.jsx                # Profile, education, leadership, ESL experience
│   │   ├── Skills.jsx               # Competencies matrix & credentials showcase
│   │   ├── Contact.jsx              # Direct contact details & form
│   │   └── NotFound.jsx             # Themed 404 recovery page
│   ├── styles/
│   │   └── app.css                  # Tailwind v4 @theme & CSS custom property tokens
│   ├── App.jsx                      # Router & layout provider
│   └── main.jsx                     # React DOM entry point
├── DESIGN_DECISIONS.md              # Design decisions, color tokens, typography & motion
└── package.json                     # Project scripts and dependencies
```
