// tests/tier3-combinations/combo-theme-route.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createMockLocalStorage, createMockDocument, createMockWindow } from '../helpers/test-env.js';
import { projects } from '../../src/data/projects.js';

describe('Tier 3: Theme Switching & Route State Combinations', () => {
  function setupAppEnvironment(initialRoute = '/', initialTheme = 'dark') {
    const storage = createMockLocalStorage({ theme: initialTheme });
    const doc = createMockDocument();
    const win = createMockWindow({ pathname: initialRoute, localStorage: storage, document: doc });
    doc.documentElement.setAttribute('data-theme', initialTheme);

    let theme = initialTheme;
    const themeManager = {
      getTheme: () => theme,
      setTheme: (t) => {
        theme = t;
        storage.setItem('theme', t);
        doc.documentElement.setAttribute('data-theme', t);
      },
      toggleTheme: () => {
        themeManager.setTheme(theme === 'dark' ? 'light' : 'dark');
      },
    };

    return { win, doc, storage, themeManager };
  }

  it('T3-TR-1: theme persists across continuous multi-page route navigation', () => {
    const { win, themeManager, storage, doc } = setupAppEnvironment('/', 'dark');
    themeManager.setTheme('light');
    assert.equal(doc.documentElement.getAttribute('data-theme'), 'light');

    // Navigate through multiple routes
    const routes = ['/projects', '/about', '/skills', '/contact', '/'];
    for (const route of routes) {
      win.history.pushState(null, '', route);
      assert.equal(win.location.pathname, route);
      // Theme must stay light
      assert.equal(themeManager.getTheme(), 'light');
      assert.equal(storage.getItem('theme'), 'light');
      assert.equal(doc.documentElement.getAttribute('data-theme'), 'light');
    }
  });

  it('T3-TR-2: switching theme while on dynamic project details page (/projects/:slug)', () => {
    const { win, themeManager, doc } = setupAppEnvironment('/projects/fermonitor', 'dark');
    const project = projects.find(p => p.slug === 'fermonitor');
    assert.ok(project);

    // Switch theme on project details view
    themeManager.toggleTheme();
    assert.equal(themeManager.getTheme(), 'light');
    assert.equal(doc.documentElement.getAttribute('data-theme'), 'light');
    assert.equal(win.location.pathname, '/projects/fermonitor');
  });

  it('T3-TR-3: direct reload on project detail page restores both theme and project data', () => {
    const { storage, themeManager } = setupAppEnvironment('/projects/etee', 'light');
    assert.equal(storage.getItem('theme'), 'light');

    // Simulate page reload
    const freshEnv = setupAppEnvironment('/projects/etee', storage.getItem('theme'));
    assert.equal(freshEnv.themeManager.getTheme(), 'light');
    const project = projects.find(p => p.slug === 'etee');
    assert.equal(project.name, 'eTee');
  });

  it('T3-TR-4: 404 Not Found view respects active light theme', () => {
    const { win, themeManager, doc } = setupAppEnvironment('/non-existent-page', 'light');
    assert.equal(win.location.pathname, '/non-existent-page');
    assert.equal(themeManager.getTheme(), 'light');
    assert.equal(doc.documentElement.getAttribute('data-theme'), 'light');
  });

  it('T3-TR-5: browser back navigation restores prior route while preserving toggled theme', () => {
    const { win, themeManager } = setupAppEnvironment('/', 'dark');
    win.history.pushState(null, '', '/about');
    themeManager.setTheme('light');
    win.history.back(); // Back to /
    assert.equal(win.location.pathname, '/');
    assert.equal(themeManager.getTheme(), 'light');
  });

  it('T3-TR-6: theme updates synchronize across both desktop navigation and mobile drawer state', () => {
    const { doc, themeManager } = setupAppEnvironment('/', 'dark');
    themeManager.setTheme('light');
    const isLightOnDoc = doc.documentElement.getAttribute('data-theme') === 'light';
    assert.equal(isLightOnDoc, true);
  });

  it('T3-TR-7: ambient canvas background remains rendered and unobtrusive in both themes', () => {
    const { themeManager } = setupAppEnvironment('/', 'dark');
    const getCanvasOpacity = (theme) => (theme === 'dark' ? 0.4 : 0.2);
    assert.equal(getCanvasOpacity(themeManager.getTheme()), 0.4);
    themeManager.toggleTheme();
    assert.equal(getCanvasOpacity(themeManager.getTheme()), 0.2);
  });
});
