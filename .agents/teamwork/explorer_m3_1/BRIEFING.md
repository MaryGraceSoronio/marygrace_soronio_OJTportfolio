# BRIEFING — 2026-10-31T06:08:00Z

## Mission
Investigate and design the Home view (`src/pages/Home.jsx`) for Milestone 3, featuring embedded identity, 700-hr OJT beacon, telemetry teaser, and featured builds.

## 🔒 My Identity
- Archetype: explorer
- Roles: investigation, synthesis
- Working directory: C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio\.agents\teamwork\explorer_m3_1
- Original parent: 350396e9-b5fc-47cd-bb0a-69c052885a9a
- Milestone: Milestone 3 (Home Page Architecture)

## 🔒 Key Constraints
- Read-only investigation — do NOT implement directly in source code; write proposals and reports in own directory
- Strict adherence to Emil Kowalski standards (<=65ch measure, tabular numerals, >=44px hit bounds, 150-300ms transitions)
- Anti-AI slop: Authentic MSU-IIT embedded systems focus, FERMONITOR thesis spotlight, 700-hour OJT beacon
- Zero placeholder copy; use authentic data from src/data/projects.js and src/data/profile.js

## Current Parent
- Conversation ID: 350396e9-b5fc-47cd-bb0a-69c052885a9a
- Updated: 2026-10-31T06:08:00Z

## Investigation State
- **Explored paths**: `src/pages/Home.jsx`, `src/components/Hero.jsx`, `src/components/ProjectCard.jsx`, `src/components/Reveal.jsx`, `src/data/projects.js`, `src/data/profile.js`, `src/data/site.js`, `src/styles/app.css`, `tests/run-e2e.js`, `tests/tier1-features/f04-home-view.test.js`, `tests/tier1-features/f25-ojt-callout.test.js`, `tests/tier2-boundaries/b01-b05-navigation-boundaries.test.js`.
- **Key findings**:
  1. Regression suite contains 330 active tests across 4 tiers, all currently passing (exit code 0).
  2. Home page requires explicit establishment of Mary Grace V. Soronio's embedded engineering identity, MSU-IIT institution, CGPA 1.67351, Dean's Lister honors, and 700-hour OJT availability.
  3. Live pulsing beacon with radar ping animation (`animate-ping`) highlights the 700-hour OJT availability in both Hero and footer Callout Band.
  4. Telemetry panel provides real-time system readout and 16-channel ADC signal spectrogram with staggered delays.
  5. 3-pillar Cyber-Physical engineering layer bridges physical silicon (ADS1115, MQ arrays, STM32F4) to real-time firmware (FreeRTOS, RT-Thread, VHDL) and connected web dashboards (SQLite, store-and-forward Firebase).
  6. Featured builds showcase spotlights flagship thesis FERMONITOR and highlighted embedded projects (`drying-oven`, `room-monitoring`).
  7. Strict Emil Kowalski standards enforced: <=65ch reading measure, tabular numerals on all numeric values, >=44px hit bounds, tactile active compression `:active { transform: scale(0.97/0.98); }`.
- **Unexplored areas**: None for Home view architecture.

## Key Decisions Made
- Authored drop-in `proposed_Home.jsx` in explorer workspace.
- Authored companion `proposed_ProjectCard.jsx` with tactile active scale and tabular numerals.
- Maintained 100% backward compatibility with static test assertions in `f04`, `f16`, `f25`.

## Artifact Index
- `DISPATCH.md` — Task instructions and dispatch log
- `BRIEFING.md` — Persistent working memory
- `progress.md` — Liveness heartbeat log
- `proposed_Home.jsx` — Complete proposed drop-in implementation of Home page
- `proposed_ProjectCard.jsx` — Enhanced tactile project card component
- `handoff.md` — Formal 5-component handoff report for Worker M3-1
