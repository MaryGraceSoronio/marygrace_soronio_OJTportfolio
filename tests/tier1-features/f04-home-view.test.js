// tests/tier1-features/f04-home-view.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileContent } from '../helpers/static-checker.js';

describe('F04: Home View (Tier 1)', () => {
  const heroContent = readFileContent('src/components/Hero.jsx') || '';
  const appContent = readFileContent('src/App.jsx') || '';
  const indexContent = readFileContent('index.html') || '';
  const combined = heroContent + appContent + indexContent;

  it('F04-T1-1: establishes Mary Grace V. Soronio developer identity', () => {
    assert.ok(
      combined.includes('Mary Grace') && combined.includes('Soronio'),
      'Home view must establish Mary Grace V. Soronio name'
    );
  });

  it('F04-T1-2: highlights embedded systems engineering specialization', () => {
    const hasSpecialization =
      combined.toLowerCase().includes('embedded') ||
      combined.toLowerCase().includes('hardware') ||
      combined.toLowerCase().includes('firmware');
    assert.ok(hasSpecialization, 'Home view must communicate embedded specialization');
  });

  it('F04-T1-3: highlights MSU-IIT academic institution', () => {
    assert.ok(
      combined.includes('MSU-IIT') || combined.includes('Mindanao State University'),
      'Home view must reference MSU-IIT'
    );
  });

  it('F04-T1-4: highlights 700-hour OJT availability or student status', () => {
    const hasOjtOrStudent =
      combined.includes('700') ||
      combined.toLowerCase().includes('ojt') ||
      combined.toLowerCase().includes('internship') ||
      combined.toLowerCase().includes('student') ||
      combined.toLowerCase().includes('fourth-year');
    assert.ok(hasOjtOrStudent, 'Home view must communicate OJT or student status');
  });

  it('F04-T1-5: includes clear hiring-oriented action trigger', () => {
    const hasCta =
      combined.includes('mailto:') ||
      combined.includes('contact') ||
      combined.includes('github') ||
      combined.includes('work');
    assert.ok(hasCta, 'Home view must include hiring action trigger');
  });
});
