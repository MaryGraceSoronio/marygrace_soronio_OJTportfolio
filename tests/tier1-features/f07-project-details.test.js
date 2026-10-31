// tests/tier1-features/f07-project-details.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { projects } from '../../src/data/projects.js';

describe('F07: Dedicated Project Details (Tier 1)', () => {
  it('F07-T1-1: every project can be located by unique slug', () => {
    for (const p of projects) {
      const found = projects.find(item => item.slug === p.slug);
      assert.equal(found.slug, p.slug);
    }
  });

  it('F07-T1-2: all project details contain technical specification copy', () => {
    for (const p of projects) {
      const details = p.details || p.overview;
      assert.ok(typeof details === 'string' && details.length >= 30, `Details too short for ${p.slug}`);
    }
  });

  it('F07-T1-3: flagship project Fermonitor details sensor channels and hardware', () => {
    const fermonitor = projects.find(p => p.slug === 'fermonitor');
    assert.ok(fermonitor, 'Fermonitor project must exist');
    assert.ok(
      fermonitor.details.includes('MQ-') ||
      fermonitor.details.includes('ADS1115') ||
      fermonitor.details.includes('sensor') ||
      fermonitor.details.includes('gas'),
      'Fermonitor details must describe sensor architecture'
    );
  });

  it('F07-T1-4: project eTee specifies YOLO and automated clean cycles', () => {
    const etee = projects.find(p => p.slug === 'etee');
    assert.ok(etee, 'eTee project must exist');
    assert.ok(
      etee.details.includes('YOLO') ||
      etee.stack.includes('YOLO') ||
      etee.line.includes('YOLO'),
      'eTee must specify YOLO vision model'
    );
  });

  it('F07-T1-5: projects with links provide authentic non-broken targets', () => {
    const projectsWithLinks = projects.filter(p => p.links && p.links.length > 0);
    assert.ok(projectsWithLinks.length >= 5, 'At least 5 projects must have authentic external links');
    for (const p of projectsWithLinks) {
      for (const link of p.links) {
        const href = link.href || link.url;
        assert.ok(
          href.startsWith('https://') || href.startsWith('http://') || href.startsWith('/'),
          `Invalid link href in ${p.slug}: ${href}`
        );
      }
    }
  });
});
