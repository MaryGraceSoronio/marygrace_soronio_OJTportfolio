# Dispatch: Worker Milestone 3 — Core Profile Pages (Home, About, Skills, Contact)

## Mission
Implement Milestone 3: Core Profile Pages (Home, About, Skills, Contact) and Scroll Reveal infrastructure.

## MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Inputs & Specifications
1. Authoritative Request: `C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio\.agents\teamwork\ORIGINAL_REQUEST.md`
2. Master Project Plan: `C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio\.agents\teamwork\orchestrator\PROJECT.md`
3. Explorer Handoff Reports & Proposed Components:
   - Explorer M3-1: `C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio\.agents\teamwork\explorer_m3_1\handoff.md` and `proposed_Home.jsx`, `proposed_ProjectCard.jsx`
   - Explorer M3-2: `C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio\.agents\teamwork\explorer_m3_2\handoff.md` and `proposed_About.jsx`, `proposed_Skills.jsx`
   - Explorer M3-3: `C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio\.agents\teamwork\explorer_m3_3\handoff.md` and `proposed_Contact.jsx`, `proposed_ScrollReveal.jsx`, `proposed_Reveal.jsx`, `proposed_app_css.patch`

## Implementations Required
1. Copy and integrate proposed page components:
   - Copy `explorer_m3_1/proposed_Home.jsx` -> `src/pages/Home.jsx`
   - Copy `explorer_m3_1/proposed_ProjectCard.jsx` -> `src/components/ProjectCard.jsx`
   - Copy `explorer_m3_2/proposed_About.jsx` -> `src/pages/About.jsx`
   - Copy `explorer_m3_2/proposed_Skills.jsx` -> `src/pages/Skills.jsx`
   - Copy `explorer_m3_3/proposed_Contact.jsx` -> `src/pages/Contact.jsx`
   - Copy `explorer_m3_3/proposed_ScrollReveal.jsx` -> `src/components/ScrollReveal.jsx`
   - Copy `explorer_m3_3/proposed_Reveal.jsx` -> `src/components/Reveal.jsx`
2. Apply `app.css` patch from `explorer_m3_3/proposed_app_css.patch` for `.scroll-reveal` and 250ms motion duration.
3. Ensure portrait photo `Sources/mary-grace-1x1-id-image.jpg` is copied to `public/mary-grace-1x1-id-image.jpg` and `public/work/mary-grace-1x1-id-image.jpg` so portrait displays without broken images. Also copy any certificates from `Sources/CERTIFICATES/` to `public/certificates/`.
4. Update `src/App.jsx` to render the newly created page components (`Home`, `About`, `Skills`, `Contact`, `NotFound`) on their respective routes.
5. Verify build and test suite:
   - Run `npm run build` (with `BypassSandbox: true` if needed for Windows temp permissions). Must exit code 0.
   - Run `npm test` or `node tests/run-e2e.js`. All 330 tests must pass.
6. Write handoff report to `C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio\.agents\teamwork\worker_m3\handoff.md`.
7. Report back to orchestrator (`350396e9-b5fc-47cd-bb0a-69c052885a9a`).


## 2026-10-31T06:10:59Z
You are teamwork_worker for Milestone 3 (Core Profile Pages: Home, About, Skills, Contact).
Your working directory is: C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio\.agents\teamwork\worker_m3
Read your dispatch at: C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio\.agents\teamwork\worker_m3\DISPATCH.md
Read the authoritative user request at: C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio\.agents\teamwork\ORIGINAL_REQUEST.md
Read the project master plan at: C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio\.agents\teamwork\orchestrator\PROJECT.md
Read the test invariants at: C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio\TEST_READY.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Implement Milestone 3:
1. Integrate proposed components from Explorer handoffs:
   - `src/pages/Home.jsx` & `src/components/ProjectCard.jsx` from `explorer_m3_1/`
   - `src/pages/About.jsx` & `src/pages/Skills.jsx` from `explorer_m3_2/`
   - `src/pages/Contact.jsx`, `src/components/ScrollReveal.jsx`, `src/components/Reveal.jsx`, and `app.css` patch from `explorer_m3_3/`
2. Ensure portrait image `Sources/mary-grace-1x1-id-image.jpg` is copied to `public/mary-grace-1x1-id-image.jpg` and `public/work/mary-grace-1x1-id-image.jpg`. Copy certificates from `Sources/CERTIFICATES/` to `public/certificates/`.
3. Update `src/App.jsx` to render the real page components on `/`, `/about`, `/skills`, `/contact`, and `*`.
4. Run `npm run build` (with `BypassSandbox: true` if needed for Windows temp permissions). Must exit code 0.
5. Run `npm test` or `node tests/run-e2e.js`. All 330 tests must pass.
6. Write handoff report to `C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio\.agents\teamwork\worker_m3\handoff.md`.
Report back to orchestrator (350396e9-b5fc-47cd-bb0a-69c052885a9a) when complete.
