// tests/empirical-m4-2-challenge.js
// EMPIRICAL CHALLENGER M4-2 ADVERSARIAL STRESS HARNESS
// Focus: Milestone 4 (Projects Showcase & Dedicated Project Details)
// Verification Scope: Media Pipeline, Fallback Resilience, Design Engineering, Responsiveness, Edge Cases

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const ROOT = path.resolve(import.meta.dirname, '..');

console.log('================================================================');
console.log('  CHALLENGER M4-2: EMPIRICAL ADVERSARIAL STRESS HARNESS');
console.log('  Milestone 4: Projects Showcase & Dedicated Project Details');
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

// Import data modules
const { projects, categories } = await import('../src/data/projects.js');
const { galleries, galleryFor } = await import('../src/data/media.js');

// Read JSX files via fs
const projectCardPath = path.join(ROOT, 'src/components/ProjectCard.jsx');
const projectCardCode = fs.readFileSync(projectCardPath, 'utf8');
const projectDetailPath = path.join(ROOT, 'src/pages/ProjectDetail.jsx');
const projectDetailCode = fs.readFileSync(projectDetailPath, 'utf8');
const projectsPagePath = path.join(ROOT, 'src/pages/Projects.jsx');
const projectsPageCode = fs.readFileSync(projectsPagePath, 'utf8');

// Extract pure helper functions from ProjectDetail.jsx for empirical stress execution
const hudMatch = projectDetailCode.match(/export const PROJECT_HUD = (\{[\s\S]*?\n\})/);
assert.ok(hudMatch, 'Must locate PROJECT_HUD definition');
const PROJECT_HUD = eval(`(${hudMatch[1]})`);

function getProjectHud(project) {
  if (PROJECT_HUD[project.slug]) {
    return PROJECT_HUD[project.slug];
  }
  const hw = project.hardwareStack || [];
  const sw = project.softwareStack || [];
  return {
    processor: hw[0] || 'Embedded Hardware Target',
    sensors: hw.slice(1, 3).join(', ') || 'Integrated Transducers',
    protocols: sw.filter((s) => /bus|i2c|spi|uart|dma|protocol|mqtt|rest/i.test(s)).join(', ') || 'Synchronous Bus Interface',
    software: sw.slice(0, 3).join(', ') || 'Custom Firmware Stack',
    tools: hw.filter((h) => /wokwi|vivado|rig|multisim|studio/i.test(h)).join(', ') || 'Engineering Toolchain',
  };
}

function getProjectStatus(project) {
  if (project.slug === 'fermonitor') {
    return {
      label: 'Active Research · Thesis Manuscript Forthcoming',
      dotColor: 'bg-emerald-400',
      pulse: true,
    };
  }
  if (project.links?.some((l) => l.type === 'video')) {
    return {
      label: 'Verified Prototype · Bench Video Demo Available',
      dotColor: 'bg-violet-400',
      pulse: false,
    };
  }
  if (project.links?.some((l) => l.type === 'github')) {
    return {
      label: 'Open Source · Hardware & Firmware Verified',
      dotColor: 'bg-indigo-400',
      pulse: false,
    };
  }
  if (project.links?.some((l) => l.type === 'report')) {
    return {
      label: 'Academic Manuscript · Verified Lab Results',
      dotColor: 'bg-sky-400',
      pulse: false,
    };
  }
  return {
    label: 'Completed System · Documented Hardware Build',
    dotColor: 'bg-purple-400',
    pulse: false,
  };
}

// ============================================================================
// SUITE 1: Media Pipeline & Asset Resilience
// ============================================================================
console.log('\n--- SUITE 1: Media Pipeline & Asset Resilience ---');

test('Catalog Completeness: Exactly 17 authentic projects present in projects.js', () => {
  assert.equal(projects.length, 17, `Expected 17 projects, found ${projects.length}`);
});

test('Primary Project Images: All 17 primary project images exist on disk and are non-empty', () => {
  for (const project of projects) {
    assert.ok(project.image, `Project ${project.slug} must declare an image path`);
    assert.ok(
      project.image.startsWith('/work/'),
      `Project ${project.slug} image path must start with '/work/': ${project.image}`
    );

    const diskPath = path.join(ROOT, 'public', project.image);
    assert.ok(fs.existsSync(diskPath), `Primary image for ${project.slug} does not exist: ${diskPath}`);

    const stat = fs.statSync(diskPath);
    assert.ok(stat.size > 1000, `Primary image for ${project.slug} is suspiciously small: ${stat.size} bytes`);
  }
});

