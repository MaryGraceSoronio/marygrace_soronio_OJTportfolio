# Test Infrastructure & Strategy: Mary Grace V. Soronio Developer Portfolio

## 1. Testing Philosophy & Architecture

The test suite for the Mary Grace V. Soronio Developer Portfolio is designed as an **opaque-box, requirement-driven, automated test system**. It validates the application purely through observable contracts, DOM outputs, route behaviors, responsive layout invariants, design system tokens, and user journey workflows without coupling to internal component implementations.

### Core Principles
1. **Opaque-Box Verification**: Tests assert observable outcomes (DOM structures, computed tokens, route resolution, state persistence, accessibility targets) rather than private implementation details.
2. **Authoritative Specification Derivation**: Every test case derives directly from:
   - `ORIGINAL_REQUEST.md`: Requirements R1–R4 and Acceptance Criteria.
   - `Instruction.md`: Master Redesign Instructions (§1–§17).
   - `PROJECT.md`: Feature Inventory (Features 1–28) and Interface Contracts.
   - Authentic CV & Asset Sources (`Sources/Soronio, Mary grace V..md`, `Sources/PROJECT PICTURES/`, `Sources/CERTIFICATES/`).
3. **Progressive Testability**: The test harness operates consistently across development milestones (M1–M5), verifying completed features while testing contracts and invariants for planned milestones.
4. **Zero-Dependency Native Execution**: Built on Node.js v26 native test runner (`node:test`) and strict assertions (`node:assert/strict`) for rapid, reliable execution across local and CI environments.

---

## 2. Systematic 4-Tier Test Architecture

The test suite is structured across four rigorous tiers ensuring depth, boundary safety, cross-feature coherence, and real-world user fidelity:

```
                          ┌─────────────────────────────────────┐
                          │    Tier 4: Real-World Scenarios     │
                          │   (5 End-to-End User Journeys)      │
                          └──────────────────┬──────────────────┘
                                             │
                          ┌──────────────────▼──────────────────┐
                          │    Tier 3: Pairwise Combinations    │
                          │  (Cross-Feature State Interactions) │
                          └──────────────────┬──────────────────┘
                                             │
                          ┌──────────────────▼──────────────────┐
                          │    Tier 2: Boundary & Corner Cases  │
                          │  (>=5 Edge Cases per Feature: 140+) │
                          └──────────────────┬──────────────────┘
                                             │
                          ┌──────────────────▼──────────────────┐
                          │    Tier 1: Feature Coverage         │
                          │ (>=5 Happy Path per Feature: 140+)  │
                          └─────────────────────────────────────┘
```

### Tier Breakdown
- **Tier 1 — Feature Coverage (>=5 tests per feature, >=140 tests)**:
  Verifies the primary contract, rendering, and functional behavior of each of the 28 features in isolation.
- **Tier 2 — Boundary & Corner Cases (>=5 tests per feature, >=140 tests)**:
  Exhaustively probes limits, malformed slugs, empty search states, extreme screen widths (320px to 3840px), rapid theme switching, null fallback graphics, and reduced-motion overrides.
- **Tier 3 — Cross-Feature Combinations (>=25 tests)**:
  Verifies pairwise interactions: theme switching while viewing a dedicated project slug, category filtering combined with viewport resizing, mobile drawer navigation resetting scroll and closing, form validation with direct mailto fallback, and canvas background respecting global theme changes.
- **Tier 4 — Real-World Application Scenarios (5 end-to-end user workflows)**:
  Simulates comprehensive real-world journeys:
  1. *Technical Recruiter Flow*: Evaluating embedded credentials, filtering projects, inspecting OJT status, and initiating contact.
  2. *Hardware Engineering Lead Audit*: Reviewing gas-sensor analog front-end, AVR assembly line robot, and FPGA drying oven schematics.
  3. *MSU-IIT Academic & OJT Coordinator Audit*: Verifying 700-hour requirement, CGPA 1.67351, Dean's Lister, and leadership credentials.
  4. *Mobile Hiring Manager Journey*: Full portfolio navigation, touch drawer, card interactions, and mailto trigger on a 390px mobile viewport.
  5. *Accessibility & Design Systems Audit*: Dark/Light theme contrast compliance, 44px tap targets, <=65ch reading measure, and reduced-motion safety.

