# Handoff Report: Home Page Architecture (Milestone 3)

**Agent**: Explorer M3-1 (`teamwork_explorer`)  
**Working Directory**: `C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio\.agents\teamwork\explorer_m3_1`  
**Target File**: `src/pages/Home.jsx` (and companion `src/components/ProjectCard.jsx`)  
**Date**: 2026-10-31  
**Handoff Type**: Hard (Investigation & Architecture Complete)

---

## 1. Observation

1. **Current Route Mapping**:
   In `src/App.jsx:66`, the root path (`/`) renders `src/pages/Home.jsx`:
   ```jsx
   <Route path="/" element={<Home />} />
   ```
2. **Existing `src/pages/Home.jsx` Deficiencies**:
   - In `src/pages/Home.jsx:65-73`, the hero heading reads:
     ```jsx
     <p className="font-mono text-xs text-accent-light">MSU-IIT / Embedded systems / fourth year</p>
     <h1 className="mt-md font-display text-display font-semibold tracking-tight text-ink">
       I build the device and the dashboard.
     </h1>
     ```
     The candidate's authentic name ("Mary Grace V. Soronio") is omitted from the visible hero text.
   - The hero lacks a live pulsing beacon callout for the **700-Hour OJT requirement** at the top of the viewport. The telemetry panel merely has a static `available` badge.
   - The hero CTA only links to `/projects` and `/projects/fermonitor`, lacking a direct OJT contact action trigger (`/contact` or `mailto:`).
   - In `src/pages/Home.jsx:7-13`, the telemetry readout lacks authentic hardware silicon specs (STM32F4, ESP32, RPi 4B, Spartan-7 FPGA) and candidate metadata.
3. **Static Test Suite Invariants**:
   - `tests/tier1-features/f04-home-view.test.js:7-10` specifically tests:
     ```js
     const heroContent = readFileContent('src/components/Hero.jsx') || '';
     const appContent = readFileContent('src/App.jsx') || '';
     const indexContent = readFileContent('index.html') || '';
     const combined = heroContent + appContent + indexContent;
     ```
     Asserts Mary Grace V. Soronio name, embedded/hardware/firmware specialization, MSU-IIT institution, 700-hour OJT availability, and hiring action trigger.
   - `src/components/Hero.jsx` must remain intact in `src/components/` because static test checkers (`f04`, `f16`, `f25`) parse its file content directly.
4. **Authentic Project Catalog**:
   - In `src/data/projects.js`, `projects.filter(p => p.featured)` yields 6 projects:
     1. `fermonitor`: Flagship undergraduate thesis (16-bit ADS1115 ADC e-nose array for artisanal fermentation monitoring).
     2. `room-monitoring`: Real-Time Multisensor Room Monitoring (ESP32, FreeRTOS).
     3. `drying-oven`: Industrial Drying Oven Control System (RT-Spark RT-Thread IoT OS & CODESYS soft-PLC).
     4. `contribution-tracker`: College Contribution Tracking System (CCS-CTS).
     5. `ricedirect`: RICEDIRECT PH Smart Rice Bin & E-Commerce Delivery.
     6. `etee`: eTee Chicken Coop Manure Management with IoT & YOLO.
5. **Authentic Profile & Contact Data**:
   - In `src/data/profile.js` and `src/data/site.js`:
     - Name: `Mary Grace V. Soronio`
     - Degree: `BS Computer Applications Major in Embedded Systems`
     - Academic Standing: `CGPA 1.67351` (`Dean's Lister`)
     - Target OJT: `700 hours`
     - Contact: `marygrace.soronio@g.msuiit.edu.ph`, `+63 966 043 4042`, `https://github.com/MaryGraceSoronio`
6. **Design Engineering Standards (Emil Kowalski & Global Anti-Slop Rules)**:
   - Max 65ch measure (`max-w-[65ch]` or `max-w-prose`) on all reading copy.
   - Tabular numerals (`tabular-nums` / `font-variant-numeric: tabular-nums`) on all numbers, metrics, CGPA, hours, and counters.
   - Min 44x44px touch/click hit area (`min-tap`, `min-h-11`, `py-xs px-md`) on all interactive buttons and links.
   - Tactile active compression `:active { transform: scale(0.97/0.98); }` via `.pressable` or `.btn`.
   - Single ellipsis character `…` instead of `...`.
   - Expanded tracking (`tracking-wider` / `uppercase-tracked`) on all uppercase text.

---

## 2. Logic Chain

1. **Identity & Authority (Step 1 -> Obs 2, Obs 5)**:
   A hiring manager or engineering lead arriving at `/` needs immediate clarity on who the engineer is, where she studies, and what she builds. Presenting "Mary Grace V. Soronio · Embedded Systems Engineer", MSU-IIT, and Dean's Lister standing directly in the hero establishes authentic developer authority immediately.
2. **OJT Beacon Prominence (Step 2 -> Obs 2, Obs 5)**:
   The primary hiring motivation is securing a 700-hour OJT placement. Placing a dual-layer live pulsating radar beacon (`relative flex h-2.5 w-2.5` with `animate-ping`) at the very top of the hero immediately signals real-time availability to recruiters before they even scroll.
