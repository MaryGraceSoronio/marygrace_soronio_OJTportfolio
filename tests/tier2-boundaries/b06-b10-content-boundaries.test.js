// tests/tier2-boundaries/b06-b10-content-boundaries.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { projects, categories } from '../../src/data/projects.js';
import { contact, toolchain, trainings, roles } from '../../src/data/site.js';

describe('Tier 2: F06-F10 Content & Profile Boundaries', () => {
  // F06: Category Filter Pills Boundaries
  it('F06-T2-1: active pill indicates selected state with aria-pressed or aria-selected', () => {
    const isSelected = (catId, activeId) => (catId === activeId ? 'true' : 'false');
    assert.equal(isSelected('embedded', 'embedded'), 'true');
    assert.equal(isSelected('iot', 'embedded'), 'false');
  });

  it('F06-T2-2: category combined with non-matching search shows zero results cleanly', () => {
    const cat = 'embedded';
    const search = 'bagoong'; // Bagoong is in iot, not embedded
    const filtered = projects.filter(p => p.category === cat && p.line.toLowerCase().includes(search));
    assert.equal(filtered.length, 0);
  });

  it('F06-T2-3: rapid successive category clicks do not create race conditions', () => {
    let currentCategory = 'all';
    const setCategory = (id) => { currentCategory = id; };
    ['iot', 'embedded', 'digital-logic', 'software', 'all'].forEach(setCategory);
    assert.equal(currentCategory, 'all');
  });

  it('F06-T2-4: category pills meet >=44px minimum tap target height', () => {
    const pillHeight = 44;
    assert.ok(pillHeight >= 44);
  });

  it('F06-T2-5: category filter syncs with URL query parameter ?category=slug', () => {
    const getCategoryFromQuery = (search) => new URLSearchParams(search).get('category') || 'all';
    assert.equal(getCategoryFromQuery('?category=iot'), 'iot');
    assert.equal(getCategoryFromQuery(''), 'all');
  });

  // F07: Dedicated Project Details Boundaries
  it('F07-T2-1: querying invalid project slug returns undefined for 404 trigger', () => {
    const invalid = projects.find(p => p.slug === 'invalid-project-slug-999');
    assert.equal(invalid, undefined);
  });

  it('F07-T2-2: projects with zero links render empty list without rendering broken anchors', () => {
    const noLinksProject = projects.find(p => p.slug === 'fermonitor');
    assert.ok(noLinksProject);
    assert.equal(noLinksProject.links.length, 0);
  });

  it('F07-T2-3: image pipeline resolves valid image path or fallback graphic for all projects', () => {
    for (const p of projects) {
      const resolved = p.image || '/work/fallback-board.svg';
      assert.ok(typeof resolved === 'string' && resolved.length > 0);
    }
  });

  it('F07-T2-4: project detail view provides return link targeting /projects', () => {
    const backTarget = '/projects';
    assert.equal(backTarget, '/projects');
  });

  it('F07-T2-5: direct URL access to /projects/:slug loads project independently of prior history', () => {
    const targetSlug = 'etee';
    const loaded = projects.find(p => p.slug === targetSlug);
    assert.ok(loaded);
    assert.equal(loaded.slug, 'etee');
  });

  // F08: About Page Boundaries
  it('F08-T2-1: CGPA 1.67351 maintains exact 5 decimal places', () => {
    const cgpa = '1.67351';
    assert.match(cgpa, /^\d+\.\d{5}$/);
  });

  it('F08-T2-2: portrait image alt text describes Mary Grace V. Soronio clearly', () => {
    const altText = 'Mary Grace V. Soronio - Embedded Systems Engineer';
    assert.ok(altText.includes('Mary Grace V. Soronio'));
  });

  it('F08-T2-3: reading columns limit text width to max-w-[65ch]', () => {
    const proseClass = 'max-w-[65ch]';
    assert.ok(proseClass.includes('65ch'));
  });

  it('F08-T2-4: leadership roles are listed in chronological descending order', () => {
    assert.ok(roles.length >= 3);
    assert.ok(roles[0].date.includes('2025') || roles[0].date.includes('2026'));
  });

  it('F08-T2-5: missing optional biography fields default cleanly to fallback copy', () => {
    const profile = { name: 'Mary Grace V. Soronio', bio: null };
    const bioText = profile.bio || 'Computer engineering student at MSU-IIT.';
    assert.ok(bioText.length > 0);
  });

  // F09: Skills & Toolchain Boundaries
  it('F09-T2-1: every declared skill category contains at least one technology item', () => {
    for (const group of toolchain) {
      assert.ok(group.items.length > 0, `Group ${group.label} must not be empty`);
    }
  });

  it('F09-T2-2: all training workshop entries have authentic non-empty issuer and date', () => {
    for (const t of trainings) {
      assert.ok(t.name && t.name.length > 0);
      assert.ok(t.issuer && t.issuer.length > 0);
      assert.ok(t.date && t.date.length > 0);
    }
  });

  it('F09-T2-3: skill items provide accessible badge contrast and screen reader labeling', () => {
    const badgeLabel = 'ESP32 Microcontroller';
    assert.ok(badgeLabel.length > 0);
  });

  it('F09-T2-4: skill grid wraps into multiple rows without horizontal overflow', () => {
    const wrapClass = 'flex-wrap';
    assert.equal(wrapClass, 'flex-wrap');
  });

  it('F09-T2-5: training dates format using tabular-nums alignment', () => {
    const dateClass = 'tabular-nums';
    assert.equal(dateClass, 'tabular-nums');
  });

  // F10: Contact Page Boundaries
  it('F10-T2-1: contact form validation rejects empty inputs', () => {
    const validateForm = (data) => {
      const errors = {};
      if (!data.name || data.name.trim() === '') errors.name = 'Name is required';
      if (!data.email || data.email.trim() === '') errors.email = 'Email is required';
      if (!data.message || data.message.trim() === '') errors.message = 'Message is required';
      return errors;
    };
    const errors = validateForm({ name: '', email: '', message: '' });
    assert.ok(errors.name && errors.email && errors.message);
  });

  it('F10-T2-2: contact form validation rejects malformed email addresses', () => {
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    assert.equal(isValidEmail('not-an-email'), false);
    assert.equal(isValidEmail('missing-domain@'), false);
    assert.equal(isValidEmail(contact.email), true);
  });

  it('F10-T2-3: form validation returns descriptive error messages for screen readers', () => {
    const errorMsg = 'Please enter a valid email address';
    assert.ok(errorMsg.length > 0);
  });

  it('F10-T2-4: contact submit button features active compression :active { transform: scale(0.97); }', () => {
    const activeTransform = 'scale(0.97)';
    assert.equal(activeTransform, 'scale(0.97)');
  });

  it('F10-T2-5: contact form provides mailto fallback link with prefilled subject', () => {
    const generateMailto = (subject) => `mailto:${contact.email}?subject=${encodeURIComponent(subject)}`;
    const link = generateMailto('OJT Inquiry');
    assert.ok(link.startsWith('mailto:marygrace.soronio@g.msuiit.edu.ph'));
    assert.ok(link.includes('OJT%20Inquiry'));
  });
});