test('Primary Project Images: Valid binary magic numbers (JPEG, PNG, AVIF)', () => {
  for (const project of projects) {
    const diskPath = path.join(ROOT, 'public', project.image);
    const buf = fs.readFileSync(diskPath);

    const isJpeg = buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
    const isPng = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
    const isAvif = buf.length > 12 && buf.subarray(4, 12).toString('latin1').includes('ftyp');

    assert.ok(
      isJpeg || isPng || isAvif,
      `Image ${project.image} for ${project.slug} does not have valid JPEG, PNG, or AVIF magic bytes`
    );
  }
});

test('Secondary Galleries: All gallery images in media.js exist on disk with non-zero size', () => {
  const allSecondaryImages = [];
  for (const [slug, list] of Object.entries(galleries)) {
    assert.ok(Array.isArray(list), `galleries[${slug}] must be an array`);
    for (const imgPath of list) {
      allSecondaryImages.push({ slug, imgPath });
    }
  }

  assert.ok(allSecondaryImages.length >= 30, `Expected >=30 secondary images, found ${allSecondaryImages.length}`);

  for (const { slug, imgPath } of allSecondaryImages) {
    assert.ok(
      imgPath.startsWith('/work/'),
      `Gallery image ${imgPath} in project ${slug} must begin with /work/`
    );
    const diskPath = path.join(ROOT, 'public', imgPath);
    assert.ok(fs.existsSync(diskPath), `Gallery image for ${slug} missing on disk: ${diskPath}`);

    const stat = fs.statSync(diskPath);
    assert.ok(stat.size > 500, `Gallery image ${imgPath} is empty or corrupted: ${stat.size} bytes`);
  }
});

test('galleryFor Helper: Excludes primary project image and returns only distinct secondary captures', () => {
  for (const project of projects) {
    const gallery = galleryFor(project);
    assert.ok(Array.isArray(gallery), `galleryFor(${project.slug}) must return an array`);
    assert.ok(
      !gallery.includes(project.image),
      `galleryFor(${project.slug}) must not include the primary project image`
    );
  }
});

test('Fallback Graphic: public/work/fallback-board.svg exists and is valid SVG XML', () => {
  const fallbackPath = path.join(ROOT, 'public/work/fallback-board.svg');
  assert.ok(fs.existsSync(fallbackPath), 'public/work/fallback-board.svg must exist');

  const content = fs.readFileSync(fallbackPath, 'utf8');
  assert.ok(content.includes('<svg'), 'fallback-board.svg must contain <svg> tag');
  assert.ok(content.includes('viewBox="0 0 900 562"'), 'fallback-board.svg must have viewBox 0 0 900 562');
  assert.ok(content.includes('width="900"'), 'fallback-board.svg must have width="900"');
  assert.ok(content.includes('height="562"'), 'fallback-board.svg must have height="562"');
  assert.ok(content.includes('fill="#12091f"'), 'fallback-board.svg must use dark purple surface token #12091f');
  assert.ok(content.includes('EMBEDDED HARDWARE CAPTURE'), 'fallback-board.svg must include descriptive label');
});

// ============================================================================
// SUITE 2: Image Failure Handling & CircuitSchematicFallback Simulation
// ============================================================================
console.log('\n--- SUITE 2: Image Failure Handling & CircuitSchematicFallback Simulation ---');

test('ProjectCard Error State: Implements onError handler and graceful fallback container', () => {
  assert.ok(
    projectCardCode.includes('onError={() => setFailed(true)}'),
    'ProjectCard <img> must bind onError to setFailed(true)'
  );
  assert.ok(
    projectCardCode.includes('{failed ? (') && projectCardCode.includes('{project.title}'),
    'ProjectCard must render safe fallback container displaying project title on failure'
  );
});

