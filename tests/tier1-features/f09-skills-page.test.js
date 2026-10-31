// tests/tier1-features/f09-skills-page.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { toolchain, trainings } from '../../src/data/site.js';
import { checkFileExists } from '../helpers/static-checker.js';

describe('F09: Skills & Toolchain Page (Tier 1)', () => {
  it('F09-T1-1: toolchain contains grouped skill categories', () => {
    assert.ok(toolchain.length >= 4, 'Toolchain must have at least 4 competency categories');
    const labels = toolchain.map(t => t.label);
    assert.ok(labels.some(l => l.includes('Languages')), 'Must include Languages category');
    assert.ok(labels.some(l => l.includes('Hardware')), 'Must include Hardware category');
    assert.ok(labels.some(l => l.includes('EDA')), 'Must include EDA category');
  });

  it('F09-T1-2: hardware competencies list target silicon architectures', () => {
    const hw = toolchain.find(t => t.label.includes('Hardware'));
    assert.ok(hw, 'Hardware category must exist');
    assert.ok(hw.items.includes('ESP32'), 'Must include ESP32');
    assert.ok(hw.items.includes('STM32'), 'Must include STM32');
  });

  it('F09-T1-3: EDA competencies list development and simulation suites', () => {
    const eda = toolchain.find(t => t.label.includes('EDA'));
    assert.ok(eda, 'EDA category must exist');
    assert.ok(eda.items.includes('Vivado'), 'Must include Vivado');
    assert.ok(eda.items.includes('RT-Thread Studio'), 'Must include RT-Thread Studio');
  });

  it('F09-T1-4: trainings list authentic certifications and workshops', () => {
    assert.ok(trainings.length >= 4, 'Must list at least 4 trainings');
    const names = trainings.map(t => t.name);
    assert.ok(names.some(n => n.includes('AI Ready ASEAN') || n.includes('AI Career')), 'Must include AI training');
    assert.ok(names.some(n => n.includes('RT-Thread')), 'Must include RT-Thread training');
    assert.ok(names.some(n => n.includes('OJT Preparation') || n.includes('KadaKareer')), 'Must include OJT workshop');
  });

  it('F09-T1-5: certificate assets folder exists in Sources or public', () => {
    const certsInSources = checkFileExists('Sources/CERTIFICATES');
    const certsInPublic = checkFileExists('public/certificates');
    assert.ok(
      certsInSources.exists || certsInPublic.exists,
      'Certificates directory must exist in Sources/ or public/'
    );
  });
});
