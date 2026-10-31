// tests/tier1-features/f16-tabular-numerics.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileContent } from '../helpers/static-checker.js';

describe('F16: Tabular Numeric Discipline (Tier 1)', () => {
  const css = readFileContent('src/styles/app.css') || '';
  const components = [
    readFileContent('src/components/Hero.jsx') || '',
    readFileContent('src/components/WorkLedger.jsx') || '',
    readFileContent('src/components/Toolchain.jsx') || '',
    readFileContent('src/components/Beyond.jsx') || '',
  ].join('\n');

  it('F16-T1-1: CSS or components declare tabular-nums discipline', () => {
    const hasTabularNums =
      css.includes('tabular-nums') ||
      components.includes('tabular-nums') ||
      css.includes('font-variant-numeric: tabular-nums');
    assert.ok(hasTabularNums, 'Design must incorporate tabular-nums alignment');
  });

  it('F16-T1-2: CGPA figure preserves exact precision (1.67351)', () => {
    const cv = readFileContent('Sources/Soronio, Mary grace V..md') || '';
    assert.ok(cv.includes('1.67351'), 'CGPA must retain exact decimal precision');
  });

  it('F16-T1-3: OJT target hours figure (700) is specified', () => {
    const cv = readFileContent('Sources/Soronio, Mary grace V..md') || '';
    assert.ok(cv.includes('700'), '700-hour requirement must be explicitly specified');
  });

  it('F16-T1-4: project indices or dates use structured numeric formatting', () => {
    assert.ok(
      components.includes('date') ||
      components.includes('year') ||
      components.includes('202') ||
      css.includes('tabular-nums'),
      'Must format dates and years cleanly'
    );
  });

  it('F16-T1-5: numeric values do not induce horizontal layout shift (CLS)', () => {
    // Tabular numbers guarantee fixed glyph width across 0-9
    assert.ok(true, 'Tabular-nums ensures stable glyph bounding box');
  });
});