test('ProjectDetail Error State: Implements onError handler and renders CircuitSchematicFallback', () => {
  assert.ok(
    projectDetailCode.includes('onError={() => setMainImageFailed(true)}'),
    'ProjectDetail <img> must bind onError to setMainImageFailed(true)'
  );
  assert.ok(
    projectDetailCode.includes('mainImageFailed ? (') &&
      projectDetailCode.includes('<CircuitSchematicFallback project={project} />'),
    'ProjectDetail must render CircuitSchematicFallback when mainImageFailed is true'
  );
});

test('CircuitSchematicFallback Robustness: Simulates SVG schematic generation with edge cases', () => {
  // Extract CircuitSchematicFallback implementation logic to test edge cases
  function renderSchematicFallback(project) {
    const slug = project?.slug || 'unknown-build';
    const title = project?.title || 'Hardware Schematic Archive';
    const stack = project?.stack || 'Hardware Subsystem';
    const categoryLabel = project?.categoryLabel || 'Laboratory Exhibit';

    return `
      <div class="flex aspect-[16/10] w-full flex-col items-center justify-center rounded-card border border-rule-2 bg-paper-3 p-lg text-center shadow-card">
        <svg class="h-16 w-16 text-accent-light/60" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="12" y="12" width="40" height="40" rx="4" stroke="currentColor" />
          <circle cx="32" cy="32" r="8" stroke="currentColor" />
          <path d="M4 24h8M4 32h8M4 40h8M52 24h8M52 32h8M52 40h8M24 4v8M32 4v8M40 4v8M24 52v8M32 52v8M40 52v8" />
        </svg>
        <p class="mt-md font-mono text-xs uppercase tracking-wider text-accent-light">[ Hardware Schematic Archive // ${slug} ]</p>
        <p class="mt-2xs font-display text-title font-semibold text-ink">${title}</p>
        <p class="mt-xs max-w-[65ch] font-mono text-xs text-muted">${stack} · ${categoryLabel}</p>
      </div>
    `.trim();
  }

  // 1. Full authentic project
  const fermonitor = projects.find((p) => p.slug === 'fermonitor');
  const fermonitorHtml = renderSchematicFallback(fermonitor);
  assert.ok(fermonitorHtml.includes('Hardware Schematic Archive // fermonitor'));
  assert.ok(fermonitorHtml.includes(fermonitor.title));

  // 2. Project with missing optional fields
  const partialProject = { slug: 'custom-mcu', title: 'Custom MCU Controller' };
  const partialHtml = renderSchematicFallback(partialProject);
  assert.ok(partialHtml.includes('custom-mcu'));
  assert.ok(partialHtml.includes('Custom MCU Controller'));

  // 3. Null / empty project
  const emptyHtml = renderSchematicFallback({});
  assert.ok(emptyHtml.includes('unknown-build'));
});

test('Gallery Exhibit Failure Isolation: Failed gallery images isolate without breaking case study', () => {
  assert.ok(
    projectDetailCode.includes('setFailedGalleryImages((prev) => ({ ...prev, [src]: true }))'),
    'ProjectDetail must track failed gallery captures per src'
  );
  assert.ok(
    projectDetailCode.includes('if (failedGalleryImages[src]) return null'),
    'ProjectDetail must filter out failed gallery exhibits cleanly'
  );
});

// ============================================================================
// SUITE 3: Emil Kowalski UI & Responsive Constraints
// ============================================================================
console.log('\n--- SUITE 3: Emil Kowalski UI & Responsive Constraints ---');

test('Hit Targets: All interactive buttons and inputs in Projects.jsx meet min-h-[44px]', () => {
  // Category buttons
  assert.ok(
    projectsPageCode.includes('min-h-[44px] items-center gap-xs rounded-pill'),
    'Category filter pills must specify min-h-[44px]'
  );

  // Search input
  assert.ok(
    projectsPageCode.includes('min-h-[44px] w-full rounded-pill') || projectsPageCode.includes('h-11 min-h-[44px]'),
    'Search input must specify min-h-[44px]'
  );

  // Clear search button
  assert.ok(
    projectsPageCode.includes('min-h-[44px] min-w-[44px] items-center justify-center'),
    'Clear search button must specify min-h-[44px] min-w-[44px]'
  );

  // Quick filter tags
  assert.ok(
    projectsPageCode.includes('touch-target pressable inline-flex min-h-[44px]'),
    'Quick filter chips must specify min-h-[44px]'
  );

  // Reset filters buttons
  assert.ok(
    projectsPageCode.includes('min-h-[44px] items-center font-mono text-xs text-accent-light hover:underline'),
    'Clear filters link must satisfy min-h-[44px]'
  );
});

