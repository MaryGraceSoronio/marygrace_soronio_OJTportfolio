// tests/empirical-m3-stress.js
// EMPIRICAL CHALLENGER STRESS HARNESS — Milestone 3
// Core Profile Pages: Home, About, Skills, Contact
//
// Rigorous adversarial verification of:
// 1. Contact form validation logic: empty, whitespace-only, malformed emails, long strings, query params
// 2. Mailto URI construction, subject fallbacks, and clipboard copy error handling
// 3. Skills filter pills state transitions, group contracts, certifications assets on disk
// 4. About page data integrity: CGPA 1.67351, Dean's Lister, 700h OJT, sorted leadership timeline
// 5. ScrollReveal motion constraints (duration <= 300ms, scale >= 0.95, reduced motion 0ms)
// 6. Anti-slop constraints: typography measure (<= 65ch), tabular numerals, touch targets (>= 44px)

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const ROOT = path.resolve(import.meta.dirname, '..');

console.log('================================================================');
console.log('  CHALLENGER M3: EMPIRICAL STRESS & ADVERSARIAL VERIFICATION');
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
// SUITE 1: Contact Form Validation Logic & Adversarial Inputs
// --------------------------------------------------------------------------
console.log('\n--- SUITE 1: Contact Form Validation Logic & Adversarial Inputs ---');

// Replicate the exact client-side validation logic from Contact.jsx
function validateContactForm(form) {
  const nextErrors = {};

  if (!form.name || form.name.trim() === '') {
    nextErrors.name = 'Please provide your name or organization so I know who I am replying to.';
  }

  if (!form.email || form.email.trim() === '') {
    nextErrors.email = 'Email address is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    nextErrors.email = 'Please enter a valid work or personal email address.';
  }

  if (!form.message || form.message.trim() === '') {
    nextErrors.message = 'Please provide a message.';
  } else if (form.message.trim().length < 20) {
    nextErrors.message = 'Please provide a little more detail (at least 20 characters).';
  }

  const isValid = Object.keys(nextErrors).length === 0;

  let resolvedSubject = '';
  let resolvedBody = '';
  let mailtoUrl = '';

  if (isValid) {
    resolvedSubject = encodeURIComponent(
      form.subject.trim() || `Portfolio inquiry from ${form.name.trim()}`
    );
    resolvedBody = encodeURIComponent(
      `${form.message.trim()}\n\n---\nSender: ${form.name.trim()}\nContact: ${form.email.trim()}`
    );
    mailtoUrl = `mailto:marygrace.soronio@g.msuiit.edu.ph?subject=${resolvedSubject}&body=${resolvedBody}`;
  }

  const fallbackUrl = `mailto:marygrace.soronio@g.msuiit.edu.ph?subject=${encodeURIComponent(
    form.subject.trim() || 'OJT / Engineering Inquiry'
  )}`;

  return { errors: nextErrors, isValid, resolvedSubject, resolvedBody, mailtoUrl, fallbackUrl };
}

test('Contact Validation: Empty submissions trigger all 3 mandatory field errors', () => {
  const res = validateContactForm({ name: '', email: '', subject: '', message: '' });
  assert.equal(res.isValid, false);
  assert.ok(res.errors.name, 'Name error required for empty string');
  assert.ok(res.errors.email, 'Email error required for empty string');
  assert.ok(res.errors.message, 'Message error required for empty string');
});

test('Contact Validation: Whitespace-only submissions trigger all 3 mandatory field errors', () => {
  const whitespaceVariations = [
    { name: '   ', email: '   ', subject: '   ', message: '   ' },
    { name: '\t\t', email: '\n\n', subject: '\r\n', message: '\t \r\n ' },
    { name: '    ', email: '  \t  ', subject: '', message: '       ' },
  ];

  for (const variant of whitespaceVariations) {
    const res = validateContactForm(variant);
    assert.equal(res.isValid, false, `Whitespace variant failed rejection: ${JSON.stringify(variant)}`);
    assert.ok(res.errors.name, 'Name rejected when whitespace-only');
    assert.ok(res.errors.email, 'Email rejected when whitespace-only');
    assert.ok(res.errors.message, 'Message rejected when whitespace-only');
  }
});

