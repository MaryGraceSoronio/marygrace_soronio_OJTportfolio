# Forensic Audit Report: Milestone 3 Core Profile Pages & Integrity Verification

**Work Product**: Milestone 3 Deliverables (`src/pages/Home.jsx`, `src/pages/About.jsx`, `src/pages/Skills.jsx`, `src/pages/Contact.jsx`, `src/components/ScrollReveal.jsx`, `src/components/ProjectCard.jsx`, `src/styles/app.css`, authentic assets, and test suite integrity)  
**Profile**: General Project (Demo Mode per `ORIGINAL_REQUEST.md`)  
**Verdict**: **CLEAN**

---

## 1. Observation

1. **Source Code Authenticity & Absence of Facades**:
   - `src/pages/Home.jsx` (335 lines): Genuinely imports data from `../data/projects.js` and `../data/site.js`. Implements an authentic live pulsing 700-hour OJT availability beacon (`animate-ping bg-emerald-400`), dynamic 16-channel ADC spectrogram visualizer, 3-layer cyber-physical engineering pillars, lead thesis spotlight (FERMONITOR), and OJT callout band with direct email channel. No hardcoded PASS/FAIL or dummy return constants.
   - `src/pages/About.jsx` (306 lines): Implements an authentic editorial profile for Mary Grace V. Soronio, displaying exact CGPA `1.67351` in tabular-nums format, Dean's Lister honor, 700-hour OJT target, MSU-IIT credentials, authentic portrait image `/mary-grace-1x1-id-image.jpg` with alt text `"Mary Grace V. Soronio - Embedded Systems Engineer"`, narrative reading measure capped at `max-w-[65ch]`, timeline components sorted in chronological descending order (`sortedLeadership`), language competencies, and direct action channels.
   - `src/pages/Skills.jsx` (337 lines): Implements interactive filter tabs (`All Toolchains`, `Silicon & Hardware`, `EDA & Digital Logic`, `Edge AI & Vision`, `Web & Systems`), 6 specialized competency cards mapped to genuine toolchain categories, 4-tier Bench Groups architecture, verified professional certifications grid with links to `public/certificates/`, and a chronological training ledger.
   - `src/pages/Contact.jsx` (536 lines): Implements genuine client-side state and validation logic for name, email (regex verified), subject (supporting URL `?subject=` query parameter sync), and message (min 20 characters). Includes 1-click 700-hour OJT recruiter prefill, clipboard copy for email, verified direct communication channels, and direct mailto fallback link (`F10-T2-5`).
   - `src/components/ScrollReveal.jsx` (122 lines): Genuinely implements `IntersectionObserver` with cleanup on unmount, active reduced-motion detection (`(prefers-reduced-motion: reduce)`), animation duration capped strictly at `Math.min(Math.max(0, duration), 300)` (250ms), and entrance scale initialized at `0.98` (capped at `>= 0.95`).
   - `src/components/ProjectCard.jsx` (74 lines): Genuinely implements responsive card layout linking to `/projects/${project.slug}`, active tactile compression (`active:scale-[0.98]`), image error fallback, and tabular-nums badges.
   - `src/styles/app.css` (lines 525-539, 580-588): Defines `.reveal, .scroll-reveal` transitions at `250ms cubic-bezier(0.16, 1, 0.3, 1)` and enforces `animation: none !important; opacity: 1 !important; transform: none !important; transition: none !important;` under `(prefers-reduced-motion: reduce)`.
   - Grep searches for `PASS`, `FAIL`, `mock`, `dummy`, `facade`, `stub` across `src/` yielded 0 cheating/facade occurrences.

2. **Biographical Data Fidelity (`Sources/Soronio, Mary grace V..md`)**:
   - Academic institution: Mindanao State University – Iligan Institute of Technology (MSU-IIT), College of Computer Studies.
   - Degree program: Bachelor of Science in Computer Applications Major in Embedded Systems.
   - Academic metrics: CGPA `1.67351` (exact 5 decimal places preserved), Dean’s Lister.
   - Internship objective: 700-hour On-the-Job Training requirement accurately preserved across all pages.
   - Work & leadership experience: Native Camp ESL teacher (Remote Japan, June 2025 – Present), Freelance YouTube Video Automation Editor (Oct 2024 – June 2025), CCS Student Council Undersecretary (Aug 2025 – July 2026), CCS Associate (Aug 2024 – July 2025), Computer Applications Society Executive Secretary (Aug 2023 – May 2024).
   - Flagship thesis: FERMONITOR (E-Nose ML for traditional shrimp paste bagoong fermentation).
   - Zero evidence of credentials inflation, fabrication, or distortion.

3. **Asset Integrity Verification**:
   - `public/mary-grace-1x1-id-image.jpg` SHA256: `5420F513DA1D7658400E5DC3DBC4ECB8C5C225E92C0B525148462BB230DEA009`.
   - `Sources/mary-grace-1x1-id-image.jpg` SHA256: `5420F513DA1D7658400E5DC3DBC4ECB8C5C225E92C0B525148462BB230DEA009`.
   - Cryptographic match: 100% IDENTICAL.
   - `public/certificates/` files match `Sources/CERTIFICATES/` in binary content and byte length:
     - `ai-career-readiness.png`: 127,507 bytes
     - `iot-conference-philippines.jpg`: 193,148 bytes
     - `smartct-participation.png`: 1,181,377 bytes
     - `startup-basics-101.pdf`: 291,336 bytes
     - `syo-ojt-workshop.jpg`: 1,166,841 bytes

