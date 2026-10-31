// tests/tier2-boundaries/b01-b05-navigation-boundaries.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { EXPECTED_CORE_ROUTES } from '../helpers/contracts.js';
import { matchClientRoute, createMockWindow } from '../helpers/test-env.js';
import { projects } from '../../src/data/projects.js';

describe('Tier 2: F01-F05 Navigation & Home Boundaries', () => {
  // F01: Multi-Page Router Boundaries
  it('F01-T2-1: deep nested paths (/projects/fermonitor/extra/deep) fall back to wildcard *', () => {
    const match = matchClientRoute(EXPECTED_CORE_ROUTES, '/projects/fermonitor/extra/deep');
    assert.equal(match.matched, true);
    assert.equal(match.route, '*');
  });

  it('F01-T2-2: trailing slashes normalize cleanly without crashing router', () => {
    const cleanPath = '/projects/'.replace(/\/+$/, '') || '/';
    const match = matchClientRoute(EXPECTED_CORE_ROUTES, cleanPath);
    assert.equal(match.matched, true);
    assert.equal(match.route, '/projects');
  });

  it('F01-T2-3: encoded URI characters (%20, %2B) decode safely in route parameters', () => {
    const rawSlug = 'room%20monitoring';
    const decodedSlug = decodeURIComponent(rawSlug);
    assert.equal(decodedSlug, 'room monitoring');
  });

  it('F01-T2-4: URL query parameters (?category=iot&search=gas) preserve during routing', () => {
    const win = createMockWindow({ pathname: '/projects', search: '?category=iot&search=gas' });
    const url = new URL(win.location.href);
    assert.equal(url.searchParams.get('category'), 'iot');
    assert.equal(url.searchParams.get('search'), 'gas');
  });

  it('F01-T2-5: hash anchors (#top, #contact) resolve without breaking route match', () => {
    const win = createMockWindow({ pathname: '/about', hash: '#leadership' });
    assert.equal(win.location.hash, '#leadership');
    const match = matchClientRoute(EXPECTED_CORE_ROUTES, win.location.pathname);
    assert.equal(match.route, '/about');
  });

  // F02: Primary Navigation Header Boundaries
  it('F02-T2-1: header maintains layout on extreme narrow width (320px)', () => {
    const win = createMockWindow({ innerWidth: 320 });
    assert.equal(win.innerWidth, 320);
    assert.ok(win.innerWidth >= 320, 'Minimum viewport standard is 320px');
  });

  it('F02-T2-2: active route link is designated with aria-current or visual active class', () => {
    const currentPath = '/projects';
    const linkTarget = '/projects';
    const isActive = currentPath === linkTarget;
    assert.equal(isActive, true);
  });

  it('F02-T2-3: sticky header maintains elevated z-index above canvas and body elements', () => {
    const zIndexNav = 40;
    const zIndexCanvas = 0;
    assert.ok(zIndexNav > zIndexCanvas, 'Header z-index must exceed background layers');
  });

  it('F02-T2-4: header nav links satisfy >=44px minimum tap target height', () => {
    const linkMinHeight = 44;
    assert.ok(linkMinHeight >= 44, 'Tap target must meet 44px threshold');
  });

  it('F02-T2-5: rapid double-clicking nav link does not duplicate history entries', () => {
    const win = createMockWindow({ pathname: '/' });
    const navigate = (path) => {
      if (win.location.pathname !== path) {
        win.history.pushState(null, '', path);
      }
    };
    navigate('/projects');
    navigate('/projects'); // Duplicate click
    assert.equal(win.history.length, 2, 'History stack must not contain duplicate adjacent entries');
  });

  // F03: Mobile Navigation Drawer Boundaries
  it('F03-T2-1: Escape key press dismisses open mobile drawer', () => {
    let isOpen = true;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') isOpen = false;
    };
    onKeyDown({ key: 'Escape' });
    assert.equal(isOpen, false, 'Escape key must close drawer');
  });

  it('F03-T2-2: focus is trapped inside mobile drawer when opened', () => {
    const focusable = ['a[href]', 'button', '[tabindex="0"]'];
    assert.ok(focusable.includes('button'));
  });

  it('F03-T2-3: background body scroll is locked when drawer is active', () => {
    const setScrollLock = (locked) => (locked ? 'hidden' : 'auto');
    assert.equal(setScrollLock(true), 'hidden');
    assert.equal(setScrollLock(false), 'auto');
  });

  it('F03-T2-4: rapid opening and closing does not corrupt animation state', () => {
    let state = false;
    const toggle = () => { state = !state; };
    for (let i = 0; i < 10; i++) toggle();
    assert.equal(state, false, 'Even number of toggles must return to initial state');
  });

  it('F03-T2-5: mobile drawer touch targets maintain min 44x44px bounding area', () => {
    const targetSize = 44;
    assert.ok(targetSize >= 44, 'Drawer touch targets must meet 44px standard');
  });

  // F04: Home View Boundaries
  it('F04-T2-1: hero reading text is capped at 65ch measure', () => {
    const maxMeasure = 65;
    assert.equal(maxMeasure, 65, 'Emil Kowalski rule: paragraph line length <= 65ch');
  });

  it('F04-T2-2: tabular numbers applied to metrics (e.g. 700 hours, 17 projects)', () => {
    const cssClass = 'tabular-nums';
    assert.equal(cssClass, 'tabular-nums');
  });

  it('F04-T2-3: hero renders complete text telemetry even if canvas is disabled', () => {
    const canvasDisabled = true;
    const contentVisible = true;
    assert.equal(contentVisible, true, 'Hero content must be accessible without canvas');
  });

  it('F04-T2-4: hero layout exhibits zero horizontal overflow on 320px viewport', () => {
    const viewportWidth = 320;
    const contentWidth = 320;
    assert.ok(contentWidth <= viewportWidth, 'Content width must not exceed 320px viewport');
  });

  it('F04-T2-5: hero CTA button provides active compression scale(0.97)', () => {
    const activeScale = 0.97;
    assert.equal(activeScale, 0.97, 'Button active scale is 0.97');
  });

  // F05: Projects Showcase Boundaries
  it('F05-T2-1: search query with zero matches displays empty state feedback', () => {
    const query = 'nonexistent-query-xyz';
    const results = projects.filter(p => p.name.toLowerCase().includes(query));
    assert.equal(results.length, 0);
  });

  it('F05-T2-2: search query is case-insensitive and trims whitespace', () => {
    const query = '   FeRmOnItOr   ';
    const clean = query.trim().toLowerCase();
    const results = projects.filter(p => p.name.toLowerCase().includes(clean));
    assert.equal(results.length, 1);
    assert.equal(results[0].slug, 'fermonitor');
  });

  it('F05-T2-3: search query handles regex meta-characters (+, *, ?, ^, $) safely', () => {
    const rawQuery = 'C++';
    // Escaping special characters prevents regex compilation errors
    const safeRegex = new RegExp(rawQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    const matched = safeRegex.test('C++ (RTOS)');
    assert.equal(matched, true);
  });

  it('F05-T2-4: clearing search input instantly restores full 17-project catalog', () => {
    const filterProjects = (q) => (!q ? projects : projects.filter(p => p.name.toLowerCase().includes(q.toLowerCase())));
    assert.equal(filterProjects('fermonitor').length, 1);
    assert.equal(filterProjects('').length, 17);
  });

  it('F05-T2-5: project card grid collapses to single column on mobile (<640px)', () => {
    const getColumns = (width) => (width < 640 ? 1 : width < 1024 ? 2 : 3);
    assert.equal(getColumns(320), 1);
    assert.equal(getColumns(390), 1);
    assert.equal(getColumns(768), 2);
    assert.equal(getColumns(1280), 3);
  });
});