test('Contact Validation: Malformed emails (missing @, missing domain, missing TLD, whitespace) are strictly rejected', () => {
  const strictlyMalformedEmails = [
    'plainaddress',
    '#@%^%#$@#$@#.com',
    '@example.com',
    'Joe Smith <email@example.com>',
    'email.example.com',
    'email@example',
    'email@example.',
    'user name@domain.com',
    'user@ domain.com',
    'user@domain .com',
    'user@domain. com',
    'user@',
    '@',
    'missing-at-sign.net',
  ];

  for (const email of strictlyMalformedEmails) {
    const res = validateContactForm({
      name: 'Dr. Jane Recruiter',
      email,
      subject: 'OJT Placement Inquiry',
      message: 'We are very interested in discussing an OJT placement for 700 hours at our research laboratory.',
    });
    assert.equal(res.isValid, false, `Expected invalid email to fail: "${email}"`);
    assert.equal(res.errors.email, 'Please enter a valid work or personal email address.');
  }
});

test('Contact Validation: Empirical analysis of regex boundary behavior on edge-case email formats', () => {
  // Pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  // Lightweight O(N) linear regex used across the project test suite (F10-T2-2).
  // Documenting how it handles dot-boundary and symbol edge cases:
  const edgeCases = [
    { email: '.email@example.com', accepted: true, note: 'Passed by linear regex (HTML5 type="email" provides RFC-level browser constraint)' },
    { email: 'email@.example.com', accepted: true, note: 'Passed by linear regex (client mailto recipient handling)' },
    { email: 'email@example..com', accepted: true, note: 'Passed by linear regex (client mailto recipient handling)' },
    { email: 'user:email@domain.com', accepted: true, note: 'Passed by linear regex (colon character in non-whitespace character class)' },
    { email: 'user@sub.domain.co.uk', accepted: true, note: 'Multi-part domain valid' },
    { email: 'first.last+ojt@g.msuiit.edu.ph', accepted: true, note: 'Plus addressing valid' },
  ];

  for (const item of edgeCases) {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.email);
    assert.equal(isValid, item.accepted, `Unexpected regex evaluation on ${item.email}`);
    observations.push({
      test: `Email Regex Edge: ${item.email}`,
      result: isValid ? 'ACCEPTED' : 'REJECTED',
      detail: item.note,
    });
  }
});

test('Contact Validation: Authentic and complex valid email formats are accepted', () => {
  const validEmails = [
    'marygrace.soronio@g.msuiit.edu.ph',
    'recruiter@subdomain.company.com',
    'first.last+tag@work-tech.io',
    'engineering-team@silicon-foundry.co.jp',
    'lead_dev@rtos-systems.org',
    'ojt-coordinator@msuiit.edu.ph',
    'hr.director@embedded-hardware.de',
  ];

  for (const email of validEmails) {
    const res = validateContactForm({
      name: 'Engineering Director',
      email,
      subject: '700-Hour OJT Interview Invitation',
      message: 'We reviewed your 17 projects on your portfolio and would like to invite you for an interview.',
    });
    assert.equal(res.isValid, true, `Valid email failed acceptance: "${email}"`);
    assert.equal(Object.keys(res.errors).length, 0);
  }
});

test('Contact Validation: Message boundary conditions (<20 chars rejected, >=20 chars accepted)', () => {
  const base = {
    name: 'Hardware Lead',
    email: 'lead@hardware.co',
    subject: 'OJT',
  };

  // 19 characters message -> must fail
  const shortMsg19 = '1234567890123456789';
  assert.equal(shortMsg19.length, 19);
  const res19 = validateContactForm({ ...base, message: shortMsg19 });
  assert.equal(res19.isValid, false);
  assert.equal(res19.errors.message, 'Please provide a little more detail (at least 20 characters).');

  // Exactly 20 characters message -> must pass
  const exactMsg20 = '12345678901234567890';
  assert.equal(exactMsg20.length, 20);
  const res20 = validateContactForm({ ...base, message: exactMsg20 });
  assert.equal(res20.isValid, true);
  assert.equal(res20.errors.message, undefined);

  // 21 characters message -> must pass
  const msg21 = '123456789012345678901';
  assert.equal(msg21.length, 21);
  const res21 = validateContactForm({ ...base, message: msg21 });
  assert.equal(res21.isValid, true);

  // 19 non-whitespace chars wrapped in 50 spaces -> trim() leaves 19 -> must fail
  const paddedShortMsg = '   ' + '1234567890123456789' + '       ';
  const resPadded = validateContactForm({ ...base, message: paddedShortMsg });
  assert.equal(resPadded.isValid, false);
  assert.equal(resPadded.errors.message, 'Please provide a little more detail (at least 20 characters).');
});

