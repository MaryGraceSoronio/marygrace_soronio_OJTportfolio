# Dispatch: E2E Testing Orchestrator

## Mission
Act as the E2E Testing Orchestrator for the Mary Grace V. Soronio Developer Portfolio.
Design and implement an opaque-box, requirement-driven automated E2E test suite based strictly on `ORIGINAL_REQUEST.md` and `Instruction.md`.
Deliver `TEST_INFRA.md` and `TEST_READY.md`.

## Key Documents
- Authoritative Request: `C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio\.agents\teamwork\ORIGINAL_REQUEST.md`
- Master Project Plan: `C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio\.agents\teamwork\orchestrator\PROJECT.md`
- Working Directory: `C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio\.agents\teamwork\sub_orch_e2e`

## Scope & Requirements
1. Opaque-box test suite covering all features in `PROJECT.md § Feature Inventory` across 4 systematic tiers:
   - Tier 1: Feature Coverage (>=5 test cases per feature covering representative inputs, isolating features)
   - Tier 2: Boundary & Corner Cases (>=5 test cases per feature covering limits, empty states, zero values, edge inputs)
   - Tier 3: Cross-Feature Combinations (pairwise interactions, state sharing, route navigation + theme toggle)
   - Tier 4: Real-World Application Scenarios (end-to-end user journeys: recruiter reviewing projects, hiring manager inspecting embedded case studies, theme toggling, contact submission validation)
2. Test Architecture:
   - Establish test runner/harness executable via a single npm script or node runner (e.g., vitest / node test runner / playwright tests).
   - Must run cleanly with exit code 0 when all tests pass.
3. Deliverables:
   - Create `TEST_INFRA.md` at project root documenting test philosophy, architecture, feature inventory test matrix, and coverage thresholds.
   - Once all tests are written and ready for the Implementation Track to execute against, publish `TEST_READY.md` at project root with runner command, tier breakdown, and coverage summary.
4. Report back to parent orchestrator (`350396e9-b5fc-47cd-bb0a-69c052885a9a`) upon publishing `TEST_READY.md`.