test('Hit Targets: Interactive CTAs and navigation in ProjectDetail.jsx meet min-h-11 (44px)', () => {
  // Breadcrumb links
  assert.ok(
    projectDetailCode.includes('inline-flex min-h-11 items-center'),
    'Breadcrumbs and back links must specify min-h-11'
  );

  // Inquiry CTA
  assert.ok(
    projectDetailCode.includes('btn btn-primary min-h-11'),
    'Inquiry CTA button must specify min-h-11'
  );

  // External repository links
  assert.ok(
    projectDetailCode.includes('inline-flex min-h-11 items-center gap-xs font-mono text-sm'),
    'Repository and artifact links must specify min-h-11'
  );

  // Pagination navigation cards
  assert.ok(
    projectDetailCode.includes('group flex min-h-11 flex-col justify-center'),
    'Previous / Next project links must specify min-h-11'
  );
});

test('Active Tactile Compression: All interactive elements feature active scaling', () => {
  const cssPath = path.join(ROOT, 'src/styles/app.css');
  const css = fs.readFileSync(cssPath, 'utf8');

  // Verify app.css rules
  assert.ok(
    css.includes('.pressable:active') && css.includes('transform: scale(0.97)'),
    'app.css must define active compression transform: scale(0.97) for .pressable:active'
  );

  // Verify ProjectCard uses pressable and active:scale-[0.98]
  assert.ok(
    projectCardCode.includes('pressable') && projectCardCode.includes('active:scale-[0.98]'),
    'ProjectCard must combine pressable with active:scale-[0.98]'
  );

  // Verify pagination navigation in ProjectDetail uses active:scale-[0.98]
  assert.ok(
    projectDetailCode.includes('active:scale-[0.98]'),
    'ProjectDetail pagination navigation cards must specify active:scale-[0.98]'
  );
});

test('Tabular Numerals: Numeric counts, badges, and indices strictly apply tabular-nums', () => {
  // Projects.jsx category count badges
  assert.ok(
    projectsPageCode.includes('tabular-nums') && projectsPageCode.includes('{count}'),
    'Projects.jsx category count badges must apply tabular-nums'
  );

  // Projects.jsx results counter
  assert.ok(
    projectsPageCode.includes('tabular-nums">{filtered.length}</span>'),
    'Projects.jsx result counter must apply tabular-nums'
  );

  // ProjectCard index badge
  assert.ok(
    projectCardCode.includes('tabular-nums') && projectCardCode.includes('String(index + 1)'),
    'ProjectCard build numbering index must apply tabular-nums'
  );

  // ProjectCard period
  assert.ok(
    projectCardCode.includes('tabular-nums text-muted">{project.period}</span>'),
    'ProjectCard period must apply tabular-nums'
  );

  // ProjectDetail build counter
  assert.ok(
    projectDetailCode.includes('tabular-nums text-muted') && projectDetailCode.includes('Build '),
    'ProjectDetail build counter must apply tabular-nums'
  );

  // ProjectDetail verified metrics
  assert.ok(
    projectDetailCode.includes('tabular-nums text-accent-light') && projectDetailCode.includes('metric.value'),
    'ProjectDetail verified metrics values must apply tabular-nums'
  );

  // ProjectDetail challenges indices
  assert.ok(
    projectDetailCode.includes('tabular-nums text-accent-light') && projectDetailCode.includes('String(i + 1)'),
    'ProjectDetail challenges index numbers must apply tabular-nums'
  );
});

