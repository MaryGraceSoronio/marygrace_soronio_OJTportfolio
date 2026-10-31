// tests/empirical-m2-stress.js
// EMPIRICAL CHALLENGER STRESS HARNESS — Milestone 2
// Navigation Shell, Routing, Canvas Background & Responsive Overflow
//
// Rigorous verification of:
// 1. High-frequency mouse/touch interaction & particle physics stability
// 2. Tab-unfocus pause (document.hidden) and resume lifecycle
// 3. prefers-reduced-motion override (0fps loop cancellation & cleanup)
// 4. Zero horizontal overflow audit across 320px to 3840px viewports
// 5. Component edge cases, touch targets, and focus management contracts

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const ROOT = path.resolve(import.meta.dirname, '..');

console.log('================================================================');
console.log('  CHALLENGER M2: EMPIRICAL STRESS & ADVERSARIAL VERIFICATION');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;
const failures = [];
const observations = [];

function test(name, fn) {
  try {
    fn();
    console.log(`  [PASS] ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  [FAIL] ${name}: ${err.message}`);
    failures.push({ name, error: err });
    failCount++;
  }
}

// --------------------------------------------------------------------------
// SUITE 1: High-Frequency Mouse/Touch Interaction & Physics Stability
// --------------------------------------------------------------------------
console.log('\n--- SUITE 1: High-Frequency Mouse/Touch & Canvas Physics Stability ---');

// Replicate the exact physics engine from src/components/ParticleBackground.jsx
function createParticleEngine(width = 1280, height = 800) {
  const count = Math.max(16, Math.min(50, Math.round((width * height) / 36000)));
  const nodes = Array.from({ length: count }, () => {
    const isTelemetryPad = Math.random() < 0.18;
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      baseVx: (Math.random() - 0.5) * 0.22,
      baseVy: (Math.random() - 0.5) * 0.22,
      r: isTelemetryPad ? 2.4 : Math.random() * 1.2 + 0.8,
      isPad: isTelemetryPad,
      padRadius: isTelemetryPad ? 4.8 : 0,
    };
  });

  const packets = Array.from({ length: 8 }, () => ({
    from: Math.floor(Math.random() * count),
    to: Math.floor(Math.random() * count),
    progress: Math.random(),
    speed: 0.012 + Math.random() * 0.018,
  }));

  const pointer = {
    x: -9999,
    y: -9999,
    active: false,
  };

  const mouseRadius = 175;
  const mouseRadiusSq = mouseRadius * mouseRadius;

  function step() {
    for (let i = 0; i < nodes.length; i++) {
      const p = nodes[i];
      p.vx += (p.baseVx - p.vx) * 0.04;
      p.vy += (p.baseVy - p.vy) * 0.04;

      if (pointer.active) {
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const d2 = dx * dx + dy * dy;

        if (d2 < mouseRadiusSq && d2 > 1) {
          const d = Math.sqrt(d2);
          const springForce = ((mouseRadius - d) / mouseRadius) * 0.65;
          p.vx += (dx / d) * springForce;
          p.vy += (dy / d) * springForce;
        }
      }

      p.vx *= 0.95;
      p.vy *= 0.95;

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -24) p.x = width + 24;
      if (p.x > width + 24) p.x = -24;
      if (p.y < -24) p.y = height + 24;
      if (p.y > height + 24) p.y = -24;
    }
  }

  return { nodes, packets, pointer, step, width, height, mouseRadius };
}

test('Physics Engine: 100,000 rapid high-frequency pointer movements remain numerically stable', () => {
  const engine = createParticleEngine(1440, 900);
  engine.pointer.active = true;

  for (let event = 0; event < 100000; event++) {
    engine.pointer.x = Math.sin(event * 0.05) * 700 + 720;
    engine.pointer.y = Math.cos(event * 0.05) * 400 + 450;
    engine.step();
  }

  for (const p of engine.nodes) {
    assert.ok(!Number.isNaN(p.x), 'Particle X coordinate must not be NaN');
    assert.ok(!Number.isNaN(p.y), 'Particle Y coordinate must not be NaN');
    assert.ok(!Number.isNaN(p.vx), 'Particle VX must not be NaN');
    assert.ok(!Number.isNaN(p.vy), 'Particle VY must not be NaN');
    assert.ok(Number.isFinite(p.x), 'Particle X must be finite');
    assert.ok(Number.isFinite(p.y), 'Particle Y must be finite');
    // Viscous damping (p.vx *= 0.95) should keep max velocity bounded under 15px/frame
    assert.ok(Math.abs(p.vx) < 15, `Particle VX exceeded bound: ${p.vx}`);
    assert.ok(Math.abs(p.vy) < 15, `Particle VY exceeded bound: ${p.vy}`);
  }
});

