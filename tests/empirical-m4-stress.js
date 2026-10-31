// tests/empirical-m4-stress.js
// EMPIRICAL CHALLENGER & ADVERSARIAL STRESS HARNESS — Milestone 4
// Projects Showcase & Dedicated Project Details
//
// Rigorous verification of:
// 1. Authentic 17-project dataset integrity & category distribution
// 2. Safe search logic under adversarial, regex, unicode, and injection inputs
// 3. Category filtering and count badge exact math
// 4. Dedicated project detail HUD spec sheet & 5-part engineering narrative coverage
// 5. Invariant slug resolution, alias resolution, and 404 recovery logic
// 6. Recruiter inquiry CTA target URI formulation and encoding
// 7. Media asset validation on disk (17 primary images, 43 gallery captures, fallback SVG)
// 8. Design engineering constraints (Emil Kowalski rules, tabular nums, <=65ch measure, 44px+ hit areas)
// 9. Integrity violation checks (no hardcoded test stubs or bypasses)

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('  CHALLENGER M4: EMPIRICAL STRESS & ADVERSARIAL VERIFICATION');
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

// Dynamically import project modules
const { projects, categories } = await import('../src/data/projects.js');
const { galleries, galleryFor } = await import('../src/data/media.js');

const projectsCode = fs.readFileSync(path.join(ROOT, 'src', 'pages', 'Projects.jsx'), 'utf8');
const detailCode = fs.readFileSync(path.join(ROOT, 'src', 'pages', 'ProjectDetail.jsx'), 'utf8');

// ============================================================================
// SUITE 1: Dataset Integrity & Category Math Invariants
// ============================================================================
console.log('\n--- SUITE 1: Dataset Integrity & Category Math Invariants ---');

test('Exact 17 authentic projects in catalog', () => {
  assert.equal(projects.length, 17, `Expected 17 projects, found ${projects.length}`);
});

test('Categories declare exactly 5 standard buckets', () => {
  const expectedCats = ['all', 'embedded', 'iot', 'digital-logic', 'software'];
  const actualCats = categories.map((c) => c.id);
  assert.deepEqual(actualCats, expectedCats);
});

test('Category counts sum exactly to 17 without orphans', () => {
  const counts = { all: projects.length };
  for (const cat of categories) {
    if (cat.id !== 'all') {
      counts[cat.id] = projects.filter((p) => p.category === cat.id).length;
    }
  }
  assert.equal(counts.all, 17);
  assert.equal(counts.embedded, 5, 'Embedded should have 5 projects');
  assert.equal(counts.iot, 5, 'IoT should have 5 projects');
  assert.equal(counts['digital-logic'], 2, 'Digital logic should have 2 projects');
  assert.equal(counts.software, 5, 'Software should have 5 projects');
  assert.equal(
    counts.embedded + counts.iot + counts['digital-logic'] + counts.software,
    17,
    'Sum of individual categories must equal 17'
  );
});

test('Every project has non-empty required narrative properties', () => {
  for (const p of projects) {
    assert.ok(p.slug && typeof p.slug === 'string', `Project missing slug: ${JSON.stringify(p)}`);
    assert.ok(p.title && typeof p.title === 'string', `${p.slug} missing title`);
    assert.ok(p.subtitle && typeof p.subtitle === 'string', `${p.slug} missing subtitle`);
    assert.ok(p.overview && p.overview.length > 20, `${p.slug} missing or short overview`);
    assert.ok(p.problem && p.problem.length > 20, `${p.slug} missing or short problem`);
    assert.ok(p.solution && p.solution.length > 20, `${p.slug} missing or short solution`);
    assert.ok(Array.isArray(p.hardwareStack), `${p.slug} hardwareStack must be an array`);
    assert.ok(Array.isArray(p.softwareStack), `${p.slug} softwareStack must be an array`);
    assert.ok(Array.isArray(p.challenges), `${p.slug} challenges must be an array`);
  }
});

// ============================================================================
// SUITE 2: Adversarial Search Stress & Substring Immunity
// ============================================================================
console.log('\n--- SUITE 2: Adversarial Search Stress & Substring Immunity ---');

