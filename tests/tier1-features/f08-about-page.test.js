// tests/tier1-features/f08-about-page.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { roles } from '../../src/data/site.js';
import { checkFileExists, readFileContent } from '../helpers/static-checker.js';

describe('F08: About Page (Tier 1)', () => {
  it('F08-T1-1: CV source document exists and contains authentic academic details', () => {
    const cvFile = checkFileExists('Sources/Soronio, Mary grace V..md');
    assert.equal(cvFile.exists, true, 'CV markdown document must exist in Sources/');
    const cvContent = readFileContent('Sources/Soronio, Mary grace V..md');
    assert.ok(cvContent.includes('1.67351'), 'CV must document CGPA 1.67351');
    assert.ok(cvContent.includes('MSU-IIT') || cvContent.includes('Mindanao State University'), 'CV must document MSU-IIT');
    assert.ok(/Dean['’]s Lister/i.test(cvContent), "CV must document Dean's Lister status");
  });

  it('F08-T1-2: authentic leadership roles are preserved in site data', () => {
    const ccsCouncil = roles.find(r => r.org && r.org.includes('CCS'));
    assert.ok(ccsCouncil, 'Must include CCS Student/Executive Council leadership role');
    assert.ok(ccsCouncil.role.includes('Budget & Finance'), 'Must document Budget & Finance role');
  });

  it('F08-T1-3: authentic ESL teaching experience is documented in site data', () => {
    const eslRole = roles.find(r => r.org && r.org.includes('Native Camp'));
    assert.ok(eslRole, 'Must include Native Camp ESL Teacher experience');
    assert.equal(eslRole.role, 'ESL Teacher');
  });

  it('F08-T1-4: authentic 1x1 portrait photo file exists in project', () => {
    const portraitInSources = checkFileExists('Sources/mary-grace-1x1-id-image.jpg');
    const portraitInPublic = checkFileExists('public/mary-grace-1x1-id-image.jpg');
    assert.ok(
      portraitInSources.exists || portraitInPublic.exists,
      'Authentic portrait photo must exist in Sources/ or public/'
    );
  });

  it('F08-T1-5: language competencies are preserved in authentic data', async () => {
    const { languages } = await import('../../src/data/site.js');
    assert.ok(Array.isArray(languages));
    const langStr = languages.join(' ');
    assert.ok(langStr.includes('English'));
    assert.ok(langStr.includes('Cebuano'));
    assert.ok(langStr.includes('Filipino'));
  });
});
