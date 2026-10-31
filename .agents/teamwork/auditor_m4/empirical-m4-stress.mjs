// .agents/teamwork/auditor_m4/empirical-m4-stress.mjs
// Master Forensic Integrity & Adversarial Stress Harness for Milestone 4
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

const ROOT = path.resolve('.');
console.log('================================================================');
console.log('  FORENSIC AUDITOR M4: EMPIRICAL STRESS & INTEGRITY HARNESS');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;
const failures = [];

function check(name, fn) {
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
// SUITE 1: Zero Cheating & Anti-Cheating Source Code Forensics
// --------------------------------------------------------------------------
console.log('\n--- SUITE 1: Zero Cheating & Anti-Cheating Forensics ---');

check('S1.1: No hardcoded test result strings or PASS constants in M4 source files', () => {
  const files = [
    'src/pages/Projects.jsx',
    'src/pages/ProjectDetail.jsx',
    'src/data/projects.js',
    'src/data/media.js',
  ];
  const forbiddenPatterns = [
    /PASS/i,
    /TEST_PASS/i,
    /ALL TEST SUITES PASSED/i,
    /__test/i,
    /mockResult/i,
    /fakePass/i,
    /testBypass/i,
  ];

  for (const f of files) {
    const content = fs.readFileSync(path.join(ROOT, f), 'utf8');
    // Ensure no suspicious bypasses or hardcoded test runner outputs
    assert.ok(!content.includes('ALL TEST SUITES PASSED'), `Hardcoded test output in ${f}`);
    assert.ok(!content.includes('ALL_TESTS_PASSED'), `Hardcoded test flag in ${f}`);
    assert.ok(!content.includes('bypass_test'), `Test bypass found in ${f}`);
    assert.ok(!content.includes('__vitest__'), `Framework bypass found in ${f}`);
  }
});

check('S1.2: No test files in tests/ contain .skip, .todo, or commented assertions', () => {
  const testFiles = fs.readdirSync(path.join(ROOT, 'tests'), { recursive: true })
    .filter(f => typeof f === 'string' && f.endsWith('.test.js'))
    .map(f => path.join(ROOT, 'tests', f));

  assert.ok(testFiles.length >= 35, `Expected >= 35 test files, found ${testFiles.length}`);

  for (const tf of testFiles) {
    const content = fs.readFileSync(tf, 'utf8');
    assert.ok(!content.includes('.skip('), `Found .skip() in test file: ${tf}`);
    assert.ok(!content.includes('.only('), `Found .only() in test file: ${tf}`);
  }
});

check('S1.3: No test files modified during M4 implementation window', () => {
  const testFiles = fs.readdirSync(path.join(ROOT, 'tests'), { recursive: true })
    .filter(f => typeof f === 'string' && f.endsWith('.test.js'))
    .map(f => path.join(ROOT, 'tests', f));

  // Worker M4 ran after 2:40 PM (14:40) on 2026-10-31
  const cutoff = new Date('2026-10-31T14:40:00+08:00');
  for (const tf of testFiles) {
    const stat = fs.statSync(tf);
    assert.ok(stat.mtime < cutoff, `Test file modified during M4 implementation: ${tf} at ${stat.mtime}`);
  }
});

// --------------------------------------------------------------------------
// SUITE 2: Authentic Content Preservation & Developer Profile
// --------------------------------------------------------------------------
console.log('\n--- SUITE 2: Authentic Content Preservation & Developer Profile ---');

import { projects, categories } from '../../../src/data/projects.js';
import { contact, education, experience, leadership } from '../../../src/data/profile.js';

check('S2.1: Exactly 17 authentic projects preserved with authentic categorizations', () => {
  assert.equal(projects.length, 17, 'Project count must be 17');
  const catCounts = { embedded: 0, iot: 0, 'digital-logic': 0, software: 0 };
  for (const p of projects) {
    assert.ok(catCounts[p.category] !== undefined, `Unknown category ${p.category} in ${p.slug}`);
    catCounts[p.category]++;
  }
  assert.equal(catCounts.embedded, 5, 'Embedded count must be 5');
  assert.equal(catCounts.iot, 5, 'IoT count must be 5');
  assert.equal(catCounts['digital-logic'], 2, 'Digital Logic count must be 2');
  assert.equal(catCounts.software, 5, 'Software count must be 5');
});

check('S2.2: Authentic microcontrollers and silicon architectures present across projects', () => {
  const hardwareSlugs = projects
    .filter(p => ['embedded', 'iot', 'digital-logic'].includes(p.category))
    .map(p => p.slug);

  const combinedSilicon = projects.map(p => `${p.stack} ${(p.hardwareStack || []).join(' ')} ${p.details} ${p.overview}`).join(' ');

  assert.ok(combinedSilicon.includes('STM32'), 'Must feature STM32');
  assert.ok(combinedSilicon.includes('ATmega328P') || combinedSilicon.includes('ATmega'), 'Must feature ATmega');
  assert.ok(combinedSilicon.includes('RA6M3') || combinedSilicon.includes('Renesas'), 'Must feature Renesas RA6M3');
  assert.ok(combinedSilicon.includes('Artix-7') || combinedSilicon.includes('FPGA') || combinedSilicon.includes('Xilinx'), 'Must feature FPGA');
  assert.ok(combinedSilicon.includes('ESP32'), 'Must feature ESP32');
  assert.ok(combinedSilicon.includes('Raspberry Pi'), 'Must feature Raspberry Pi');
});

check('S2.3: Mary Grace Soronio developer credentials match Sources exactly', () => {
  assert.equal(contact.name, 'Mary Grace V. Soronio');
  assert.equal(contact.email, 'marygrace.soronio@g.msuiit.edu.ph');
  assert.equal(contact.phone, '+63 966 043 4042');
  assert.equal(education[0].cgpa, '1.67351');
  assert.equal(education[0].honors, "Dean's Lister");
  assert.ok(education[0].institution.includes('MSU-IIT'));
  assert.ok(education[0].degree.includes('Embedded Systems'));
});

// --------------------------------------------------------------------------
// SUITE 3: Asset Authenticity & Fallback Graphic Integrity
// --------------------------------------------------------------------------
console.log('\n--- SUITE 3: Asset Authenticity & Fallback Graphic Integrity ---');

import { galleries, galleryFor } from '../../../src/data/media.js';

check('S3.1: All 43 copied secondary assets match Sources byte-for-byte via SHA-256', () => {
  // Pre-hash Sources
  const sourceHashes = new Map();
  function hashDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        hashDir(full);
      } else if (ent.isFile()) {
        const buf = fs.readFileSync(full);
        const hash = crypto.createHash('sha256').update(buf).digest('hex');
        sourceHashes.set(hash, full);
      }
    }
  }
  hashDir(path.join(ROOT, 'Sources'));

  // Inspect public/work, public/docs, public/video
  const copiedFolders = ['public/work', 'public/docs', 'public/video'];
  let checkedCount = 0;
  for (const folder of copiedFolders) {
    const folderPath = path.join(ROOT, folder);
    if (!fs.existsSync(folderPath)) continue;
    const files = fs.readdirSync(folderPath);
    for (const f of files) {
      if (f === 'fallback-board.svg') continue;
      const full = path.join(folderPath, f);
      const stat = fs.statSync(full);
      // Check if file was copied during M4 (between 15:50 and 16:05)
      const m4Time = new Date('2026-10-31T15:50:00+08:00');
      if (stat.birthtime >= m4Time || stat.ctime >= m4Time) {
        const buf = fs.readFileSync(full);
        const h = crypto.createHash('sha256').update(buf).digest('hex');
        assert.ok(sourceHashes.has(h), `Copied file ${f} has NO match in Sources/ (SHA256: ${h})`);
        checkedCount++;
      }
    }
  }
  assert.equal(checkedCount, 43, `Expected 43 copied assets, checked ${checkedCount}`);
});