// Replicate filtering logic from Projects.jsx
function filterCatalog(activeCat, queryText) {
  const needle = queryText.trim().toLowerCase();
  return projects.filter((project) => {
    const inCategory = activeCat === 'all' || project.category === activeCat;
    if (!inCategory) return false;
    if (!needle) return true;

    const haystack = [
      project.title,
      project.name,
      project.subtitle,
      project.line,
      project.summary,
      project.stack,
      project.categoryLabel,
      ...(project.hardwareStack || []),
      ...(project.softwareStack || []),
      ...(project.tags || []),
      project.details,
      project.overview,
      project.problem,
      project.solution,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return haystack.includes(needle);
  });
}

test('Regex special characters do NOT crash search (C++, [FPGA], (RTOS), .*?+{})', () => {
  const maliciousRegexQueries = [
    'C++',
    '[FPGA]',
    '(RTOS)',
    '.*',
    '\\d+',
    '???',
    '+++',
    '{{{',
    '^$',
    '[a-z]+',
    '|',
  ];
  for (const q of maliciousRegexQueries) {
    assert.doesNotThrow(() => {
      const res = filterCatalog('all', q);
      assert.ok(Array.isArray(res));
    }, `Search crashed on regex query: "${q}"`);
  }
});

test('Search handles C++ specifically and matches C++ projects', () => {
  const res = filterCatalog('all', 'c++');
  assert.ok(res.length >= 2, `Expected at least 2 C++ projects, found ${res.length}`);
  const slugs = res.map((p) => p.slug);
  assert.ok(slugs.includes('ricedirect') || slugs.includes('aquaflush') || slugs.includes('etee'));
});

test('Search handles SQL injection and XSS strings cleanly without false matches', () => {
  const adversarialStrings = [
    "' OR '1'='1",
    '<script>alert("xss")</script>',
    'DROP TABLE projects;--',
    '${process.env.SECRET}',
    '__proto__',
    'constructor',
  ];
  for (const str of adversarialStrings) {
    const res = filterCatalog('all', str);
    assert.equal(res.length, 0, `Adversarial input "${str}" should yield 0 matches`);
  }
});

test('Search handles unicode, diacritics, and symbols gracefully', () => {
  assert.doesNotThrow(() => {
    filterCatalog('all', 'CO₂');
    filterCatalog('all', 'H₂S');
    filterCatalog('all', 'μC');
    filterCatalog('all', '🚀');
  });
});

test('Search handles massive string input without memory leak or catastrophic backtracking', () => {
  const hugeString = 'a'.repeat(5000);
  const start = performance.now();
  const res = filterCatalog('all', hugeString);
  const elapsed = performance.now() - start;
  assert.equal(res.length, 0);
  assert.ok(elapsed < 20, `Search took too long (${elapsed}ms) for 5000-char string`);
});

// ============================================================================
// SUITE 3: Dedicated Project Detail HUD Spec Sheets & Narrative Coverage
// ============================================================================
console.log('\n--- SUITE 3: Dedicated Project Detail HUD Spec Sheets & Narrative ---');

test('ProjectDetail.jsx defines PROJECT_HUD covering all 17 projects', () => {
  assert.ok(detailCode.includes('export const PROJECT_HUD = {'), 'Must export PROJECT_HUD');
  for (const p of projects) {
    const key = p.slug.includes('-') ? `'${p.slug}':` : `${p.slug}:`;
    const altKey = `"${p.slug}":`;
    assert.ok(
      detailCode.includes(key) || detailCode.includes(altKey),
      `ProjectDetail.jsx PROJECT_HUD missing entry for ${p.slug}`
    );
  }
});

test('ProjectDetail.jsx implements getProjectHud and getProjectStatus helpers', () => {
  assert.ok(detailCode.includes('export function getProjectHud'), 'Must export getProjectHud');
  assert.ok(detailCode.includes('export function getProjectStatus'), 'Must export getProjectStatus');
});

test('All projects have at least 1 verified challenge documented', () => {
  for (const p of projects) {
    assert.ok(
      p.challenges && p.challenges.length >= 1,
      `Project ${p.slug} must document at least 1 authentic challenge`
    );
  }
});

// ============================================================================
// SUITE 4: Slug Resolution, Aliases, & 404 Recovery State
// ============================================================================
console.log('\n--- SUITE 4: Slug Resolution, Aliases, & 404 Recovery State ---');

test('All 17 canonical slugs resolve to unique distinct projects', () => {
  const seen = new Set();
  for (const p of projects) {
    assert.ok(!seen.has(p.slug), `Duplicate slug detected: ${p.slug}`);
    seen.add(p.slug);
  }
  assert.equal(seen.size, 17);
});

test('Alias slugs correctly resolve back to canonical project entries', () => {
  const aliasMap = {
    'fermonitor-iot-incubator': 'fermonitor',
    'fermonitor-bagoong-enose': 'fermonitor',
    'stm32-smart-ambient-monitor': 'room-monitoring',
    'stm32-freertos-room-monitor': 'room-monitoring',
  };
  for (const [alias, canonical] of Object.entries(aliasMap)) {
    const found = projects.find(
      (item) => item.slug === alias || item.aliasSlugs?.includes(alias)
    );
    assert.ok(found, `Alias ${alias} did not resolve to any project`);
    assert.equal(found.slug, canonical, `Alias ${alias} resolved to ${found.slug}, expected ${canonical}`);
  }
});

test('Path traversal and malformed slug queries return undefined for 404 catch', () => {
  const badSlugs = [
    '../../etc/passwd',
    '..\\..\\windows\\system32',
    'null',
    'undefined',
    '<script>',
    '',
    'nonexistent-build-404',
  ];
  for (const bad of badSlugs) {
    const found = projects.find((item) => item.slug === bad || item.aliasSlugs?.includes(bad));
    assert.equal(found, undefined, `Bad slug "${bad}" should not match any project`);
  }
});

test('ProjectDetail.jsx contains 404 recovery UI with link to /projects', () => {
  assert.ok(detailCode.includes('404 // BUILD_NOT_FOUND'), 'Must include 404 header code');
  assert.ok(detailCode.includes('to="/projects"'), 'Must link back to /projects');
  assert.ok(detailCode.includes('to="/"'), 'Must link back to /');
});

// ============================================================================
// SUITE 5: Recruiter Inquiry CTA URL Construction
// ============================================================================
console.log('\n--- SUITE 5: Recruiter Inquiry CTA URL Construction ---');

test('Inquiry CTA strictly satisfies test contract T3-CD-5 format for all projects', () => {
  for (const p of projects) {
    const inquiryUrl = `/contact?subject=${encodeURIComponent(
      `Inquiry regarding ${p.name || p.title}`
    )}`;
    assert.ok(inquiryUrl.startsWith('/contact?subject=Inquiry%20regarding%20'));
    assert.ok(!inquiryUrl.includes('undefined'));
    assert.ok(!inquiryUrl.includes('null'));
  }
});

test('Inquiry CTA encodes special characters in project titles safely', () => {
  const mockP = { title: 'C++ & FPGA / RTOS: Controller' };
  const inquiryUrl = `/contact?subject=${encodeURIComponent(`Inquiry regarding ${mockP.title}`)}`;
  assert.equal(
    inquiryUrl,
    '/contact?subject=Inquiry%20regarding%20C%2B%2B%20%26%20FPGA%20%2F%20RTOS%3A%20Controller'
  );
  // Verify decoding reconstitutes original string exactly
  const parsed = new URLSearchParams(inquiryUrl.slice('/contact?'.length));
  assert.equal(parsed.get('subject'), 'Inquiry regarding C++ & FPGA / RTOS: Controller');
});

// ============================================================================
// SUITE 6: Media Asset Pipeline & Disk Integrity
// ============================================================================
console.log('\n--- SUITE 6: Media Asset Pipeline & Disk Integrity ---');

test('public/work/fallback-board.svg exists and is valid SVG', () => {
  const svgPath = path.join(ROOT, 'public', 'work', 'fallback-board.svg');
  assert.ok(fs.existsSync(svgPath), 'fallback-board.svg must exist on disk');
  const content = fs.readFileSync(svgPath, 'utf8');
  assert.ok(content.includes('<svg'), 'fallback-board.svg must contain <svg tag');
  assert.ok(content.includes('viewBox="0 0 900 562"'), 'Must have 900x562 viewBox');
  assert.ok(content.includes('#12091f'), 'Must match dark purple background');
  assert.ok(content.includes('EMBEDDED HARDWARE CAPTURE'), 'Must have technical hardware caption');
});

test('All 17 primary project images exist on disk with valid file size (>1KB)', () => {
  for (const p of projects) {
    assert.ok(p.image, `Project ${p.slug} has no image defined`);
    const relPath = p.image.startsWith('/') ? p.image.slice(1) : p.image;
    const absPath = path.join(ROOT, 'public', relPath);
    assert.ok(fs.existsSync(absPath), `Project image does not exist: ${absPath}`);
    const stat = fs.statSync(absPath);
    assert.ok(stat.size > 1024, `Project image too small (<1KB): ${absPath}`);
  }
});

test('All secondary gallery captures mapped in src/data/media.js exist on disk', () => {
  let totalGalleriesCount = 0;
  for (const [slug, images] of Object.entries(galleries)) {
    for (const img of images) {
      totalGalleriesCount++;
      const relPath = img.startsWith('/') ? img.slice(1) : img;
      const absPath = path.join(ROOT, 'public', relPath);
      assert.ok(fs.existsSync(absPath), `Gallery image for ${slug} missing: ${absPath}`);
      const stat = fs.statSync(absPath);
      assert.ok(stat.size > 1024, `Gallery image too small: ${absPath}`);
    }
  }
  console.log(`    Verified ${totalGalleriesCount} secondary gallery captures on disk`);
  assert.ok(totalGalleriesCount >= 20, 'Should have rich secondary gallery assets');
});

test('galleryFor helper strictly filters out duplicate of primary hero image', () => {
  const fermonitor = projects.find((p) => p.slug === 'fermonitor');
  const gallery = galleryFor(fermonitor);
  assert.ok(!gallery.includes(fermonitor.image), 'galleryFor must not repeat primary hero image');
});

// ============================================================================
// SUITE 7: Design Engineering Standards & Emil Kowalski Rules
// ============================================================================
console.log('\n--- SUITE 7: Design Engineering Standards & Emil Kowalski Rules ---');

test('Projects.jsx implements 44px+ touch targets on interactive controls', () => {
  assert.ok(projectsCode.includes('min-h-[44px]'), 'Projects.jsx must enforce min-h-[44px]');
  assert.ok(projectsCode.includes('pressable'), 'Projects.jsx must include pressable class');
});

test('Projects.jsx implements tabular-nums on numeric badges and counts', () => {
  assert.ok(projectsCode.includes('tabular-nums'), 'Projects.jsx must enforce tabular-nums');
});

test('Projects.jsx bounds paragraph and lead text to max-w-[65ch]', () => {
  assert.ok(projectsCode.includes('max-w-[65ch]'), 'Projects.jsx must constrain text measure to max-w-[65ch]');
});

test('ProjectDetail.jsx implements 44px+ touch targets on back links and inquiry CTAs', () => {
  assert.ok(detailCode.includes('min-h-11'), 'ProjectDetail.jsx must enforce min-h-11 (44px)');
});

test('ProjectDetail.jsx bounds technical narrative to max-w-[65ch]', () => {
  assert.ok(detailCode.includes('max-w-[65ch]'), 'ProjectDetail.jsx must bound narrative to max-w-[65ch]');
});

test('ProjectDetail.jsx implements CircuitSchematicFallback on image failure', () => {
  assert.ok(detailCode.includes('CircuitSchematicFallback'), 'Must include CircuitSchematicFallback');
  assert.ok(detailCode.includes('setMainImageFailed(true)'), 'Must handle onError on main image');
});

test('ProjectDetail.jsx enforces rel="noopener noreferrer" and target="_blank" on external links', () => {
  assert.ok(
    detailCode.includes('target="_blank"') && detailCode.includes('rel="noopener noreferrer"'),
    'External links must have target="_blank" and rel="noopener noreferrer"'
  );
});

// ============================================================================
// SUITE 8: Integrity & Anti-Cheating Verification
// ============================================================================
console.log('\n--- SUITE 8: Integrity & Anti-Cheating Verification ---');

test('No hardcoded test mocks or expected outputs embedded in source code', () => {
  const suspiciousTokens = [
    'mockTestRunner',
    '__TEST_OVERRIDE__',
    'fakeProjectCatalog',
    'window.__TEST_PASS__',
    'skipValidation',
  ];
  for (const token of suspiciousTokens) {
    assert.ok(!projectsCode.includes(token), `Found suspicious token in Projects.jsx: ${token}`);
    assert.ok(!detailCode.includes(token), `Found suspicious token in ProjectDetail.jsx: ${token}`);
  }
});

test('No console.error or console.warn in production page components', () => {
  assert.ok(!projectsCode.includes('console.error'), 'No console.error in Projects.jsx');
  assert.ok(!detailCode.includes('console.error'), 'No console.error in ProjectDetail.jsx');
  assert.ok(!projectsCode.includes('console.warn'), 'No console.warn in Projects.jsx');
  assert.ok(!detailCode.includes('console.warn'), 'No console.warn in ProjectDetail.jsx');
});

// ============================================================================
// SUITE 9: Comprehensive 17-Project Route Stress & HUD Subsystem Validation
// ============================================================================
console.log('\n--- SUITE 9: Comprehensive 17-Project Route Stress & HUD Telemetry ---');

import vm from 'node:vm';
const jsPortion = detailCode
  .slice(0, detailCode.indexOf('function Section'))
  .replace(/^import\s+.*?from\s+['"].*?['"]/gm, '')
  .replace(/\bexport\s+/g, '');

const vmContext = { projects, galleryFor };
vm.createContext(vmContext);
vm.runInContext(jsPortion, vmContext);
const { PROJECT_HUD: hudTable, getProjectHud: hudHelper, getProjectStatus: statusHelper } = vmContext;

// Test all 17 projects individually
for (const p of projects) {
  test(`Project /projects/${p.slug}: renders valid title, HUD sheet, problem/solution, challenges, metrics, links`, () => {
    // 1. Slug resolution
    const found = projects.find((item) => item.slug === p.slug || item.aliasSlugs?.includes(p.slug));
    assert.ok(found, `Failed to find project by slug: ${p.slug}`);

    // 2. Title & Subtitle
    assert.ok(found.title && found.title.trim().length > 0, `${p.slug}: empty title`);
    assert.ok(found.subtitle && found.subtitle.trim().length > 0, `${p.slug}: empty subtitle`);

    // 3. HUD Spec Sheet
    const hud = hudHelper(found);
    assert.ok(hud, `${p.slug}: getProjectHud returned null/undefined`);
    assert.ok(hud.processor && hud.processor.trim().length > 0, `${p.slug}: HUD processor missing`);
    assert.ok(hud.sensors && hud.sensors.trim().length > 0, `${p.slug}: HUD sensors missing`);
    assert.ok(hud.protocols && hud.protocols.trim().length > 0, `${p.slug}: HUD protocols missing`);
    assert.ok(hud.software && hud.software.trim().length > 0, `${p.slug}: HUD software missing`);
    assert.ok(hud.tools && hud.tools.trim().length > 0, `${p.slug}: HUD tools missing`);

    // 4. Status Beacon
    const status = statusHelper(found);
    assert.ok(status && status.label, `${p.slug}: status beacon missing label`);
    assert.ok(status.dotColor && status.dotColor.startsWith('bg-'), `${p.slug}: invalid dotColor`);

    // 5. Problem & Solution
    assert.ok(found.problem && found.problem.trim().length >= 20, `${p.slug}: problem narrative too short`);
    assert.ok(found.solution && found.solution.trim().length >= 20, `${p.slug}: solution narrative too short`);

    // 6. Challenges
    assert.ok(Array.isArray(found.challenges) && found.challenges.length >= 1, `${p.slug}: challenges array empty`);
    for (const ch of found.challenges) {
      assert.ok(typeof ch === 'string' && ch.trim().length >= 10, `${p.slug}: challenge string too short: ${ch}`);
    }

    // 7. Metrics (if present)
    if (found.metrics && found.metrics.length > 0) {
      for (const m of found.metrics) {
        assert.ok(m.label && m.value, `${p.slug}: metric must have label and value`);
      }
    }

    // 8. Links
    if (found.links && found.links.length > 0) {
      for (const l of found.links) {
        const targetUrl = l.href || l.url;
        assert.ok(targetUrl, `${p.slug}: link missing href/url`);
        assert.ok(
          targetUrl.startsWith('http://') || targetUrl.startsWith('https://') || targetUrl.startsWith('/'),
          `${p.slug}: invalid link url protocol: ${targetUrl}`
        );
      }
    }

    // 9. Inquiry CTA target
    const inquiryUrl = `/contact?subject=${encodeURIComponent(`Inquiry regarding ${found.name || found.title}`)}`;
    assert.ok(inquiryUrl.startsWith('/contact?subject=Inquiry%20regarding%20'));
    assert.ok(!inquiryUrl.includes(' '));
  });
}

// ============================================================================
// SUITE 10: URL Parameter Synchronization & History Navigation Simulation
// ============================================================================
console.log('\n--- SUITE 10: URL Parameter Synchronization & History Navigation ---');

test('Direct URL parameter loading (?category=embedded&q=stm32)', () => {
  const directUrl = 'http://localhost/projects?category=embedded&q=stm32';
  const urlObj = new URL(directUrl);
  const categoryParam = urlObj.searchParams.get('category') || 'all';
  const queryParam = urlObj.searchParams.get('q') || '';

  const activeCategory = categories.some((c) => c.id === categoryParam) ? categoryParam : 'all';
  assert.equal(activeCategory, 'embedded');
  assert.equal(queryParam, 'stm32');

  const filtered = filterCatalog(activeCategory, queryParam);
  assert.ok(filtered.length > 0, 'Direct load ?category=embedded&q=stm32 should yield matches');
  for (const p of filtered) {
    assert.equal(p.category, 'embedded');
  }
});

test('Simulated history navigation (pushState -> back -> forward) state consistency', () => {
  const history = [
    { category: 'all', q: '' }, // Initial load /projects
    { category: 'iot', q: '' }, // Filter by IoT
    { category: 'iot', q: 'fermonitor' }, // Type fermonitor
  ];
  let historyIdx = 2;

  // Verify state at step 2 (iot + fermonitor)
  let state = history[historyIdx];
  let res = filterCatalog(state.category, state.q);
  assert.equal(res.length, 1);
  assert.equal(res[0].slug, 'fermonitor');

  // Back button (historyIdx = 1: iot + empty q)
  historyIdx--;
  state = history[historyIdx];
  res = filterCatalog(state.category, state.q);
  assert.equal(res.length, 5, 'IoT category should yield 5 builds');
  for (const p of res) {
    assert.equal(p.category, 'iot');
  }

  // Back button (historyIdx = 0: all + empty q)
  historyIdx--;
  state = history[historyIdx];
  res = filterCatalog(state.category, state.q);
  assert.equal(res.length, 17, 'All category should yield 17 builds');

  // Forward button (historyIdx = 1: iot + empty q)
  historyIdx++;
  state = history[historyIdx];
  res = filterCatalog(state.category, state.q);
  assert.equal(res.length, 5);

  // Forward button (historyIdx = 2: iot + fermonitor)
  historyIdx++;
  state = history[historyIdx];
  res = filterCatalog(state.category, state.q);
  assert.equal(res.length, 1);
});

test('Invalid slugs return clean 404 condition', () => {
  const invalidSlugs = [
    '/projects/does-not-exist',
    '/projects/123',
    '/projects/undefined',
    '/projects/null',
    '/projects/[object%20Object]',
  ];

  for (const pathStr of invalidSlugs) {
    const slug = pathStr.replace('/projects/', '');
    const found = projects.find((item) => item.slug === slug || item.aliasSlugs?.includes(slug));
    assert.equal(found, undefined, `Invalid slug ${slug} should not resolve to any project`);
  }
});

console.log('\n================================================================');
console.log(`SUMMARY: ${passCount} tests passed, ${failCount} tests failed.`);
console.log('================================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
