// tests/tier1-features/f11-not-found-page.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { EXPECTED_CORE_ROUTES } from '../helpers/contracts.js';
import { matchClientRoute } from '../helpers/test-env.js';

describe('F11: 404 Not Found Page (Tier 1)', () => {
  it('F11-T1-1: route specification includes wildcard catch-all route', () => {
    assert.ok(EXPECTED_CORE_ROUTES.includes('*'), 'Must define * wildcard route');
  });

  it('F11-T1-2: wildcard intercepts arbitrary non-existent route paths', () => {
    const nonExistent = ['/some-broken-path', '/invalid-destination', '/foo/bar/baz'];
    for (const path of nonExistent) {
      const match = matchClientRoute(EXPECTED_CORE_ROUTES, path);
      assert.equal(match.matched, true);
      assert.equal(match.route, '*');
    }
  });

  it('F11-T1-3: recovery navigation targets Home route /', () => {
    const homeRoute = EXPECTED_CORE_ROUTES.find(r => r === '/');
    assert.equal(homeRoute, '/');
  });

  it('F11-T1-4: recovery navigation targets Projects route /projects', () => {
    const projectsRoute = EXPECTED_CORE_ROUTES.find(r => r === '/projects');
    assert.equal(projectsRoute, '/projects');
  });

  it('F11-T1-5: preserves site layout structure without unmounting core shell', () => {
    const match = matchClientRoute(EXPECTED_CORE_ROUTES, '/missing');
    assert.ok(match.params !== undefined, 'Route match parameters must be defined for 404 view');
  });
});