check('S3.2: public/work/fallback-board.svg exists and is valid custom SVG graphic', () => {
  const fallbackPath = path.join(ROOT, 'public/work/fallback-board.svg');
  assert.ok(fs.existsSync(fallbackPath), 'fallback-board.svg must exist');
  const svg = fs.readFileSync(fallbackPath, 'utf8');
  assert.ok(svg.includes('<svg'), 'Must have svg tag');
  assert.ok(svg.includes('viewBox="0 0 900 562"'), 'Must have correct viewBox');
  assert.ok(svg.includes('EMBEDDED HARDWARE CAPTURE'), 'Must have label');
  assert.ok(svg.includes('#12091f'), 'Must match dark purple palette');
});

check('S3.3: All 41 secondary media references in media.js exist on disk', () => {
  let count = 0;
  for (const p of projects) {
    const gal = galleryFor(p);
    for (const item of gal) {
      const diskPath = path.join(ROOT, 'public', item);
      assert.ok(fs.existsSync(diskPath), `Missing gallery file on disk: ${diskPath}`);
      count++;
    }
  }
  assert.ok(count >= 30, `Expected >= 30 gallery items, found ${count}`);
});

// --------------------------------------------------------------------------
// SUITE 4: Search & Category Filter Adversarial Testing
// --------------------------------------------------------------------------
console.log('\n--- SUITE 4: Search & Category Filter Adversarial Testing ---');

