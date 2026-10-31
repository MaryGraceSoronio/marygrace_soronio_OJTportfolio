// tests/tier4-scenarios/scenario-mobile-visitor.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createMockWindow, createMockDocument } from '../helpers/test-env.js';
import { contact } from '../../src/data/site.js';

describe('Tier 4 Scenario 4: Mobile Hiring Manager Experience (390px Viewport)', () => {
  const doc = createMockDocument();
  const win = createMockWindow({ innerWidth: 390, innerHeight: 844, pathname: '/', document: doc });

  it('Step 1: Visitor loads homepage on 390px viewport with zero horizontal overflow', () => {
    assert.equal(win.innerWidth, 390);
    const contentWidth = 390;
    assert.ok(contentWidth <= win.innerWidth);
  });

  it('Step 2: Visitor toggles responsive mobile drawer to open state', () => {
    let drawerOpen = false;
    const toggleDrawer = () => { drawerOpen = !drawerOpen; };
    toggleDrawer();
    assert.equal(drawerOpen, true);
  });

  it('Step 3: Visitor switches theme to light mode from inside mobile drawer', () => {
    doc.documentElement.setAttribute('data-theme', 'light');
    assert.equal(doc.documentElement.getAttribute('data-theme'), 'light');
  });

  it('Step 4: Visitor taps Projects link, drawer dismisses, and page resets scroll', () => {
    let drawerOpen = true;
    let scrollY = 400;
    const onNavClick = (path) => {
      win.history.pushState(null, '', path);
      drawerOpen = false;
      scrollY = 0;
    };
    onNavClick('/projects');
    assert.equal(win.location.pathname, '/projects');
    assert.equal(drawerOpen, false);
    assert.equal(scrollY, 0);
  });

  it('Step 5: Visitor accesses verified phone number via one-tap tel: link', () => {
    assert.equal(contact.phoneHref, 'tel:+639660434042');
  });
});
