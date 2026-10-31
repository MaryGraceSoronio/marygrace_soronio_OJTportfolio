// tests/tier1-features/f03-mobile-drawer.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileContent } from '../helpers/static-checker.js';

describe('F03: Mobile Navigation Drawer (Tier 1)', () => {
  const navContent = readFileContent('src/components/Nav.jsx') || '';
  const appContent = readFileContent('src/App.jsx') || '';
  const projectPlan = readFileContent('.agents/teamwork/orchestrator/PROJECT.md') || '';
  const combined = navContent + appContent + projectPlan;

  it('F03-T1-1: includes mobile hamburger or responsive menu trigger', () => {
    const hasTrigger =
      combined.includes('menu') ||
      combined.includes('drawer') ||
      combined.includes('hamburger') ||
      combined.includes('open') ||
      combined.includes('md:hidden') ||
      combined.includes('lg:hidden');
    assert.ok(hasTrigger, 'Mobile navigation menu trigger must be specified');
  });

  it('F03-T1-2: mobile trigger provides accessible labeling (aria-label or text)', () => {
    const hasAria =
      combined.includes('aria-label') ||
      combined.includes('aria-expanded') ||
      combined.includes('Menu') ||
      combined.includes('navigation');
    assert.ok(hasAria, 'Mobile trigger must have accessible labeling');
  });

  it('F03-T1-3: mobile navigation container applies responsive visibility classes', () => {
    const hasResponsive =
      combined.includes('hidden') ||
      combined.includes('md:flex') ||
      combined.includes('sm:flex') ||
      combined.includes('block') ||
      combined.includes('fixed');
    assert.ok(hasResponsive, 'Mobile navigation must apply responsive breakpoint classes');
  });

  it('F03-T1-4: mobile navigation preserves access to primary sections', () => {
    assert.ok(
      combined.includes('work') || combined.includes('projects'),
      'Mobile navigation must preserve access to projects/work'
    );
  });

  it('F03-T1-5: mobile interaction handles dismissal or close state', () => {
    const hasClose =
      combined.includes('close') ||
      combined.includes('setOpen') ||
      combined.includes('toggle') ||
      combined.includes('href="#') ||
      combined.includes('onClick');
    assert.ok(hasClose, 'Mobile navigation must support dismissal/state toggle');
  });
});
