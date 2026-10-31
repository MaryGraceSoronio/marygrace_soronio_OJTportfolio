// tests/tier1-features/f05-projects-showcase.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { projects } from '../../src/data/projects.js';
import { validateProjectSchema } from '../helpers/contracts.js';

describe('F05: Projects Showcase (Tier 1)', () => {
  it('F05-T1-1: catalog contains exactly 17 authentic projects', () => {
    assert.equal(projects.length, 17, 'Project catalog must contain exactly 17 projects');
  });

  it('F05-T1-2: every project conforms to project schema contract', () => {
    for (const p of projects) {
      const { valid, errors } = validateProjectSchema(p);
      assert.ok(valid, `Schema failure in project ${p.slug}: ${errors.join(', ')}`);
    }
  });

  it('F05-T1-3: every project specifies non-empty technology stack', () => {
    for (const p of projects) {
      const stack = p.stack || p.hardwareStack;
      assert.ok(stack && stack.length > 0, `Project ${p.slug} must specify technology stack`);
    }
  });

  it('F05-T1-4: every project specifies non-empty summary or line', () => {
    for (const p of projects) {
      const line = p.line || p.summary;
      assert.ok(typeof line === 'string' && line.trim().length > 10, `Project ${p.slug} must have summary`);
    }
  });

  it('F05-T1-5: project items provide slug identifiers for detail page navigation', () => {
    for (const p of projects) {
      assert.ok(p.slug && p.slug.length > 2, `Project ${p.name} must have a valid slug`);
    }
  });
});
