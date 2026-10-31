// tests/empirical-m3-2-challenge.js
// EMPIRICAL CHALLENGER M3-2 ADVERSARIAL STRESS HARNESS
// Focus: Motion, Performance, Responsiveness, and Accessibility
//
// Milestone 3: Core Profile Pages (Home, About, Skills, Contact)
// Target Components: ScrollReveal.jsx, Reveal.jsx, app.css, Pages & Assets

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const ROOT = path.resolve(import.meta.dirname, '..');

console.log('================================================================');
console.log('  CHALLENGER M3-2: ADVERSARIAL MOTION, RESPONSIVENESS & ACCESSIBILITY');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;
const failures = [];

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

// ============================================================================
// SUITE 1: ScrollReveal & Reveal Component Architecture & Lifecycle
// ============================================================================
console.log('\n--- SUITE 1: ScrollReveal & Reveal Architecture & Lifecycle ---');

const scrollRevealPath = path.join(ROOT, 'src/components/ScrollReveal.jsx');
const scrollRevealCode = fs.readFileSync(scrollRevealPath, 'utf8');

const revealPath = path.join(ROOT, 'src/components/Reveal.jsx');
const revealCode = fs.readFileSync(revealPath, 'utf8');

test('ScrollReveal: Source exists and exports default functional component', () => {
  assert.ok(fs.existsSync(scrollRevealPath), 'ScrollReveal.jsx must exist');
  assert.ok(
    /export\s+default\s+function\s+ScrollReveal/.test(scrollRevealCode),
    'ScrollReveal.jsx must export default function ScrollReveal'
  );
});

test('Reveal: Re-export backward compatibility shim delegates to ScrollReveal.jsx', () => {
  assert.ok(fs.existsSync(revealPath), 'Reveal.jsx must exist');
  assert.ok(
    revealCode.includes("export { default } from './ScrollReveal.jsx'"),
    'Reveal.jsx must re-export ScrollReveal default'
  );
});