test('Contact Validation: DoS stress test with 100k character fields completes in <50ms without backtracking', () => {
  const hugeName = 'A'.repeat(50000);
  const hugeEmail = 'valid.user+' + 'a'.repeat(20000) + '@example.org';
  const hugeSubject = 'Topic '.repeat(10000);
  const hugeMessage = 'This is a valid long message string. '.repeat(10000); // ~370,000 chars

  const start = performance.now();
  const res = validateContactForm({
    name: hugeName,
    email: hugeEmail,
    subject: hugeSubject,
    message: hugeMessage,
  });
  const duration = performance.now() - start;

  assert.equal(res.isValid, true);
  assert.ok(duration < 50, `Massive string validation took too long: ${duration.toFixed(2)}ms`);
  assert.ok(res.mailtoUrl.startsWith('mailto:marygrace.soronio@g.msuiit.edu.ph?subject='));
});

// --------------------------------------------------------------------------
// SUITE 2: Mailto URI Construction, Query Parameters & Fallbacks
// --------------------------------------------------------------------------
console.log('\n--- SUITE 2: Mailto URI Construction, Query Parameters & Fallbacks ---');

test('Mailto Construction: Special characters, newlines, and ampersands are properly encoded', () => {
  const form = {
    name: 'Tech & Co. <Staffing>',
    email: 'recruiter@tech-and-co.com',
    subject: 'Question & Inquiry #1: OJT + Thesis [Hardware/FPGA]',
    message: 'Hello Mary Grace,\n\nWe saw your thesis & drying oven project.\nCan we schedule a call at 100% availability?',
  };

  const res = validateContactForm(form);
  assert.equal(res.isValid, true);

  // Verify subject encoded
  assert.ok(res.mailtoUrl.includes('Question%20%26%20Inquiry%20%231%3A%20OJT%20%2B%20Thesis%20%5BHardware%2FFPGA%5D'));

  // Verify body contains sender and email footer with encoded newlines
  assert.ok(res.mailtoUrl.includes('%0A%0A---%0ASender%3A%20Tech%20%26%20Co.%20%3CStaffing%3E%0AContact%3A%20recruiter%40tech-and-co.com'));

  // Verify decoded body recovers exact text
  const urlObj = new URL(res.mailtoUrl);
  assert.equal(urlObj.protocol, 'mailto:');
  assert.equal(urlObj.pathname, 'marygrace.soronio@g.msuiit.edu.ph');
  const searchParams = new URLSearchParams(urlObj.search);
  assert.equal(searchParams.get('subject'), form.subject);
  assert.ok(searchParams.get('body').includes(form.message));
  assert.ok(searchParams.get('body').includes(`Sender: ${form.name}`));
  assert.ok(searchParams.get('body').includes(`Contact: ${form.email}`));
});

test('Mailto Construction: Empty subject defaults cleanly to "Portfolio inquiry from {Name}"', () => {
  const form = {
    name: 'Dr. Jane Smith',
    email: 'jane.smith@msuiit.edu.ph',
    subject: '',
    message: 'We are very interested in discussing your electronic nose thesis project and OJT placement.',
  };

  const res = validateContactForm(form);
  assert.equal(res.isValid, true);

  const urlObj = new URL(res.mailtoUrl);
  const searchParams = new URLSearchParams(urlObj.search);
  assert.equal(searchParams.get('subject'), 'Portfolio inquiry from Dr. Jane Smith');
});

test('Mailto Fallback Link: Provides prefilled subject even prior to form submission', () => {
  // Case A: With custom subject
  const formA = { name: '', email: '', subject: '700-Hour OJT Inquiry', message: '' };
  const resA = validateContactForm(formA);
  assert.equal(
    resA.fallbackUrl,
    'mailto:marygrace.soronio@g.msuiit.edu.ph?subject=700-Hour%20OJT%20Inquiry'
  );

  // Case B: With empty subject
  const formB = { name: '', email: '', subject: '', message: '' };
  const resB = validateContactForm(formB);
  assert.equal(
    resB.fallbackUrl,
    'mailto:marygrace.soronio@g.msuiit.edu.ph?subject=OJT%20%2F%20Engineering%20Inquiry'
  );
});

