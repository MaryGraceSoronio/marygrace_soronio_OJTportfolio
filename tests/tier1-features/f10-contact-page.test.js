// tests/tier1-features/f10-contact-page.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { contact } from '../../src/data/site.js';

describe('F10: Contact Page (Tier 1)', () => {
  it('F10-T1-1: provides authentic MSU-IIT institutional email', () => {
    assert.equal(contact.email, 'marygrace.soronio@g.msuiit.edu.ph');
  });

  it('F10-T1-2: provides verified phone number with valid dialable href', () => {
    assert.equal(contact.phone, '+63 966 043 4042');
    assert.ok(contact.phoneHref && contact.phoneHref.startsWith('tel:+63'), 'phoneHref must be valid tel: protocol');
  });

  it('F10-T1-3: provides verified GitHub profile URL', () => {
    assert.equal(contact.github, 'https://github.com/MaryGraceSoronio');
  });

  it('F10-T1-4: provides verified LinkedIn profile URL', () => {
    assert.ok(
      contact.linkedin.includes('linkedin.com/in/mary-grace-soronio'),
      'LinkedIn URL must point to Mary Grace Soronio'
    );
  });

  it('F10-T1-5: provides verified geographic residence', () => {
    assert.ok(contact.place.includes('Iligan City'), 'Must specify Iligan City');
    assert.ok(contact.place.includes('Philippines'), 'Must specify Philippines');
  });
});