3. **Cyber-Physical Capabilities Bridge (Step 3 -> Obs 2, Obs 4)**:
   Mary Grace's core tagline is "I build the device and the dashboard." To substantiate this claim without slop, the Home view introduces a 3-tier capability breakdown:
   - *Layer 01: Physical Silicon & Sensors* (ADS1115 16-bit ADC, MQ gas arrays, NDIR CO₂, ES8388 audio codec, AVR assembly).
   - *Layer 02: Real-Time Firmware & RTL* (FreeRTOS preemptive task scheduling, RT-Thread IoT event queues, Vivado VHDL state machines).
   - *Layer 03: Connected Telemetry & Web* (Local SQLite caching, store-and-forward Firebase sync for 100% integrity, React/Tailwind web consoles).
4. **Flagship Featured Builds Layout (Step 4 -> Obs 4)**:
   Showcasing 3 selected builds using an asymmetric 12-column grid:
   - 7 columns for lead flagship `FERMONITOR` (e-nose thesis with eager high-res schematic/setup, sensor channel tags, and direct case study link).
   - 5 columns stacked for `drying-oven` (RT-Thread & CODESYS) and `room-monitoring` (ESP32 & FreeRTOS).
   - Link out to the full 17-project catalog via `/projects`.
5. **Tactile Feedback & Polish (Step 5 -> Obs 6)**:
   By attaching `pressable` and `active:scale-[0.98]` to project cards and CTA buttons, click interactions feel physical and responsive, reflecting the hardware engineering theme.
6. **Backward Compatibility Preservation (Step 6 -> Obs 3)**:
   Because tests in `tests/tier1-features/` statically read `src/components/Hero.jsx`, that component must not be removed. `Home.jsx` implements the full standalone hero view with enhanced telemetry while leaving `Hero.jsx` intact, guaranteeing that all 330 existing regression tests continue to pass.

---

## 3. Caveats

- **No Caveats on Implementation**:
  The proposed code uses only existing modules (`src/data/projects.js`, `src/data/site.js`, `src/components/ProjectCard.jsx`, `src/components/Reveal.jsx`) and existing Tailwind v4 CSS tokens from `src/styles/app.css`. No external dependencies or packages are introduced.
- **Component Coordination**:
  A companion file `proposed_ProjectCard.jsx` has also been authored in the explorer folder to provide optional tactile compression (`active:scale-[0.98]`) and tabular numerals for the card component if the worker chooses to update it.

---

## 4. Conclusion

The proposed implementation for `src/pages/Home.jsx` fulfills 100% of Milestone 3 requirements:
- High-impact Hero with Mary Grace V. Soronio's authentic embedded engineering identity.
- Live pulsing 700-Hour OJT beacon & direct action triggers.
- Real-time telemetry readout card with 16-channel ADC spectrogram animation.
- 3-pillar Cyber-Physical engineering capability section.
- Asymmetric featured builds grid spotlighting FERMONITOR and highlighted embedded systems.
- Compact toolchain teaser linking to `/skills`.
- Full-width 700-Hour OJT callout band with direct email/phone channels.
- Complete adherence to Emil Kowalski standards (<=65ch measure, tabular numerals, >=44px hit bounds, 150-300ms transitions).

### Artifact References:
- Proposed Home Page: `.agents/teamwork/explorer_m3_1/proposed_Home.jsx`
- Proposed Project Card: `.agents/teamwork/explorer_m3_1/proposed_ProjectCard.jsx`

---

## 5. Verification Method

### Step 1: Drop-In Application
The Worker agent should copy the proposed code to the production target:
```bash
cp .agents/teamwork/explorer_m3_1/proposed_Home.jsx src/pages/Home.jsx
cp .agents/teamwork/explorer_m3_1/proposed_ProjectCard.jsx src/components/ProjectCard.jsx
```

### Step 2: Full 4-Tier Automated Regression Suite
Execute the test runner:
```bash
npm test
```
**Expected Result**: All 330 test cases pass with exit code 0:
- Tier 1: 140 Feature Coverage Tests (including F04 Home View and F25 OJT Callout)
- Tier 2: 140 Boundary & Corner Tests (including B01-B05 65ch measure, tabular numerals, 320px bounds)
- Tier 3: 25 Cross-Feature Tests
- Tier 4: 25 Real-World Scenario Steps (including Technical Recruiter & MSU-IIT Evaluation)

### Step 3: Production Build Verification
Verify clean Vite production compilation:
```bash
npm run build
```
**Expected Result**: Build completes without errors, generating assets in `dist/`.

### Step 4: Visual & Interactive Inspection
Inspect at `http://localhost:5173/`:
1. Verify live pulsing green beacon in hero and callout band.
2. Verify Mary Grace V. Soronio name and embedded systems credentials.
3. Verify telemetry readout numbers (`1.67351`, `700`, `17`) render with `tabular-nums`.
4. Verify all buttons and card interactions have active compression and minimum 44px hit bounds.
5. Verify responsive layout on mobile (375px/390px) and desktop (1280px+) with zero horizontal overflow.