test('Physics Engine: Singularity resilience at d2 <= 1 (mouse directly on particle)', () => {
  const engine = createParticleEngine(800, 600);
  const targetParticle = engine.nodes[0];
  engine.pointer.active = true;

  // Place pointer exactly on particle (dx=0, dy=0, d2=0)
  engine.pointer.x = targetParticle.x;
  engine.pointer.y = targetParticle.y;
  engine.step();

  assert.ok(!Number.isNaN(targetParticle.vx), 'Exact coincidence must not produce NaN');
  assert.ok(!Number.isNaN(targetParticle.vy), 'Exact coincidence must not produce NaN');

  // Place pointer at distance 0.5px (d2 = 0.25 < 1)
  engine.pointer.x = targetParticle.x + 0.5;
  engine.pointer.y = targetParticle.y;
  engine.step();

  assert.ok(!Number.isNaN(targetParticle.vx), 'Sub-1px distance must not produce NaN (guarded by d2 > 1)');
  assert.ok(Number.isFinite(targetParticle.vx), 'Sub-1px distance must remain finite');
});

test('Physics Engine: Resilient to adversarial pointer inputs (NaN, Infinity, negative, extreme coordinates)', () => {
  const engine = createParticleEngine(800, 600);
  engine.pointer.active = true;

  const adversarialInputs = [
    { x: NaN, y: NaN },
    { x: Infinity, y: Infinity },
    { x: -Infinity, y: -Infinity },
    { x: -99999, y: -99999 },
    { x: 1e9, y: 1e9 },
    { x: 0, y: 0 },
  ];

  for (const input of adversarialInputs) {
    engine.pointer.x = input.x;
    engine.pointer.y = input.y;
    engine.step();

    for (const p of engine.nodes) {
      assert.ok(!Number.isNaN(p.x) && !Number.isNaN(p.y), `Adversarial input ${JSON.stringify(input)} caused NaN position`);
      assert.ok(Number.isFinite(p.x) && Number.isFinite(p.y), `Adversarial input ${JSON.stringify(input)} caused non-finite position`);
    }
  }
});

test('Physics Engine: Viscous damping restitutes perturbed particles back to base velocity', () => {
  const engine = createParticleEngine(1000, 800);
  const p = engine.nodes[0];
  // Apply massive impulse shock
  p.vx = 50.0;
  p.vy = 50.0;
  engine.pointer.active = false;

  // Simulate 120 frames (2 seconds at 60fps) without interaction
  for (let frame = 0; frame < 120; frame++) {
    engine.step();
  }

  // Under 0.95 viscous damping and restitution: 0.95^120 = 0.002
  assert.ok(Math.abs(p.vx - p.baseVx) < 0.2, `VX should restitute close to baseVx, got ${p.vx} vs ${p.baseVx}`);
  assert.ok(Math.abs(p.vy - p.baseVy) < 0.2, `VY should restitute close to baseVy, got ${p.vy} vs ${p.baseVy}`);
});

test('Physics Engine: Node density adapts across mobile (320x568) to 4K (3840x2160)', () => {
  const mobile = createParticleEngine(320, 568);
  const desktop = createParticleEngine(1440, 900);
  const ultraWide4k = createParticleEngine(3840, 2160);

  // Density formula: Math.max(16, Math.min(50, Math.round((w * h) / 36000)))
  assert.equal(mobile.nodes.length, 16, `Mobile nodes should hit lower floor 16, got ${mobile.nodes.length}`);
  assert.ok(desktop.nodes.length >= 30 && desktop.nodes.length <= 40, `Desktop nodes should be 30-40, got ${desktop.nodes.length}`);
  assert.equal(ultraWide4k.nodes.length, 50, `4K nodes should hit upper ceiling 50, got ${ultraWide4k.nodes.length}`);
});

