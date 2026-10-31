# Dispatch: Worker Milestone 2 — Navigation Shell, Routing & Canvas Background

## Mission
Implement Milestone 2: Navigation Shell, Routing & Canvas Background for Mary Grace's portfolio.

## MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Inputs & Specifications
1. Authoritative Request: `C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio\.agents\teamwork\ORIGINAL_REQUEST.md`
2. Master Project Plan: `C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio\.agents\teamwork\orchestrator\PROJECT.md`
3. Explorer Handoff Reports & Proposed Components:
   - Explorer M2-1: `C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio\.agents\teamwork\explorer_m2_1\handoff.md` and `proposed_NotFound.jsx`
   - Explorer M2-2: `C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio\.agents\teamwork\explorer_m2_2\handoff.md` and `proposed_Nav.jsx`, `proposed_MobileDrawer.jsx`, `proposed_Footer.jsx`, `proposed_Header.jsx`
   - Explorer M2-3: `C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio\.agents\teamwork\explorer_m2_3\handoff.md` and `proposed_ParticleBackground.jsx`, `AmbientCanvas.jsx`, `proposed_transitions.md`

## Implementations Required
1. Copy / integrate proposed components:
   - `src/components/Nav.jsx` (sticky floating header with active route styling, theme toggle, OJT beacon, mobile drawer trigger)
   - `src/components/Header.jsx` (backward-compatibility re-export shim)
   - `src/components/MobileDrawer.jsx` (slide-down drawer, body scroll lock, focus trap, >=44px hit targets)
   - `src/components/Footer.jsx` (authentic footer with MSU-IIT credentials, CGPA 1.67351, 700h OJT, verified links)
   - `src/components/ParticleBackground.jsx` (60fps canvas telemetry circuit mesh with mouse spring physics & reduced-motion 0fps override)
   - `src/components/AmbientCanvas.jsx` (re-export shim)
   - `src/components/NotFound.jsx` (and/or `src/pages/NotFound.jsx`) (themed dark purple 404 recovery page)
2. Routing & App Shell (`src/App.jsx`):
   - Wire declarative client-side routing across `/`, `/projects`, `/projects/:slug`, `/about`, `/skills`, `/contact`, and `*`.
   - Provide route page wrappers with smooth transition styles.
   - Ensure existing components (`Hero`, `WorkLedger`, `Toolchain`, `Beyond`, `Training`, `ContactBand`) remain wired to respective routes or views.
3. Exclusive File Ownership:
   - Worker M2 owns:
     - `src/App.jsx`
     - `src/components/Nav.jsx`
     - `src/components/Header.jsx`
     - `src/components/MobileDrawer.jsx`
     - `src/components/Footer.jsx`
     - `src/components/ParticleBackground.jsx`
     - `src/components/AmbientCanvas.jsx`
     - `src/components/NotFound.jsx` (and `src/pages/NotFound.jsx`)
     - `src/styles/app.css` (for any page transition keyframe additions)

## Verification
1. Run `npm run build` (with `BypassSandbox: true` if needed for Windows temp permissions). Must exit code 0.
2. Run `node tests/run-e2e.js` or `npm test` to verify all 330 tests pass.
3. Write handoff report to `C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio\.agents\teamwork\worker_m2\handoff.md`.
4. Report back to orchestrator (`350396e9-b5fc-47cd-bb0a-69c052885a9a`).


## 2026-10-31T05:34:46Z
From: 350396e9-b5fc-47cd-bb0a-69c052885a9a
You are teamwork_worker for Milestone 2 (Navigation Shell, Routing & Canvas Background).
Implement Milestone 2:
1. Copy and integrate proposed components from Explorer handoffs:
   - `src/components/Nav.jsx`, `src/components/Header.jsx`, `src/components/MobileDrawer.jsx`, `src/components/Footer.jsx` from `explorer_m2_2/`
   - `src/components/ParticleBackground.jsx` and `src/components/AmbientCanvas.jsx` from `explorer_m2_3/`
   - `src/components/NotFound.jsx` (and `src/pages/NotFound.jsx`) from `explorer_m2_1/`
2. Wire declarative client-side routing in `src/App.jsx` across `/`, `/projects`, `/projects/:slug`, `/about`, `/skills`, `/contact`, and `*`.
3. Verify build and tests:
   - Run `npm run build` (use `BypassSandbox: true` if needed for Windows temp permissions). Must exit code 0.
   - Run `node tests/run-e2e.js` or `npm test`. All 330 tests must pass.
4. Write handoff report to `C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio\.agents\teamwork\worker_m2\handoff.md`.
Report back to orchestrator (350396e9-b5fc-47cd-bb0a-69c052885a9a) when complete.