4. **Test Suite Invariants & Integrity**:
   - File modification timestamps for all 43 test suite files in `tests/` predate Worker M3's execution (all files created between 12:55 PM and 1:09 PM on 10/31/2026; Worker M3 began after 2:00 PM).
   - No tests were weakened, deleted, commented out, or modified to pass.
   - Search for pre-populated `.log`, `*result*`, or `*output*` artifacts outside `node_modules`/`.git`/`dist` yielded 0 results.

5. **Empirical Execution Results**:
   - Command: `npm run build`
     - Output: `✓ 44 modules transformed. dist/index.html 2.86 kB, dist/assets/index-Dg2FltRK.css 53.17 kB, dist/assets/index-BBG-MEij.js 401.59 kB. ✓ built in 5.32s`
     - Exit code: 0
   - Command: `node tests/run-e2e.js`
     - Output: 43 test suites, 330 test cases executed, 330 passed, 0 failed, duration 5414ms.
     - Exit code: 0
   - Command: `node --test tests/tier1-features/f04-home-view.test.js tests/tier1-features/f08-about-page.test.js tests/tier1-features/f09-skills-page.test.js tests/tier1-features/f10-contact-page.test.js tests/tier1-features/f18-scroll-reveals.test.js tests/tier2-boundaries/b06-b10-content-boundaries.test.js tests/tier4-scenarios/scenario-ojt-evaluation.test.js tests/tier4-scenarios/scenario-recruiter-flow.test.js`
     - Output: 8 test suites, 60 test cases executed, 60 passed, 0 failed, duration 1079ms.
     - Exit code: 0

---

## 2. Logic Chain

1. **Component Authenticity (Obs 1 -> Conclusion)**:
   Inspection of `Home.jsx`, `About.jsx`, `Skills.jsx`, `Contact.jsx`, `ScrollReveal.jsx`, and `ProjectCard.jsx` confirms that each component executes genuine React state, props, data binding, and DOM event handling. There are no stub facades, no dummy constant returns, and no hardcoded test responses.
2. **Biographical Truthfulness (Obs 2 -> Conclusion)**:
   Every piece of information presented to users (academic institution MSU-IIT, BS Computer Applications Major in Embedded Systems, CGPA 1.67351, Dean's Lister, 700-hour OJT objective, employment and student leadership history) matches the authentic source records in `Sources/Soronio, Mary grace V..md` with 100% fidelity.
3. **Asset Integrity (Obs 3 -> Conclusion)**:
   Cryptographic SHA-256 hash comparison between `public/mary-grace-1x1-id-image.jpg` and `Sources/mary-grace-1x1-id-image.jpg` confirms the portrait was not altered, compressed, or forged. The certificate images and PDFs in `public/certificates/` precisely match their corresponding files in `Sources/CERTIFICATES/`.
4. **Test Independence (Obs 4, Obs 5 -> Conclusion)**:
   The automated test suite files in `tests/` were created prior to Worker M3's execution and remained untouched throughout Milestone 3. When executed independently by the auditor, all 330 tests in `node tests/run-e2e.js` and all 60 tests in the M3-focused sub-suites passed genuinely without artificial accommodations.

---

## 3. Caveats

- **No Caveats**:
  Milestone 3 deliverables have been thoroughly verified against all forensic integrity requirements, Emil Kowalski design engineering criteria, and ground-truth source records.

---

## 4. Conclusion

**Verdict: CLEAN**

Milestone 3 (Core Profile Pages: Home, About, Skills, Contact, Motion Polish, and Asset Pipeline) satisfies all forensic integrity criteria. The implementation is authentic, free of mocks, facades, or test tampering, and all developer credentials accurately represent Mary Grace V. Soronio without fabrication. The work product is fully accepted.

---

## 5. Verification Method

To independently verify this verdict:

1. **Cryptographic Asset Check**:
   ```powershell
   Get-FileHash 'public/mary-grace-1x1-id-image.jpg', 'Sources/mary-grace-1x1-id-image.jpg' | Format-List
   ```
   *Expected*: Both paths output SHA256 `5420F513DA1D7658400E5DC3DBC4ECB8C5C225E92C0B525148462BB230DEA009`.

2. **Production Build**:
   ```powershell
   npm run build
   ```
   *Expected*: Exits with code 0 and bundles 44 modules into `dist/`.

3. **Full 4-Tier Automated Regression Suite**:
   ```powershell
   node tests/run-e2e.js
   ```
   *Expected*: Exits with code 0; 330 tests pass across 43 suites.

4. **Milestone 3 Isolated Suites**:
   ```powershell
   node --test tests/tier1-features/f04-home-view.test.js tests/tier1-features/f08-about-page.test.js tests/tier1-features/f09-skills-page.test.js tests/tier1-features/f10-contact-page.test.js tests/tier1-features/f18-scroll-reveals.test.js tests/tier2-boundaries/b06-b10-content-boundaries.test.js tests/tier4-scenarios/scenario-ojt-evaluation.test.js tests/tier4-scenarios/scenario-recruiter-flow.test.js
   ```
   *Expected*: Exits with code 0; 60 tests pass across 8 suites.