---

## 3. Feature Inventory Test Matrix (28 Features)

| Feature # | Feature Name | Tier 1 Tests | Tier 2 Tests | Tier 3 Pairwise | Tier 4 Journey | Source Contract |
|:---:|:---|:---:|:---:|:---:|:---:|:---|
| **F01** | Multi-Page Router | 5 | 5 | ✓ | ✓ | `PROJECT.md § Architecture` |
| **F02** | Primary Navigation Header | 5 | 5 | ✓ | ✓ | `ORIGINAL_REQUEST R2` |
| **F03** | Mobile Navigation Drawer | 5 | 5 | ✓ | ✓ | `Instruction § 12` |
| **F04** | Home View (`/`) | 5 | 5 | ✓ | ✓ | `ORIGINAL_REQUEST R2` |
| **F05** | Projects Showcase (`/projects`) | 5 | 5 | ✓ | ✓ | `ORIGINAL_REQUEST R2` |
| **F06** | Category Filter Pills | 5 | 5 | ✓ | ✓ | `src/data/projects.js` |
| **F07** | Dedicated Project Details (`/projects/:slug`) | 5 | 5 | ✓ | ✓ | `Instruction § 7` |
| **F08** | About Page (`/about`) | 5 | 5 | ✓ | ✓ | `Sources/Soronio CV` |
| **F09** | Skills & Toolchain Page (`/skills`) | 5 | 5 | ✓ | ✓ | `src/data/site.js` |
| **F10** | Contact Page (`/contact`) | 5 | 5 | ✓ | ✓ | `ORIGINAL_REQUEST R2` |
| **F11** | 404 Not Found Page (`*`) | 5 | 5 | ✓ | — | `Instruction § 11` |
| **F12** | Dark Purple Primary Identity | 5 | 5 | ✓ | ✓ | `ORIGINAL_REQUEST R1` |
| **F13** | Light Theme Toggle | 5 | 5 | ✓ | ✓ | `ORIGINAL_REQUEST R1` |
| **F14** | Theme Persistence (`localStorage`) | 5 | 5 | ✓ | ✓ | `PROJECT.md § Theme Context` |
| **F15** | Typography Hierarchy (<=65ch) | 5 | 5 | ✓ | ✓ | `Instruction § 10` |
| **F16** | Tabular Numeric Discipline | 5 | 5 | ✓ | ✓ | `Emil Kowalski Rules` |
| **F17** | Ambient Canvas Background (60fps) | 5 | 5 | ✓ | ✓ | `ORIGINAL_REQUEST R3` |
| **F18** | Scroll-Triggered Reveals | 5 | 5 | ✓ | — | `ORIGINAL_REQUEST R3` |
| **F19** | Page Transitions (<=300ms) | 5 | 5 | ✓ | ✓ | `ORIGINAL_REQUEST R3` |
| **F20** | Tactile Micro-Interactions | 5 | 5 | ✓ | ✓ | `Emil Kowalski Rules` |
| **F21** | Hover Elevation & Glow | 5 | 5 | ✓ | — | `Instruction § 7` |
| **F22** | Touch Target Compliance (>=44px) | 5 | 5 | ✓ | ✓ | `Emil Kowalski Rules` |
| **F23** | 17-Project Authentic Catalog | 5 | 5 | ✓ | ✓ | `ORIGINAL_REQUEST R2` |
| **F24** | Authentic Image Pipeline | 5 | 5 | ✓ | ✓ | `Instruction § 6` |
| **F25** | 700-Hour OJT Callout | 5 | 5 | ✓ | ✓ | `Soronio CV` |
| **F26** | Zero Horizontal Overflow | 5 | 5 | ✓ | ✓ | `ORIGINAL_REQUEST R4` |
| **F27** | Design Decisions Document | 5 | 5 | — | ✓ | `ORIGINAL_REQUEST R1` |
| **F28** | Playwright Visual Verification | 5 | 5 | ✓ | ✓ | `Instruction § 13` |
| **TOTAL** | **28 Features** | **140** | **140** | **25+** | **5 Journeys** | **>=310 Test Cases** |

