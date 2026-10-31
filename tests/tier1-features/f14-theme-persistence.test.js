// tests/tier1-features/f14-theme-persistence.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createMockLocalStorage } from '../helpers/test-env.js';

describe('F14: Theme Persistence (Tier 1)', () => {
  function createPersistentThemeManager(storage) {
    const STORAGE_KEY = 'theme';
    let currentTheme = storage.getItem(STORAGE_KEY) || 'dark';

    return {
      getTheme() {
        return currentTheme;
      },
      setTheme(theme) {
        if (theme === 'dark' || theme === 'light') {
          currentTheme = theme;
          storage.setItem(STORAGE_KEY, theme);
        }
      },
      toggleTheme() {
        this.setTheme(currentTheme === 'dark' ? 'light' : 'dark');
      },
    };
  }

  it('F14-T1-1: saves active theme into localStorage', () => {
    const storage = createMockLocalStorage();
    const manager = createPersistentThemeManager(storage);
    manager.setTheme('light');
    assert.equal(storage.getItem('theme'), 'light');
  });

  it('F14-T1-2: restores saved "light" theme on initialization', () => {
    const storage = createMockLocalStorage({ theme: 'light' });
    const manager = createPersistentThemeManager(storage);
    assert.equal(manager.getTheme(), 'light');
  });

  it('F14-T1-3: restores saved "dark" theme on initialization', () => {
    const storage = createMockLocalStorage({ theme: 'dark' });
    const manager = createPersistentThemeManager(storage);
    assert.equal(manager.getTheme(), 'dark');
  });

  it('F14-T1-4: defaults to "dark" theme when storage is empty', () => {
    const storage = createMockLocalStorage();
    const manager = createPersistentThemeManager(storage);
    assert.equal(manager.getTheme(), 'dark');
  });

  it('F14-T1-5: persists toggled theme across multiple operations', () => {
    const storage = createMockLocalStorage();
    const manager = createPersistentThemeManager(storage);
    manager.toggleTheme(); // dark -> light
    assert.equal(storage.getItem('theme'), 'light');
    manager.toggleTheme(); // light -> dark
    assert.equal(storage.getItem('theme'), 'dark');
  });
});
