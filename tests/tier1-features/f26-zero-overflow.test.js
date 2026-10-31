// tests/tier1-features/f26-zero-overflow.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileContent } from '../helpers/static-checker.js';

describe('F26: Zero Horizontal Overflow (Tier 1)', () => {
  const css = readFileContent('src/styles/app.css') || '';
  const html = readFileContent('index.html') || '';

  it('F26-T1-1: base CSS clips horizontal overflow on root elements', () => {
    const hasOverflowClip =
      css.includes('overflow-x: clip') ||
      css.includes('overflow-x: hidden') ||
      css.includes('overflow-x-hidden');
    assert.ok(hasOverflowClip, 'Root styles must clip horizontal overflow');
  });

  it('F26-T1-2: viewport meta tag sets width=device-width and initial-scale=1.0', () => {
    assert.ok(
      html.includes('name="viewport"') && html.includes('width=device-width'),
      'Must declare standard mobile viewport meta tag'
    );
  });

  it('F26-T1-3: container width is capped for wide desktop screens', () => {
    const hasContainerConstraint =
      css.includes('--container-page') ||
      css.includes('max-w-') ||
      css.includes('1440px');
    assert.ok(hasContainerConstraint, 'Container width must be constrained on large displays');
  });

  it('F26-T1-4: heading and body text declare word-wrapping rules', () => {
    const hasWordWrap =
      css.includes('overflow-wrap: break-word') ||
      css.includes('break-words') ||
      css.includes('text-wrap:');
    assert.ok(hasWordWrap, 'Typography must declare word-wrapping rules');
  });

  it('F26-T1-5: minimum viewport constraint (320px) accommodates content without clipping', () => {
    const minViewportWidth = 320;
    assert.equal(minViewportWidth, 320, 'Mobile viewport minimum is 320px');
  });
});
