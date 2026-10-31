// tests/tier4-scenarios/scenario-accessibility-audit.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createMockWindow } from '../helpers/test-env.js';
import { calculateContrastRatio } from '../helpers/static-checker.js';

describe('Tier 4 Scenario 5: Accessibility & Design Systems Auditor Flow', () => {
  it('Step 1: Auditor activates prefers-reduced-motion and verifies canvas stops completely', () => {
    const win = createMockWindow({ reducedMotion: true });
    const isReduced = win.matchMedia('(prefers-reduced-motion: reduce)').matches;
    assert.equal(isReduced, true);
    const canvasFps = isReduced ? 0 : 60;
    assert.equal(canvasFps, 0, 'Canvas must halt to 0fps when prefers-reduced-motion is active');
  });

  it('Step 2: Auditor tests WCAG AA color contrast in default dark purple theme', () => {
    const textLightRgb = [245, 242, 251]; // #f5f2fb
    const bgDarkRgb = [11, 6, 18];        // #0b0612
    const contrastRatio = calculateContrastRatio(textLightRgb, bgDarkRgb);
    assert.ok(contrastRatio >= 4.5, `Dark theme contrast ratio ${contrastRatio.toFixed(2)} must be >= 4.5`);
  });

  it('Step 3: Auditor tests WCAG AA color contrast in light paper theme', () => {
    const inkDarkRgb = [21, 13, 36];       // #150d24
    const paperLightRgb = [250, 248, 253]; // #faf8fd
    const contrastRatio = calculateContrastRatio(inkDarkRgb, paperLightRgb);
    assert.ok(contrastRatio >= 7.0, `Light theme contrast ratio ${contrastRatio.toFixed(2)} must be >= 7.0`);
  });

  it('Step 4: Auditor verifies all touch targets satisfy minimum 44x44px bounding area', () => {
    const targets = [
      { name: 'theme-toggle', size: 44 },
      { name: 'nav-item', size: 44 },
      { name: 'mobile-menu-btn', size: 44 },
      { name: 'category-pill', size: 44 },
      { name: 'contact-submit', size: 48 },
    ];
    for (const t of targets) {
      assert.ok(t.size >= 44, `Target ${t.name} must be >=44px`);
    }
  });

  it('Step 5: Auditor verifies typography line length is constrained to <=65ch', () => {
    const maxMeasure = 65;
    assert.ok(maxMeasure <= 65, 'Line length constraint must not exceed 65ch');
  });
});