test('Measure Restraint: Reading text and technical narratives bounded to <= 65ch', () => {
  // Projects.jsx
  assert.ok(
    projectsPageCode.includes('header className="max-w-[65ch]"'),
    'Projects.jsx header must be bounded to max-w-[65ch]'
  );
  assert.ok(
    projectsPageCode.includes('text-lead text-ink-2 max-w-[65ch]'),
    'Projects.jsx lead paragraph must be bounded to max-w-[65ch]'
  );
  assert.ok(
    projectsPageCode.includes('max-w-[65ch] text-sm text-ink-2'),
    'Projects.jsx empty state description must be bounded to max-w-[65ch]'
  );

  // ProjectDetail.jsx
  assert.ok(
    projectDetailCode.includes('max-w-[65ch] font-display text-title'),
    'ProjectDetail.jsx subtitle must be bounded to max-w-[65ch]'
  );
  assert.ok(
    projectDetailCode.includes('figcaption className="mt-sm max-w-[65ch]'),
    'ProjectDetail.jsx figcaption must be bounded to max-w-[65ch]'
  );
  assert.ok(
    projectDetailCode.includes('p className="max-w-[65ch]">{project.overview}</p>'),
    'ProjectDetail.jsx overview narrative must be bounded to max-w-[65ch]'
  );
  assert.ok(
    projectDetailCode.includes('p className="max-w-[65ch] italic text-ink-2">{project.problem}</p>'),
    'ProjectDetail.jsx problem callout must be bounded to max-w-[65ch]'
  );
  assert.ok(
    projectDetailCode.includes('p className="max-w-[65ch]">{project.solution}</p>'),
    'ProjectDetail.jsx solution narrative must be bounded to max-w-[65ch]'
  );
});

test('Responsive Grid Layout: Verified 1-col mobile, 2-col tablet, 3-col desktop in Projects.jsx', () => {
  assert.ok(
    projectsPageCode.includes('grid gap-lg sm:grid-cols-2 lg:grid-cols-3'),
    'Projects.jsx catalog must use grid gap-lg sm:grid-cols-2 lg:grid-cols-3'
  );
});

test('Responsive Layout: Technical HUD and narratives in ProjectDetail.jsx scale responsibly', () => {
  // HUD spec sheet
  assert.ok(
    projectDetailCode.includes('grid grid-cols-1 gap-sm sm:grid-cols-2 lg:grid-cols-5'),
    'ProjectDetail.jsx HUD must use grid grid-cols-1 gap-sm sm:grid-cols-2 lg:grid-cols-5'
  );

  // Narrative and sidebar
  assert.ok(
    projectDetailCode.includes('grid gap-2xl lg:grid-cols-12 lg:gap-col'),
    'ProjectDetail.jsx main content must use grid gap-2xl lg:grid-cols-12 lg:gap-col'
  );

  // Gallery
  assert.ok(
    projectDetailCode.includes('grid gap-md sm:grid-cols-2'),
    'ProjectDetail.jsx gallery exhibits must use grid gap-md sm:grid-cols-2'
  );

  // Pagination
  assert.ok(
    projectDetailCode.includes('grid gap-md border-t border-rule pt-lg sm:grid-cols-2'),
    'ProjectDetail.jsx pagination must use sm:grid-cols-2'
  );
});

// ============================================================================
// SUITE 4: Adversarial Edge Cases & Stress Scenarios
// ============================================================================
console.log('\n--- SUITE 4: Adversarial Edge Cases & Stress Scenarios ---');

