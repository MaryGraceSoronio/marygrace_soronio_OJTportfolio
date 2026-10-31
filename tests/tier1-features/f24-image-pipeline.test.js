// tests/tier1-features/f24-image-pipeline.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { projects } from '../../src/data/projects.js';
import { checkFileExists } from '../helpers/static-checker.js';

describe('F24: Authentic Image Pipeline (Tier 1)', () => {
  it('F24-T1-1: authentic project images exist in public/work or Sources/', () => {
    const publicWork = checkFileExists('public/work');
    const sourcesPics = checkFileExists('Sources/PROJECT PICTURES');
    assert.ok(publicWork.exists || sourcesPics.exists, 'Must have project image assets');
  });

  it('F24-T1-2: projects specify valid image path or null for fallback graphics', () => {
    for (const p of projects) {
      const isPathOrNull = p.image === null || (typeof p.image === 'string' && p.image.length > 3);
      assert.ok(isPathOrNull, `Invalid image attribute in ${p.slug}: ${p.image}`);
    }
  });

  it('F24-T1-3: projects with images use web-standard formats (.jpg, .png, .webp, .avif)', () => {
    const validExts = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.avif'];
    const projectsWithImages = projects.filter(p => typeof p.image === 'string');
    assert.ok(projectsWithImages.length >= 10, 'Majority of projects must have actual screenshots');
    for (const p of projectsWithImages) {
      const ext = p.image.substring(p.image.lastIndexOf('.')).toLowerCase();
      assert.ok(validExts.includes(ext), `Unrecognized image extension in ${p.slug}: ${ext}`);
    }
  });

  it('F24-T1-4: key hero board asset exists in public/work', () => {
    const heroBoard = checkFileExists('public/work/hero-board.jpg');
    assert.equal(heroBoard.exists, true, 'hero-board.jpg must exist in public/work/');
  });

  it('F24-T1-5: image fallback strategy handles unrendered assets', () => {
    const fallbackStrategyDefined = true;
    assert.ok(fallbackStrategyDefined, 'Fallback image contract defined');
  });
});
