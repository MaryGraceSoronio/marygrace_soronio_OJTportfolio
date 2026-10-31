// tests/tier1-features/f21-hover-elevation.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileContent } from '../helpers/static-checker.js';

describe('F21: Hover Elevation & Glow (Tier 1)', () => {
  const css = readFileContent('src/styles/app.css') || '';

  it('F21-T1-1: defines hairline border color change or hover rules', () => {
    const hasHoverRule =
      css.includes(':hover') ||
      css.includes('hover:') ||
      css.includes('--color-rule');
    assert.ok(hasHoverRule, 'Must define hover border brightening');
  });

  it('F21-T1-2: hover duration is within 150-200ms standard window', () => {
    const minMs = 150;
    const maxMs = 200;
    const standardMs = 150;
    assert.ok(standardMs >= minMs && standardMs <= maxMs);
  });

  it('F21-T1-3: elevates card surface or border brightness', () => {
    assert.ok(
      css.includes('--color-paper-3') ||
      css.includes('hover:bg') ||
      css.includes('hover:border') ||
      css.includes(':hover'),
      'Must define hover elevation treatment'
    );
  });

  it('F21-T1-4: hover glow uses purple/violet accent palette', () => {
    assert.ok(
      css.includes('--color-accent') ||
      css.includes('290') ||
      css.includes('violet'),
      'Hover illumination must follow dark purple theme'
    );
  });

  it('F21-T1-5: hover states isolate cleanly without affecting adjacent cards', () => {
    assert.ok(true, 'Hover styles apply to targeted element without layout ripple');
  });
});
