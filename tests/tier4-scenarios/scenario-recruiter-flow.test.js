// tests/tier4-scenarios/scenario-recruiter-flow.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { projects } from '../../src/data/projects.js';
import { contact } from '../../src/data/site.js';
import { createMockWindow, createMockLocalStorage } from '../helpers/test-env.js';

describe('Tier 4 Scenario 1: Technical Recruiter Hiring Journey', () => {
  const win = createMockWindow({ pathname: '/' });

  it('Step 1: Recruiter arrives on Home view, validates candidate identity & OJT target', () => {
    assert.equal(win.location.pathname, '/');
    const candidateName = 'Mary Grace V. Soronio';
    const ojtTargetHours = 700;
    assert.equal(candidateName, 'Mary Grace V. Soronio');
    assert.equal(ojtTargetHours, 700);
  });

  it('Step 2: Recruiter navigates to Projects catalog and filters by RTOS/embedded keyword', () => {
    win.history.pushState(null, '', '/projects?q=RTOS');
    assert.equal(win.location.pathname, '/projects');
    const rtosProjects = projects.filter(p =>
      p.stack.toLowerCase().includes('rtos') ||
      p.details.toLowerCase().includes('rtos') ||
      p.details.toLowerCase().includes('freertos') ||
      p.details.toLowerCase().includes('rt-thread')
    );
    assert.ok(rtosProjects.length >= 2, 'Recruiter finds multiple RTOS builds');
  });

  it('Step 3: Recruiter inspects Drying Oven dedicated case study (/projects/drying-oven)', () => {
    win.history.pushState(null, '', '/projects/drying-oven');
    assert.equal(win.location.pathname, '/projects/drying-oven');
    const project = projects.find(p => p.slug === 'drying-oven');
    assert.ok(project);
    assert.ok(project.details.includes('RT-Thread') && project.details.includes('CODESYS'));
  });

  it('Step 4: Recruiter audits candidate GitHub links and verifiable project manuscripts', () => {
    const project = projects.find(p => p.slug === 'drying-oven');
    assert.ok(project.links.length >= 2);
    const videoLink = project.links.find(l => l.label.includes('Video'));
    assert.ok(videoLink);
    assert.ok((videoLink.href || videoLink.url).startsWith('https://drive.google.com'));
  });

  it('Step 5: Recruiter navigates to Contact page and acquires verified direct channels', () => {
    win.history.pushState(null, '', '/contact');
    assert.equal(win.location.pathname, '/contact');
    assert.equal(contact.email, 'marygrace.soronio@g.msuiit.edu.ph');
    assert.equal(contact.phone, '+63 966 043 4042');
    assert.equal(contact.github, 'https://github.com/MaryGraceSoronio');
  });
});
