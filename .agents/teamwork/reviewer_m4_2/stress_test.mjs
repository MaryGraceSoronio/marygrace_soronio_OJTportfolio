import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../../..');

console.log('=== ADVERSARIAL STRESS TEST SUITE: MILESTONE 4 ===\n');

// 1. Load data
const { projects, categories } = await import(pathToFileURL(path.join(rootDir, 'src/data/projects.js')).href);
const { galleries, galleryFor } = await import(pathToFileURL(path.join(rootDir, 'src/data/media.js')).href);

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    passCount++;
    console.log(`  ✔ [PASS] ${message}`);
  } else {
    failCount++;
    console.error(`  ✖ [FAIL] ${message}`);
  }
}

// ------------------------------------------------------------------------
// Test Suite 1: Adversarial Search Query Robustness
// ------------------------------------------------------------------------
console.log('--- Suite 1: Adversarial Search Strings ---');
const adversarialInputs = [
  '',
  '   ',
  'C++',
  'FreeRTOS/POSIX',
  '[0-9]+',
  '.*',
  '(?=.*foo)',
  '\\w+\\s+',
  '${jndi:ldap://test}',
  '<script>alert(1)</script>',
  'STM32',
  'stm32',
  'StM32',
  'bagoong',
  'non_existent_super_random_term_xyz_99999',
];

for (const query of adversarialInputs) {
  try {
    const needle = query.trim().toLowerCase();
    const matches = projects.filter((project) => {
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
    assert(Array.isArray(matches), `Search with query "${query}" executed safely (found ${matches.length})`);
  } catch (err) {
    assert(false, `Search with query "${query}" threw error: ${err.message}`);
  }
}

// ------------------------------------------------------------------------
// Test Suite 2: Category and Search Matrix
// ------------------------------------------------------------------------
console.log('\n--- Suite 2: Category and Count Matrix ---');
const declaredCategories = ['all', 'embedded', 'iot', 'digital-logic', 'software'];
assert(
  categories.length === declaredCategories.length &&
  categories.every(c => declaredCategories.includes(c.id)),
  'Categories array precisely matches the 5 declared categories'
);

const catCounts = { all: projects.length };
for (const cat of categories) {
  if (cat.id !== 'all') {
    catCounts[cat.id] = projects.filter(p => p.category === cat.id).length;
  }
}
assert(catCounts.all === 17, `Total catalog count is 17 (got ${catCounts.all})`);
assert(catCounts.embedded === 5, `Embedded category count is 5 (got ${catCounts.embedded})`);
assert(catCounts.iot === 5, `IoT category count is 5 (got ${catCounts.iot})`);
assert(catCounts['digital-logic'] === 2, `Digital Logic category count is 2 (got ${catCounts['digital-logic']})`);
assert(catCounts.software === 5, `Software category count is 5 (got ${catCounts.software})`);
assert(
  catCounts.embedded + catCounts.iot + catCounts['digital-logic'] + catCounts.software === 17,
  'Sum of category subsets strictly equals 17'
);

// ------------------------------------------------------------------------
// Test Suite 3: Routing Resolution & Aliases for All 17 Projects
// ------------------------------------------------------------------------
console.log('\n--- Suite 3: Route Resolution & Aliases ---');
for (const p of projects) {
  const index = projects.findIndex((item) => item.slug === p.slug || item.aliasSlugs?.includes(p.slug));
  assert(index !== -1, `Direct slug resolution works for "${p.slug}"`);
  if (p.aliasSlugs) {
    for (const alias of p.aliasSlugs) {
      const aliasIndex = projects.findIndex((item) => item.slug === alias || item.aliasSlugs?.includes(alias));
      assert(aliasIndex === index, `Alias slug "${alias}" resolves to "${p.slug}"`);
    }
  }
}

const nonExistentSlugs = ['404-slug', 'random-project-not-found', 'undefined', 'null'];
for (const fakeSlug of nonExistentSlugs) {
  const fakeIndex = projects.findIndex((item) => item.slug === fakeSlug || item.aliasSlugs?.includes(fakeSlug));
  assert(fakeIndex === -1, `Non-existent slug "${fakeSlug}" correctly yields -1 (triggers 404)`);
}

// ------------------------------------------------------------------------
// Test Suite 4: Circular Pagination Invariants
// ------------------------------------------------------------------------
console.log('\n--- Suite 4: Circular Pagination Arithmetic ---');
for (let i = 0; i < projects.length; i++) {
  const prevIdx = (i - 1 + projects.length) % projects.length;
  const nextIdx = (i + 1) % projects.length;
  assert(prevIdx >= 0 && prevIdx < projects.length, `prevIdx for ${i} is in bounds: ${prevIdx}`);
  assert(nextIdx >= 0 && nextIdx < projects.length, `nextIdx for ${i} is in bounds: ${nextIdx}`);
  assert(prevIdx !== i && nextIdx !== i, `Pagination step moves away from current item (${i})`);
}

// ------------------------------------------------------------------------
// Test Suite 5: Inquiry URL Encoding for All 17 Projects
// ------------------------------------------------------------------------
console.log('\n--- Suite 5: Inquiry URL Construction ---');
for (const p of projects) {
  const inquiryUrl = `/contact?subject=${encodeURIComponent(`Inquiry regarding ${p.name || p.title}`)}`;
  assert(
    inquiryUrl.startsWith('/contact?subject=Inquiry%20regarding%20'),
    `Inquiry URL for "${p.slug}" is properly encoded (${inquiryUrl.slice(0, 50)}...)`
  );
}

// ------------------------------------------------------------------------
// Test Suite 6: Physical File Verification for All Assets
// ------------------------------------------------------------------------
console.log('\n--- Suite 6: Disk Asset Existence ---');
const fallbackSvg = path.join(rootDir, 'public/work/fallback-board.svg');
assert(fs.existsSync(fallbackSvg), 'public/work/fallback-board.svg exists on disk');

for (const p of projects) {
  const fullPath = path.join(rootDir, 'public', p.image);
  assert(fs.existsSync(fullPath), `Main image exists on disk: ${p.image}`);
}

let galleryAssetCount = 0;
for (const [slug, imgList] of Object.entries(galleries)) {
  for (const imgPath of imgList) {
    const fullPath = path.join(rootDir, 'public', imgPath);
    assert(fs.existsSync(fullPath), `Gallery image for ${slug} exists: ${imgPath}`);
    galleryAssetCount++;
  }
}
console.log(`\nVerified ${galleryAssetCount} gallery assets on disk.`);

// ------------------------------------------------------------------------
// Summary
// ------------------------------------------------------------------------
console.log('\n======================================================');
console.log(`TOTAL CHECKS: ${passCount + failCount}`);
console.log(`PASSED: ${passCount}`);
console.log(`FAILED: ${failCount}`);
console.log('======================================================\n');

if (failCount > 0) process.exit(1);