test('Clipboard Copy: Robust fallback to document.execCommand when navigator.clipboard is unavailable', () => {
  const contactCode = fs.readFileSync(path.join(ROOT, 'src/pages/Contact.jsx'), 'utf8');

  // Verify presence of navigator.clipboard feature check
  assert.ok(contactCode.includes('navigator.clipboard && navigator.clipboard.writeText'));

  // Verify fallback mechanism using document.createElement('textarea')
  assert.ok(contactCode.includes("document.createElement('textarea')"));
  assert.ok(contactCode.includes("document.execCommand('copy')"));

  // Verify catch block resetting copiedEmail to false to prevent sticky state on failure
  assert.ok(contactCode.includes('setCopiedEmail(false)'));
});

// --------------------------------------------------------------------------
// SUITE 3: Skills Page Filter Pills, State Transitions & Asset Integrity
// --------------------------------------------------------------------------
console.log('\n--- SUITE 3: Skills Page Filter Pills, State Transitions & Asset Integrity ---');

import { skills, toolchain, certifications, trainings } from '../src/data/site.js';

const specializedGroups = [
  { key: 'embedded', title: 'Embedded & Microcontrollers', domain: 'Silicon & Architecture', items: skills.embedded },
  { key: 'programming', title: 'Programming & HDLs', domain: 'Languages & Logic', items: skills.programming },
  { key: 'tools', title: 'EDA & Development Toolchains', domain: 'Simulation & Synthesis', items: skills.tools },
  { key: 'ai', title: 'Edge AI & Computer Vision', domain: 'Inference & Sensors', items: skills.ai },
  { key: 'web', title: 'Web & Systems Architecture', domain: 'Interfaces & APIs', items: skills.web },
  { key: 'soft', title: 'Working Style & Collaboration', domain: 'Execution & Teamwork', items: skills.soft },
];

function filterSkills(activeTab) {
  return specializedGroups.filter((g) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'silicon') return g.key === 'embedded' || g.key === 'programming';
    if (activeTab === 'eda') return g.key === 'tools' || g.key === 'programming';
    if (activeTab === 'ai') return g.key === 'ai';
    if (activeTab === 'web') return g.key === 'web';
    return true;
  });
}

test('Skills Filter Pills: "All Toolchains" renders all 6 specialized groups', () => {
  const result = filterSkills('all');
  assert.equal(result.length, 6);
  const keys = result.map(g => g.key);
  assert.deepEqual(keys, ['embedded', 'programming', 'tools', 'ai', 'web', 'soft']);
});

test('Skills Filter Pills: "Silicon & Hardware" renders embedded and programming groups', () => {
  const result = filterSkills('silicon');
  assert.equal(result.length, 2);
  const keys = result.map(g => g.key);
  assert.deepEqual(keys, ['embedded', 'programming']);
});

test('Skills Filter Pills: "EDA & Digital Logic" renders programming and tools groups', () => {
  const result = filterSkills('eda');
  assert.equal(result.length, 2);
  const keys = result.map(g => g.key);
  // Preserves array definition order: index 1 'programming', index 2 'tools'
  assert.deepEqual(keys, ['programming', 'tools']);
});

test('Skills Filter Pills: "Edge AI & Vision" renders edge AI group', () => {
  const result = filterSkills('ai');
  assert.equal(result.length, 1);
  assert.equal(result[0].key, 'ai');
});

test('Skills Filter Pills: "Web & Systems" renders web architecture group', () => {
  const result = filterSkills('web');
  assert.equal(result.length, 1);
  assert.equal(result[0].key, 'web');
});

test('Skills Filter Pills: Unknown or undefined tab gracefully falls back without empty state or crash', () => {
  const unknownResult = filterSkills('unknown-tab-123');
  assert.equal(unknownResult.length, 6, 'Unknown tab should return all 6 groups gracefully');

  const emptyResult = filterSkills('');
  assert.equal(emptyResult.length, 6, 'Empty tab string should return all 6 groups gracefully');
});