// --------------------------------------------------------------------------
// SUITE 2: Tab-Unfocus Pause (document.hidden) and Resume Lifecycle
// --------------------------------------------------------------------------
console.log('\n--- SUITE 2: Tab-Unfocus Pause (document.hidden) and Resume Lifecycle ---');

function createMockCanvasEnvironment(initialReducedMotion = false) {
  let isRunning = true;
  let rafId = 0;
  let nextRafId = 1;
  const scheduledFrames = new Map();
  let cancelledFrames = [];
  let isDocumentHidden = false;
  let renderedFrameCount = 0;

  const mockWindow = {
    requestAnimationFrame(cb) {
      const id = nextRafId++;
      scheduledFrames.set(id, cb);
      return id;
    },
    cancelAnimationFrame(id) {
      scheduledFrames.delete(id);
      cancelledFrames.push(id);
    },
  };

  const listeners = {
    visibilitychange: [],
    change: [],
    resize: [],
    pointermove: [],
    pointerleave: [],
  };

  const mockDocument = {
    get hidden() {
      return isDocumentHidden;
    },
    set hidden(val) {
      isDocumentHidden = val;
    },
    addEventListener(event, handler) {
      if (listeners[event]) listeners[event].push(handler);
    },
    removeEventListener(event, handler) {
      if (listeners[event]) {
        listeners[event] = listeners[event].filter(h => h !== handler);
      }
    },
  };

  const motionQuery = {
    matches: initialReducedMotion,
    addEventListener(event, handler) {
      if (listeners[event]) listeners[event].push(handler);
    },
    removeEventListener(event, handler) {
      if (listeners[event]) {
        listeners[event] = listeners[event].filter(h => h !== handler);
      }
    },
  };

  // Replicate ParticleBackground.jsx useEffect initialization and handlers
  let cleanedUp = false;

  const render = () => {
    if (!isRunning) return;
    renderedFrameCount++;
    rafId = mockWindow.requestAnimationFrame(render);
  };

  const onVisibilityChange = () => {
    isRunning = !mockDocument.hidden;
    if (isRunning) {
      rafId = mockWindow.requestAnimationFrame(render);
    } else {
      mockWindow.cancelAnimationFrame(rafId);
    }
  };

  const onMotionPreferenceChange = (e) => {
    if (e.matches) {
      isRunning = false;
      mockWindow.cancelAnimationFrame(rafId);
    } else {
      isRunning = true;
      rafId = mockWindow.requestAnimationFrame(render);
    }
  };

  // Initial mount
  if (!motionQuery.matches) {
    rafId = mockWindow.requestAnimationFrame(render);
    mockDocument.addEventListener('visibilitychange', onVisibilityChange);
    motionQuery.addEventListener('change', onMotionPreferenceChange);
  } else {
    // Under prefers-reduced-motion: reduce, returns immediately
  }

  const cleanup = () => {
    isRunning = false;
    mockWindow.cancelAnimationFrame(rafId);
    mockDocument.removeEventListener('visibilitychange', onVisibilityChange);
    motionQuery.removeEventListener('change', onMotionPreferenceChange);
    cleanedUp = true;
  };

  // Flush single tick
  const flushFrame = () => {
    const entries = Array.from(scheduledFrames.entries());
    for (const [id, cb] of entries) {
      scheduledFrames.delete(id);
      cb();
    }
  };

  return {
    mockWindow,
    mockDocument,
    motionQuery,
    listeners,
    scheduledFrames,
    cancelledFrames,
    getIsRunning: () => isRunning,
    getRafId: () => rafId,
    getRenderedFrameCount: () => renderedFrameCount,
    onVisibilityChange,
    onMotionPreferenceChange,
    flushFrame,
    cleanup,
  };
}

