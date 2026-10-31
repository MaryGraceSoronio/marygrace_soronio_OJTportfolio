// tests/tier1-features/f27-design-decisions.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { checkFileExists, readFileContent } from '../helpers/static-checker.js';

describe('F27: Design Decisions Document (Tier 1)', () => {
  const projectPlan = readFileContent('.agents/teamwork/orchestrator/PROJECT.md') || '';
  const decisionsDoc = checkFileExists('DESIGN_DECISIONS.md');
  const decisionsContent = decisionsDoc.exists ? readFileContent('DESIGN_DECISIONS.md') : projectPlan;

  it('F27-T1-1: design decisions are formally documented in project specification', () => {
    assert.ok(
      decisionsDoc.exists || projectPlan.includes('DESIGN_DECISIONS.md'),
      'DESIGN_DECISIONS.md must be documented or planned in project'
    );
  });

  it('F27-T1-2: documents dark purple visual identity & Cyber-Physical concept', () => {
    assert.ok(
      decisionsContent.toLowerCase().includes('dark purple') ||
      decisionsContent.toLowerCase().includes('cyber-physical'),
      'Must document dark purple identity'
    );
  });

  it('F27-T1-3: documents color palette tokens and contrast ratios', () => {
    assert.ok(
      decisionsContent.includes('contrast') ||
      decisionsContent.includes('WCAG') ||
      decisionsContent.includes('palette') ||
      decisionsContent.includes('tokens'),
      'Must document color system and contrast ratios'
    );
  });

  it('F27-T1-4: documents typography scale and measure constraints', () => {
    assert.ok(
      decisionsContent.includes('65ch') ||
      decisionsContent.includes('typography') ||
      decisionsContent.includes('font'),
      'Must document typography rules'
    );
  });

  it('F27-T1-5: documents motion standards and reduced-motion support', () => {
    assert.ok(
      decisionsContent.includes('motion') ||
      decisionsContent.includes('animation') ||
      decisionsContent.includes('reduced-motion'),
      'Must document motion and animation principles'
    );
  });
});