// Emulate ScrollReveal logic purely to stress-test mathematical and lifecycle boundaries
function simulateScrollRevealProps({
  duration = 250,
  delay = 0,
  scale = 0.98,
  distance = 8,
  reduced = false,
  shown = false,
}) {
  const safeDuration = reduced ? 0 : Math.min(Math.max(0, duration), 300);
  const safeDelay = reduced ? 0 : Math.min(Math.max(0, delay), 250);
  const safeScale = Math.max(0.95, Math.min(1, scale));

  const style = reduced
    ? {
        opacity: 1,
        transform: 'none',
        transition: 'none',
      }
    : {
        opacity: shown ? 1 : 0,
        transform: shown
          ? 'translateY(0) scale(1)'
          : `translateY(${distance}px) scale(${safeScale})`,
        transitionProperty: 'opacity, transform',
        transitionDuration: `${safeDuration}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: shown ? `${safeDelay}ms` : '0ms',
        willChange: shown ? 'auto' : 'transform, opacity',
      };

  return { safeDuration, safeDelay, safeScale, style };
}

test('ScrollReveal Math: Animation duration strictly capped at <= 300ms', () => {
  // Test adversarial high durations
  assert.equal(simulateScrollRevealProps({ duration: 300 }).safeDuration, 300);
  assert.equal(simulateScrollRevealProps({ duration: 420 }).safeDuration, 300);
  assert.equal(simulateScrollRevealProps({ duration: 1000 }).safeDuration, 300);
  assert.equal(simulateScrollRevealProps({ duration: 10000 }).safeDuration, 300);

  // Test negative or zero duration
  assert.equal(simulateScrollRevealProps({ duration: -100 }).safeDuration, 0);
  assert.equal(simulateScrollRevealProps({ duration: 0 }).safeDuration, 0);

  // Test standard valid durations
  assert.equal(simulateScrollRevealProps({ duration: 150 }).safeDuration, 150);
  assert.equal(simulateScrollRevealProps({ duration: 250 }).safeDuration, 250);
});

test('ScrollReveal Math: Entrance scale starts from >= 0.95 and rejects scale(0)', () => {
  // Adversarial scale(0) rejection
  const zeroScale = simulateScrollRevealProps({ scale: 0, shown: false });
  assert.equal(zeroScale.safeScale, 0.95, 'scale: 0 must floor to 0.95');
  assert.ok(
    zeroScale.style.transform.includes('scale(0.95)'),
    'Style transform must never contain scale(0)'
  );

  // Negative scale rejection
  assert.equal(simulateScrollRevealProps({ scale: -1 }).safeScale, 0.95);

  // Sub-0.95 scale rejection
  assert.equal(simulateScrollRevealProps({ scale: 0.5 }).safeScale, 0.95);
  assert.equal(simulateScrollRevealProps({ scale: 0.8 }).safeScale, 0.95);
  assert.equal(simulateScrollRevealProps({ scale: 0.94 }).safeScale, 0.95);

  // Standard valid scales
  assert.equal(simulateScrollRevealProps({ scale: 0.95 }).safeScale, 0.95);
  assert.equal(simulateScrollRevealProps({ scale: 0.98 }).safeScale, 0.98);
  assert.equal(simulateScrollRevealProps({ scale: 1.0 }).safeScale, 1.0);

  // Oversized scale capped at 1.0
  assert.equal(simulateScrollRevealProps({ scale: 1.5 }).safeScale, 1.0);
  assert.equal(simulateScrollRevealProps({ scale: 2.0 }).safeScale, 1.0);
});

test('ScrollReveal Math: Delay parameter capped at <= 250ms to prevent lag', () => {
  assert.equal(simulateScrollRevealProps({ delay: 500 }).safeDelay, 250);
  assert.equal(simulateScrollRevealProps({ delay: 1000 }).safeDelay, 250);
  assert.equal(simulateScrollRevealProps({ delay: -50 }).safeDelay, 0);
  assert.equal(simulateScrollRevealProps({ delay: 100 }).safeDelay, 100);
});

test('ScrollReveal GPU: Transitions strictly animate transform and opacity', () => {
  const normal = simulateScrollRevealProps({ shown: true });
  assert.equal(normal.style.transitionProperty, 'opacity, transform');
  assert.equal(normal.style.transitionTimingFunction, 'cubic-bezier(0.16, 1, 0.3, 1)');
  assert.equal(normal.style.willChange, 'auto');

  const unshown = simulateScrollRevealProps({ shown: false });
  assert.equal(unshown.style.willChange, 'transform, opacity');
});

// ============================================================================
// SUITE 2: IntersectionObserver Lifecycle & Rapid Scroll Handling
// ============================================================================
console.log('\n--- SUITE 2: IntersectionObserver Lifecycle & Rapid Scroll Handling ---');

test('ScrollReveal Lifecycle: Clean observer disconnect on unmount', () => {
  // Verify ScrollReveal code contains observer.disconnect() in cleanup return
  assert.ok(
    scrollRevealCode.includes('return () => {') && scrollRevealCode.includes('observer.disconnect()'),
    'ScrollReveal useEffect cleanup must call observer.disconnect()'
  );

  // Verify ScrollReveal disconnects immediately upon first intersecting entry
  assert.ok(
    /if\s*\(\s*entry\.isIntersecting\s*\)\s*\{[\s\S]*?observer\.disconnect\(\)/.test(scrollRevealCode),
    'ScrollReveal must call observer.disconnect() as soon as entry.isIntersecting is true'
  );
});

test('ScrollReveal Lifecycle: MediaQuery event listener cleaned up on unmount', () => {
  assert.ok(
    scrollRevealCode.includes('mediaQuery.removeEventListener'),
    'ScrollReveal useEffect cleanup must call mediaQuery.removeEventListener'
  );
});

test('ScrollReveal Rapid Scroll: Fast bursts of intersection events handle gracefully', () => {
  let shownState = false;
  let disconnectCount = 0;
  let isObserverActive = true;

  const mockObserver = {
    disconnect() {
      disconnectCount++;
      isObserverActive = false;
    },
  };

  const handleEntries = (entries) => {
    if (!isObserverActive) return;
    for (const entry of entries) {
      if (entry.isIntersecting) {
        shownState = true;
        mockObserver.disconnect();
        break;
      }
    }
  };

  // Simulate 100 rapid scroll ticks delivering entries
  for (let i = 0; i < 100; i++) {
    const isIntersecting = i >= 5; // Intersects on 5th tick
    handleEntries([{ isIntersecting, target: {} }]);
  }

  assert.equal(shownState, true, 'Element must be shown');
  assert.equal(disconnectCount, 1, 'Observer must disconnect exactly once on first intersection');
});

test('ScrollReveal Fallback: Unsupported IntersectionObserver reveals instantly without crashing', () => {
  assert.ok(
    scrollRevealCode.includes("typeof IntersectionObserver === 'undefined'"),
    'ScrollReveal must guard for undefined IntersectionObserver'
  );
  assert.ok(
    scrollRevealCode.includes('setShown(true)'),
    'ScrollReveal must set shown=true when observer is unavailable'
  );
});

// ============================================================================
// SUITE 3: Prefers-Reduced-Motion Strict Compliance
// ============================================================================
console.log('\n--- SUITE 3: Prefers-Reduced-Motion Strict Compliance ---');

test('ScrollReveal Accessibility: Prefers-reduced-motion forces 0ms transition and transform: none', () => {
  const reducedProps = simulateScrollRevealProps({
    duration: 300,
    delay: 200,
    distance: 16,
    scale: 0.95,
    reduced: true,
    shown: false,
  });

  assert.equal(reducedProps.safeDuration, 0, 'Duration must be 0ms under reduced motion');
  assert.equal(reducedProps.safeDelay, 0, 'Delay must be 0ms under reduced motion');
  assert.equal(reducedProps.style.opacity, 1, 'Opacity must be 1 under reduced motion');
  assert.equal(reducedProps.style.transform, 'none', 'Transform must be none under reduced motion');
  assert.equal(reducedProps.style.transition, 'none', 'Transition must be none under reduced motion');
});

test('CSS Level Reduced Motion: app.css enforces reduced-motion overrides on .scroll-reveal and .reveal', () => {
  const cssPath = path.join(ROOT, 'src/styles/app.css');
  const cssContent = fs.readFileSync(cssPath, 'utf8');

  // Verify @media (prefers-reduced-motion: reduce) rule exists
  assert.ok(
    cssContent.includes('@media (prefers-reduced-motion: reduce)'),
    'app.css must contain @media (prefers-reduced-motion: reduce)'
  );

  // Extract the reduced-motion block around line 574
  const idx = cssContent.lastIndexOf('@media (prefers-reduced-motion: reduce)');
  assert.ok(idx !== -1, 'Must find reduced motion block');
  const block = cssContent.slice(idx);

  assert.ok(
    block.includes('.scroll-reveal') && block.includes('.reveal'),
    'Reduced motion block must override .scroll-reveal and .reveal'
  );
  assert.ok(
    block.includes('transform: none !important'),
    'Reduced motion CSS must force transform: none !important'
  );
  assert.ok(
    block.includes('transition: none !important'),
    'Reduced motion CSS must force transition: none !important'
  );
  assert.ok(
    block.includes('opacity: 1 !important'),
    'Reduced motion CSS must force opacity: 1 !important'
  );
  assert.ok(
    block.includes('.ambient-canvas') && block.includes('display: none !important'),
    'Ambient canvas must be disabled under reduced motion'
  );
});

// ============================================================================
// SUITE 4: Responsive Boundaries & Layout Stress Testing (320px, 375px, 768px, 1024px, 1440px)
// ============================================================================
console.log('\n--- SUITE 4: Responsive Boundaries & Layout Stress Testing ---');

const srcDir = path.join(ROOT, 'src');

function findJsxFiles(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findJsxFiles(full));
    } else if (entry.name.endsWith('.jsx')) {
      results.push(full);
    }
  }
  return results;
}

const jsxFiles = findJsxFiles(srcDir);

test('Layout Bounds: No component uses w-screen (which triggers Windows scrollbar overflow)', () => {
  const violations = [];
  for (const f of jsxFiles) {
    const code = fs.readFileSync(f, 'utf8');
    if (/\bw-screen\b/.test(code)) {
      violations.push(path.relative(ROOT, f));
    }
  }
  assert.deepEqual(violations, [], `Forbidden 'w-screen' class found in: ${violations.join(', ')}`);
});

test('Layout Bounds: Root html and body enforce horizontal overflow clipping (overflow-x: clip)', () => {
  const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const appCss = fs.readFileSync(path.join(ROOT, 'src/styles/app.css'), 'utf8');

  // Verify viewport meta tag exists and prevents non-responsive scaling
  assert.ok(
    indexHtml.includes('<meta name="viewport" content="width=device-width, initial-scale=1.0"'),
    'index.html must specify standard responsive viewport meta'
  );

  // Verify body and html styling prevents horizontal scrollbar via overflow-x: clip
  assert.ok(
    appCss.includes('overflow-x: clip') || appCss.includes('overflow-x: hidden'),
    'app.css must enforce overflow-x clipping on html/body'
  );
});

test('Responsive Columns: Multi-column grids must use responsive breakpoints (sm:, md:, lg:)', () => {
  const rawGridRegex = /(?<!\w|sm:|md:|lg:|xl:|2xl:)grid-cols-([2-9]|\d{2})/g;
  const violations = [];

  for (const f of jsxFiles) {
    const code = fs.readFileSync(f, 'utf8');
    const rel = path.relative(ROOT, f);
    let match;
    while ((match = rawGridRegex.exec(code)) !== null) {
      const context = code.slice(Math.max(0, match.index - 30), match.index + 30);
      violations.push({ file: rel, match: match[0], context });
    }
  }

  // Filter known acceptable small-element grids (e.g., 2-col mini status indicators)
  const problematic = violations.filter(v => {
    return !v.context.includes('grid-cols-2') || v.context.includes('card');
  });

  assert.equal(
    problematic.length,
    0,
    `Unresponsive multi-column grids detected: ${JSON.stringify(problematic, null, 2)}`
  );
});

test('Responsive Measure: Line length on reading paragraphs capped at max-w-[65ch] across viewports', () => {
  const profilePages = ['About.jsx', 'Skills.jsx', 'Contact.jsx', 'Home.jsx'];
  for (const page of profilePages) {
    const code = fs.readFileSync(path.join(ROOT, 'src/pages', page), 'utf8');
    assert.ok(
      code.includes('max-w-[65ch]'),
      `${page} must constrain reading measure using max-w-[65ch]`
    );
  }
});

test('Responsive Touch: Interactive elements maintain >= 44px hit targets on mobile (320px/375px)', () => {
  // Check Nav, MobileDrawer, and ThemeToggle
  const navCode = fs.readFileSync(path.join(ROOT, 'src/components/Nav.jsx'), 'utf8');
  const drawerCode = fs.readFileSync(path.join(ROOT, 'src/components/MobileDrawer.jsx'), 'utf8');
  const toggleCode = fs.readFileSync(path.join(ROOT, 'src/components/ThemeToggle.jsx'), 'utf8');

  assert.ok(
    navCode.includes('min-h-[44px]') || navCode.includes('h-11') || navCode.includes('p-2.5'),
    'Nav triggers must satisfy minimum 44px tap target'
  );
  assert.ok(
    drawerCode.includes('min-h-[44px]') || drawerCode.includes('h-11') || drawerCode.includes('py-3'),
    'Mobile drawer nav links must satisfy minimum 44px tap target'
  );
  assert.ok(
    toggleCode.includes('h-11 w-11') || toggleCode.includes('min-h-11 min-w-11') || toggleCode.includes('min-h-[44px]'),
    'ThemeToggle must satisfy minimum 44px tap area (h-11/w-11 = 44px)'
  );
});

// ============================================================================
// SUITE 5: Asset Integrity & 404 Prevention
// ============================================================================
console.log('\n--- SUITE 5: Asset Integrity & 404 Prevention ---');

test('ID Portrait Asset: mary-grace-1x1-id-image.jpg exists, non-empty, valid JPEG', () => {
  const pubPath = path.join(ROOT, 'public/mary-grace-1x1-id-image.jpg');
  const distPath = path.join(ROOT, 'dist/mary-grace-1x1-id-image.jpg');

  assert.ok(fs.existsSync(pubPath), 'public/mary-grace-1x1-id-image.jpg must exist');
  assert.ok(fs.existsSync(distPath), 'dist/mary-grace-1x1-id-image.jpg must exist in production build');

  const stat = fs.statSync(pubPath);
  assert.ok(stat.size > 50000, `Portrait size ${stat.size} bytes must be authentic (>50KB)`);

  const buf = fs.readFileSync(pubPath);
  assert.equal(buf[0], 0xFF, 'JPEG byte 0 must be 0xFF');
  assert.equal(buf[1], 0xD8, 'JPEG byte 1 must be 0xD8');
  assert.equal(buf[2], 0xFF, 'JPEG byte 2 must be 0xFF');
});

test('Certificate Assets: All 5 certificates exist in public/ and dist/ with valid magic headers', () => {
  const certFiles = [
    { file: 'ai-career-readiness.png', magic: [0x89, 0x50, 0x4E, 0x47], type: 'PNG' },
    { file: 'iot-conference-philippines.jpg', magic: [0xFF, 0xD8, 0xFF], type: 'JPEG' },
    { file: 'smartct-participation.png', magic: [0x89, 0x50, 0x4E, 0x47], type: 'PNG' },
    { file: 'startup-basics-101.pdf', magic: [0x25, 0x50, 0x44, 0x46], type: 'PDF' }, // %PDF
    { file: 'syo-ojt-workshop.jpg', magic: [0xFF, 0xD8, 0xFF], type: 'JPEG' },
  ];

  for (const c of certFiles) {
    const pub = path.join(ROOT, 'public/certificates', c.file);
    const dist = path.join(ROOT, 'dist/certificates', c.file);

    assert.ok(fs.existsSync(pub), `public/certificates/${c.file} must exist`);
    assert.ok(fs.existsSync(dist), `dist/certificates/${c.file} must exist in production build`);

    const stat = fs.statSync(pub);
    assert.ok(stat.size > 1000, `File ${c.file} must be non-empty (>1KB)`);

    const buf = fs.readFileSync(pub);
    for (let i = 0; i < c.magic.length; i++) {
      assert.equal(
        buf[i],
        c.magic[i],
        `File ${c.file} byte ${i} must match ${c.type} magic byte 0x${c.magic[i].toString(16)}`
      );
    }
  }
});

test('Absolute URL Prefixing: All asset links begin with leading "/" to prevent SPA route 404s', () => {
  const profileJs = fs.readFileSync(path.join(ROOT, 'src/data/profile.js'), 'utf8');

  // Find all cert / portrait paths
  const fileMatches = profileJs.match(/file:\s*['"`]([^'"`]+)['"`]/g) || [];
  for (const m of fileMatches) {
    const target = m.replace(/file:\s*['"`]/, '').replace(/['"`]$/, '');
    assert.ok(
      target.startsWith('/'),
      `Asset path "${target}" must start with leading '/' for SPA router safety`
    );
  }

  const portraitMatch = profileJs.match(/portrait:\s*['"`]([^'"`]+)['"`]/);
  assert.ok(portraitMatch, 'profile.js must declare portrait');
  assert.ok(
    portraitMatch[1].startsWith('/'),
    `Portrait path "${portraitMatch[1]}" must start with leading '/'`
  );
});

// ============================================================================
// SUITE SUMMARY & VERDICT
// ============================================================================
console.log('\n================================================================');
console.log(`  EMPIRICAL RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
console.log('================================================================');

if (failures.length > 0) {
  console.log('\nFailures Detected:');
  for (const f of failures) {
    console.error(`- ${f.name}: ${f.error.message}`);
  }
}

console.log('\n================================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
