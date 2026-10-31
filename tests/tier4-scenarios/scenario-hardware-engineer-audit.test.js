// tests/tier4-scenarios/scenario-hardware-engineer-audit.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { projects } from '../../src/data/projects.js';
import { toolchain, trainings } from '../../src/data/site.js';
import { createMockWindow } from '../helpers/test-env.js';

describe('Tier 4 Scenario 2: Hardware Engineering Lead Technical Audit', () => {
  const win = createMockWindow({ pathname: '/projects' });

  it('Step 1: Lead filters projects by "iot" and opens Fermonitor case study', () => {
    win.history.pushState(null, '', '/projects/fermonitor');
    assert.equal(win.location.pathname, '/projects/fermonitor');
    const fermonitor = projects.find(p => p.slug === 'fermonitor');
    assert.ok(fermonitor);
    assert.equal(fermonitor.category, 'iot');
  });

  it('Step 2: Lead audits gas sensor analog front-end and ADC signal chain', () => {
    const fermonitor = projects.find(p => p.slug === 'fermonitor');
    assert.ok(fermonitor.details.includes('MQ-135'));
    assert.ok(fermonitor.details.includes('MQ-136'));
    assert.ok(fermonitor.details.includes('MQ-137'));
    assert.ok(fermonitor.details.includes('ADS1115'));
  });

  it('Step 3: Lead switches to "digital-logic" category and audits FPGA Oven VHDL architecture', () => {
    win.history.pushState(null, '', '/projects/fpga-oven');
    assert.equal(win.location.pathname, '/projects/fpga-oven');
    const fpgaOven = projects.find(p => p.slug === 'fpga-oven');
    assert.ok(fpgaOven);
    assert.ok(fpgaOven.details.includes('Vivado'));
    assert.ok(fpgaOven.details.includes('one-hot'));
  });

  it('Step 4: Lead navigates to /skills and audits target silicon and EDA tools', () => {
    win.history.pushState(null, '', '/skills');
    assert.equal(win.location.pathname, '/skills');
    const hwGroup = toolchain.find(t => t.label.includes('Hardware'));
    assert.ok(hwGroup.items.includes('ESP32'));
    assert.ok(hwGroup.items.includes('STM32'));
    assert.ok(hwGroup.items.includes('PCB Layout'));
  });

  it('Step 5: Lead audits authentic professional training and IoT certifications', () => {
    const rtThreadCert = trainings.find(t => t.name.includes('RT-Thread'));
    assert.ok(rtThreadCert);
    assert.ok(rtThreadCert.issuer.includes('RT-Thread'));
  });
});
