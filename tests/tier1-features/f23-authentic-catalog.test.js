// tests/tier1-features/f23-authentic-catalog.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { projects } from '../../src/data/projects.js';
import { EXPECTED_PROJECT_SLUGS } from '../helpers/contracts.js';

describe('F23: 17-Project Authentic Catalog (Tier 1)', () => {
  it('F23-T1-1: contains all 17 expected authentic project slugs', () => {
    assert.equal(projects.length, 17);
    const slugs = projects.map(p => p.slug);
    for (const expected of EXPECTED_PROJECT_SLUGS) {
      assert.ok(slugs.includes(expected), `Missing expected project slug: ${expected}`);
    }
  });

  it('F23-T1-2: preserves Fermonitor bagoong electronic nose project', () => {
    const p = projects.find(item => item.slug === 'fermonitor');
    assert.ok(p, 'Fermonitor must exist');
    assert.ok(p.line.includes('bagoong') || p.line.includes('fermentation'));
  });

  it('F23-T1-3: preserves eTee solar poultry coop with YOLO vision', () => {
    const p = projects.find(item => item.slug === 'etee');
    assert.ok(p, 'eTee must exist');
    assert.ok(p.stack.includes('YOLO'));
  });

  it('F23-T1-4: preserves AquaFlush volumetric flow rate monitor', () => {
    const p = projects.find(item => item.slug === 'aquaflush');
    assert.ok(p, 'AquaFlush must exist');
    assert.ok(p.stack.includes('Interrupt') || p.details.includes('pulse'));
  });

  it('F23-T1-5: preserves FPGA drying oven and RT-Thread HMI projects', () => {
    const fpga = projects.find(item => item.slug === 'fpga-oven');
    const rtt = projects.find(item => item.slug === 'rtthread-hmi');
    assert.ok(fpga, 'FPGA Oven must exist');
    assert.ok(rtt, 'RT-Thread HMI must exist');
  });
});