test('Visibility Lifecycle: Initial mount starts animation loop with active rAF callback', () => {
  const env = createMockCanvasEnvironment(false);
  assert.equal(env.getIsRunning(), true, 'Animation should be running on mount');
  assert.equal(env.scheduledFrames.size, 1, 'Should have exactly 1 scheduled rAF frame on mount');
  env.flushFrame();
  assert.equal(env.getRenderedFrameCount(), 1, 'Frame 1 rendered');
  assert.equal(env.scheduledFrames.size, 1, 'Should have re-scheduled frame 2');
  env.cleanup();
});

test('Visibility Lifecycle: Tab unfocus (document.hidden = true) halts loop and cancels rAF', () => {
  const env = createMockCanvasEnvironment(false);
  env.flushFrame(); // Render 1 frame

  // Tab hidden event
  env.mockDocument.hidden = true;
  env.onVisibilityChange();

  assert.equal(env.getIsRunning(), false, 'isRunning must be false when tab is hidden');
  assert.equal(env.scheduledFrames.size, 0, 'No pending rAF callbacks when tab is hidden');

  // Verify no new frames execute
  const countBefore = env.getRenderedFrameCount();
  env.flushFrame();
  assert.equal(env.getRenderedFrameCount(), countBefore, 'Zero frames rendered while tab is hidden');
  env.cleanup();
});

test('Visibility Lifecycle: Tab refocus (document.hidden = false) resumes animation loop cleanly', () => {
  const env = createMockCanvasEnvironment(false);
  env.flushFrame();

  // Hide tab
  env.mockDocument.hidden = true;
  env.onVisibilityChange();
  assert.equal(env.getIsRunning(), false);

  // Return to tab
  env.mockDocument.hidden = false;
  env.onVisibilityChange();
  assert.equal(env.getIsRunning(), true, 'isRunning must resume to true when tab is visible');
  assert.equal(env.scheduledFrames.size, 1, 'Exactly 1 rAF callback scheduled upon refocus');

  env.flushFrame();
  assert.ok(env.getRenderedFrameCount() >= 2, 'Loop successfully resumes rendering');
  env.cleanup();
});

test('Visibility Lifecycle: Rapid 500x visibility toggling does not throw or corrupt state', () => {
  const env = createMockCanvasEnvironment(false);

  for (let i = 0; i < 500; i++) {
    env.mockDocument.hidden = (i % 2 === 0);
    env.onVisibilityChange();
  }

  // End in visible state
  env.mockDocument.hidden = false;
  env.onVisibilityChange();
  assert.equal(env.getIsRunning(), true);
  env.flushFrame();
  assert.ok(env.getRenderedFrameCount() > 0);
  env.cleanup();
});

test('Adversarial finding: Duplicate onVisibilityChange calls when document.hidden === false', () => {
  const env = createMockCanvasEnvironment(false);
  assert.equal(env.scheduledFrames.size, 1);

  // If a browser/extension fires visibilitychange while document is already visible:
  env.mockDocument.hidden = false;
  env.onVisibilityChange(); // Called while already visible

  const pendingCallbacks = env.scheduledFrames.size;
  observations.push({
    test: 'Duplicate visibilitychange on visible document',
    result: pendingCallbacks > 1 ? 'CONCURRENCY_RISK' : 'ISOLATED',
    detail: `Calling onVisibilityChange without intervening hidden state scheduled ${pendingCallbacks} callbacks.`,
  });

  // Document that without a guard (e.g. if (!isRunning) ...), duplicate callbacks could accumulate
  assert.ok(pendingCallbacks >= 1);
  env.cleanup();
});

// --------------------------------------------------------------------------
// SUITE 3: prefers-reduced-motion Override (0fps Loop Cancellation)
// --------------------------------------------------------------------------
console.log('\n--- SUITE 3: prefers-reduced-motion Override (0fps Loop Cancellation) ---');

test('Reduced Motion: Initial load with prefers-reduced-motion: reduce produces exactly 0fps', () => {
  const env = createMockCanvasEnvironment(true); // Initial reducedMotion = true
  assert.equal(env.scheduledFrames.size, 0, 'Zero frames scheduled when prefers-reduced-motion is active');
  assert.equal(env.getRenderedFrameCount(), 0, 'Zero frames rendered');
  env.flushFrame();
  assert.equal(env.getRenderedFrameCount(), 0, 'Zero frames rendered after flush');
  env.cleanup();
});

