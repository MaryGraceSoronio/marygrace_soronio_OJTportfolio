# Dispatch: Sub-Orchestrator Milestone 1 — Design System & Authentic Data Foundation

## Mission
Orchestrate and execute Milestone 1: Design System & Authentic Data Foundation for Mary Grace V. Soronio's portfolio.

## Key Documents
- Authoritative Request: `C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio\.agents\teamwork\ORIGINAL_REQUEST.md`
- Master Project Plan: `C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio\.agents\teamwork\orchestrator\PROJECT.md`
- Survey Reports:
  - Spec Miner: `C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio\.agents\teamwork\spec_miner_survey_1\handoff.md`
  - Content/Assets Explorer: `C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio\.agents\teamwork\explorer_survey_2\handoff.md`
  - Design/Architecture Explorer: `C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio\.agents\teamwork\explorer_survey_3\handoff.md`
- Working Directory: `C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio\.agents\teamwork\sub_orch_m1`

## Scope of Milestone 1
1. **Design System & Tokens (Features 12, 13, 14, 15, 16, 20, 21, 22)**:
   - Configure CSS custom properties and Tailwind v4 `@theme` in `src/styles/app.css` for both:
     - Dark Purple primary theme (obsidian `#0b0612`, surfaces `#12091f` / `#1a0d2e`, violet accents `#9d4edd` / `#a855f7`, contrast text `#f5f2fb`)
     - Light Theme option (violet-tinted paper `#faf8fd`, card surfaces `#ffffff`, dark text `#150d24`, deep violet accents `#7c3aed`)
   - Create `src/context/ThemeContext.jsx` implementing theme switching, `localStorage` persistence, zero-FOUC initialization, and HTML element attributes (`data-theme` and `.dark`/`.light` class).
   - Base typography and Emil Kowalski micro-interaction rules (`tabular-nums`, `:active { transform: scale(0.97); }`, min 44px tap targets, max 65ch line length, fluid font sizing).
2. **Authentic Data Layer & Asset Pipeline (Features 23, 24)**:
   - Update `src/data/projects.js` with complete, uncorrupted, authentic data for all 17 projects from `Sources/Soronio, Mary grace V..md` and `explorer_survey_2/handoff.md`.
   - Create `src/data/profile.js` with verified developer profile data (Mary Grace V. Soronio, BS Computer Applications Major in Embedded Systems, MSU-IIT, CGPA 1.67351 Dean's Lister, 700-hour OJT goal, leadership roles, ESL experience, certifications, contact info). ZERO FABRICATION.
   - Asset sync: Ensure all authentic screenshots (from `Sources/PROJECT PICTURES/` and `public/work/`), certificates, and 1x1 portrait photo (`Sources/mary-grace-1x1-id-image.jpg`) are accessible in `public/` so no project has broken images.
3. **Execution**:
   - Run the Explorer -> Worker -> Reviewer -> Challenger -> Auditor iteration loop per the Project Pattern.
   - Worker must verify build (`npm run build`).
   - Deliver gate verdict and report back to parent orchestrator (`350396e9-b5fc-47cd-bb0a-69c052885a9a`).
