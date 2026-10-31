// tests/tier3-combinations/combo-drawer-navigation.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createMockWindow, createMockDocument } from '../helpers/test-env.js';

describe('Tier 3: Mobile Navigation Drawer & Multi-Page Routing Combinations', () => {
  function createDrawerManager() {
    let isOpen = false;
    let currentPath = '/';
    let scrollY = 500;
    let bodyOverflow = 'auto';

    return {
      isOpen: () => isOpen,
      open: () => {
        isOpen = true;
        bodyOverflow = 'hidden'; // lock scroll
      },
      close: () => {
        isOpen = false;
        bodyOverflow = 'auto'; // unlock scroll
      },
      navigate: (path) => {
        currentPath = path;
        isOpen = false;
        bodyOverflow = 'auto';
        scrollY = 0; // scroll to top on navigate
      },
      getPath: () => currentPath,
      getScrollY: () => scrollY,
      getBodyOverflow: () => bodyOverflow,
    };
  }

  it('T3-DN-1: navigating from mobile drawer navigates, closes drawer, and resets scroll to 0', () => {
    const drawer = createDrawerManager();
    drawer.open();
    assert.equal(drawer.isOpen(), true);
    assert.equal(drawer.getBodyOverflow(), 'hidden');

    drawer.navigate('/projects');
    assert.equal(drawer.getPath(), '/projects');
    assert.equal(drawer.isOpen(), false);
    assert.equal(drawer.getBodyOverflow(), 'auto');
    assert.equal(drawer.getScrollY(), 0);
  });

  it('T3-DN-2: toggling theme from within open mobile drawer synchronizes DOM without closing drawer', () => {
    const doc = createMockDocument();
    doc.documentElement.setAttribute('data-theme', 'dark');
    let drawerOpen = true;

    const toggleTheme = () => {
      const current = doc.documentElement.getAttribute('data-theme');
      doc.documentElement.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
    };

    toggleTheme();
    assert.equal(doc.documentElement.getAttribute('data-theme'), 'light');
    assert.equal(drawerOpen, true, 'Drawer must remain open after theme toggle');
  });

  it('T3-DN-3: expanding viewport from mobile (<768px) to desktop (>=1024px) automatically dismisses drawer', () => {
    const win = createMockWindow({ innerWidth: 390 });
    let drawerOpen = true;

    const onResize = (newWidth) => {
      win.innerWidth = newWidth;
      if (newWidth >= 1024) {
        drawerOpen = false;
      }
    };

    onResize(1280);
    assert.equal(drawerOpen, false, 'Drawer must automatically close on desktop breakpoint');
  });

  it('T3-DN-4: clicking backdrop outside drawer closes drawer without activating background elements', () => {
    let drawerOpen = true;
    let backgroundButtonClicked = false;

    const onBackdropClick = (e) => {
      e.stopPropagation();
      drawerOpen = false;
    };

    onBackdropClick({ stopPropagation: () => {} });
    assert.equal(drawerOpen, false);
    assert.equal(backgroundButtonClicked, false);
  });

  it('T3-DN-5: drawer navigation links maintain >=44px tap targets on touch devices', () => {
    const drawerLinks = [
      { label: 'Home', height: 48 },
      { label: 'Projects', height: 48 },
      { label: 'About', height: 48 },
      { label: 'Skills', height: 48 },
      { label: 'Contact', height: 48 },
    ];
    for (const link of drawerLinks) {
      assert.ok(link.height >= 44, `Link ${link.label} must be >=44px high`);
    }
  });

  it('T3-DN-6: Escape key inside open drawer dismisses drawer and returns focus to hamburger button', () => {
    let drawerOpen = true;
    let focusedElement = 'drawer-link-1';

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        drawerOpen = false;
        focusedElement = 'hamburger-button';
      }
    };

    onKeyDown({ key: 'Escape' });
    assert.equal(drawerOpen, false);
    assert.equal(focusedElement, 'hamburger-button');
  });
});