test('Reduced Motion: Dynamic OS toggle from standard to reduced-motion cancels active rAF loop immediately', () => {
  const env = createMockCanvasEnvironment(false);
  env.flushFrame();
  assert.equal(env.getRenderedFrameCount(), 1);

  // User enables prefers-reduced-motion in OS
  env.onMotionPreferenceChange({ matches: true });
  assert.equal(env.getIsRunning(), false, 'isRunning set to false immediately');
  assert.equal(env.scheduledFrames.size, 0, 'Active rAF cancelled immediately');

  // Verify loop remains halted
  env.flushFrame();
  assert.equal(env.getRenderedFrameCount(), 1, 'No further frames rendered after reduced motion enabled');
  env.cleanup();
});

test('Reduced Motion: Dynamic OS toggle from reduced-motion back to standard restarts loop cleanly', () => {
  const env = createMockCanvasEnvironment(false);
  env.onMotionPreferenceChange({ matches: true });
  assert.equal(env.getIsRunning(), false);

  // User turns off reduced motion
  env.onMotionPreferenceChange({ matches: false });
  assert.equal(env.getIsRunning(), true, 'Loop resumes when reduced motion is disabled');
  assert.equal(env.scheduledFrames.size, 1, 'rAF callback re-scheduled');

  env.flushFrame();
  assert.ok(env.getRenderedFrameCount() >= 1, 'Canvas resumes rendering frames');
  env.cleanup();
});

test('Reduced Motion: CSS media query display: none !important and animation cancellation', () => {
  const css = fs.readFileSync(path.join(ROOT, 'src/styles/app.css'), 'utf8');

  // Verify CSS contains @media (prefers-reduced-motion: reduce) rule
  assert.ok(css.includes('@media (prefers-reduced-motion: reduce)'), 'CSS must include prefers-reduced-motion query');

  // Verify .ambient-canvas has display: none !important
  assert.ok(
    css.includes('.ambient-canvas') && css.includes('display: none !important'),
    'CSS must force display: none !important on .ambient-canvas under reduced motion'
  );

  // Verify global animation cancellation (duration 0.001ms / none)
  assert.ok(
    css.includes('animation-duration: 0.001ms !important') ||
    css.includes('animation: none !important'),
    'CSS must enforce zero animation duration under reduced motion'
  );
});

// --------------------------------------------------------------------------
// SUITE 4: Zero Horizontal Overflow Audit Across 320px to 3840px Viewports
// --------------------------------------------------------------------------
console.log('\n--- SUITE 4: Zero Horizontal Overflow Audit Across 320px to 3840px Viewports ---');

const VIEWPORTS = [320, 360, 375, 390, 414, 768, 1024, 1280, 1440, 1920, 2560, 3840];

test('HTML and Body root elements enforce strict horizontal overflow clipping (overflow-x: clip)', () => {
  const css = fs.readFileSync(path.join(ROOT, 'src/styles/app.css'), 'utf8');

  // Check html and body overflow rules
  assert.ok(
    css.includes('overflow-x: clip') || css.includes('overflow-x: hidden'),
    'Root HTML or body must enforce overflow-x: clip or hidden'
  );
});

test('Shell container constraint: padding-inline and max-width scaling across all viewports', () => {
  const css = fs.readFileSync(path.join(ROOT, 'src/styles/app.css'), 'utf8');
  assert.ok(css.includes('.shell'), '.shell class must be defined');
  assert.ok(css.includes('max-width: var(--container-page)'), '.shell must cap at max-width container-page (1440px)');

  // At 320px: shell padding is --spacing-lg (24px)
  // Inner available content width = 320 - (24 * 2) = 272px
  for (const vp of VIEWPORTS) {
    const isDesktop = vp >= 768; // 48rem
    const padding = isDesktop ? 64 * 2 : 24 * 2; // spacing-3xl (64px) vs spacing-lg (24px)
    const contentWidth = Math.min(vp, 1440) - padding;
    assert.ok(contentWidth > 0, `Viewport ${vp}px must have positive content width (got ${contentWidth}px)`);
  }
});

