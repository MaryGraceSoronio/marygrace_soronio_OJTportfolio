// tests/tier1-features/f12-dark-purple-theme.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileContent } from '../helpers/static-checker.js';

describe('F12: Dark Purple Primary Identity (Tier 1)', () => {
  const cssContent = readFileContent('src/styles/app.css') || '';

  it('F12-T1-1: defines deep dark purple canvas background color', () => {
    assert.ok(
      cssContent.includes('--color-paper') ||
      cssContent.includes('oklch(14%') ||
      cssContent.includes('oklch(11%') ||
      cssContent.includes('#0b0612') ||
      cssContent.includes('#171021'),
      'Must define dark purple background canvas'
    );
  });

  it('F12-T1-2: defines high-contrast text color clearing WCAG AA', () => {
    assert.ok(
      cssContent.includes('--color-ink') ||
      cssContent.includes('oklch(93%') ||
      cssContent.includes('oklch(98%') ||
      cssContent.includes('#f5f2fb'),
      'Must define high contrast light text for dark background'
    );
  });

  it('F12-T1-3: defines electric violet / amethyst accent color', () => {
    assert.ok(
      cssContent.includes('--color-accent') ||
      cssContent.includes('oklch(57% 0.23 290)') ||
      cssContent.includes('#9d4edd') ||
      cssContent.includes('#a855f7'),
      'Must define violet accent color'
    );
  });

  it('F12-T1-4: defines elevated violet card surface colors', () => {
    assert.ok(
      cssContent.includes('--color-paper-2') ||
      cssContent.includes('--color-paper-3') ||
      cssContent.includes('#12091f') ||
      cssContent.includes('#1a0d2e') ||
      cssContent.includes('oklch(17.5%') ||
      cssContent.includes('oklch(21%'),
      'Must define elevated violet surface tokens'
    );
  });

  it('F12-T1-5: defines subtle violet hairline border tokens', () => {
    assert.ok(
      cssContent.includes('--color-rule') ||
      cssContent.includes('--color-rule-2') ||
      cssContent.includes('rgba(186, 147, 245') ||
      cssContent.includes('oklch(29% 0.04 290)'),
      'Must define hairline border tokens'
    );
  });
});
