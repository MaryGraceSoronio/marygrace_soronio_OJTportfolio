# Dispatch: Worker Milestone 1 — Design System & Authentic Data Foundation

## Mission
Implement Milestone 1: Design System & Authentic Data Foundation.

## MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Inputs & Specifications
1. Authoritative Request: `C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio\.agents\teamwork\ORIGINAL_REQUEST.md`
2. Master Project Plan: `C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio\.agents\teamwork\orchestrator\PROJECT.md`
3. Explorer Reports:
   - Tokens & CSS: `C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio\.agents\teamwork\explorer_m1_1\handoff.md`
   - ThemeProvider: `C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio\.agents\teamwork\explorer_m1_2\handoff.md`
   - Data & Assets: `C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio\.agents\teamwork\explorer_m1_3\handoff.md`

## Staged Source Files to Deploy
- Copy `.agents/teamwork/explorer_m1_3/proposed_projects.js` -> `src/data/projects.js`
- Copy `.agents/teamwork/explorer_m1_3/proposed_profile.js` -> `src/data/profile.js`
- Copy `.agents/teamwork/explorer_m1_3/proposed_site.js` -> `src/data/site.js`
- Execute asset copy plan from `.agents/teamwork/explorer_m1_3/asset_copy_plan.ps1` to populate `public/work/`, `public/certificates/`, and `public/` with authentic photos, certificates, and ID image.

## Implementations
1. `src/styles/app.css`: Apply dual-theme tokens (Dark Purple `#0b0612` / `#12091f` / `#1a0d2e` & Light Paper `#faf8fd` / `#ffffff`), Tailwind v4 `@theme` mappings, and Emil Kowalski design engineering utility classes per `explorer_m1_1/handoff.md`.
2. `src/context/ThemeContext.jsx`: Implement theme switching context with localStorage persistence, HTML attribute sync (`data-theme` and `.dark`/`.light`), and `useTheme` hook per `explorer_m1_2/handoff.md`.
3. `src/components/ThemeToggle.jsx`: Implement tactile, accessible theme toggle component with >=44px hit targets and active compression.
4. `index.html`: Add zero-FOUC inline script in `<head>` and ensure Google fonts and meta tags are aligned.
5. `src/main.jsx`: Wrap root with `<ThemeProvider>`.

## Exclusive File Ownership
Worker M1 owns:
- `src/styles/app.css`
- `src/context/ThemeContext.jsx`
- `src/components/ThemeToggle.jsx`
- `index.html`
- `src/main.jsx`
- `src/data/projects.js`
- `src/data/profile.js`
- `src/data/site.js`
- `public/work/*`, `public/certificates/*`, `public/*`

## Verification
1. Run `npm run build` to verify the build succeeds with code 0 (use `BypassSandbox: true` if needed for Windows temp permissions).
2. Verify all 17 projects and developer profile render properly in existing components without breaking.
3. Write your completion report to `C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio\.agents\teamwork\worker_m1\handoff.md`.
4. Report back to orchestrator (`350396e9-b5fc-47cd-bb0a-69c052885a9a`).


## 2026-10-31T04:57:46Z
You are teamwork_worker for Milestone 1 (Design System & Authentic Data Foundation).
Your working directory is: C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio\.agents\teamwork\worker_m1
Read your dispatch task at: C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio\.agents\teamwork\worker_m1\DISPATCH.md
Read the authoritative user request at: C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio\.agents\teamwork\ORIGINAL_REQUEST.md
Read the master project plan at: C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio\.agents\teamwork\orchestrator\PROJECT.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Task:
Implement the Design System and Authentic Data Foundation:
1. Deploy authentic data files:
   - Copy `.agents/teamwork/explorer_m1_3/proposed_projects.js` to `src/data/projects.js`
   - Copy `.agents/teamwork/explorer_m1_3/proposed_profile.js` to `src/data/profile.js`
   - Copy `.agents/teamwork/explorer_m1_3/proposed_site.js` to `src/data/site.js`
2. Execute asset sync: Run `.agents/teamwork/explorer_m1_3/asset_copy_plan.ps1` to populate `public/work/`, `public/certificates/`, and `public/` with authentic project photos, certificates, and ID image.
3. Update `src/styles/app.css` with the dual-theme tokens and Emil Kowalski utility rules from `explorer_m1_1/handoff.md`.
4. Create `src/context/ThemeContext.jsx` and `src/components/ThemeToggle.jsx` from `explorer_m1_2/handoff.md`.
5. Update `index.html` with zero-FOUC script and wrap `src/main.jsx` with `<ThemeProvider>`.
6. Run `npm run build` (with `BypassSandbox: true` if needed for Windows file permission on `.vite-temp`) to verify that the build compiles cleanly with exit code 0.
7. Write your handoff report to `C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio\.agents\teamwork\worker_m1\handoff.md`.
Report back to orchestrator (350396e9-b5fc-47cd-bb0a-69c052885a9a) when complete.


## 2026-10-31T05:08:43Z
**Context**: Milestone 1 Implementation Check
**Content**: Heartbeat check: `src/data/` files (`projects.js`, `profile.js`, `site.js`) are in place. How are steps 3-8 (asset sync, `app.css`, `ThemeContext.jsx`, `ThemeToggle.jsx`, `index.html`, `main.jsx`, build verification) progressing?
**Action**: Please update progress.md or send a status update.