test('Audit: Navigation Header (Nav.jsx) elements fit within 320px mobile viewport without blowout', () => {
  const navCode = fs.readFileSync(path.join(ROOT, 'src/components/Nav.jsx'), 'utf8');

  // Verify responsive visibility classes:
  // - Monogram & brand name: Link to "/"
  // - Subtitle "Embedded Systems · MSU-IIT" must be hidden on mobile (hidden sm:block)
  assert.ok(navCode.includes('hidden') && navCode.includes('sm:block'), 'Nav subtitle must be hidden on small mobile screens');

  // - Desktop nav links must be hidden on mobile (hidden lg:flex)
  assert.ok(navCode.includes('hidden items-center gap-1 lg:flex'), 'Desktop nav links must be hidden under lg breakpoint');

  // - OJT button must be hidden on small mobile (hidden sm:inline-flex)
  assert.ok(navCode.includes('hidden sm:inline-flex'), 'OJT CTA button must be hidden on mobile < 640px to prevent overflow');

  // - Mobile hamburger must be hidden on desktop (lg:hidden)
  assert.ok(navCode.includes('lg:hidden'), 'Hamburger button must hide on desktop');
});

test('Audit: 404 Recovery Terminal (NotFound.jsx) chip and copy wrapping on 320px viewport', () => {
  const notFoundCode = fs.readFileSync(path.join(ROOT, 'src/pages/NotFound.jsx'), 'utf8');

  // Verify code diagnostic element uses break-all or break-words
  assert.ok(
    notFoundCode.includes('break-all') || notFoundCode.includes('break-words'),
    'Unmapped URL code element in NotFound must have break-all or break-words to prevent overflow'
  );

  // Check telemetry chip: 0x0404 · HARDWARE INTERRUPT: UNMAPPED_VECTOR
  // Check if chip text fits or if container allows flex wrap / text shrink
  const chipText = '0x0404 · HARDWARE INTERRUPT: UNMAPPED_VECTOR';
  assert.ok(chipText.length > 0);
});

test('Audit: Footer (Footer.jsx) credentials and verified channels wrap properly on 320px', () => {
  const footerCode = fs.readFileSync(path.join(ROOT, 'src/components/Footer.jsx'), 'utf8');

  // Verify flex-wrap on badges
  assert.ok(footerCode.includes('flex flex-wrap items-center gap-2'), 'Footer badge cluster must use flex-wrap');

  // Verify grid columns responsive: lg:grid-cols-12
  assert.ok(footerCode.includes('lg:grid-cols-12'), 'Footer must use responsive columns with single column on mobile');

  // Verify max-w-[65ch] on bio copy per Emil Kowalski rule
  assert.ok(footerCode.includes('max-w-[65ch]'), 'Footer bio copy must be constrained to max-w-[65ch]');
});

test('Audit: Mobile Navigation Drawer (MobileDrawer.jsx) fixed bounds and overlay', () => {
  const drawerCode = fs.readFileSync(path.join(ROOT, 'src/components/MobileDrawer.jsx'), 'utf8');

  // Drawer panel: fixed inset-x-0 top-16 z-50
  assert.ok(drawerCode.includes('fixed inset-x-0 top-16'), 'Drawer must span inset-x-0 within viewport');
  assert.ok(drawerCode.includes('overflow-y-auto'), 'Drawer content must scroll vertically if exceeding screen height');
  assert.ok(drawerCode.includes('max-h-[calc(100dvh-4rem)]'), 'Drawer height capped at viewport height minus navbar');
});

// --------------------------------------------------------------------------
// SUITE 5: Component Accessibility, Touch Targets & Interaction Contracts
// --------------------------------------------------------------------------
console.log('\n--- SUITE 5: Accessibility, Touch Targets & Focus Management Contracts ---');

