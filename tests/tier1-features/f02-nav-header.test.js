// tests/tier1-features/f02-nav-header.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileContent, checkFileExists } from '../helpers/static-checker.js';

describe('F02: Primary Navigation Header (Tier 1)', () => {
  const navContent = readFileContent('src/components/Nav.jsx') || '';

  it('F02-T1-1: Nav component exists or is specified in components directory', () => {
    const file = checkFileExists('src/components/Nav.jsx');
    assert.equal(file.exists, true, 'Nav.jsx must exist in components directory');
  });

  it('F02-T1-2: Nav includes branding or monogram identifier', () => {
    assert.ok(
      navContent.includes('Mary Grace') ||
      navContent.includes('Soronio') ||
      navContent.includes('brand') ||
      navContent.includes('logo'),
      'Nav must include branding for Mary Grace V. Soronio'
    );
  });

  it('F02-T1-3: Nav provides navigation targets to core sections', () => {
    const hasWork = navContent.includes('work') || navContent.includes('projects');
    const hasContact = navContent.includes('contact');
    assert.ok(hasWork && hasContact, 'Nav must provide links to work/projects and contact');
  });

  it('F02-T1-4: Nav defines fixed or sticky positioning structure with z-index', () => {
    const isFixedOrSticky =
      navContent.includes('fixed') ||
      navContent.includes('sticky') ||
      navContent.includes('top-0');
    assert.ok(isFixedOrSticky, 'Nav header must be positioned fixed or sticky at the top');
  });

  it('F02-T1-5: Nav contains action CTA element for recruiter or OJT inquiry', () => {
    assert.ok(
      navContent.includes('hire') ||
      navContent.includes('contact') ||
      navContent.includes('mail') ||
      navContent.includes('OJT') ||
      navContent.includes('button') ||
      navContent.includes('a href'),
      'Nav must contain interactive CTA element'
    );
  });
});
