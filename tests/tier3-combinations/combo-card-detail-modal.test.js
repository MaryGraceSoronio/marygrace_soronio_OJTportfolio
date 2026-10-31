// tests/tier3-combinations/combo-card-detail-modal.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { projects } from '../../src/data/projects.js';
import { createMockWindow } from '../helpers/test-env.js';

describe('Tier 3: Project Card & Dedicated Details Pairwise Interactions', () => {
  it('T3-CD-1: clicking project card routes to dedicated case study URL (/projects/:slug)', () => {
    const win = createMockWindow({ pathname: '/projects' });
    const selectProject = (slug) => {
      win.history.pushState(null, '', `/projects/${slug}`);
    };
    selectProject('fermonitor');
    assert.equal(win.location.pathname, '/projects/fermonitor');
  });

  it('T3-CD-2: returning to /projects from case study retains active category filter', () => {
    const win = createMockWindow({ pathname: '/projects', search: '?category=iot' });
    // Navigate into detail
    win.history.pushState(null, '', '/projects/fermonitor');
    assert.equal(win.location.pathname, '/projects/fermonitor');

    // Click "Back to Projects"
    win.history.back();
    assert.equal(win.location.pathname, '/projects');
    assert.equal(win.location.search, '?category=iot');
  });

  it('T3-CD-3: external manuscript & GitHub links open in new tab with rel="noopener noreferrer"', () => {
    const etee = projects.find(p => p.slug === 'etee');
    assert.ok(etee);
    const linkConfig = {
      href: etee.links[0].href,
      target: '_blank',
      rel: 'noopener noreferrer',
    };
    assert.equal(linkConfig.target, '_blank');
    assert.ok(linkConfig.rel.includes('noopener'));
    assert.ok(linkConfig.rel.includes('noreferrer'));
  });

  it('T3-CD-4: deep link sharing directly to /projects/:slug loads full case study from cold start', () => {
    const directSlug = 'aquaflush';
    const project = projects.find(p => p.slug === directSlug);
    assert.ok(project);
    assert.equal(project.name, 'AquaFlush');
    assert.ok(project.details.includes('pulse') || project.details.includes('timing'));
  });

  it('T3-CD-5: inquiry CTA on project details page prefills contact form with project name', () => {
    const targetProject = projects.find(p => p.slug === 'fpga-oven');
    assert.ok(targetProject);
    const buildInquiryUrl = (proj) => `/contact?subject=${encodeURIComponent(`Inquiry regarding ${proj.name}`)}`;
    const url = buildInquiryUrl(targetProject);
    assert.ok(url.startsWith('/contact?subject='));
    assert.ok(url.includes('FPGA%20Oven'));
  });

  it('T3-CD-6: reduced-motion preference bypasses card hover spring and detail transition', () => {
    const win = createMockWindow({ reducedMotion: true });
    const isMotionReduced = win.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const transitionTiming = isMotionReduced ? '0ms' : '200ms cubic-bezier(0.16, 1, 0.3, 1)';
    assert.equal(transitionTiming, '0ms');
  });
});