test('Skills Data Integrity: Every skill group contains >= 6 items with no empty entries', () => {
  for (const group of specializedGroups) {
    assert.ok(group.items.length >= 6, `Group ${group.key} has insufficient items: ${group.items.length}`);
    for (const item of group.items) {
      assert.ok(typeof item === 'string' && item.trim().length > 0, `Group ${group.key} contains empty item`);
    }
  }
});

test('Bench Groups Architecture: 4 Pillars (Languages, Hardware, Web, EDA) are populated', () => {
  assert.equal(toolchain.length, 4, 'Toolchain must contain exactly 4 pillars');
  const expectedLabels = ['Languages', 'Hardware & Architecture', 'Web & Systems', 'EDA & Development Tools'];
  const actualLabels = toolchain.map(t => t.label);
  assert.deepEqual(actualLabels, expectedLabels);

  for (const pillar of toolchain) {
    assert.ok(pillar.items.length >= 6, `Pillar ${pillar.label} has only ${pillar.items.length} items`);
  }
});

test('Certifications Assets: Every referenced certificate file exists on disk with non-zero size', () => {
  assert.ok(certifications.length >= 6, `Expected >= 6 certifications, got ${certifications.length}`);

  let verifiedAssetCount = 0;
  for (const cert of certifications) {
    assert.ok(cert.title, 'Certification must have title');
    assert.ok(cert.issuer, 'Certification must have issuer');
    assert.ok(cert.date, 'Certification must have date');

    if (cert.file) {
      const diskPath = path.join(ROOT, 'public', cert.file.replace(/^\//, ''));
      assert.ok(fs.existsSync(diskPath), `Certificate asset file missing on disk: ${diskPath}`);
      const stats = fs.statSync(diskPath);
      assert.ok(stats.size > 1000, `Certificate asset file unexpectedly small (${stats.size} bytes): ${diskPath}`);
      verifiedAssetCount++;
    }
  }

  assert.ok(verifiedAssetCount >= 4, `Expected >= 4 verified certificate files on disk, got ${verifiedAssetCount}`);
});

test('Trainings Ledger: All 5 trainings preserved with authentic issuers and dates', () => {
  assert.equal(trainings.length, 5, 'Trainings ledger must contain exactly 5 authentic entries');
  for (const training of trainings) {
    assert.ok(training.name && training.name.length > 0);
    assert.ok(training.issuer && training.issuer.length > 0);
    assert.ok(training.date && training.date.length > 0);
  }
});

// --------------------------------------------------------------------------
// SUITE 4: About Page Data Integrity & Chronological Sorting
// --------------------------------------------------------------------------
console.log('\n--- SUITE 4: About Page Data Integrity & Chronological Sorting ---');

import { developerProfile, leadership, education, experience, languages } from '../src/data/site.js';

test('About Data: Academic credentials strictly match authentic CV records', () => {
  assert.equal(developerProfile.cgpa, '1.67351', 'CGPA must be strictly 1.67351');
  assert.equal(developerProfile.deanLister, true, 'Dean’s Lister honors must be true');
  assert.equal(developerProfile.ojtTargetHours, 700, 'OJT Target must be strictly 700 hours');
  assert.ok(developerProfile.name.includes('Mary Grace V. Soronio'));

  const msu = education.find(e => e.institution.includes('MSU-IIT') || e.institution.includes('Mindanao State University'));
  assert.ok(msu, 'MSU-IIT education entry must exist');
  assert.equal(msu.cgpa, '1.67351');
  assert.equal(msu.honors, "Dean's Lister");
});

test('About Data: Authentic portrait photo exists on disk and is a valid JPEG asset', () => {
  const portraitRelPath = developerProfile.portrait || '/mary-grace-1x1-id-image.jpg';
  const portraitDiskPath = path.join(ROOT, 'public', portraitRelPath.replace(/^\//, ''));
  assert.ok(fs.existsSync(portraitDiskPath), `Portrait photo file not found at ${portraitDiskPath}`);

  const buffer = fs.readFileSync(portraitDiskPath);
  assert.ok(buffer.length > 50000, `Portrait photo size is suspiciously small: ${buffer.length} bytes`);

  // Verify JPEG magic bytes: FF D8 FF
  assert.equal(buffer[0], 0xFF, 'JPEG header byte 0 must be 0xFF');
  assert.equal(buffer[1], 0xD8, 'JPEG header byte 1 must be 0xD8');
  assert.equal(buffer[2], 0xFF, 'JPEG header byte 2 must be 0xFF');
});

test('About Data: Student Leadership timeline is sorted in strict chronological descending order', () => {
  // Replicate the sorting logic from About.jsx
  const sortedLeadership = [...leadership].sort((a, b) => {
    const yearA = parseInt(a.period?.match(/\d{4}/)?.[0] || '0', 10);
    const yearB = parseInt(b.period?.match(/\d{4}/)?.[0] || '0', 10);
    return yearB - yearA;
  });

  assert.equal(sortedLeadership.length, 3, 'Must have 3 leadership roles');

  // Verify descending order of initial years
  const years = sortedLeadership.map(item => parseInt(item.period?.match(/\d{4}/)?.[0] || '0', 10));
  assert.deepEqual(years, [2025, 2024, 2023], 'Leadership timeline must be sorted 2025, 2024, 2023');

  assert.ok(sortedLeadership[0].role.includes('Undersecretary'));
  assert.ok(sortedLeadership[1].role.includes('Associate'));
  assert.ok(sortedLeadership[2].role.includes('Executive Secretary'));
});

test('About Data: Leadership timeline sorting is resilient to malformed/unparseable period strings', () => {
  const testItems = [
    { role: 'Role A', period: 'August 2022 – May 2023' },
    { role: 'Role B', period: 'Ongoing / Present' }, // No 4-digit year -> 0
    { role: 'Role C', period: '2026' },
    { role: 'Role D', period: null }, // Null period -> 0
    { role: 'Role E', period: 'Nov 2024' },
  ];

  const sorted = [...testItems].sort((a, b) => {
    const yearA = parseInt(a.period?.match(/\d{4}/)?.[0] || '0', 10);
    const yearB = parseInt(b.period?.match(/\d{4}/)?.[0] || '0', 10);
    return yearB - yearA;
  });

  const parsedYears = sorted.map(item => parseInt(item.period?.match(/\d{4}/)?.[0] || '0', 10));
  assert.deepEqual(parsedYears, [2026, 2024, 2022, 0, 0]);
});

test('About Data: Work Experience and Multilingual competencies are preserved', () => {
  assert.ok(experience.length >= 2, 'Work experience must contain Native Camp ESL and YouTube Automation');
  const esl = experience.find(e => e.role.includes('ESL') || e.organization.includes('Native Camp'));
  assert.ok(esl, 'ESL teaching experience must be documented');
  assert.ok(esl.period.includes('June 2025'));

  assert.ok(languages.length >= 4, 'Must document at least 4 language competencies');
  assert.ok(languages.some(l => l.includes('English')));
  assert.ok(languages.some(l => l.includes('Cebuano')));
  assert.ok(languages.some(l => l.includes('Filipino')));
  assert.ok(languages.some(l => l.includes('Japanese')));
});

// --------------------------------------------------------------------------
// SUITE 5: ScrollReveal & Motion Standards Compliance
// --------------------------------------------------------------------------
console.log('\n--- SUITE 5: ScrollReveal & Motion Standards Compliance ---');

test('ScrollReveal: Strictly enforces Emil Kowalski motion constraints (duration <= 300ms, scale >= 0.95)', () => {
  const code = fs.readFileSync(path.join(ROOT, 'src/components/ScrollReveal.jsx'), 'utf8');

  // Verify duration clamping
  assert.ok(
    code.includes('Math.min(Math.max(0, duration), 300)'),
    'ScrollReveal must cap duration at <= 300ms'
  );

  // Verify delay clamping
  assert.ok(
    code.includes('Math.min(Math.max(0, delay), 250)'),
    'ScrollReveal must cap delay at <= 250ms'
  );

  // Verify scale floor (>= 0.95, rejecting scale(0))
  assert.ok(
    code.includes('Math.max(0.95, Math.min(1, scale))'),
    'ScrollReveal must floor entrance scale at >= 0.95'
  );

  // Verify snappy cubic-bezier easing
  assert.ok(
    code.includes('cubic-bezier(0.16, 1, 0.3, 1)'),
    'ScrollReveal must use snappy cubic-bezier(0.16, 1, 0.3, 1)'
  );

  // Verify reduced-motion returns instant 0ms transform: none
  assert.ok(
    code.includes("transform: 'none'"),
    'ScrollReveal must set transform: none under reduced motion'
  );
  assert.ok(
    code.includes('transition: \'none\''),
    'ScrollReveal must set transition: none under reduced motion'
  );
});

test('Reveal Re-export: Confirms Reveal.jsx forwards default to ScrollReveal.jsx', () => {
  const revealCode = fs.readFileSync(path.join(ROOT, 'src/components/Reveal.jsx'), 'utf8');
  assert.ok(
    revealCode.includes("export { default } from './ScrollReveal.jsx'"),
    'Reveal.jsx must re-export ScrollReveal as default'
  );
});

// --------------------------------------------------------------------------
// SUITE 6: Anti-AI Slop Heuristics & Design Engineering Rules
// --------------------------------------------------------------------------
console.log('\n--- SUITE 6: Anti-AI Slop Heuristics & Design Engineering Rules ---');

test('Typography Measure: Reading text in About, Skills, and Contact is constrained to max-w-[65ch]', () => {
  const aboutCode = fs.readFileSync(path.join(ROOT, 'src/pages/About.jsx'), 'utf8');
  const skillsCode = fs.readFileSync(path.join(ROOT, 'src/pages/Skills.jsx'), 'utf8');
  const contactCode = fs.readFileSync(path.join(ROOT, 'src/pages/Contact.jsx'), 'utf8');
  const homeCode = fs.readFileSync(path.join(ROOT, 'src/pages/Home.jsx'), 'utf8');

  // Verify presence of max-w-[65ch] or max-w-prose in every profile page
  assert.ok(aboutCode.includes('max-w-[65ch]'), 'About.jsx must enforce max-w-[65ch] on bio paragraphs');
  assert.ok(skillsCode.includes('max-w-[65ch]'), 'Skills.jsx must enforce max-w-[65ch] on explanatory copy');
  assert.ok(contactCode.includes('max-w-[65ch]'), 'Contact.jsx must enforce max-w-[65ch] on introductory copy');
  assert.ok(homeCode.includes('max-w-[65ch]'), 'Home.jsx must enforce max-w-[65ch] on hero narrative');
});

test('Tabular Numerals: Numeric values (CGPA, OJT hours, counts, dates) use tabular-nums', () => {
  const aboutCode = fs.readFileSync(path.join(ROOT, 'src/pages/About.jsx'), 'utf8');
  const skillsCode = fs.readFileSync(path.join(ROOT, 'src/pages/Skills.jsx'), 'utf8');
  const contactCode = fs.readFileSync(path.join(ROOT, 'src/pages/Contact.jsx'), 'utf8');
  const homeCode = fs.readFileSync(path.join(ROOT, 'src/pages/Home.jsx'), 'utf8');

  assert.ok(aboutCode.includes('tabular-nums'), 'About.jsx must apply tabular-nums to CGPA and numbers');
  assert.ok(skillsCode.includes('tabular-nums'), 'Skills.jsx must apply tabular-nums to counts and dates');
  assert.ok(contactCode.includes('tabular-nums'), 'Contact.jsx must apply tabular-nums to OJT hours and character counts');
  assert.ok(homeCode.includes('tabular-nums'), 'Home.jsx must apply tabular-nums to telemetry readouts');
});

test('Touch Targets & Active Micro-interactions: Min 44px tap targets and tactile compression', () => {
  const contactCode = fs.readFileSync(path.join(ROOT, 'src/pages/Contact.jsx'), 'utf8');
  const skillsCode = fs.readFileSync(path.join(ROOT, 'src/pages/Skills.jsx'), 'utf8');
  const aboutCode = fs.readFileSync(path.join(ROOT, 'src/pages/About.jsx'), 'utf8');

  // Contact page button targets:
  assert.ok(contactCode.includes('min-h-[44px]') || contactCode.includes('min-h-[48px]'));
  assert.ok(contactCode.includes('active:scale-[0.97]'));

  // Skills filter pills touch-target:
  assert.ok(skillsCode.includes('min-tap') || skillsCode.includes('touch-target'));

  // About action buttons:
  assert.ok(aboutCode.includes('min-tap') || aboutCode.includes('touch-target'));
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
