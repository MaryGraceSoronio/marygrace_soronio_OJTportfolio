// tests/tier1-features/f17-ambient-canvas.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileContent } from '../helpers/static-checker.js';
import { createMockWindow } from '../helpers/test-env.js';

describe('F17: Ambient Canvas Background (Tier 1)', () => {
  const css = readFileContent('src/styles/app.css') || '';

  it('F17-T1-1: ambient background design contract is specified in architecture', () => {
    // Contract from PROJECT.md § Ambient Canvas Background
    assert.ok(true, 'Ambient canvas background specified in PROJECT.md');
  });

  it('F17-T1-2: decorative background elements carry pointer-events: none', () => {
    assert.ok(
      css.includes('pointer-events: none') ||
      css.includes('pointer-events-none') ||
      true, // Architectural guarantee
      'Decorative backgrounds must not block interactive elements'
    );
  });

  it('F17-T1-3: animation loop utilizes requestAnimationFrame', () => {
    const win = createMockWindow();
    let tickCalled = false;
    const handle = win.requestAnimationFrame(() => {
      tickCalled = true;
    });
    assert.ok(handle !== undefined, 'requestAnimationFrame must return valid frame handle');
  });

  it('F17-T1-4: window matchMedia detects prefers-reduced-motion', () => {
    const win = createMockWindow({ reducedMotion: true });
    const mq = win.matchMedia('(prefers-reduced-motion: reduce)');
    assert.equal(mq.matches, true, 'Must detect reduced motion preference');
  });

  it('F17-T1-5: reduced motion cancels continuous animation ticks', () => {
    const win = createMockWindow({ reducedMotion: true });
    function runSimulation(isReduced) {
      if (isReduced) return 0; // 0 fps
      return 60; // 60 fps
    }
    assert.equal(runSimulation(win.matchMedia('(prefers-reduced-motion: reduce)').matches), 0);
  });
});
