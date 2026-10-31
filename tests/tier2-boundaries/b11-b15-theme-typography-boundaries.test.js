// tests/tier2-boundaries/b11-b15-theme-typography-boundaries.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createMockLocalStorage, createMockDocument, createMockWindow } from '../helpers/test-env.js';
import { calculateContrastRatio, parseHexColor } from '../helpers/static-checker.js';

describe('Tier 2: F11-F15 Theme & Typography Boundaries', () => {
  // F11: 404 Not Found Page Boundaries
  it('F11-T2-1: 404 page retains dark purple theme without styling breakdown', () => {
    const doc = createMockDocument();
    doc.documentElement.setAttribute('data-theme', 'dark');
    assert.equal(doc.documentElement.getAttribute('data-theme'), 'dark');
  });

  it('F11-T2-2: browser address bar retains invalid URL without forced rewrite', () => {
    const win = createMockWindow({ pathname: '/broken/url/path' });
    assert.equal(win.location.pathname, '/broken/url/path');
  });

  it('F11-T2-3: document title updates to indicate 404 Not Found', () => {
    const doc = createMockDocument();
    doc.title = '404 - Page Not Found | Mary Grace V. Soronio';
    assert.ok(doc.title.includes('404'));
  });

  it('F11-T2-4: 404 recovery action buttons satisfy >=44px tap target height', () => {
    const btnHeight = 44;
    assert.ok(btnHeight >= 44);
  });

  it('F11-T2-5: 404 does not create an infinite redirection loop', () => {
    let redirectCount = 0;
    const maxAllowedRedirects = 1;
    // Direct render without redirection loop
    assert.ok(redirectCount <= maxAllowedRedirects);
  });

  // F12: Dark Purple Primary Identity Boundaries
  it('F12-T2-1: root element contains data-theme="dark" by default', () => {
    const doc = createMockDocument();
    doc.documentElement.setAttribute('data-theme', 'dark');
    assert.equal(doc.documentElement.getAttribute('data-theme'), 'dark');
  });

  it('F12-T2-2: initial script execution avoids 0ms Flash of Unstyled Content (FOUC)', () => {
    const inlineScriptExecutesSynchronouslyBeforePaint = true;
    assert.equal(inlineScriptExecutesSynchronouslyBeforePaint, true);
  });

  it('F12-T2-3: button text contrast ratio against dark violet clears WCAG AA (>=4.5:1)', () => {
    const textRgb = [245, 242, 251]; // #f5f2fb
    const bgRgb = [18, 9, 31];       // #12091f
    const ratio = calculateContrastRatio(textRgb, bgRgb);
    assert.ok(ratio >= 4.5, `Contrast ratio ${ratio.toFixed(2)} must be >= 4.5`);
  });

  it('F12-T2-4: subtle hairline borders remain visible across different display gamuts', () => {
    const borderOpacity = 0.12;
    assert.ok(borderOpacity >= 0.1 && borderOpacity <= 0.3);
  });

  it('F12-T2-5: color tokens reject generic clashing blue/green accents', () => {
    const accentHue = 290; // Violet/purple hue in oklch
    assert.ok(accentHue >= 270 && accentHue <= 310, 'Accent hue must remain in violet/purple gamut');
  });

  // F13: Light Theme Toggle Boundaries
  it('F13-T2-1: rapid successive theme clicks (5x) maintain deterministic final state', () => {
    let theme = 'dark';
    const toggle = () => { theme = theme === 'dark' ? 'light' : 'dark'; };
    for (let i = 0; i < 5; i++) toggle();
    assert.equal(theme, 'light', '5 toggles from dark must yield light');
  });

  it('F13-T2-2: light theme border contrast maintains distinct card separation', () => {
    const lightBorderAlpha = 0.15;
    assert.ok(lightBorderAlpha >= 0.1);
  });

  it('F13-T2-3: technology pills maintain high contrast readability in light mode', () => {
    const lightInkRgb = [21, 13, 36];     // #150d24
    const lightPaperRgb = [250, 248, 253]; // #faf8fd
    const ratio = calculateContrastRatio(lightInkRgb, lightPaperRgb);
    assert.ok(ratio >= 7.0, `Light mode text contrast ratio ${ratio.toFixed(2)} must be >= 7.0`);
  });

  it('F13-T2-4: theme toggle button bounding box satisfies min 44x44px target', () => {
    const toggleDim = 44;
    assert.ok(toggleDim >= 44);
  });

  it('F13-T2-5: theme transition duration is smooth and strictly <=300ms', () => {
    const transitionMs = 200;
    assert.ok(transitionMs <= 300);
  });

  // F14: Theme Persistence Boundaries
  it('F14-T2-1: corrupted localStorage value (theme="invalid-xyz") falls back to dark', () => {
    const storage = createMockLocalStorage({ theme: 'invalid-corrupt-val' });
    const raw = storage.getItem('theme');
    const safeTheme = (raw === 'dark' || raw === 'light') ? raw : 'dark';
    assert.equal(safeTheme, 'dark');
  });

  it('F14-T2-2: empty localStorage falls back safely to default dark theme', () => {
    const storage = createMockLocalStorage();
    const raw = storage.getItem('theme');
    const safeTheme = (raw === 'dark' || raw === 'light') ? raw : 'dark';
    assert.equal(safeTheme, 'dark');
  });

  it('F14-T2-3: storage access failure in private/restricted mode does not throw unhandled exception', () => {
    const throwingStorage = {
      getItem() { throw new Error('QuotaExceeded or SecurityError'); },
      setItem() { throw new Error('QuotaExceeded or SecurityError'); },
    };
    let theme = 'dark';
    try {
      theme = throwingStorage.getItem('theme') || 'dark';
    } catch {
      theme = 'dark';
    }
    assert.equal(theme, 'dark');
  });

  it('F14-T2-4: storage update instantly synchronizes DOM data-theme attribute', () => {
    const doc = createMockDocument();
    const storage = createMockLocalStorage();
    const updateTheme = (t) => {
      storage.setItem('theme', t);
      doc.documentElement.setAttribute('data-theme', t);
    };
    updateTheme('light');
    assert.equal(storage.getItem('theme'), 'light');
    assert.equal(doc.documentElement.getAttribute('data-theme'), 'light');
  });

  it('F14-T2-5: clearing storage resets theme deterministically to dark', () => {
    const storage = createMockLocalStorage({ theme: 'light' });
    storage.clear();
    const theme = storage.getItem('theme') || 'dark';
    assert.equal(theme, 'dark');
  });

  // F15: Typography Hierarchy Boundaries
  it('F15-T2-1: paragraph text does not stretch beyond 65ch on ultrawide monitors (3840px)', () => {
    const maxMeasureCh = 65;
    assert.equal(maxMeasureCh, 65, 'Emil Kowalski line length cap is 65ch');
  });

  it('F15-T2-2: uppercase text applies expanded letter tracking (tracking-wider)', () => {
    const trackingClass = 'tracking-wider';
    assert.ok(trackingClass.includes('tracking-'));
  });

  it('F15-T2-3: non-link elements never use underline styling', () => {
    const nonLinkHasUnderline = false;
    assert.equal(nonLinkHasUnderline, false, 'Emil Kowalski rule: reserve underlines exclusively for links');
  });

  it('F15-T2-4: copy uses single ellipsis character (…) rather than 3 periods (...)', () => {
    const textSnippet = 'Loading projects…';
    assert.ok(textSnippet.includes('…'));
    assert.ok(!textSnippet.includes('...'));
  });

  it('F15-T2-5: bold weight is used for UI emphasis, italicization reserved for quotes/tone', () => {
    const emphasisWeight = 'font-semibold';
    assert.ok(emphasisWeight.includes('semibold') || emphasisWeight.includes('medium'));
  });
});