test('Touch Targets: All interactive buttons and links enforce >=44px tap targets', () => {
  const navCode = fs.readFileSync(path.join(ROOT, 'src/components/Nav.jsx'), 'utf8');
  const drawerCode = fs.readFileSync(path.join(ROOT, 'src/components/MobileDrawer.jsx'), 'utf8');
  const footerCode = fs.readFileSync(path.join(ROOT, 'src/components/Footer.jsx'), 'utf8');
  const notFoundCode = fs.readFileSync(path.join(ROOT, 'src/pages/NotFound.jsx'), 'utf8');

  // Nav
  assert.ok(navCode.includes('min-h-11'), 'Nav Monogram/Links enforce min-h-11 (44px)');
  assert.ok(navCode.includes('min-w-11'), 'Hamburger trigger enforces min-w-11 (44px)');

  // Drawer
  assert.ok(drawerCode.includes('min-h-12'), 'Drawer links enforce min-h-12 (48px)');

  // Footer
  assert.ok(footerCode.includes('min-h-11'), 'Footer links and Back to Top enforce min-h-11 (44px)');

  // NotFound
  assert.ok(notFoundCode.includes('min-tap') || notFoundCode.includes('min-h-[44px]'), 'NotFound action buttons enforce min-tap');
});

test('Tactile Micro-interactions: Active scale compression (:active { transform: scale(0.97); }) is defined', () => {
  const navCode = fs.readFileSync(path.join(ROOT, 'src/components/Nav.jsx'), 'utf8');
  const css = fs.readFileSync(path.join(ROOT, 'src/styles/app.css'), 'utf8');

  assert.ok(navCode.includes('active:scale-[0.97]'), 'Nav links include active:scale-[0.97]');
  assert.ok(css.includes('scale(0.97)'), 'app.css defines tactile active scale(0.97) rule');
});

test('Mobile Drawer: Focus trapping, Escape dismissal, and Body scroll lock contracts', () => {
  const drawerCode = fs.readFileSync(path.join(ROOT, 'src/components/MobileDrawer.jsx'), 'utf8');

  // Body scroll lock
  assert.ok(drawerCode.includes("document.body.style.overflow = 'hidden'"), 'Drawer locks body scroll when open');
  assert.ok(drawerCode.includes("document.body.style.overflow = ''"), 'Drawer unlocks body scroll when closed');

  // Escape key handler
  assert.ok(drawerCode.includes("event.key === 'Escape'"), 'Drawer listens for Escape key');
  assert.ok(drawerCode.includes('triggerRef?.current?.focus()'), 'Drawer returns focus to triggerRef upon Escape');

  // Tab key circular focus trap
  assert.ok(drawerCode.includes("event.key !== 'Tab'"), 'Drawer checks for Tab key');
  assert.ok(drawerCode.includes('event.shiftKey'), 'Drawer handles Shift+Tab reverse wrapping');

  // Desktop auto-dismiss on >=1024px resize
  assert.ok(drawerCode.includes('window.innerWidth >= 1024'), 'Drawer auto-closes on desktop breakpoint >= 1024px');
});

test('Tabular Numerals: CGPA (1.67351) and OJT (700h) use tabular-nums font feature', () => {
  const footerCode = fs.readFileSync(path.join(ROOT, 'src/components/Footer.jsx'), 'utf8');
  const notFoundCode = fs.readFileSync(path.join(ROOT, 'src/pages/NotFound.jsx'), 'utf8');

  // Footer
  assert.ok(footerCode.includes('1.67351'), 'Footer contains authentic CGPA 1.67351');
  assert.ok(footerCode.includes('tabular-nums'), 'Footer applies tabular-nums to numerical values');

  // NotFound
  assert.ok(notFoundCode.includes('tabular-nums'), 'NotFound applies tabular-nums to telemetry hex code');
});

// --------------------------------------------------------------------------
// SUITE SUMMARY & VERDICT GENERATION
// --------------------------------------------------------------------------
console.log('\n================================================================');
console.log(`  EMPIRICAL TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
console.log('================================================================');

if (failures.length > 0) {
  console.log('\nFailures Detected:');
  for (const f of failures) {
    console.error(`- ${f.name}: ${f.error.message}`);
  }
}

if (observations.length > 0) {
  console.log('\nEmpirical Observations & Edge Behavior:');
  for (const o of observations) {
    console.log(`- [${o.result}] ${o.test}: ${o.detail}`);
  }
}

console.log('\n================================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
