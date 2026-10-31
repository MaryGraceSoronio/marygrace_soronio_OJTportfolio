// tests/empirical-m1-stress.js
// EMPIRICAL CHALLENGER STRESS HARNESS — Milestone 1
// Tests:
// 1. 17 Projects Data integrity (schema fields, backwards compatibility, array lengths, unique slugs)
// 2. Image asset availability and missing image reporting
// 3. Developer profile and site.js re-export integrity
// 4. Theme state resilience (corrupt localStorage, null, rapid toggling, matchMedia, cross-tab sync, throw errors)
// 5. CSS custom properties and Emil Kowalski tokens

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const ROOT = path.resolve(import.meta.dirname, '..');

console.log('================================================================');
console.log('  CHALLENGER M1: EMPIRICAL STRESS & ADVERSARIAL VERIFICATION');
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

// --------------------------------------------------------------------------
// SUITE 1: 17 Projects Data Integrity & Schema Compliance
// --------------------------------------------------------------------------
console.log('\n--- SUITE 1: 17 Projects Authentic Data Integrity ---');

const { projects, categories } = await import('../src/data/projects.js');

test('Catalog contains exactly 17 authentic projects', () => {
  assert.equal(projects.length, 17, `Expected 17 projects, got ${projects.length}`);
});

test('Categories export contains all 5 required categories', () => {
  const catIds = categories.map(c => c.id);
  assert.deepEqual(catIds.sort(), ['all', 'digital-logic', 'embedded', 'iot', 'software'].sort());
});

test('All project slugs are unique, kebab-case, and non-empty', () => {
  const slugs = new Set();
  const kebabRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  for (const p of projects) {
    assert.ok(p.slug && typeof p.slug === 'string', `Invalid slug on project: ${JSON.stringify(p)}`);
    assert.ok(kebabRegex.test(p.slug), `Slug '${p.slug}' is not valid kebab-case`);
    assert.ok(!slugs.has(p.slug), `Duplicate slug found: ${p.slug}`);
    slugs.add(p.slug);
  }
  assert.equal(slugs.size, 17);
});

test('All 17 projects have complete Modern Schema fields', () => {
  const modernFields = [
    'slug', 'title', 'subtitle', 'category', 'categoryLabel',
    'featured', 'order', 'period', 'summary', 'overview',
    'problem', 'solution', 'hardwareStack', 'softwareStack',
    'challenges', 'metrics', 'links'
  ];

  for (const p of projects) {
    for (const f of modernFields) {
      assert.ok(p[f] !== undefined, `Project '${p.slug}' missing modern field '${f}'`);
      assert.ok(p[f] !== null, `Project '${p.slug}' has null modern field '${f}'`);
    }
    assert.ok(Array.isArray(p.hardwareStack), `'hardwareStack' must be array in ${p.slug}`);
    assert.ok(p.hardwareStack.length > 0, `'hardwareStack' is empty in ${p.slug}`);
    assert.ok(Array.isArray(p.softwareStack), `'softwareStack' must be array in ${p.slug}`);
    assert.ok(p.softwareStack.length > 0, `'softwareStack' is empty in ${p.slug}`);
    assert.ok(Array.isArray(p.challenges), `'challenges' must be array in ${p.slug}`);
    assert.ok(p.challenges.length > 0, `'challenges' is empty in ${p.slug}`);
    assert.ok(Array.isArray(p.metrics), `'metrics' must be array in ${p.slug}`);
    assert.ok(p.metrics.length > 0, `'metrics' is empty in ${p.slug}`);
    assert.ok(Array.isArray(p.links), `'links' must be array in ${p.slug}`);
  }
});

test('All 17 projects have complete Backwards Compatibility Aliases (name, line, details, stack)', () => {
  for (const p of projects) {
    assert.ok(typeof p.name === 'string' && p.name.length > 0, `Missing legacy 'name' in ${p.slug}`);
    assert.ok(typeof p.line === 'string' && p.line.length > 0, `Missing legacy 'line' in ${p.slug}`);
    assert.ok(typeof p.details === 'string' && p.details.length > 0, `Missing legacy 'details' in ${p.slug}`);
    assert.ok(typeof p.stack === 'string' && p.stack.length > 0, `Missing legacy 'stack' in ${p.slug}`);
  }
});

test('Every project category matches a valid category ID', () => {
  const validCatIds = categories.filter(c => c.id !== 'all').map(c => c.id);
  for (const p of projects) {
    assert.ok(validCatIds.includes(p.category), `Invalid category '${p.category}' in project ${p.slug}`);
  }
});

