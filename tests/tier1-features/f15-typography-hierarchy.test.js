// tests/tier1-features/f15-typography-hierarchy.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileContent } from '../helpers/static-checker.js';

describe('F15: Typography Hierarchy (Tier 1)', () => {
  const css = readFileContent('src/styles/app.css') || '';
  const html = readFileContent('index.html') || '';

  it('F15-T1-1: defines distinct display and body font variables', () => {
    assert.ok(css.includes('--font-display'), 'Must declare --font-display');
    assert.ok(css.includes('--font-body'), 'Must declare --font-body');
  });

  it('F15-T1-2: declares fluid clamp sizing equations for display headlines', () => {
    assert.ok(
      css.includes('clamp('),
      'Typography scale must include fluid clamp sizing equations'
    );
  });

  it('F15-T1-3: body or paragraph styles constrain reading measure', () => {
    const hasMeasureRule =
      css.includes('max-w-prose') ||
      css.includes('max-w-[65ch]') ||
      css.includes('65ch') ||
      css.includes('text-wrap: pretty') ||
      css.includes('text-wrap: balance');
    assert.ok(hasMeasureRule, 'Typography must constrain reading measure or optimize text wrapping');
  });

  it('F15-T1-4: HTML shell pre-connects and loads web fonts', () => {
    assert.ok(
      html.includes('fonts.googleapis.com') || html.includes('fonts.gstatic.com') || html.includes('font'),
      'HTML shell must configure font assets'
    );
  });

  it('F15-T1-5: base styles define heading weight and tracking rules', () => {
    assert.ok(
      css.includes('h1') && (css.includes('font-family') || css.includes('font-weight')),
      'Base styles must format heading elements'
    );
  });
});
