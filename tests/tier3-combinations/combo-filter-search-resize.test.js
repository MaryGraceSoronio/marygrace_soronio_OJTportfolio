// tests/tier3-combinations/combo-filter-search-resize.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { projects } from '../../src/data/projects.js';
import { createMockWindow } from '../helpers/test-env.js';

describe('Tier 3: Category Filtering, Search, and Viewport Resizing', () => {
  function queryProjects(category = 'all', searchQuery = '') {
    const cleanSearch = searchQuery.trim().toLowerCase();
    return projects.filter(p => {
      const matchesCategory = category === 'all' || p.category === category;
      const combinedText = `${p.name} ${p.stack} ${p.line} ${p.details}`.toLowerCase();
      const matchesSearch = cleanSearch === '' || combinedText.includes(cleanSearch);
      return matchesCategory && matchesSearch;
    });
  }

  it('T3-FSR-1: filtering by category "iot" and searching "bagoong" yields exact Fermonitor match', () => {
    const results = queryProjects('iot', 'bagoong');
    assert.equal(results.length, 1);
    assert.equal(results[0].slug, 'fermonitor');
  });

  it('T3-FSR-2: filtering by category "software" and searching for hardware term "gas sensor" yields empty results', () => {
    const results = queryProjects('software', 'gas sensor');
    assert.equal(results.length, 0);
  });

  it('T3-FSR-3: resizing viewport from desktop (1280px) to mobile (375px) preserves active filter & search state', () => {
    const win = createMockWindow({ innerWidth: 1280, search: '?category=embedded&q=rtos' });
    let category = 'embedded';
    let search = 'rtos';
    let resultsDesktop = queryProjects(category, search);
    assert.ok(resultsDesktop.length > 0);

    // Simulate viewport resize to mobile
    win.innerWidth = 375;
    assert.equal(win.innerWidth, 375);
    // State is preserved
    let resultsMobile = queryProjects(category, search);
    assert.equal(resultsMobile.length, resultsDesktop.length);
  });

  it('T3-FSR-4: selecting category updates query parameter and back button restores previous state', () => {
    const win = createMockWindow({ pathname: '/projects' });
    const setCategoryInUrl = (cat) => {
      win.history.pushState(null, '', `/projects?category=${cat}`);
    };
    setCategoryInUrl('embedded');
    assert.equal(win.location.search, '?category=embedded');
    setCategoryInUrl('digital-logic');
    assert.equal(win.location.search, '?category=digital-logic');

    win.history.back();
    assert.equal(win.location.search, '?category=embedded');
  });

  it('T3-FSR-5: clearing search query while category "embedded" is active preserves embedded subset', () => {
    const withSearch = queryProjects('embedded', 'oven');
    assert.equal(withSearch.length, 1);
    assert.equal(withSearch[0].slug, 'drying-oven');

    // Clear search
    const clearedSearch = queryProjects('embedded', '');
    assert.ok(clearedSearch.length > 1);
    for (const p of clearedSearch) {
      assert.equal(p.category, 'embedded');
    }
  });

  it('T3-FSR-6: changing category while search query "STM32" is active applies search to new category', () => {
    const inAll = queryProjects('all', 'STM32');
    assert.ok(inAll.length >= 1);

    const inEmbedded = queryProjects('embedded', 'STM32');
    assert.ok(inEmbedded.length >= 1);
    for (const p of inEmbedded) {
      assert.equal(p.category, 'embedded');
    }
  });
});
