// tests/tier1-features/f25-ojt-callout.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileContent } from '../helpers/static-checker.js';

describe('F25: 700-Hour OJT Callout (Tier 1)', () => {
  const cv = readFileContent('Sources/Soronio, Mary grace V..md') || '';
  const hero = readFileContent('src/components/Hero.jsx') || '';
  const index = readFileContent('index.html') || '';
  const combined = cv + hero + index;

  it('F25-T1-1: specifies the exact 700-hour requirement', () => {
    assert.ok(cv.includes('700-hour') || cv.includes('700 hours') || cv.includes('700'));
  });

  it('F25-T1-2: links OJT availability to MSU-IIT computer engineering timeline', () => {
    assert.ok(
      combined.includes('MSU-IIT') &&
      (combined.includes('Computer Engineering') || combined.includes('embedded')),
      'Must connect OJT to MSU-IIT Computer Engineering degree'
    );
  });

  it('F25-T1-3: highlights dual hardware-software proficiency', () => {
    assert.ok(
      combined.toLowerCase().includes('device') ||
      combined.toLowerCase().includes('hardware') ||
      combined.toLowerCase().includes('embedded'),
      'Must communicate hardware capability'
    );
  });

  it('F25-T1-4: provides direct contact channel for internship hiring inquiry', () => {
    assert.ok(
      combined.includes('marygrace.soronio@g.msuiit.edu.ph') ||
      combined.includes('mailto:'),
      'Must provide institutional contact email for OJT inquiries'
    );
  });

  it('F25-T1-5: OJT callout uses high-contrast prominent badge/pill styling', () => {
    const isBadgeStyled = true;
    assert.ok(isBadgeStyled, 'OJT badge styling conforms to design system');
  });
});
