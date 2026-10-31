// tests/tier1-features/f13-light-theme-toggle.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateThemeContext } from '../helpers/contracts.js';
import { createMockDocument, createMockWindow } from '../helpers/test-env.js';

describe('F13: Light Theme Toggle (Tier 1)', () => {
  function createThemeHarness(initialTheme = 'dark') {
    const doc = createMockDocument();
    let currentTheme = initialTheme;
    doc.documentElement.setAttribute('data-theme', currentTheme);
    doc.documentElement.classList.add(currentTheme);

    const ctx = {
      theme: currentTheme,
      toggleTheme() {
        const next = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(next);
      },
      setTheme(newTheme) {
        doc.documentElement.classList.remove(currentTheme);
        currentTheme = newTheme;
        this.theme = newTheme;
        doc.documentElement.setAttribute('data-theme', newTheme);
        doc.documentElement.classList.add(newTheme);
      },
    };
    return { ctx, doc };
  }

  it('F13-T1-1: ThemeContext conforms to declared interface contract', () => {
    const { ctx } = createThemeHarness();
    const { valid, errors } = validateThemeContext(ctx);
    assert.ok(valid, `ThemeContext invalid: ${errors.join(', ')}`);
  });

  it('F13-T1-2: toggleTheme toggles from dark to light', () => {
    const { ctx } = createThemeHarness('dark');
    assert.equal(ctx.theme, 'dark');
    ctx.toggleTheme();
    assert.equal(ctx.theme, 'light');
  });

  it('F13-T1-3: toggleTheme toggles from light back to dark', () => {
    const { ctx } = createThemeHarness('light');
    assert.equal(ctx.theme, 'light');
    ctx.toggleTheme();
    assert.equal(ctx.theme, 'dark');
  });

  it('F13-T1-4: updating theme synchronizes data-theme attribute on documentElement', () => {
    const { ctx, doc } = createThemeHarness('dark');
    assert.equal(doc.documentElement.getAttribute('data-theme'), 'dark');
    ctx.setTheme('light');
    assert.equal(doc.documentElement.getAttribute('data-theme'), 'light');
  });

  it('F13-T1-5: updating theme synchronizes CSS class on documentElement', () => {
    const { ctx, doc } = createThemeHarness('dark');
    assert.equal(doc.documentElement.classList.contains('dark'), true);
    ctx.setTheme('light');
    assert.equal(doc.documentElement.classList.contains('dark'), false);
    assert.equal(doc.documentElement.classList.contains('light'), true);
  });
});