---

## 4. Test Directory Layout

```
MaryGrace-Portfolio/
├── TEST_INFRA.md                   # This specification
├── TEST_READY.md                   # Test suite publication report
├── tests/
│   ├── run-e2e.js                  # Master test runner & CLI report generator
│   ├── helpers/
│   │   ├── contracts.js            # Schemas & validators for models and routes
│   │   ├── test-env.js             # Synthetic DOM, window, localStorage & matchMedia simulator
│   │   └── static-checker.js       # File, token, and CSS AST verification utilities
│   ├── tier1-features/
│   │   ├── f01-multi-page-router.test.js
│   │   ├── f02-nav-header.test.js
│   │   ├── f03-mobile-drawer.test.js
│   │   ├── f04-home-view.test.js
│   │   ├── f05-projects-showcase.test.js
│   │   ├── f06-category-pills.test.js
│   │   ├── f07-project-details.test.js
│   │   ├── f08-about-page.test.js
│   │   ├── f09-skills-page.test.js
│   │   ├── f10-contact-page.test.js
│   │   ├── f11-not-found-page.test.js
│   │   ├── f12-dark-purple-theme.test.js
│   │   ├── f13-light-theme-toggle.test.js
│   │   ├── f14-theme-persistence.test.js
│   │   ├── f15-typography-hierarchy.test.js
│   │   ├── f16-tabular-numerics.test.js
│   │   ├── f17-ambient-canvas.test.js
│   │   ├── f18-scroll-reveals.test.js
│   │   ├── f19-page-transitions.test.js
│   │   ├── f20-tactile-microinteractions.test.js
│   │   ├── f21-hover-elevation.test.js
│   │   ├── f22-touch-targets.test.js
│   │   ├── f23-authentic-catalog.test.js
│   │   ├── f24-image-pipeline.test.js
│   │   ├── f25-ojt-callout.test.js
│   │   ├── f26-zero-overflow.test.js
│   │   ├── f27-design-decisions.test.js
│   │   └── f28-playwright-verification.test.js
│   ├── tier2-boundaries/
│   │   ├── boundary-routing-slugs.test.js
│   │   ├── boundary-theme-toggles.test.js
│   │   ├── boundary-catalog-integrity.test.js
│   │   ├── boundary-responsive-viewports.test.js
│   │   ├── boundary-contact-validation.test.js
│   │   └── boundary-motion-reduced.test.js
│   ├── tier3-combinations/
│   │   ├── combo-theme-route.test.js
│   │   ├── combo-filter-search-resize.test.js
│   │   ├── combo-drawer-navigation.test.js
│   │   └── combo-card-detail-modal.test.js
│   └── tier4-scenarios/
│       ├── scenario-recruiter-flow.test.js
│       ├── scenario-hardware-engineer-audit.test.js
│       ├── scenario-ojt-evaluation.test.js
│       ├── scenario-mobile-visitor.test.js
│       └── scenario-accessibility-audit.test.js
```

---

## 5. Execution Commands

### Run Full Test Suite
```bash
node tests/run-e2e.js
```
or via npm:
```bash
npm test
```

### Run by Tier
```bash
node tests/run-e2e.js --tier=1
node tests/run-e2e.js --tier=2
node tests/run-e2e.js --tier=3
node tests/run-e2e.js --tier=4
```

### Native Node Test Runner Direct Invocation
```bash
node --test tests/**/*.test.js
```

---

## 6. Coverage & Quality Thresholds

- **Total Test Cases**: `>= 310` tests
- **Tier 1 Feature Coverage**: 100% of 28 features covered with `>= 5` tests each
- **Tier 2 Boundary Coverage**: 100% of 28 features covered with `>= 5` edge cases each
- **Tier 3 Combinations**: Matrix coverage of routing, theming, filtering, and responsive drawer
- **Tier 4 Scenarios**: 5 complete recruiter & auditor workflows
- **Exit Code**: Clean exit code `0` on successful execution
