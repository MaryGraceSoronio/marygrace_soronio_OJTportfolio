// tests/tier4-scenarios/scenario-ojt-evaluation.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { roles, trainings } from '../../src/data/site.js';
import { readFileContent } from '../helpers/static-checker.js';

describe('Tier 4 Scenario 3: MSU-IIT Academic & OJT Coordinator Evaluation', () => {
  it('Step 1: Coordinator validates authentic university credentials and degree program', () => {
    const cv = readFileContent('Sources/Soronio, Mary grace V..md') || '';
    assert.ok(cv.includes('Mindanao State University - Iligan Institute of Technology') || cv.includes('MSU-IIT'));
    assert.ok(cv.includes('Embedded Systems'));
  });

  it('Step 2: Coordinator verifies student status and exact 700-hour requirement', () => {
    const cv = readFileContent('Sources/Soronio, Mary grace V..md') || '';
    assert.ok(cv.includes('700-hour OJT') || cv.includes('700-hour'));
  });

  it('Step 3: Coordinator inspects academic performance: CGPA 1.67351 and Dean\'s Lister honors', () => {
    const cv = readFileContent('Sources/Soronio, Mary grace V..md') || '';
    assert.ok(cv.includes('1.67351'));
    assert.ok(/Dean['’]s Lister/i.test(cv));
  });

  it('Step 4: Coordinator audits university leadership roles in CCS student council', () => {
    const councilRole = roles.find(r => r.org.includes('CCS'));
    assert.ok(councilRole);
    assert.ok(councilRole.role.includes('Budget & Finance'));
  });

  it('Step 5: Coordinator audits career readiness preparation and KadaKareer workshop', () => {
    const ojtPrep = trainings.find(t => t.name.includes('OJT Preparation') || t.issuer.includes('KadaKareer'));
    assert.ok(ojtPrep);
    assert.ok(ojtPrep.issuer.includes('KadaKareer'));
  });
});