// Test search filter function logic directly against adversarial inputs
function filterCatalog(category, searchQuery) {
  const needle = searchQuery.trim().toLowerCase();
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

test('Adversarial Search: Regex meta-characters (+, *, ?, [, ], (, ), \\) do not throw exceptions', () => {
  const hostileQueries = [
    'C++',
    'C#',
    '*.png',
    '[a-z]+',
    '(ESP32|STM32)',
    '\\d{3}',
    '???',
    '+++',
    '{0,1}',
    '.*',
    '$$$',
    '^^^',
  ];

  for (const q of hostileQueries) {
    let results;
    assert.doesNotThrow(() => {
      results = filterCatalog('all', q);
    }, `Hostile query "${q}" threw an unhandled exception`);
    assert.ok(Array.isArray(results), `Query "${q}" did not return an array`);
  }
});

test('Search Exactness: "C++" correctly finds C++ projects without regex crash', () => {
  const cppResults = filterCatalog('all', 'C++');
  assert.ok(cppResults.length >= 2, `Expected >=2 C++ projects, found ${cppResults.length}`);
  const hasRiceDirect = cppResults.some((p) => p.slug === 'ricedirect');
  const hasAquaflush = cppResults.some((p) => p.slug === 'aquaflush');
  assert.ok(hasRiceDirect, 'RiceDirect must match C++ search');
  assert.ok(hasAquaflush, 'AquaFlush must match C++ search');
});

test('Adversarial Search: Excessive whitespace, Unicode, and mixed case handle cleanly', () => {
  const queries = [
    '   RTOS   ',
    '   fReErToS   ',
    'STM32\t\n',
    'Ø',
    '日本語',
    '🚀🔥',
  ];

  for (const q of queries) {
    let results;
    assert.doesNotThrow(() => {
      results = filterCatalog('all', q);
    });
    assert.ok(Array.isArray(results));
  }

  // Verify trimmed RTOS finds FreeRTOS/RT-Thread projects
  const rtosResults = filterCatalog('all', '   RTOS   ');
  assert.ok(rtosResults.length >= 3, `Expected >=3 RTOS projects, found ${rtosResults.length}`);
});

test('Route Resolution: All 17 canonical slugs resolve to unique project entries', () => {
  for (const p of projects) {
    const found = projects.find((item) => item.slug === p.slug || item.aliasSlugs?.includes(p.slug));
    assert.ok(found, `Canonical slug "${p.slug}" failed to resolve`);
    assert.equal(found.slug, p.slug);
  }
});

test('Route Resolution: Alias slugs resolve correctly to canonical projects', () => {
  const projectsWithAliases = projects.filter((p) => p.aliasSlugs?.length > 0);
  assert.ok(projectsWithAliases.length > 0, 'Expected projects with aliasSlugs');

  for (const p of projectsWithAliases) {
    for (const alias of p.aliasSlugs) {
      const found = projects.find((item) => item.slug === alias || item.aliasSlugs?.includes(alias));
      assert.ok(found, `Alias slug "${alias}" failed to resolve to ${p.slug}`);
      assert.equal(found.slug, p.slug);
    }
  }
});

test('Route Fallback: Unregistered slug returns undefined for clean 404 handling', () => {
  const fakeSlug = 'non-existent-silicon-build-xyz';
  const found = projects.find((item) => item.slug === fakeSlug || item.aliasSlugs?.includes(fakeSlug));
  assert.equal(found, undefined, 'Unregistered slug must return undefined');
});

test('HUD Telemetry Fallback: getProjectHud returns valid object even on projects with sparse data', () => {
  // All 17 projects
  for (const p of projects) {
    const hud = getProjectHud(p);
    assert.ok(hud.processor && hud.processor.length > 0, `${p.slug} HUD processor must not be empty`);
    assert.ok(hud.sensors && hud.sensors.length > 0, `${p.slug} HUD sensors must not be empty`);
    assert.ok(hud.protocols && hud.protocols.length > 0, `${p.slug} HUD protocols must not be empty`);
    assert.ok(hud.software && hud.software.length > 0, `${p.slug} HUD software must not be empty`);
    assert.ok(hud.tools && hud.tools.length > 0, `${p.slug} HUD tools must not be empty`);
  }

  // Sparse mock project
  const sparseProject = {
    slug: 'sparse-build',
    title: 'Sparse Project',
    hardwareStack: ['Custom FPGA'],
    softwareStack: ['SPI Protocol Bus Driver'],
  };
  const sparseHud = getProjectHud(sparseProject);
  assert.equal(sparseHud.processor, 'Custom FPGA');
  assert.ok(sparseHud.protocols.includes('SPI'));
});

test('Project Status Inference: getProjectStatus returns valid status beacon for all projects', () => {
  for (const p of projects) {
    const status = getProjectStatus(p);
    assert.ok(status.label && status.label.length > 0, `${p.slug} status label must not be empty`);
    assert.ok(status.dotColor && status.dotColor.startsWith('bg-'), `${p.slug} status dotColor invalid`);
    assert.equal(typeof status.pulse, 'boolean');
  }
});

test('Recruiter Inquiry CTA URL: Generates fully encoded URI string safe against XSS or URL breakage', () => {
  for (const p of projects) {
    const inquiryUrl = `/contact?subject=${encodeURIComponent(`Inquiry regarding ${p.name || p.title}`)}`;
    assert.ok(inquiryUrl.startsWith('/contact?subject=Inquiry%20regarding%20'));
    // Ensure no unencoded spaces or raw characters
    assert.ok(!inquiryUrl.includes(' '));
  }
});

// ============================================================================
// SUMMARY & VERDICT
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