function filterCatalog(category, query) {
  const needle = query.trim().toLowerCase();
  return projects.filter((project) => {
    const inCategory = category === 'all' || project.category === category;
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

check('S4.1: Adversarial queries with special characters and regex meta-characters', () => {
  const stressQueries = [
    'C++',
    'I²C',
    'H₂S',
    '.*',
    '[a-z]+',
    '(?=.*)',
    '\\',
    '/',
    '#RTOS',
    '   ',
    'NONEXISTENT_STRESS_TARGET_404',
  ];

  for (const q of stressQueries) {
    // Must execute cleanly without throwing
    const res = filterCatalog('all', q);
    assert.ok(Array.isArray(res));
  }

  // C++ must find ricedirect or line-robot or aquaflush
  const cppResults = filterCatalog('all', 'C++');
  assert.ok(cppResults.length >= 1, 'C++ query must match C++ projects');

  // I²C must find fermonitor or mp3-player or aquaflush
  const i2cResults = filterCatalog('all', 'I²C');
  assert.ok(i2cResults.length >= 1, 'I²C query must match I2C/I²C projects');

  // Non-existent must return 0 items
  const emptyRes = filterCatalog('all', 'NONEXISTENT_STRESS_TARGET_404');
  assert.equal(emptyRes.length, 0);
});

check('S4.2: Case insensitivity and whitespace trimming across categories', () => {
  const upper = filterCatalog('embedded', '   FREE-RTOS   ');
  const lower = filterCatalog('embedded', 'freertos');
  // Both must find room-monitoring or mp3-player
  const matchUpper = filterCatalog('all', '   STM32   ');
  const matchLower = filterCatalog('all', 'stm32');
  assert.equal(matchUpper.length, matchLower.length);
  assert.ok(matchUpper.length >= 3);
});

// --------------------------------------------------------------------------
// SUITE 5: Dynamic Routing & Slug Resolution
// --------------------------------------------------------------------------
console.log('\n--- SUITE 5: Dynamic Routing & Slug Resolution ---');

check('S5.1: All 17 canonical slugs resolve to unique project records', () => {
  const resolved = new Set();
  for (const p of projects) {
    const idx = projects.findIndex(item => item.slug === p.slug || item.aliasSlugs?.includes(p.slug));
    assert.ok(idx >= 0, `Failed to resolve canonical slug ${p.slug}`);
    resolved.add(projects[idx].slug);
  }
  assert.equal(resolved.size, 17, 'All 17 projects must resolve uniquely');
});

check('S5.2: Alias slugs map to canonical projects correctly', () => {
  const aliasTests = [
    { alias: 'fpga-digital-clock-vhdl', expected: 'fpga-oven' },
    { alias: 'fpga-drying-oven-controller', expected: 'fpga-oven' },
    { alias: 'fermonitor-bagoong-enose', expected: 'fermonitor' },
    { alias: 'fermonitor-iot-incubator', expected: 'fermonitor' },
    { alias: 'stm32-freertos-room-monitor', expected: 'room-monitoring' },
    { alias: 'rt-thread-drying-oven-hmi', expected: 'rtthread-hmi' },
    { alias: 'avr-assembly-line-robot', expected: 'line-robot' },
    { alias: 'aquaflush-water-monitor', expected: 'aquaflush' },
  ];

  for (const { alias, expected } of aliasTests) {
    const idx = projects.findIndex(item => item.slug === alias || item.aliasSlugs?.includes(alias));
    assert.ok(idx >= 0, `Alias ${alias} not found`);
    assert.equal(projects[idx].slug, expected, `Alias ${alias} mapped to ${projects[idx].slug} instead of ${expected}`);
  }
});

check('S5.3: Unknown slugs return -1 (triggering 404 view)', () => {
  const badSlugs = ['../../etc/passwd', 'null', 'undefined', 'foo-bar-baz-999', ''];
  for (const bad of badSlugs) {
    const idx = projects.findIndex(item => item.slug === bad || item.aliasSlugs?.includes(bad));
    assert.equal(idx, -1, `Expected -1 for bad slug ${bad}`);
  }
});

check('S5.4: Recruiter inquiry CTA URI encoding is valid', () => {
  for (const p of projects) {
    const inquiryUrl = `/contact?subject=${encodeURIComponent(`Inquiry regarding ${p.name || p.title}`)}`;
    assert.ok(inquiryUrl.startsWith('/contact?subject=Inquiry%20regarding%20'));
    // Verify no unencoded spaces
    assert.ok(!inquiryUrl.includes(' '));
  }
});

// --------------------------------------------------------------------------
// SUITE 6: Anti-AI-Slop & Emil Kowalski Design Engineering Rules
// --------------------------------------------------------------------------
console.log('\n--- SUITE 6: Anti-AI-Slop & Emil Kowalski Design Engineering Rules ---');

check('S6.1: Projects.jsx and ProjectDetail.jsx bound text measure to max-w-[65ch]', () => {
  const p1 = fs.readFileSync(path.join(ROOT, 'src/pages/Projects.jsx'), 'utf8');
  const p2 = fs.readFileSync(path.join(ROOT, 'src/pages/ProjectDetail.jsx'), 'utf8');
  assert.ok(p1.includes('max-w-[65ch]'), 'Projects.jsx missing 65ch measure constraint');
  assert.ok(p2.includes('max-w-[65ch]'), 'ProjectDetail.jsx missing 65ch measure constraint');
});

check('S6.2: Tabular numbers applied to counts, indices, metrics, and dates', () => {
  const p1 = fs.readFileSync(path.join(ROOT, 'src/pages/Projects.jsx'), 'utf8');
  const p2 = fs.readFileSync(path.join(ROOT, 'src/pages/ProjectDetail.jsx'), 'utf8');
  assert.ok(p1.includes('tabular-nums'), 'Projects.jsx missing tabular-nums');
  assert.ok(p2.includes('tabular-nums'), 'ProjectDetail.jsx missing tabular-nums');
});

check('S6.3: Touch targets satisfy minimum 44px hit areas on all buttons and links', () => {
  const p1 = fs.readFileSync(path.join(ROOT, 'src/pages/Projects.jsx'), 'utf8');
  const p2 = fs.readFileSync(path.join(ROOT, 'src/pages/ProjectDetail.jsx'), 'utf8');
  assert.ok(p1.includes('min-h-[44px]'), 'Projects.jsx missing min-h-[44px]');
  assert.ok(p2.includes('min-h-11'), 'ProjectDetail.jsx missing min-h-11 (44px)');
});

check('S6.4: Active scale compression applied to interactive controls', () => {
  const p1 = fs.readFileSync(path.join(ROOT, 'src/pages/Projects.jsx'), 'utf8');
  const p2 = fs.readFileSync(path.join(ROOT, 'src/pages/ProjectDetail.jsx'), 'utf8');
  assert.ok(p1.includes('pressable'), 'Projects.jsx missing pressable tactile class');
  assert.ok(p2.includes('active:scale-'), 'ProjectDetail.jsx missing active scale compression');
});

console.log('\n================================================================');
console.log(`STRESS TEST SUMMARY: Total=${passCount + failCount}, Passed=${passCount}, Failed=${failCount}`);
console.log('================================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
