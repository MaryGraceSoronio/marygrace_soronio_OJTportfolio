// tests/tier1-features/f06-category-pills.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { categories, projects } from '../../src/data/projects.js';
import { VALID_CATEGORIES } from '../helpers/contracts.js';

describe('F06: Category Filter Pills (Tier 1)', () => {
  it('F06-T1-1: defines all 5 required category identifiers', () => {
    const ids = categories.map(c => c.id);
    for (const cat of VALID_CATEGORIES) {
      assert.ok(ids.includes(cat), `Missing expected category ${cat}`);
    }
  });

  it('F06-T1-2: every category includes non-empty human-readable label', () => {
    for (const c of categories) {
      assert.ok(c.label && c.label.trim().length > 0, `Category ${c.id} missing label`);
    }
  });

  it('F06-T1-3: every project in catalog has category present in declared categories', () => {
    const validIds = categories.map(c => c.id).filter(id => id !== 'all');
    for (const p of projects) {
      assert.ok(validIds.includes(p.category), `Project ${p.slug} has unrecognized category: ${p.category}`);
    }
  });

  it('F06-T1-4: filtering by specific category returns correct subset', () => {
    const iotProjects = projects.filter(p => p.category === 'iot');
    assert.ok(iotProjects.length > 0, 'Must have iot projects');
    for (const p of iotProjects) {
      assert.equal(p.category, 'iot');
    }
  });

  it('F06-T1-5: filtering by "all" preserves full 17-project catalog', () => {
    const filterAll = (catId) => (catId === 'all' ? projects : projects.filter(p => p.category === catId));
    assert.equal(filterAll('all').length, 17);
  });
});
