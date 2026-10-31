// tests/tier1-features/f01-multi-page-router.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { EXPECTED_CORE_ROUTES } from '../helpers/contracts.js';
import { matchClientRoute, createMockWindow } from '../helpers/test-env.js';
import { readFileContent } from '../helpers/static-checker.js';

describe('F01: Multi-Page Router (Tier 1)', () => {
  it('F01-T1-1: defines all mandatory core route patterns', () => {
    const required = ['/', '/projects', '/projects/:slug', '/about', '/skills', '/contact', '*'];
    for (const r of required) {
      assert.ok(EXPECTED_CORE_ROUTES.includes(r), `Missing expected route pattern ${r}`);
    }
  });

  it('F01-T1-2: resolves exact home route / to Home view contract', () => {
    const match = matchClientRoute(EXPECTED_CORE_ROUTES, '/');
    assert.equal(match.matched, true);
    assert.equal(match.route, '/');
  });

  it('F01-T1-3: resolves dynamic project slug route /projects/:slug with slug parameter', () => {
    const match = matchClientRoute(EXPECTED_CORE_ROUTES, '/projects/fermonitor');
    assert.equal(match.matched, true);
    assert.equal(match.route, '/projects/:slug');
    assert.equal(match.params.slug, 'fermonitor');
  });

  it('F01-T1-4: resolves secondary profile routes (/about, /skills, /contact)', () => {
    for (const p of ['/about', '/skills', '/contact']) {
      const match = matchClientRoute(EXPECTED_CORE_ROUTES, p);
      assert.equal(match.matched, true);
      assert.equal(match.route, p);
    }
  });

  it('F01-T1-5: falls through to wildcard route * for unmatched paths', () => {
    const match = matchClientRoute(EXPECTED_CORE_ROUTES, '/random-missing-url');
    assert.equal(match.matched, true);
    assert.equal(match.route, '*');
  });
});