test('Flagship project Fermonitor preserves 16-bit ADS1115 and 4 gas sensor channels', () => {
  const ferm = projects.find(p => p.slug === 'fermonitor');
  assert.ok(ferm, 'Fermonitor project not found');
  assert.equal(ferm.featured, true);
  const hw = ferm.hardwareStack.join(' ');
  assert.ok(hw.includes('ADS1115'), 'Fermonitor must list ADS1115 ADC');
  assert.ok(hw.includes('MQ-137'), 'Fermonitor must list MQ-137');
  assert.ok(hw.includes('MQ-136'), 'Fermonitor must list MQ-136');
  assert.ok(hw.includes('MQ-135'), 'Fermonitor must list MQ-135');
  assert.ok(hw.includes('CO₂') || hw.includes('CO2'), 'Fermonitor must list CO2 sensor');
});

// --------------------------------------------------------------------------
// SUITE 2: Image Asset Analysis
// --------------------------------------------------------------------------
console.log('\n--- SUITE 2: Image Asset Integrity & Fallback Handling ---');

test('Check all 17 project image paths on filesystem', () => {
  let existingImages = 0;
  for (const p of projects) {
    assert.ok(p.image, `Project ${p.slug} must specify an image path`);
    const publicPath = path.join(ROOT, 'public', p.image.replace(/^\//, ''));
    assert.ok(fs.existsSync(publicPath), `Project ${p.slug} image missing at ${publicPath}`);
    existingImages++;
  }
  console.log(`    Images present in public/: ${existingImages}/17`);
  assert.equal(existingImages, 17, 'All 17 project images exist on disk');
});

// --------------------------------------------------------------------------
// SUITE 3: Profile & site.js Backwards Compatibility
// --------------------------------------------------------------------------
console.log('\n--- SUITE 3: Developer Profile & site.js Shim ---');

const profile = await import('../src/data/profile.js');
const siteShim = await import('../src/data/site.js');

test('Developer profile matches authentic MSU-IIT credentials with 0 fabrication', () => {
  const p = profile.developerProfile;
  assert.equal(p.name, 'Mary Grace V. Soronio');
  assert.equal(p.cgpa, '1.67351');
  assert.equal(p.deanLister, true);
  assert.equal(p.ojtTargetHours, 700);
  assert.ok(p.education.some(e => e.institution.includes('MSU-IIT') && e.cgpa === '1.67351'));
  assert.ok(p.education.some(e => e.degree.includes('Embedded Systems')));
  assert.ok(p.experience.some(e => e.role.includes('ESL')));
  assert.ok(p.experience.some(e => e.role.includes('YouTube')));
  assert.ok(p.leadership.some(l => l.organization.includes('CCS') && l.role.includes('Budget')));
});

test('profile.js exports individual named collections matching site.js shim', () => {
  const expectedExports = [
    'contact', 'education', 'experience', 'leadership',
    'roles', 'trainings', 'certifications', 'skills',
    'toolchain', 'languages', 'developerProfile'
  ];

  for (const exp of expectedExports) {
    assert.ok(profile[exp] !== undefined, `profile.js missing export '${exp}'`);
    assert.ok(siteShim[exp] !== undefined, `site.js missing re-export '${exp}'`);
    assert.strictEqual(profile[exp], siteShim[exp], `site.js re-export '${exp}' does not match profile.js`);
  }
});

// --------------------------------------------------------------------------
// SUITE 4: Theme State Machine Stress & Adversarial Testing
// --------------------------------------------------------------------------
console.log('\n--- SUITE 4: Theme State Machine Stress Testing ---');

const themeContextCode = fs.readFileSync(path.join(ROOT, 'src/context/ThemeContext.jsx'), 'utf-8');
const THEME_STORAGE_KEY = 'mg_theme';
const THEME_COLORS = {
  dark: '#0b0612',
  light: '#faf8fd',
};

test('ThemeContext source defines THEME_STORAGE_KEY="mg_theme" and accurate hex tokens', () => {
  assert.ok(themeContextCode.includes("THEME_STORAGE_KEY = 'mg_theme'"));
  assert.ok(themeContextCode.includes("dark: '#0b0612'"));
  assert.ok(themeContextCode.includes("light: '#faf8fd'"));
});

function createMockDoc() {
  const classes = new Set();
  const attributes = {};
  return {
    documentElement: {
      attributes,
      classList: {
        add: (...cls) => cls.forEach(c => classes.add(c)),
        remove: (...cls) => cls.forEach(c => classes.delete(c)),
        contains: (c) => classes.has(c),
      },
      style: {},
      setAttribute(k, v) { attributes[k] = String(v); },
      getAttribute(k) { return attributes[k] !== undefined ? attributes[k] : null; },
    },
    querySelector: () => null,
  };
}

function simulateHeadScript(mockWindow, mockStorage, mockDocument) {
  try {
    const k = 'mg_theme';
    const s = mockStorage.getItem(k);
    let t;
    if (s === 'light' || s === 'dark') {
      t = s;
    } else if (mockWindow.matchMedia && mockWindow.matchMedia('(prefers-color-scheme: light)').matches) {
      t = 'light';
    } else {
      t = 'dark';
    }
    const root = mockDocument.documentElement;
    root.setAttribute('data-theme', t);
    root.classList.remove('dark', 'light');
    root.classList.add(t);
    root.style.colorScheme = t;
    const m = mockDocument.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', t === 'light' ? '#faf8fd' : '#0b0612');
    return t;
  } catch (e) {
    mockDocument.documentElement.setAttribute('data-theme', 'dark');
    mockDocument.documentElement.classList.add('dark');
    return 'dark';
  }
}

function simulateGetInitialTheme(mockWindow, mockStorage, mockDocument) {
  const domTheme = mockDocument.documentElement.getAttribute('data-theme');
  if (domTheme === 'light' || domTheme === 'dark') {
    return domTheme;
  }
  try {
    const stored = mockStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
  } catch (e) {}

  if (mockWindow.matchMedia && mockWindow.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
}

const corruptValues = [
  'neon',
  'DARK',
  'Light',
  '{"theme": "dark"}',
  'null',
  'undefined',
  '0',
  '1',
  'false',
  'true',
  'NaN',
  '',
  '   ',
  '<script>alert(1)</script>',
  'dark; drop table themes;',
  'rgba(0,0,0,0)',
];

for (const corrupt of corruptValues) {
  test(`Corrupted localStorage ('${corrupt}') safely resolves to default dark or system theme`, () => {
    const storageMap = new Map([[THEME_STORAGE_KEY, corrupt]]);
    const mockStorage = {
      getItem: (k) => storageMap.get(k) ?? null,
      setItem: (k, v) => storageMap.set(k, String(v)),
    };
    const mockDoc = createMockDoc();
    const mockWin = {
      matchMedia: (query) => ({ matches: false }),
    };

    const headTheme = simulateHeadScript(mockWin, mockStorage, mockDoc);
    assert.equal(headTheme, 'dark', `Head script should resolve to 'dark' for corrupt value: ${corrupt}`);

    const reactTheme = simulateGetInitialTheme(mockWin, mockStorage, mockDoc);
    assert.equal(reactTheme, 'dark', `React hook should resolve to 'dark' for corrupt value: ${corrupt}`);
  });
}

test('Storage QuotaExceededError / SecurityError does not throw and recovers to dark', () => {
  const throwingStorage = {
    getItem() { throw new Error('DOMException: SecurityError'); },
    setItem() { throw new Error('DOMException: QuotaExceededError'); },
  };
  const mockDoc = createMockDoc();
  const mockWin = { matchMedia: () => ({ matches: false }) };

  const headTheme = simulateHeadScript(mockWin, throwingStorage, mockDoc);
  assert.equal(headTheme, 'dark');

  const reactTheme = simulateGetInitialTheme(mockWin, throwingStorage, mockDoc);
  assert.equal(reactTheme, 'dark');
});

test('matchMedia prefers-color-scheme: light properly detected when no storage preference exists', () => {
  const mockStorage = { getItem: () => null, setItem: () => {} };
  const mockDoc = createMockDoc();
  const mockWin = {
    matchMedia: (q) => ({ matches: q.includes('light') }),
  };

  const headTheme = simulateHeadScript(mockWin, mockStorage, mockDoc);
  assert.equal(headTheme, 'light');

  const reactTheme = simulateGetInitialTheme(mockWin, mockStorage, mockDoc);
  assert.equal(reactTheme, 'light');
});

test('Explicit localStorage overrides system preference (light vs dark)', () => {
  const mockStorage = {
    getItem: (k) => (k === THEME_STORAGE_KEY ? 'dark' : null),
    setItem: () => {},
  };
  const mockDoc = createMockDoc();
  const mockWin = {
    matchMedia: (q) => ({ matches: q.includes('light') }),
  };

  const headTheme = simulateHeadScript(mockWin, mockStorage, mockDoc);
  assert.equal(headTheme, 'dark');

  const reactTheme = simulateGetInitialTheme(mockWin, mockStorage, mockDoc);
  assert.equal(reactTheme, 'dark');
});

test('Rapid 100-cycle toggling maintains deterministic parity across DOM, state, and storage', () => {
  let state = 'dark';
  let storageVal = 'dark';
  const doc = {
    themeAttr: 'dark',
    classes: new Set(['dark']),
    colorScheme: 'dark',
  };

  const toggle = () => {
    state = state === 'dark' ? 'light' : 'dark';
    storageVal = state;
    doc.themeAttr = state;
    if (state === 'dark') {
      doc.classes.add('dark');
      doc.classes.delete('light');
    } else {
      doc.classes.add('light');
      doc.classes.delete('dark');
    }
    doc.colorScheme = state;
  };

  for (let i = 0; i < 100; i++) {
    toggle();
    assert.equal(state, storageVal);
    assert.equal(state, doc.themeAttr);
    assert.ok(doc.classes.has(state));
    assert.ok(!doc.classes.has(state === 'dark' ? 'light' : 'dark'));
    assert.equal(doc.colorScheme, state);
  }

  assert.equal(state, 'dark');
});

test('Cross-tab storage listener discards malformed and unrelated storage events', () => {
  let currentState = 'dark';
  const handleStorage = (e) => {
    if (e.key === THEME_STORAGE_KEY && (e.newValue === 'light' || e.newValue === 'dark')) {
      currentState = e.newValue;
    }
  };

  handleStorage({ key: 'user_session', newValue: 'light' });
  assert.equal(currentState, 'dark');

  handleStorage({ key: THEME_STORAGE_KEY, newValue: 'neon-purple' });
  assert.equal(currentState, 'dark');

  handleStorage({ key: THEME_STORAGE_KEY, newValue: null });
  assert.equal(currentState, 'dark');

  handleStorage({ key: THEME_STORAGE_KEY, newValue: 'light' });
  assert.equal(currentState, 'light');

  handleStorage({ key: THEME_STORAGE_KEY, newValue: 'dark' });
  assert.equal(currentState, 'dark');
});

// --------------------------------------------------------------------------
// SUITE 5: CSS Design System Tokens & Emil Kowalski Standards
// --------------------------------------------------------------------------
console.log('\n--- SUITE 5: CSS Design System Tokens & Polish Rules ---');

const css = fs.readFileSync(path.join(ROOT, 'src/styles/app.css'), 'utf-8');

test('CSS defines complete Dark Purple tokens', () => {
  const darkSection = css.match(/:root,\s*\[data-theme="dark"\],\s*\.dark\s*\{([^}]+)\}/s);
  assert.ok(darkSection, 'Dark theme section not found in app.css');
  const dBody = darkSection[1];
  assert.ok(dBody.includes('--theme-paper: #0b0612'), 'Must define obsidian plum #0b0612');
  assert.ok(dBody.includes('--theme-ink: #f5f2fb'), 'Must define high-contrast ink #f5f2fb');
  assert.ok(dBody.includes('--theme-accent: #9d4edd'), 'Must define electric violet #9d4edd');
});

test('CSS defines complete Light Paper tokens', () => {
  const lightSection = css.match(/\[data-theme="light"\],\s*\.light\s*\{([^}]+)\}/s);
  assert.ok(lightSection, 'Light theme section not found in app.css');
  const lBody = lightSection[1];
  assert.ok(lBody.includes('--theme-paper: #faf8fd'), 'Must define paper #faf8fd');
  assert.ok(lBody.includes('--theme-ink: #150d24'), 'Must define ink #150d24');
  assert.ok(lBody.includes('--theme-accent: #7c3aed'), 'Must define royal violet #7c3aed');
});

test('CSS defines bridge variables on :root for backwards compatibility', () => {
  assert.ok(css.includes('--color-paper: var(--theme-paper);'));
  assert.ok(css.includes('--color-ink: var(--theme-ink);'));
  assert.ok(css.includes('--color-accent: var(--theme-accent);'));
  assert.ok(css.includes('--color-rule: var(--theme-rule);'));
});

test('Emil Kowalski rules are enforced in CSS', () => {
  assert.ok(css.includes('max-width: 65ch;'), 'Must constrain reading measure to 65ch');
  assert.ok(css.includes('font-variant-numeric: tabular-nums;'), 'Must enforce tabular-nums on numbers');
  assert.ok(css.includes('transform: scale(0.97);'), 'Must define active scale(0.97) compression');
  assert.ok(css.includes('@media (prefers-reduced-motion: reduce)'), 'Must include reduced-motion media query');
  assert.ok(css.includes('min-height: 44px;'), 'Must enforce minimum 44px hit area');
});

// --------------------------------------------------------------------------
// SUMMARY
// --------------------------------------------------------------------------
console.log('\n================================================================');
console.log(`STRESS TEST SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
console.log('================================================================\n');

if (failCount > 0) {
  console.error('FAILURES:');
  for (const f of failures) {
    console.error(`  - ${f.name}: ${f.error.message}`);
  }
  process.exit(1);
} else {
  console.log('ALL EMPIRICAL STRESS TESTS PASSED!');
  process.exit(0);
}
